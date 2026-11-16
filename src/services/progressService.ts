import {
  KalamHistoryItem,
  SkillScoreRecord,
  StudentProfile,
  StudentProgressState,
  ThemeId,
} from '../types/learning';

const STORAGE_KEY = 'rihlati_elkpd_arabic_v2';

export const DEFAULT_PROGRESS_STATE: StudentProgressState = {
  level: 'low',
  student: null,
  points: 0,
  completedModules: [],
  answeredCorrectIds: [],
  skillScores: {},
  kalamHistory: [],
};

export function loadProgress(): StudentProgressState {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS_STATE;
    const parsed = JSON.parse(raw) as Partial<StudentProgressState>;
    return {
      level: parsed.level || 'low',
      student: parsed.student || null,
      points: typeof parsed.points === 'number' ? parsed.points : 0,
      completedModules: Array.isArray(parsed.completedModules)
        ? parsed.completedModules
        : [],
      answeredCorrectIds: Array.isArray(parsed.answeredCorrectIds)
        ? parsed.answeredCorrectIds
        : [],
      skillScores: parsed.skillScores || {},
      kalamHistory: Array.isArray(parsed.kalamHistory) ? parsed.kalamHistory : [],
    };
  } catch {
    return DEFAULT_PROGRESS_STATE;
  }
}

export function saveProgress(state: StudentProgressState): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage quota errors
  }
}

export function clearProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore
  }
}

export function updateStudentProfile(
  prev: StudentProgressState,
  student: StudentProfile
): StudentProgressState {
  return {
    ...prev,
    student,
  };
}

export function upsertSkillScore(
  prev: StudentProgressState,
  moduleKey: string,
  record: SkillScoreRecord
): StudentProgressState {
  return {
    ...prev,
    skillScores: {
      ...prev.skillScores,
      [moduleKey]: record,
    },
  };
}

export function appendKalamHistory(
  prev: StudentProgressState,
  item: Omit<KalamHistoryItem, 'id' | 'timestamp'>
): StudentProgressState {
  const newItem: KalamHistoryItem = {
    ...item,
    id: `kalam-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  return {
    ...prev,
    kalamHistory: [newItem, ...prev.kalamHistory].slice(0, 30),
  };
}

export function getThemeStatus(
  completedModules: string[],
  skillScores: Record<string, SkillScoreRecord>,
  themeId: ThemeId
): {
  statusLabel: 'Belum Dimulai' | 'Sedang Dipelajari' | 'Selesai';
  completedCount: number;
  percentage: number;
} {
  const skills = ['istima', 'kalam', 'qiraah', 'kitabah'];
  const completedCount = skills.filter((s) =>
    completedModules.includes(`${themeId}:${s}`)
  ).length;
  const startedCount = skills.filter(
    (s) =>
      completedModules.includes(`${themeId}:${s}`) ||
      Boolean(skillScores[`${themeId}:${s}`])
  ).length;

  const percentage = Math.round((completedCount / 4) * 100);
  if (completedCount === 4) {
    return { statusLabel: 'Selesai', completedCount, percentage };
  }
  if (startedCount > 0 || completedCount > 0) {
    return { statusLabel: 'Sedang Dipelajari', completedCount, percentage };
  }
  return { statusLabel: 'Belum Dimulai', completedCount, percentage };
}
