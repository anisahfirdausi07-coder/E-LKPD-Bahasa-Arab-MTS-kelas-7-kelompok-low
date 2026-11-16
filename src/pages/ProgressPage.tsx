import React from 'react';
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle2,
  Headphones,
  MessageCircle,
  Pencil,
  RotateCcw,
  User,
} from 'lucide-react';
import { SKILLS_META, THEMES } from '../data';
import { getThemeStatus } from '../services/progressService';
import { StudentProgressState, ThemeId } from '../types/learning';
import { HappyStarMascot } from '../components/PastelDecorations';

interface ProgressPageProps {
  progress: StudentProgressState;
  onBackHome: () => void;
  onEditStudent: () => void;
  onOpenLesson: (themeId: ThemeId) => void;
  onResetProgress: () => void;
}

export const ProgressPage: React.FC<ProgressPageProps> = ({
  progress,
  onBackHome,
  onEditStudent,
  onOpenLesson,
  onResetProgress,
}) => {
  const totalModules = THEMES.length * SKILLS_META.length;
  const overallPercent = Math.round(
    (progress.completedModules.length / totalModules) * 100
  );

  const completedDarsCount = THEMES.filter(
    (t) =>
      getThemeStatus(progress.completedModules, progress.skillScores, t.id)
        .completedCount === 4
  ).length;

  return (
    <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackHome}
          className="min-h-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-[#F6F2FF] border border-[#DDD6FE] text-[#4C1D95] text-sm font-semibold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
          <span>Kembali ke Beranda</span>
        </button>

        {progress.points > 0 && (
          <button
            type="button"
            onClick={onResetProgress}
            className="min-h-[44px] px-4 py-2 rounded-2xl bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] text-[#9F1239] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Atur Ulang Progres</span>
          </button>
        )}
      </div>

      {/* Summary Banner */}
      <section className="rounded-3xl border border-[#DDD6FE] bg-gradient-to-br from-[#F6F2FF] via-[#FFFDF9] to-[#FFFBEB] p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4">
            <HappyStarMascot className="w-16 h-16 shrink-0" />
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5E5280]">
                <span>Hasil Belajar Peserta Didik</span>
                <span aria-hidden="true">·</span>
                <span dir="rtl" className="font-arabic font-bold text-[#5B21B6] text-sm">
                  مُسْتَوَى مُنْخَفِض
                </span>
              </div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#261C42]">
                {progress.student?.fullName || 'Siswa Kelas VII MTs'}
              </h1>
              <p className="text-sm text-[#4D426D]">
                {progress.student
                  ? `Kelas ${progress.student.className} · No. Absen ${progress.student.attendanceNumber}`
                  : 'Belum mengisi identitas siswa'}{' '}
                ·{' '}
                <button
                  type="button"
                  onClick={onEditStudent}
                  className="font-semibold text-[#6D28D9] hover:underline"
                >
                  {progress.student ? 'Ubah Data Siswa' : 'Isi Identitas Sekarang'}
                </button>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0">
            <div className="rounded-2xl bg-white border border-[#E5DCFE] px-4 py-3 text-center">
              <p className="text-xs font-medium text-[#5E5280]">Progres Total</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-[#5B21B6] tabular-nums">
                {overallPercent}%
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#BAE6FD] px-4 py-3 text-center">
              <p className="text-xs font-medium text-[#5E5280]">Dars Selesai</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-[#0369A1] tabular-nums">
                {completedDarsCount}/3
              </p>
            </div>
            <div className="rounded-2xl bg-white border border-[#FDE68A] px-4 py-3 text-center">
              <p className="text-xs font-medium text-[#5E5280]">Total Poin</p>
              <p className="font-display text-xl sm:text-2xl font-bold text-[#B45309] tabular-nums">
                {progress.points}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Score Breakdown Per Dars */}
      <section className="space-y-4">
        <h2 className="font-display text-xl sm:text-2xl font-bold text-[#261C42]">
          Rincian Nilai &amp; Penyelesaian Setiap Dars
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {THEMES.map((theme) => {
            const status = getThemeStatus(
              progress.completedModules,
              progress.skillScores,
              theme.id
            );

            const istimaScore = progress.skillScores[`${theme.id}:istima`];
            const qiraahScore = progress.skillScores[`${theme.id}:qiraah`];
            const kitabahScore = progress.skillScores[`${theme.id}:kitabah`];
            const kalamDone = progress.completedModules.includes(`${theme.id}:kalam`);

            return (
              <article
                key={theme.id}
                className={`rounded-3xl border ${theme.palette.cardBorder} ${theme.palette.cardBg} p-5 space-y-4 flex flex-col justify-between`}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-bold text-[#5E5280]">
                        {theme.darsLabel} · {status.statusLabel}
                      </span>
                      <p dir="rtl" className="font-arabic text-2xl font-bold text-[#261C42]">
                        {theme.arabicTitle}
                      </p>
                      <p className={`font-display text-base font-bold ${theme.palette.accentText}`}>
                        {theme.indonesianTitle}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-[#261C42] bg-white px-3 py-1 rounded-xl border border-white/80 tabular-nums">
                      {status.percentage}%
                    </span>
                  </div>

                  <div className="space-y-2.5 text-sm">
                    <div className="rounded-2xl bg-white/90 px-3.5 py-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium text-[#261C42]">
                        <Headphones className="w-4 h-4 text-[#0284C7]" aria-hidden="true" />
                        <span>Nilai Istima&apos;</span>
                      </span>
                      <span className="font-bold text-[#0369A1] tabular-nums">
                        {istimaScore ? `${istimaScore.score}/100 (${istimaScore.correct}/${istimaScore.total})` : 'Belum dikerjakan'}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white/90 px-3.5 py-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium text-[#261C42]">
                        <MessageCircle className="w-4 h-4 text-[#6D28D9]" aria-hidden="true" />
                        <span>Latihan Kalam</span>
                      </span>
                      <span className="font-bold text-[#5B21B6]">
                        {kalamDone ? 'Selesai Dilatih' : 'Belum selesai'}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white/90 px-3.5 py-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium text-[#261C42]">
                        <BookOpen className="w-4 h-4 text-[#CA8A04]" aria-hidden="true" />
                        <span>Nilai Qira&apos;ah</span>
                      </span>
                      <span className="font-bold text-[#A16207] tabular-nums">
                        {qiraahScore ? `${qiraahScore.score}/100 (${qiraahScore.correct}/${qiraahScore.total})` : 'Belum dikerjakan'}
                      </span>
                    </div>

                    <div className="rounded-2xl bg-white/90 px-3.5 py-2.5 flex items-center justify-between">
                      <span className="flex items-center gap-2 font-medium text-[#261C42]">
                        <Pencil className="w-4 h-4 text-[#EA580C]" aria-hidden="true" />
                        <span>Hasil Kitabah</span>
                      </span>
                      <span className="font-bold text-[#C2410C] tabular-nums">
                        {kitabahScore ? `${kitabahScore.score}/100 (${kitabahScore.correct}/${kitabahScore.total})` : 'Belum dikerjakan'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenLesson(theme.id)}
                  className={`w-full min-h-[44px] rounded-2xl ${theme.palette.accentBg} ${theme.palette.accentHover} text-white text-sm font-semibold transition-colors`}
                >
                  Buka {theme.darsLabel}
                </button>
              </article>
            );
          })}
        </div>
      </section>

      {/* Kalam History */}
      <section className="rounded-3xl border border-[#DDD6FE] bg-white p-5 sm:p-7 space-y-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EDE9FE] flex items-center justify-center">
            <Award className="w-5 h-5 text-[#6D28D9]" aria-hidden="true" />
          </div>
          <div>
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#261C42]">
              Riwayat Latihan Percakapan (Maharah Kalam)
            </h2>
            <p className="text-xs sm:text-sm text-[#5E5280]">
              Catatan ucapan dan percakapan latihan siswa tersimpan otomatis.
            </p>
          </div>
        </div>

        {progress.kalamHistory.length === 0 ? (
          <div className="rounded-2xl bg-[#FAF8FF] border border-[#E9E1FA] p-6 text-center space-y-2">
            <User className="w-8 h-8 text-[#8B5CF6] mx-auto" aria-hidden="true" />
            <p className="text-sm text-[#5E5280]">
              Belum ada riwayat latihan berbicara. Coba fitur mikrofon atau Teman Bicara AI pada salah satu Dars!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.kalamHistory.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-[#E9E1FA] bg-[#FAF8FF] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#5E5280]">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6D28D9]" aria-hidden="true" />
                    <span>{item.themeId.toUpperCase()}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.timestamp}</span>
                  </div>
                  <p dir="rtl" className="font-arabic text-xl font-bold text-[#261C42]">
                    {item.studentResponse}
                  </p>
                  <p className="text-xs text-[#4D426D]">{item.feedbackNote}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};
