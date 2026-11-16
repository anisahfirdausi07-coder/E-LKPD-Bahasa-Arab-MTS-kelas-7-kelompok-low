export type SpeechSpeed = 0.75 | 0.85 | 1.0;

interface SpeechControlCallbacks {
  onStart?: () => void;
  onPause?: () => void;
  onResume?: () => void;
  onEnd?: () => void;
}

export function isSpeechSynthesisSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function speakArabicText(
  text: string,
  speed: SpeechSpeed = 0.85,
  callbacks?: SpeechControlCallbacks
): void {
  if (!isSpeechSynthesisSupported()) {
    callbacks?.onStart?.();
    setTimeout(() => callbacks?.onEnd?.(), 900);
    return;
  }

  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ar-SA';
    utterance.rate = speed;
    utterance.pitch = 1.02;

    const voices = window.speechSynthesis.getVoices();
    const arabicVoice =
      voices.find((v) => v.lang.toLowerCase().startsWith('ar-sa')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ar-eg')) ||
      voices.find((v) => v.lang.toLowerCase().startsWith('ar'));

    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    utterance.onstart = () => callbacks?.onStart?.();
    utterance.onpause = () => callbacks?.onPause?.();
    utterance.onresume = () => callbacks?.onResume?.();
    utterance.onend = () => callbacks?.onEnd?.();
    utterance.onerror = () => callbacks?.onEnd?.();

    window.speechSynthesis.speak(utterance);
  } catch {
    callbacks?.onEnd?.();
  }
}

export function pauseArabicSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.speaking) {
    window.speechSynthesis.pause();
  }
}

export function resumeArabicSpeech(): void {
  if (isSpeechSynthesisSupported() && window.speechSynthesis.paused) {
    window.speechSynthesis.resume();
  }
}

export function stopArabicSpeech(): void {
  if (isSpeechSynthesisSupported()) {
    window.speechSynthesis.cancel();
  }
}

export function playFeedbackTone(isCorrect: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const notes = isCorrect ? [523.25, 659.25, 783.99] : [349.23, 311.13];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.09);

      gain.gain.setValueAtTime(0.001, now + idx * 0.09);
      gain.gain.exponentialRampToValueAtTime(0.08, now + idx * 0.09 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + idx * 0.09);
      osc.stop(now + idx * 0.09 + 0.24);
    });
  } catch {
    // Optional sound feedback
  }
}

export interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function createArabicSpeechRecognition(): SpeechRecognitionInstance | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  };
  const RecognitionCtor = win.SpeechRecognition || win.webkitSpeechRecognition;
  if (!RecognitionCtor) return null;

  const recognition = new RecognitionCtor();
  recognition.lang = 'ar-SA';
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = false;
  return recognition;
}

export function normalizeArabicForComparison(input: string): string {
  return input
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // Strip harakat & tatweel for gentle comparison
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[.,،؟?!؛:«»"']/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}
