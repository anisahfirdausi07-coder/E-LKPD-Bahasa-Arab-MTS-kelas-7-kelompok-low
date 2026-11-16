import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  EyeOff,
  Headphones,
  HelpCircle,
  MessageCircle,
  Pencil,
  Volume2,
} from 'lucide-react';
import { SKILLS_META, THEMES } from '../data';
import {
  normalizeArabicForComparison,
  playFeedbackTone,
} from '../services/speechService';
import {
  SkillId,
  SkillScoreRecord,
  ThemeContent,
  ThemeId,
} from '../types/learning';
import { AIConversation } from './AIConversation';
import { ArabicTextInput } from './ArabicTextInput';
import { AudioPlayer } from './AudioPlayer';
import { MatchingExercise } from './MatchingExercise';
import {
  CartoonOpenBook,
  EncouragingCloudMascot,
  HappyStarMascot,
  PastelCloud,
  PastelStar,
} from './PastelDecorations';
import { VoiceRecorder } from './VoiceRecorder';

interface LessonWorkspaceProps {
  theme: ThemeContent;
  activeSkill: SkillId;
  completedModules: string[];
  answeredCorrectIds: string[];
  skillScores: Record<string, SkillScoreRecord>;
  onSelectTheme: (themeId: ThemeId) => void;
  onSelectSkill: (skillId: SkillId) => void;
  onBackHome: () => void;
  onRecordCorrectAnswer: (questionId: string, points?: number) => void;
  onUpdateSkillScore: (moduleKey: string, record: SkillScoreRecord) => void;
  onMarkModuleComplete: (moduleKey: string, bonusPoints?: number) => void;
  onSaveKalamHistory: (
    themeId: ThemeId,
    type: 'repeat' | 'ai-chat' | 'guided',
    prompt: string,
    studentResponse: string,
    feedbackNote: string
  ) => void;
}

const SKILL_ICONS: Record<SkillId, React.ComponentType<{ className?: string }>> = {
  istima: Headphones,
  kalam: MessageCircle,
  qiraah: BookOpen,
  kitabah: Pencil,
};

export const LessonWorkspace: React.FC<LessonWorkspaceProps> = ({
  theme,
  activeSkill,
  completedModules,
  answeredCorrectIds,
  skillScores,
  onSelectTheme,
  onSelectSkill,
  onBackHome,
  onRecordCorrectAnswer,
  onUpdateSkillScore,
  onMarkModuleComplete,
  onSaveKalamHistory,
}) => {
  const [showTranslations, setShowTranslations] = useState(true);
  const [showSkillHint, setShowSkillHint] = useState(false);

  // Track which listening quiz questions have had their audio played first
  const [playedAudioIds, setPlayedAudioIds] = useState<Record<string, boolean>>({});
  const [audioRequiredWarning, setAudioRequiredWarning] = useState<string | null>(null);

  // Listening & Reading MCQ feedback
  const [mcqFeedback, setMcqFeedback] = useState<
    Record<string, { selectedId: string; isCorrect: boolean }>
  >({});

  // Kalam active sentence selector for repeat practice
  const [activeRepeatId, setActiveRepeatId] = useState<string | null>(null);

  // Kitabah states (Copy, Fill, Picture Write)
  const [kitabahInputs, setKitabahInputs] = useState<Record<string, string>>({});
  const [kitabahFeedback, setKitabahFeedback] = useState<
    Record<string, { isCorrect: boolean; message: string }>
  >({});

  // Confirm before leaving active unfinished exercise
  const [pendingNavAction, setPendingNavAction] = useState<(() => void) | null>(null);

  const currentModuleKey = `${theme.id}:${activeSkill}`;
  const isCurrentCompleted = completedModules.includes(currentModuleKey);

  const hasUnsavedAttempt =
    (Object.keys(mcqFeedback).length > 0 || Object.keys(kitabahInputs).length > 0) &&
    !isCurrentCompleted;

  const requestLeaveCheck = (action: () => void) => {
    if (hasUnsavedAttempt) {
      setPendingNavAction(() => action);
    } else {
      action();
    }
  };

  const handleMcqAnswer = (
    questionId: string,
    optionId: string,
    correctOptionId: string,
    allQuestionIds: string[],
    requireAudioFirst: boolean
  ) => {
    if (requireAudioFirst && !playedAudioIds[questionId]) {
      setAudioRequiredWarning(questionId);
      playFeedbackTone(false);
      return;
    }

    setAudioRequiredWarning(null);
    const isCorrect = optionId === correctOptionId;
    playFeedbackTone(isCorrect);

    const nextMcq = {
      ...mcqFeedback,
      [questionId]: { selectedId: optionId, isCorrect },
    };
    setMcqFeedback(nextMcq);

    if (isCorrect) {
      onRecordCorrectAnswer(questionId, 10);
    }

    // Compute live score for this skill's quiz
    const newlyCorrectSet = new Set(answeredCorrectIds);
    if (isCorrect) newlyCorrectSet.add(questionId);
    const correctCount = allQuestionIds.filter((id) => newlyCorrectSet.has(id)).length;
    const scorePercent = Math.round((correctCount / allQuestionIds.length) * 100);
    const allDone = correctCount === allQuestionIds.length;

    onUpdateSkillScore(currentModuleKey, {
      score: scorePercent,
      correct: correctCount,
      total: allQuestionIds.length,
      completed: allDone,
      updatedAt: new Date().toISOString(),
    });

    if (allDone) {
      onMarkModuleComplete(currentModuleKey, 20);
    }
  };

  const handleCheckKitabahCopy = (taskId: string, targetArabic: string) => {
    const raw = (kitabahInputs[taskId] || '').trim();
    if (!raw) return;

    const cleanUser = normalizeArabicForComparison(raw);
    const cleanTarget = normalizeArabicForComparison(targetArabic);
    const isCorrect = cleanUser === cleanTarget;

    playFeedbackTone(isCorrect);
    setKitabahFeedback((prev) => ({
      ...prev,
      [taskId]: {
        isCorrect,
        message: isCorrect
          ? 'أَحْسَنْتَ! Tulisan Arabmu sudah sesuai dengan contoh.'
          : `حَاوِلْ مَرَّةً أُخْرَى! Periksa hurufnya lagi, contoh yang benar: ${targetArabic}`,
      },
    }));

    if (isCorrect) {
      onRecordCorrectAnswer(taskId, 10);
      syncKitabahScore(taskId);
    }
  };

  const handleCheckKitabahFill = (
    taskId: string,
    expectedAnswers: string[],
    sampleSentence: string
  ) => {
    const raw = (kitabahInputs[taskId] || '').trim();
    if (!raw) return;

    const cleanUser = normalizeArabicForComparison(raw);
    const isCorrect = expectedAnswers.some((ans) => {
      const cleanAns = normalizeArabicForComparison(ans);
      return cleanUser === cleanAns || cleanUser.includes(cleanAns);
    });

    playFeedbackTone(isCorrect);
    setKitabahFeedback((prev) => ({
      ...prev,
      [taskId]: {
        isCorrect,
        message: isCorrect
          ? `مُمْتَازٌ! Kalimat lengkapnya menjadi: ${sampleSentence}`
          : `Sudah mencoba! Contoh kalimat yang sesuai misalnya: ${sampleSentence}`,
      },
    }));

    if (isCorrect) {
      onRecordCorrectAnswer(taskId, 15);
      syncKitabahScore(taskId);
    }
  };

  const handleCheckPictureWrite = (
    taskId: string,
    expectedKeywords: string[],
    sampleSentence: string
  ) => {
    const raw = (kitabahInputs[taskId] || '').trim();
    if (!raw) return;

    const cleanUser = normalizeArabicForComparison(raw);
    const isCorrect = expectedKeywords.some((kw) =>
      cleanUser.includes(normalizeArabicForComparison(kw))
    );

    playFeedbackTone(isCorrect);
    setKitabahFeedback((prev) => ({
      ...prev,
      [taskId]: {
        isCorrect,
        message: isCorrect
          ? `أَحْسَنْتَ! Kalimatmu sudah sesuai gambar. Contoh: ${sampleSentence}`
          : `Bagus sudah berani menulis! Contoh kalimat yang tepat: ${sampleSentence}`,
      },
    }));

    if (isCorrect) {
      onRecordCorrectAnswer(taskId, 15);
      syncKitabahScore(taskId);
    }
  };

  const syncKitabahScore = (justCompletedId: string) => {
    const allIds = [
      ...theme.kitabah.copyTasks.map((t) => t.id),
      ...theme.kitabah.fillTasks.map((t) => t.id),
      ...(theme.kitabah.pictureWriteTask ? [`${theme.id}-pic-write`] : []),
    ];
    const setIds = new Set([...answeredCorrectIds, justCompletedId]);
    const correctCount = allIds.filter((id) => setIds.has(id)).length;
    const scorePercent = Math.round((correctCount / allIds.length) * 100);
    const allDone = correctCount === allIds.length;

    onUpdateSkillScore(currentModuleKey, {
      score: scorePercent,
      correct: correctCount,
      total: allIds.length,
      completed: allDone,
      updatedAt: new Date().toISOString(),
    });

    if (allDone) {
      onMarkModuleComplete(currentModuleKey, 20);
    }
  };

  const renderHighlightedArabic = (sentence: string, highlights: string[]) => {
    const tokens = sentence.split(' ');
    return (
      <span>
        {tokens.map((token, idx) => {
          const cleanTok = normalizeArabicForComparison(token);
          const isHighlighted = highlights.some((h) =>
            cleanTok.includes(normalizeArabicForComparison(h))
          );
          return (
            <span
              key={idx}
              className={
                isHighlighted
                  ? 'bg-[#FEF08A]/75 text-[#261C42] px-1 rounded-md mx-0.5'
                  : 'mx-0.5'
              }
            >
              {token}{' '}
            </span>
          );
        })}
      </span>
    );
  };

  const skillOrder: SkillId[] = ['istima', 'kalam', 'qiraah', 'kitabah'];
  const currentSkillIdx = skillOrder.indexOf(activeSkill);
  const nextSkill = skillOrder[currentSkillIdx + 1] || null;
  const currentThemeIdx = THEMES.findIndex((t) => t.id === theme.id);
  const nextTheme = THEMES[currentThemeIdx + 1] || null;

  const activeSkillScore = skillScores[currentModuleKey];
  const currentSkillHint =
    activeSkill === 'istima'
      ? theme.istima.hint
      : activeSkill === 'kalam'
      ? theme.kalam.hint
      : activeSkill === 'qiraah'
      ? theme.qiraah.hint
      : theme.kitabah.hint;

  return (
    <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-16 space-y-6 sm:space-y-8">
      {/* Exit Confirmation Modal */}
      {pendingNavAction && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-[#261C42]/45 backdrop-blur-xs flex items-center justify-center p-4"
        >
          <div className="max-w-md w-full rounded-3xl bg-white border border-[#DDD6FE] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-3">
              <EncouragingCloudMascot className="w-12 h-12 shrink-0" />
              <h2 className="font-display text-lg font-bold text-[#261C42]">
                Keluar dari Latihan?
              </h2>
            </div>
            <p className="text-sm text-[#4D426D] leading-relaxed">
              Latihan pada keterampilan ini masih berjalan. Jawaban yang sudah benar tetap
              tersimpan otomatis, namun isian yang belum diperiksa akan direset.
            </p>
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingNavAction(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#F4F0FF] hover:bg-[#EDE9FE] text-[#5B21B6] text-sm font-semibold"
              >
                Lanjut Mengerjakan
              </button>
              <button
                type="button"
                onClick={() => {
                  const fn = pendingNavAction;
                  setPendingNavAction(null);
                  fn();
                }}
                className="min-h-[42px] px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold"
              >
                Ya, Pindah Halaman
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation & Dars Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => requestLeaveCheck(onBackHome)}
          className="self-start min-h-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-[#F6F2FF] border border-[#DDD6FE] text-[#4C1D95] text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </button>

        <div
          className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#F4F0FF] border border-[#E2D9FA]"
          role="navigation"
          aria-label="Pilih Dars pembelajaran"
        >
          {THEMES.map((t) => {
            const active = t.id === theme.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() =>
                  requestLeaveCheck(() => {
                    setMcqFeedback({});
                    setKitabahInputs({});
                    setKitabahFeedback({});
                    onSelectTheme(t.id);
                  })
                }
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                  active
                    ? 'bg-white text-[#5B21B6] shadow-xs'
                    : 'text-[#5E5280] hover:text-[#261C42]'
                }`}
              >
                {t.darsLabel}: {t.indonesianTitle}
              </button>
            );
          })}
        </div>
      </div>

      {/* Theme Header Banner */}
      <section
        className={`relative rounded-3xl border ${theme.palette.cardBorder} ${theme.palette.cardBg} p-5 sm:p-7 overflow-hidden shadow-xs`}
      >
        <div className="pointer-events-none absolute top-3 right-5 opacity-70 animate-drift-cloud hidden sm:block">
          <PastelCloud className="w-20 h-11" fill="#FFFFFF" />
        </div>
        <div className="pointer-events-none absolute bottom-3 right-24 opacity-80 animate-twinkle-soft hidden md:block">
          <PastelStar className="w-6 h-6" />
        </div>

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5E5280]">
              <span>{theme.darsLabel}</span>
              <span aria-hidden="true">·</span>
              <span dir="rtl" className="font-arabic font-bold text-[#5B21B6] text-sm">
                مُسْتَوَى مُنْخَفِض
              </span>
              {isCurrentCompleted && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-[#0369A1] inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
                    Keterampilan Selesai
                  </span>
                </>
              )}
            </div>
            <h1 className="flex flex-wrap items-baseline gap-3">
              <span
                dir="rtl"
                className="font-arabic text-3xl sm:text-4xl font-bold text-[#261C42]"
              >
                {theme.arabicTitle}
              </span>
              <span className={`font-display text-xl sm:text-2xl font-bold ${theme.palette.accentText}`}>
                {theme.indonesianTitle}
              </span>
            </h1>
            <p className="text-sm sm:text-base text-[#4D426D] max-w-2xl">
              <strong>Tujuan:</strong> {theme.objective}
            </p>
          </div>

          <div className="hidden md:block shrink-0 animate-float-slow">
            <CartoonOpenBook className="w-16 h-14" />
          </div>
        </div>
      </section>

      {/* 4 Skill Tabs */}
      <div
        className="grid grid-cols-2 md:grid-cols-4 gap-3"
        role="tablist"
        aria-label="Empat keterampilan bahasa Arab"
      >
        {SKILLS_META.map((skill) => {
          const Icon = SKILL_ICONS[skill.id];
          const isActive = activeSkill === skill.id;
          const done = completedModules.includes(`${theme.id}:${skill.id}`);
          const rec = skillScores[`${theme.id}:${skill.id}`];

          return (
            <button
              key={skill.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() =>
                requestLeaveCheck(() => {
                  setShowSkillHint(false);
                  onSelectSkill(skill.id);
                })
              }
              className={`min-h-[64px] rounded-2xl border p-3.5 flex items-center gap-3 transition-all text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] ${
                isActive
                  ? 'bg-white border-[#7C3AED] shadow-sm ring-1 ring-[#7C3AED]/20'
                  : `${skill.bgTint} ${skill.borderTint} hover:bg-white`
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl ${skill.iconBg} flex items-center justify-center shrink-0`}
              >
                <Icon className={`w-5 h-5 ${skill.iconColor}`} aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  dir="rtl"
                  className="font-arabic text-lg font-bold text-[#261C42] leading-tight truncate"
                >
                  {skill.arabic}
                </p>
                <p className="font-display text-xs font-semibold text-[#5E5280] truncate">
                  {skill.indonesian} {rec ? `· ${rec.score}%` : ''}
                </p>
              </div>
              {done && (
                <CheckCircle2
                  className="w-4 h-4 text-[#0284C7] shrink-0"
                  aria-label="Selesai"
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Petunjuk Pengerjaan Toggle + Score Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setShowSkillHint((prev) => !prev)}
          className="self-start min-h-[42px] px-4 py-2 rounded-2xl bg-[#FFFBEB] hover:bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>{showSkillHint ? 'Tutup Petunjuk Pengerjaan' : 'Petunjuk Pengerjaan'}</span>
        </button>

        {activeSkillScore && (
          <div className="rounded-2xl bg-[#EEF7FF] border border-[#BAE6FD] px-4 py-2 text-xs sm:text-sm font-semibold text-[#0369A1] tabular-nums">
            Skor Saat Ini: {activeSkillScore.score}/100 · Benar {activeSkillScore.correct} dari{' '}
            {activeSkillScore.total}
          </div>
        )}
      </div>

      {showSkillHint && (
        <div className="rounded-2xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-sm text-[#78350F]">
          {currentSkillHint}
        </div>
      )}

      {/* Celebration Banner when Skill Completed */}
      {isCurrentCompleted && (
        <div className="rounded-3xl border border-[#FDE68A] bg-[#FFFBEB] p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 shadow-xs">
          <div className="animate-gentle-bounce shrink-0">
            <HappyStarMascot className="w-14 h-14" />
          </div>
          <div className="text-center sm:text-left space-y-0.5 flex-1">
            <p className="font-display text-base sm:text-lg font-bold text-[#92400E]">
              مُمْتَازٌ! Kamu telah menyelesaikan keterampilan ini!
            </p>
            <p className="text-sm text-[#78350F]">
              Nilai dan progresmu sudah tersimpan otomatis. Ayo lanjut ke keterampilan berikutnya!
            </p>
          </div>
        </div>
      )}

      {/* =========================================================
          SKILL 1: AL-ISTIMA'
      ========================================================= */}
      {activeSkill === 'istima' && (
        <div className="space-y-8">
          {/* Bagian A: Mufradat dengan Audio */}
          <div className="rounded-3xl border border-[#BAE6FD] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                Bagian A: Mufradat dengan Audio (الْمُفْرَدَاتُ)
              </h2>
              <p className="text-sm sm:text-base text-[#4D426D]">{theme.istima.intro}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {theme.istima.vocabulary.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-[#E0F2FE] bg-[#F7FBFF] p-5 flex flex-col justify-between gap-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-3xl leading-none" aria-hidden="true">
                      {item.emoji}
                    </span>
                    <AudioPlayer
                      text={item.arabic}
                      compact
                      label="Dengar"
                      accentClass="bg-[#0284C7] hover:bg-[#0369A1] text-white"
                    />
                  </div>

                  <div className="space-y-1.5 pt-1">
                    <p
                      dir="rtl"
                      className="font-arabic text-2xl sm:text-3xl font-bold text-[#261C42] leading-relaxed"
                    >
                      {item.arabic}
                    </p>
                    <p className="text-sm font-semibold text-[#0369A1] italic">
                      {item.transliteration}
                    </p>
                    <p className="text-sm font-medium text-[#4D426D]">{item.indonesian}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bagian B: Mendengarkan Kalimat */}
          <div className="rounded-3xl border border-[#DDD6FE] bg-white p-5 sm:p-7 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                Bagian B: Mendengarkan Kalimat Sederhana
              </h2>
              <p className="text-sm sm:text-base text-[#4D426D]">
                Dengarkan contoh kalimat berikut dengan saksama, atur kecepatan suara jika perlu.
              </p>
            </div>

            <div className="space-y-3">
              {theme.istima.sentences.map((sent, idx) => (
                <div
                  key={sent.id}
                  className="rounded-2xl border border-[#E9E1FA] bg-[#FAF8FF] p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <span className="text-xs font-bold text-[#6D28D9]">Kalimat {idx + 1}</span>
                    <p
                      dir="rtl"
                      className="font-arabic text-2xl sm:text-3xl font-bold text-[#261C42] leading-relaxed"
                    >
                      {sent.arabic}
                    </p>
                    <p className="text-xs sm:text-sm font-medium italic text-[#5B21B6]">
                      {sent.transliteration}
                    </p>
                    <p className="text-sm text-[#4D426D]">{sent.indonesian}</p>
                  </div>
                  <AudioPlayer
                    text={sent.arabic}
                    label="Putar Kalimat"
                    accentClass="bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Latihan Istima': 5 Soal Pilihan Ganda */}
          <div className="rounded-3xl border border-[#DDD6FE] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                Latihan Istima&apos; (تَدْرِيبُ الِاسْتِمَاعِ — 5 Soal)
              </h2>
              <p className="text-sm sm:text-base text-[#4D426D]">
                Putar audio soal terlebih dahulu sebelum memilih jawaban!
              </p>
            </div>

            <div className="space-y-5">
              {theme.istima.questions.map((q, idx) => {
                const feedback = mcqFeedback[q.id];
                const isAlreadyDone = answeredCorrectIds.includes(q.id);
                const audioWasPlayed = Boolean(playedAudioIds[q.id]);
                const allQIds = theme.istima.questions.map((item) => item.id);

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-[#E9E1FA] bg-[#FAF8FF] p-5 space-y-4"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#6D28D9]">
                          Soal {idx + 1} dari {theme.istima.questions.length}
                          {isAlreadyDone ? ' · Sudah Benar (+10 Poin)' : ''}
                        </span>
                        <p className="text-sm sm:text-base font-semibold text-[#261C42]">
                          {q.promptHint}
                        </p>
                      </div>

                      <AudioPlayer
                        text={q.promptAudioText}
                        label="Putar Audio Soal"
                        onPlayed={() => {
                          setPlayedAudioIds((prev) => ({ ...prev, [q.id]: true }));
                          if (audioRequiredWarning === q.id) {
                            setAudioRequiredWarning(null);
                          }
                        }}
                        accentClass="bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
                      />
                    </div>

                    {audioRequiredWarning === q.id && (
                      <div className="rounded-xl bg-[#FFFBEB] border border-[#FDE68A] px-3.5 py-2 text-xs sm:text-sm font-medium text-[#92400E]">
                        Putar tombol &ldquo;Putar Audio Soal&rdquo; terlebih dahulu sebelum memilih jawaban ya!
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {q.options.map((opt) => {
                        const selected = feedback?.selectedId === opt.id;
                        const isRightChoice = selected && feedback?.isCorrect;
                        const isWrongChoice = selected && !feedback?.isCorrect;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleMcqAnswer(q.id, opt.id, q.correctOptionId, allQIds, true)
                            }
                            className={`min-h-[94px] rounded-2xl border p-4 text-left transition-all space-y-1.5 ${
                              isRightChoice
                                ? 'bg-[#EFF6FF] border-[#0284C7] ring-2 ring-[#7DD3FC]'
                                : isWrongChoice
                                ? 'bg-[#FFF1EB] border-[#EA580C] ring-2 ring-[#FED7AA]'
                                : !audioWasPlayed
                                ? 'bg-white/75 border-[#E2D9FA] opacity-85 hover:border-[#8B5CF6]'
                                : 'bg-white border-[#E2D9FA] hover:border-[#8B5CF6] hover:bg-[#F6F2FF]'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <p
                                dir="rtl"
                                className="font-arabic text-xl sm:text-2xl font-bold text-[#261C42]"
                              >
                                {opt.arabic}
                              </p>
                              {opt.emoji && (
                                <span className="text-2xl leading-none" aria-hidden="true">
                                  {opt.emoji}
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-medium text-[#5E5280]">
                              {opt.transliteration} · {opt.indonesian}
                            </p>
                          </button>
                        );
                      })}
                    </div>

                    {feedback && (
                      <div
                        className={`rounded-2xl p-4 flex items-center gap-4 border ${
                          feedback.isCorrect
                            ? 'bg-[#FFFBEB] border-[#FDE68A]'
                            : 'bg-[#FFF3EB] border-[#FED7AA]'
                        }`}
                      >
                        {feedback.isCorrect ? (
                          <HappyStarMascot className="w-12 h-12 shrink-0 animate-gentle-bounce" />
                        ) : (
                          <EncouragingCloudMascot className="w-12 h-12 shrink-0" />
                        )}
                        <div className="space-y-0.5">
                          <p className="font-display font-bold text-sm sm:text-base text-[#261C42]">
                            {feedback.isCorrect
                              ? 'أَحْسَنْتَ! Jawabanmu Benar!'
                              : 'حَاوِلْ مَرَّةً أُخْرَى! Yuk coba dengarkan lagi.'}
                          </p>
                          <p className="text-xs sm:text-sm text-[#4D426D]">
                            {feedback.isCorrect
                              ? q.explanation
                              : 'Tekan Putar Audio Soal sekali lagi dan perhatikan kata yang terdengar.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SKILL 2: AL-KALAM
      ========================================================= */}
      {activeSkill === 'kalam' && (
        <div className="space-y-8">
          {/* Bagian A: Dengarkan dan Ulangi */}
          <div className="rounded-3xl border border-[#DDD6FE] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                  Bagian A: Dengarkan dan Ulangi
                </h2>
                <p className="text-sm sm:text-base text-[#4D426D]">{theme.kalam.intro}</p>
              </div>
              {!isCurrentCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    playFeedbackTone(true);
                    onMarkModuleComplete(currentModuleKey, 20);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0"
                >
                  Tandai Maharah Kalam Selesai
                </button>
              )}
            </div>

            <div className="space-y-4">
              {theme.kalam.repeatSentences.map((sent, idx) => {
                const isSelected = (activeRepeatId || theme.kalam.repeatSentences[0]?.id) === sent.id;
                return (
                  <div
                    key={sent.id}
                    className={`rounded-2xl border p-4 sm:p-5 space-y-4 transition-colors ${
                      isSelected ? 'bg-[#F6F2FF] border-[#8B5CF6]' : 'bg-[#FAF8FF] border-[#E9E1FA]'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      <div className="space-y-1.5">
                        <span className="text-xs font-bold text-[#6D28D9]">Kalimat {idx + 1}</span>
                        <p
                          dir="rtl"
                          className="font-arabic text-2xl sm:text-3xl font-bold text-[#261C42]"
                        >
                          {sent.arabic}
                        </p>
                        <p className="text-xs sm:text-sm italic font-medium text-[#5B21B6]">
                          {sent.transliteration} · {sent.indonesian}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <AudioPlayer
                          text={sent.arabic}
                          compact
                          label="Dengarkan"
                          accentClass="bg-[#6D28D9] hover:bg-[#5B21B6] text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setActiveRepeatId(sent.id)}
                          className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold border transition-colors ${
                            isSelected
                              ? 'bg-[#6D28D9] border-[#6D28D9] text-white'
                              : 'bg-white border-[#DDD6FE] text-[#5B21B6] hover:bg-[#EDE9FE]'
                          }`}
                        >
                          {isSelected ? 'Sedang Dilatih' : 'Latih Ucapkan'}
                        </button>
                      </div>
                    </div>

                    {isSelected && (
                      <VoiceRecorder
                        targetArabic={sent.arabic}
                        buttonLabel="Simpan Latihan"
                        onSaveTranscript={(transcript, note) => {
                          onSaveKalamHistory(theme.id, 'repeat', sent.arabic, transcript, note);
                          onMarkModuleComplete(currentModuleKey, 20);
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bagian B: AI Arabic Conversation Partner */}
          <div className="space-y-3">
            <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
              Bagian B: Berbicara dengan Teman AI
            </h2>
            <AIConversation
              theme={theme}
              onSaveChatTurn={(prompt, studentResponse) => {
                onSaveKalamHistory(
                  theme.id,
                  'ai-chat',
                  prompt,
                  studentResponse,
                  'Percakapan interaktif dengan Teman Bicara AI'
                );
                onMarkModuleComplete(currentModuleKey, 20);
              }}
            />
          </div>

          {/* Bagian C: Latihan Kalam Terbimbing */}
          <div className="rounded-3xl border border-[#BAE6FD] bg-white p-5 sm:p-7 space-y-5 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                Bagian C: {theme.kalam.guidedPrompt.title}
              </h2>
              <p className="text-sm sm:text-base text-[#4D426D]">
                {theme.kalam.guidedPrompt.description}
              </p>
            </div>

            <div className="rounded-2xl border border-[#BAE6FD] bg-[#EEF7FF] p-5 space-y-3">
              <div className="text-4xl leading-none" aria-hidden="true">
                {theme.kalam.guidedPrompt.visualEmoji}
              </div>
              <p className="text-sm sm:text-base font-bold text-[#261C42]">
                {theme.kalam.guidedPrompt.characterSummary}
              </p>
              <div className="space-y-1 pt-1" dir="rtl">
                <p className="text-xs font-bold text-[#0369A1]" dir="ltr">
                  Pola Kalimat Bantuan:
                </p>
                {theme.kalam.guidedPrompt.patternLines.map((line, i) => (
                  <p key={i} className="font-arabic text-xl sm:text-2xl font-bold text-[#261C42]">
                    {line}
                  </p>
                ))}
              </div>
              <AudioPlayer
                text={theme.kalam.guidedPrompt.sampleAnswer}
                label="Dengar Contoh Jawaban"
                accentClass="bg-[#0284C7] hover:bg-[#0369A1] text-white"
              />
            </div>

            <VoiceRecorder
              targetArabic={theme.kalam.guidedPrompt.sampleAnswer}
              buttonLabel="Simpan Kalam Terbimbing"
              onSaveTranscript={(transcript, note) => {
                onSaveKalamHistory(
                  theme.id,
                  'guided',
                  theme.kalam.guidedPrompt.title,
                  transcript,
                  note
                );
                onMarkModuleComplete(currentModuleKey, 20);
              }}
            />
          </div>
        </div>
      )}

      {/* =========================================================
          SKILL 3: AL-QIRA'AH
      ========================================================= */}
      {activeSkill === 'qiraah' && (
        <div className="space-y-8">
          {/* Teks Bacaan */}
          <div className="rounded-3xl border border-[#FDE68A] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <p
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl font-bold text-[#261C42]"
                >
                  {theme.qiraah.passageTitleArabic}
                </p>
                <h2 className="font-display text-lg sm:text-xl font-bold text-[#A16207]">
                  {theme.qiraah.passageTitleIndonesian}
                </h2>
                <p className="text-sm text-[#4D426D]">{theme.qiraah.intro}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <AudioPlayer
                  text={theme.qiraah.sentences.map((s) => s.arabic).join(' ')}
                  label="Bacakan Teks"
                  accentClass="bg-[#CA8A04] hover:bg-[#A16207] text-white"
                />

                <button
                  type="button"
                  onClick={() => setShowTranslations((prev) => !prev)}
                  className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#FFFDF9] hover:bg-[#FEFCE8] border border-[#FDE68A] text-[#713F12] text-xs sm:text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  {showTranslations ? (
                    <EyeOff className="w-4 h-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{showTranslations ? 'Sembunyikan Arti' : 'Lihat Arti'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {theme.qiraah.sentences.map((sentence, idx) => (
                <div
                  key={`sent-${theme.id}-${idx}`}
                  className="rounded-2xl border border-[#FEF08A] bg-[#FFFDF2] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-2 flex-1">
                    <p
                      dir="rtl"
                      className="font-arabic text-2xl sm:text-3xl font-bold text-[#261C42] leading-loose"
                    >
                      {renderHighlightedArabic(sentence.arabic, theme.qiraah.highlightedWords)}
                    </p>
                    {showTranslations && (
                      <div className="space-y-0.5 pt-1 border-t border-[#FEF08A]/80">
                        <p className="text-xs sm:text-sm font-medium italic text-[#92400E]">
                          {sentence.transliteration}
                        </p>
                        <p className="text-sm text-[#4D426D]">{sentence.indonesian}</p>
                      </div>
                    )}
                  </div>

                  <AudioPlayer
                    text={sentence.arabic}
                    compact
                    label="Dengar"
                    showSpeedControl={false}
                    accentClass="bg-[#FEF08A] hover:bg-[#FDE047] text-[#713F12]"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Latihan Menjodohkan Gambar (jika tersedia pada Dars 2 & 3) */}
          {theme.qiraah.imageMatchPairs && (
            <MatchingExercise
              title="Latihan Menjodohkan Kosakata &amp; Gambar"
              subtitle="Klik kata Arab di kiri, lalu klik gambar dan nama benda yang cocok di kanan."
              pairs={theme.qiraah.imageMatchPairs}
              onComplete={() => onRecordCorrectAnswer(`${theme.id}-img-match`, 15)}
            />
          )}

          {/* Latihan Menjodohkan Kosakata & Arti (5 Pasangan) */}
          <MatchingExercise
            title="Latihan Menjodohkan Kosakata &amp; Arti (5 Pasangan)"
            subtitle="Pasangkan setiap kosakata Arab dengan terjemahan bahasa Indonesianya."
            pairs={theme.qiraah.vocabMatchPairs}
            onComplete={() => onRecordCorrectAnswer(`${theme.id}-vocab-match`, 15)}
          />

          {/* 5 Soal Pemahaman Bacaan */}
          <div className="rounded-3xl border border-[#DDD6FE] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                Pemahaman Teks Bacaan (5 Soal)
              </h2>
              <p className="text-sm sm:text-base text-[#4D426D]">
                Jawab pertanyaan berikut berdasarkan teks di atas.
              </p>
            </div>

            <div className="space-y-5">
              {theme.qiraah.questions.map((q, idx) => {
                const feedback = mcqFeedback[q.id];
                const isAlreadyDone = answeredCorrectIds.includes(q.id);
                const allQIds = theme.qiraah.questions.map((item) => item.id);

                return (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-[#E9E1FA] bg-[#FAF8FF] p-5 space-y-4"
                  >
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-[#6D28D9]">
                        Pertanyaan {idx + 1} dari {theme.qiraah.questions.length}
                        {isAlreadyDone ? ' · Sudah Benar (+10 Poin)' : ''}
                      </span>
                      <p
                        dir="rtl"
                        className="font-arabic text-2xl font-bold text-[#261C42] leading-relaxed"
                      >
                        {q.questionArabic}
                      </p>
                      <p className="text-sm font-medium text-[#4D426D]">{q.questionIndonesian}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {q.options.map((opt) => {
                        const selected = feedback?.selectedId === opt.id;
                        const isRightChoice = selected && feedback?.isCorrect;
                        const isWrongChoice = selected && !feedback?.isCorrect;

                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              handleMcqAnswer(q.id, opt.id, q.correctOptionId, allQIds, false)
                            }
                            className={`min-h-[80px] rounded-2xl border p-4 text-left transition-all space-y-1 ${
                              isRightChoice
                                ? 'bg-[#EFF6FF] border-[#0284C7] ring-2 ring-[#7DD3FC]'
                                : isWrongChoice
                                ? 'bg-[#FFF1EB] border-[#EA580C] ring-2 ring-[#FED7AA]'
                                : 'bg-white border-[#E2D9FA] hover:border-[#8B5CF6] hover:bg-[#F6F2FF]'
                            }`}
                          >
                            <p
                              dir="rtl"
                              className="font-arabic text-xl sm:text-2xl font-bold text-[#261C42]"
                            >
                              {opt.arabic}
                            </p>
                            <p className="text-xs font-medium text-[#5E5280]">{opt.indonesian}</p>
                          </button>
                        );
                      })}
                    </div>

                    {feedback && (
                      <div
                        className={`rounded-2xl p-4 flex items-center gap-4 border ${
                          feedback.isCorrect
                            ? 'bg-[#FFFBEB] border-[#FDE68A]'
                            : 'bg-[#FFF3EB] border-[#FED7AA]'
                        }`}
                      >
                        {feedback.isCorrect ? (
                          <HappyStarMascot className="w-12 h-12 shrink-0 animate-gentle-bounce" />
                        ) : (
                          <EncouragingCloudMascot className="w-12 h-12 shrink-0" />
                        )}
                        <div className="space-y-0.5">
                          <p className="font-display font-bold text-sm sm:text-base text-[#261C42]">
                            {feedback.isCorrect
                              ? 'أَحْسَنْتَ! Jawabanmu Tepat!'
                              : 'حَاوِلْ مَرَّةً أُخْرَى! Yuk periksa kembali teksnya.'}
                          </p>
                          <p className="text-xs sm:text-sm text-[#4D426D]">
                            {feedback.isCorrect
                              ? q.explanation
                              : 'Baca kembali kalimat yang ditandai warna kuning pada teks di atas.'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SKILL 4: AL-KITABAH
      ========================================================= */}
      {activeSkill === 'kitabah' && (
        <div className="space-y-8">
          {/* Bagian A: Menyalin Tulisan Arab */}
          <div className="rounded-3xl border border-[#FED7AA] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                Bagian A: Menyalin Tulisan Arab (RTL)
              </h2>
              <p className="text-sm sm:text-base text-[#4D426D]">{theme.kitabah.intro}</p>
            </div>

            <div className="space-y-5">
              {theme.kitabah.copyTasks.map((task, idx) => {
                const val = kitabahInputs[task.id] || '';
                const fb = kitabahFeedback[task.id];
                const isDone = answeredCorrectIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-[#FED7AA] bg-[#FFF8F3] p-5 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#C2410C]">
                          Salin {idx + 1} dari {theme.kitabah.copyTasks.length}
                          {isDone ? ' · Sudah Benar (+10 Poin)' : ''}
                        </span>
                        <div className="flex flex-wrap items-baseline gap-3">
                          <p
                            dir="rtl"
                            className="font-arabic text-3xl font-bold text-[#261C42]"
                          >
                            {task.targetArabic}
                          </p>
                          <span className="text-sm text-[#5E5280]">({task.indonesian})</span>
                        </div>
                      </div>
                      <AudioPlayer
                        text={task.targetArabic}
                        compact
                        label="Dengar"
                        showSpeedControl={false}
                        accentClass="bg-[#EA580C] hover:bg-[#C2410C] text-white"
                      />
                    </div>

                    <ArabicTextInput
                      value={val}
                      onChange={(next) =>
                        setKitabahInputs((prev) => ({ ...prev, [task.id]: next }))
                      }
                    />

                    <button
                      type="button"
                      disabled={!val.trim()}
                      onClick={() => handleCheckKitabahCopy(task.id, task.targetArabic)}
                      className="min-h-[44px] px-5 py-2 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                    >
                      Periksa Tulisan
                    </button>

                    {fb && (
                      <div
                        className={`rounded-2xl p-4 flex items-center gap-4 border ${
                          fb.isCorrect
                            ? 'bg-[#FFFBEB] border-[#FDE68A]'
                            : 'bg-[#FFF1F2] border-[#FECDD3]'
                        }`}
                      >
                        {fb.isCorrect ? (
                          <HappyStarMascot className="w-11 h-11 shrink-0" />
                        ) : (
                          <EncouragingCloudMascot className="w-11 h-11 shrink-0" />
                        )}
                        <p className="text-xs sm:text-sm font-medium text-[#261C42]">
                          {fb.message}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bagian B: Melengkapi Kalimat */}
          <div className="rounded-3xl border border-[#DDD6FE] bg-white p-5 sm:p-7 space-y-6 shadow-xs">
            <div className="space-y-1">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                Bagian B: Melengkapi Kalimat
              </h2>
              <p className="text-sm sm:text-base text-[#4D426D]">
                Isi bagian yang kosong dengan huruf Arab menggunakan keyboard fisik atau keyboard Arab virtual.
              </p>
            </div>

            <div className="space-y-5">
              {theme.kitabah.fillTasks.map((task, idx) => {
                const val = kitabahInputs[task.id] || '';
                const fb = kitabahFeedback[task.id];
                const isDone = answeredCorrectIds.includes(task.id);

                return (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-[#E5DCFE] bg-[#FAF8FF] p-5 space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      {task.hintEmoji && (
                        <span className="text-3xl leading-none shrink-0" aria-hidden="true">
                          {task.hintEmoji}
                        </span>
                      )}
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-[#6D28D9]">
                          Melengkapi {idx + 1} dari {theme.kitabah.fillTasks.length}
                          {isDone ? ' · Sudah Benar (+15 Poin)' : ''}
                        </span>
                        <p className="text-sm sm:text-base font-bold text-[#261C42]">
                          {task.instruction}
                        </p>
                        <p className="text-xs text-[#5E5280]">Petunjuk: {task.hintText}</p>
                      </div>
                    </div>

                    <div
                      dir="rtl"
                      className="rounded-2xl bg-white border border-[#DDD6FE] px-4 py-3 flex flex-wrap items-center gap-2 font-arabic text-2xl font-bold text-[#261C42]"
                    >
                      <span>{task.promptPrefix}</span>
                      <span className="text-[#6D28D9] underline decoration-dashed underline-offset-8">
                        {val.trim() || '............'}
                      </span>
                      {task.promptSuffix && <span>{task.promptSuffix}</span>}
                    </div>

                    <ArabicTextInput
                      value={val}
                      onChange={(next) =>
                        setKitabahInputs((prev) => ({ ...prev, [task.id]: next }))
                      }
                      placeholder="Ketik kata pelengkap dalam bahasa Arab..."
                    />

                    <button
                      type="button"
                      disabled={!val.trim()}
                      onClick={() =>
                        handleCheckKitabahFill(
                          task.id,
                          task.expectedAnswers,
                          task.sampleFullSentence
                        )
                      }
                      className="min-h-[44px] px-5 py-2 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 text-white text-sm font-semibold transition-colors"
                    >
                      Periksa Jawaban
                    </button>

                    {fb && (
                      <div
                        className={`rounded-2xl p-4 flex items-center gap-4 border ${
                          fb.isCorrect
                            ? 'bg-[#FFFBEB] border-[#FDE68A]'
                            : 'bg-[#FFF3EB] border-[#FED7AA]'
                        }`}
                      >
                        {fb.isCorrect ? (
                          <HappyStarMascot className="w-11 h-11 shrink-0" />
                        ) : (
                          <EncouragingCloudMascot className="w-11 h-11 shrink-0" />
                        )}
                        <p className="text-xs sm:text-sm font-medium text-[#261C42]">
                          {fb.message}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bagian C: Menulis Kalimat Berdasarkan Gambar (Dars 2 & 3) */}
          {theme.kitabah.pictureWriteTask && (
            <div className="rounded-3xl border border-[#BAE6FD] bg-white p-5 sm:p-7 space-y-5 shadow-xs">
              <div className="space-y-1">
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
                  Bagian C: Menulis Kalimat Berdasarkan Gambar
                </h2>
                <p className="text-sm sm:text-base text-[#4D426D]">
                  {theme.kitabah.pictureWriteTask.instruction}
                </p>
              </div>

              <div className="rounded-2xl border border-[#BAE6FD] bg-[#EEF7FF] p-5 flex items-center gap-4">
                <span className="text-5xl leading-none" aria-hidden="true">
                  {theme.kitabah.pictureWriteTask.promptEmoji}
                </span>
                <div className="space-y-1">
                  <p className="font-display font-bold text-base text-[#261C42]">
                    {theme.kitabah.pictureWriteTask.promptLabel}
                  </p>
                  <p dir="rtl" className="font-arabic text-xl font-bold text-[#0369A1]">
                    {theme.kitabah.pictureWriteTask.examplePattern}
                  </p>
                </div>
              </div>

              <ArabicTextInput
                value={kitabahInputs[`${theme.id}-pic-write`] || ''}
                onChange={(next) =>
                  setKitabahInputs((prev) => ({
                    ...prev,
                    [`${theme.id}-pic-write`]: next,
                  }))
                }
                placeholder="Tulis kalimat bahasa Arab berdasarkan gambar di atas..."
              />

              <button
                type="button"
                disabled={!(kitabahInputs[`${theme.id}-pic-write`] || '').trim()}
                onClick={() =>
                  handleCheckPictureWrite(
                    `${theme.id}-pic-write`,
                    theme.kitabah.pictureWriteTask!.expectedKeywords,
                    theme.kitabah.pictureWriteTask!.sampleSentence
                  )
                }
                className="min-h-[44px] px-5 py-2 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 text-white text-sm font-semibold transition-colors"
              >
                Periksa Kalimat
              </button>

              {kitabahFeedback[`${theme.id}-pic-write`] && (
                <div
                  className={`rounded-2xl p-4 flex items-center gap-4 border ${
                    kitabahFeedback[`${theme.id}-pic-write`].isCorrect
                      ? 'bg-[#FFFBEB] border-[#FDE68A]'
                      : 'bg-[#FFF3EB] border-[#FED7AA]'
                  }`}
                >
                  {kitabahFeedback[`${theme.id}-pic-write`].isCorrect ? (
                    <HappyStarMascot className="w-11 h-11 shrink-0" />
                  ) : (
                    <EncouragingCloudMascot className="w-11 h-11 shrink-0" />
                  )}
                  <p className="text-xs sm:text-sm font-medium text-[#261C42]">
                    {kitabahFeedback[`${theme.id}-pic-write`].message}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Bottom Step Navigation: Kembali / Lanjut */}
      <div className="pt-4 border-t border-[#E9E1FA] flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => requestLeaveCheck(onBackHome)}
          className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-white hover:bg-[#F4F0FF] border border-[#DDD6FE] text-[#4C1D95] text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Menu Dars</span>
        </button>

        {nextSkill ? (
          <button
            type="button"
            onClick={() =>
              requestLeaveCheck(() => {
                setShowSkillHint(false);
                onSelectSkill(nextSkill);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              })
            }
            className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <span>
              Lanjut ke {SKILLS_META.find((s) => s.id === nextSkill)?.indonesian}
            </span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        ) : nextTheme ? (
          <button
            type="button"
            onClick={() =>
              requestLeaveCheck(() => {
                setMcqFeedback({});
                setKitabahInputs({});
                setKitabahFeedback({});
                onSelectTheme(nextTheme.id);
                onSelectSkill('istima');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              })
            }
            className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] text-white text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Lanjut ke {nextTheme.darsLabel}: {nextTheme.indonesianTitle}</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => requestLeaveCheck(onBackHome)}
            className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <span>Selesai · Kembali ke Beranda</span>
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
          </button>
        )}
      </div>
    </main>
  );
};
