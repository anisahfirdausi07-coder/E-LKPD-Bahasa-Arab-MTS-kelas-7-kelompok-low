import React, { useState } from 'react';
import { Pause, Play, RotateCcw, Volume2 } from 'lucide-react';
import {
  pauseArabicSpeech,
  resumeArabicSpeech,
  speakArabicText,
  SpeechSpeed,
} from '../services/speechService';

interface AudioPlayerProps {
  text: string;
  label?: string;
  compact?: boolean;
  showSpeedControl?: boolean;
  onPlayed?: () => void;
  accentClass?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({
  text,
  label = 'Putar Audio',
  compact = false,
  showSpeedControl = true,
  onPlayed,
  accentClass = 'bg-[#0284C7] hover:bg-[#0369A1] text-white',
}) => {
  const [status, setStatus] = useState<'idle' | 'playing' | 'paused'>('idle');
  const [speed, setSpeed] = useState<SpeechSpeed>(0.85);

  const handlePlay = () => {
    onPlayed?.();
    if (status === 'paused') {
      resumeArabicSpeech();
      setStatus('playing');
      return;
    }
    speakArabicText(text, speed, {
      onStart: () => setStatus('playing'),
      onPause: () => setStatus('paused'),
      onResume: () => setStatus('playing'),
      onEnd: () => setStatus('idle'),
    });
  };

  const handlePause = () => {
    pauseArabicSpeech();
    setStatus('paused');
  };

  const handleReplay = () => {
    onPlayed?.();
    speakArabicText(text, speed, {
      onStart: () => setStatus('playing'),
      onEnd: () => setStatus('idle'),
    });
  };

  const cycleSpeed = () => {
    const next: SpeechSpeed = speed === 0.75 ? 0.85 : speed === 0.85 ? 1.0 : 0.75;
    setSpeed(next);
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={status === 'playing' ? handlePause : handlePlay}
          className={`min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${accentClass}`}
        >
          {status === 'playing' ? (
            <>
              <Pause className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>Jeda</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{status === 'paused' ? 'Lanjut' : label}</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleReplay}
          title="Ulangi suara"
          aria-label="Ulangi suara"
          className="min-h-[40px] min-w-[40px] px-2.5 rounded-xl bg-white hover:bg-[#F4F0FF] border border-[#DDD6FE] text-[#5B21B6] flex items-center justify-center transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={status === 'playing' ? handlePause : handlePlay}
        className={`min-h-[44px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${accentClass}`}
      >
        {status === 'playing' ? (
          <>
            <Pause className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Jeda Audio</span>
          </>
        ) : (
          <>
            <Play className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
            <span>{status === 'paused' ? 'Lanjutkan' : label}</span>
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleReplay}
        className="min-h-[44px] px-3.5 py-2 rounded-2xl bg-white hover:bg-[#F4F0FF] border border-[#DDD6FE] text-[#5B21B6] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
      >
        <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Ulangi</span>
      </button>

      {showSpeedControl && (
        <button
          type="button"
          onClick={cycleSpeed}
          title="Ubah kecepatan suara"
          className="min-h-[44px] px-3 py-2 rounded-2xl bg-[#FFFDF9] hover:bg-[#EEF7FF] border border-[#BAE6FD] text-[#0369A1] text-xs font-bold tabular-nums transition-colors"
        >
          Kecepatan: {speed}x
        </button>
      )}
    </div>
  );
};
