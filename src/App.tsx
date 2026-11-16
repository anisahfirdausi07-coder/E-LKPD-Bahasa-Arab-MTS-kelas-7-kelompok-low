/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useMemo, useState } from 'react';
import { DashboardHome } from './components/DashboardHome';
import { ActivePage, Header } from './components/Header';
import { LessonWorkspace } from './components/LessonWorkspace';
import { CornerSkyDecorations } from './components/PastelDecorations';
import { SKILLS_META, getThemesForLevel } from './data';
import { GuidePage } from './pages/GuidePage';
import { ProgressPage } from './pages/ProgressPage';
import { StudentPage } from './pages/StudentPage';
import {
  DEFAULT_PROGRESS_STATE,
  appendKalamHistory,
  clearProgress,
  loadProgress,
  saveProgress,
  updateStudentProfile,
  upsertSkillScore,
} from './services/progressService';
import {
  SkillId,
  SkillScoreRecord,
  StudentProfile,
  StudentProgressState,
  ThemeId,
} from './types/learning';

export default function App() {
  const [progress, setProgress] = useState<StudentProgressState>(loadProgress);
  const [activePage, setActivePage] = useState<ActivePage>('dashboard');
  const [activeThemeId, setActiveThemeId] = useState<ThemeId>('taaruf');
  const [activeSkill, setActiveSkill] = useState<SkillId>('istima');
  const [pendingDestination, setPendingDestination] = useState<{
    themeId: ThemeId;
    skillId: SkillId;
  } | null>(null);

  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const themes = useMemo(() => getThemesForLevel(progress.level), [progress.level]);
  const totalModules = themes.length * SKILLS_META.length;

  const activeTheme = useMemo(
    () => themes.find((t) => t.id === activeThemeId) || themes[0],
    [themes, activeThemeId]
  );

  const openLesson = (themeId: ThemeId, skillId: SkillId = 'istima') => {
    // If student hasn't entered identity yet, prompt StudentPage once and then continue straight into the chosen lesson
    if (!progress.student) {
      setPendingDestination({ themeId, skillId });
      setActivePage('student');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setActiveThemeId(themeId);
    setActiveSkill(skillId);
    setActivePage('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartJourney = () => {
    if (!progress.student) {
      setPendingDestination({ themeId: 'taaruf', skillId: 'istima' });
      setActivePage('student');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const el = document.getElementById('menu-pembelajaran');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      openLesson('taaruf', 'istima');
    }
  };

  const handleSaveStudent = (profile: StudentProfile) => {
    setProgress((prev) => updateStudentProfile(prev, profile));
    if (pendingDestination) {
      setActiveThemeId(pendingDestination.themeId);
      setActiveSkill(pendingDestination.skillId);
      setPendingDestination(null);
      setActivePage('lesson');
    } else {
      setActivePage('dashboard');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRecordCorrectAnswer = (questionId: string, pointsEarned = 10) => {
    setProgress((prev) => {
      if (prev.answeredCorrectIds.includes(questionId)) {
        return prev;
      }
      return {
        ...prev,
        points: prev.points + pointsEarned,
        answeredCorrectIds: [...prev.answeredCorrectIds, questionId],
      };
    });
  };

  const handleUpdateSkillScore = (moduleKey: string, record: SkillScoreRecord) => {
    setProgress((prev) => upsertSkillScore(prev, moduleKey, record));
  };

  const handleMarkModuleComplete = (moduleKey: string, bonusPoints = 20) => {
    setProgress((prev) => {
      if (prev.completedModules.includes(moduleKey)) {
        return prev;
      }
      return {
        ...prev,
        points: prev.points + bonusPoints,
        completedModules: [...prev.completedModules, moduleKey],
      };
    });
  };

  const handleSaveKalamHistory = (
    themeId: ThemeId,
    type: 'repeat' | 'ai-chat' | 'guided',
    prompt: string,
    studentResponse: string,
    feedbackNote: string
  ) => {
    setProgress((prev) =>
      appendKalamHistory(prev, {
        themeId,
        type,
        prompt,
        studentResponse,
        feedbackNote,
      })
    );
  };

  const handleResetProgress = () => {
    clearProgress();
    setProgress(DEFAULT_PROGRESS_STATE);
    setActivePage('dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDF9] text-[#261C42] relative selection:bg-[#EDE9FE] selection:text-[#4C1D95]">
      <CornerSkyDecorations />

      <Header
        activePage={activePage}
        student={progress.student}
        totalPoints={progress.points}
        completedCount={progress.completedModules.length}
        totalModules={totalModules}
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenMaterials={() => openLesson(activeThemeId, activeSkill)}
      />

      <div className="flex-1">
        {activePage === 'dashboard' && (
          <DashboardHome
            student={progress.student}
            completedModules={progress.completedModules}
            skillScores={progress.skillScores}
            onStartJourney={handleStartJourney}
            onOpenLesson={openLesson}
            onOpenGuide={() => {
              setActivePage('guide');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenStudentPage={() => {
              setPendingDestination(null);
              setActivePage('student');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activePage === 'student' && (
          <StudentPage
            currentStudent={progress.student}
            onSaveStudent={handleSaveStudent}
            onBack={() => {
              setPendingDestination(null);
              setActivePage('dashboard');
            }}
          />
        )}

        {activePage === 'lesson' && (
          <LessonWorkspace
            theme={activeTheme}
            activeSkill={activeSkill}
            completedModules={progress.completedModules}
            answeredCorrectIds={progress.answeredCorrectIds}
            skillScores={progress.skillScores}
            onSelectTheme={(id) => {
              setActiveThemeId(id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectSkill={(skill) => setActiveSkill(skill)}
            onBackHome={() => {
              setActivePage('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRecordCorrectAnswer={handleRecordCorrectAnswer}
            onUpdateSkillScore={handleUpdateSkillScore}
            onMarkModuleComplete={handleMarkModuleComplete}
            onSaveKalamHistory={handleSaveKalamHistory}
          />
        )}

        {activePage === 'progress' && (
          <ProgressPage
            progress={progress}
            onBackHome={() => {
              setActivePage('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEditStudent={() => {
              setPendingDestination(null);
              setActivePage('student');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLesson={(themeId) => openLesson(themeId, 'istima')}
            onResetProgress={handleResetProgress}
          />
        )}

        {activePage === 'guide' && (
          <GuidePage
            onBackHome={() => {
              setActivePage('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartLearning={() => openLesson('taaruf', 'istima')}
          />
        )}
      </div>

      <footer className="relative z-10 border-t border-[#ECE4FA] bg-[#FAF7FF]/80 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-[#5E5280]">
          <p className="text-center sm:text-left">
            <span dir="rtl" className="font-arabic font-bold text-[#5B21B6]">
              هَيَّا نَتَعَلَّمُ
            </span>{' '}
            · E-LKPD Bahasa Arab Kelas VII MTs ·{' '}
            <span dir="rtl" className="font-arabic font-bold text-[#5B21B6]">
              مُسْتَوَى مُنْخَفِض
            </span>
          </p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => {
                setActivePage('guide');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-medium text-[#5B21B6] hover:underline"
            >
              Petunjuk
            </button>
            <button
              type="button"
              onClick={() => {
                setActivePage('progress');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-medium text-[#5B21B6] hover:underline"
            >
              Progres Belajar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
