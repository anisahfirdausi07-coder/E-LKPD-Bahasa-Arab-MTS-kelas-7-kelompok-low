export type LearningLevel = 'low' | 'middle' | 'high';
export type ThemeId = 'taaruf' | 'adawat' | 'yawmiyyat';
export type SkillId = 'istima' | 'kalam' | 'qiraah' | 'kitabah';

export interface StudentProfile {
  fullName: string;
  className: string;
  attendanceNumber: string;
}

export interface VocabItem {
  id: string;
  arabic: string;
  transliteration: string;
  indonesian: string;
  emoji: string;
}

export interface SentenceItem {
  id: string;
  arabic: string;
  transliteration: string;
  indonesian: string;
}

export interface ListeningQuestion {
  id: string;
  promptAudioText: string;
  promptHint: string;
  options: {
    id: string;
    arabic: string;
    transliteration: string;
    indonesian: string;
    emoji?: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  speakerRole: 'boy' | 'girl';
  arabic: string;
  transliteration: string;
  indonesian: string;
}

export interface GuidedSpeakingPrompt {
  title: string;
  description: string;
  visualEmoji: string;
  characterSummary: string;
  patternLines: string[];
  sampleAnswer: string;
}

export interface MatchingPair {
  id: string;
  leftArabic: string;
  rightText: string;
  rightEmoji?: string;
}

export interface ReadingQuestion {
  id: string;
  questionIndonesian: string;
  questionArabic: string;
  options: {
    id: string;
    arabic: string;
    indonesian: string;
  }[];
  correctOptionId: string;
  explanation: string;
}

export interface CopyTask {
  id: string;
  targetArabic: string;
  indonesian: string;
}

export interface FillBlankTask {
  id: string;
  instruction: string;
  promptPrefix: string;
  promptSuffix?: string;
  hintEmoji?: string;
  hintText: string;
  expectedAnswers: string[];
  sampleFullSentence: string;
}

export interface PictureWriteTask {
  id: string;
  promptEmoji: string;
  promptLabel: string;
  instruction: string;
  examplePattern: string;
  expectedKeywords: string[];
  sampleSentence: string;
}

export interface ThemeContent {
  id: ThemeId;
  level: LearningLevel;
  orderNumber: string;
  darsLabel: string;
  arabicTitle: string;
  transliteration: string;
  indonesianTitle: string;
  shortDesc: string;
  objective: string;
  imagePath: string;
  palette: {
    cardBg: string;
    cardBorder: string;
    softSurface: string;
    accentBg: string;
    accentHover: string;
    accentText: string;
    badgeBg: string;
    ringColor: string;
  };
  istima: {
    intro: string;
    hint: string;
    vocabulary: VocabItem[];
    sentences: SentenceItem[];
    questions: ListeningQuestion[];
  };
  kalam: {
    intro: string;
    hint: string;
    repeatSentences: SentenceItem[];
    dialogueTitle: string;
    dialogue: DialogueLine[];
    aiOpeningMessage: {
      arabic: string;
      transliteration: string;
      indonesian: string;
      tip: string;
    };
    starterPrompts: {
      arabic: string;
      transliteration: string;
      indonesian: string;
    }[];
    guidedPrompt: GuidedSpeakingPrompt;
  };
  qiraah: {
    intro: string;
    hint: string;
    passageTitleArabic: string;
    passageTitleIndonesian: string;
    highlightedWords: string[];
    sentences: {
      arabic: string;
      transliteration: string;
      indonesian: string;
    }[];
    imageMatchPairs?: MatchingPair[];
    vocabMatchPairs: MatchingPair[];
    questions: ReadingQuestion[];
  };
  kitabah: {
    intro: string;
    hint: string;
    copyTasks: CopyTask[];
    fillTasks: FillBlankTask[];
    pictureWriteTask?: PictureWriteTask;
  };
}

export interface SkillScoreRecord {
  score: number;
  correct: number;
  total: number;
  completed: boolean;
  updatedAt: string;
}

export interface KalamHistoryItem {
  id: string;
  themeId: ThemeId;
  type: 'repeat' | 'ai-chat' | 'guided';
  prompt: string;
  studentResponse: string;
  feedbackNote: string;
  timestamp: string;
}

export interface StudentProgressState {
  level: LearningLevel;
  student: StudentProfile | null;
  points: number;
  completedModules: string[];
  answeredCorrectIds: string[];
  skillScores: Record<string, SkillScoreRecord>;
  kalamHistory: KalamHistoryItem[];
}
