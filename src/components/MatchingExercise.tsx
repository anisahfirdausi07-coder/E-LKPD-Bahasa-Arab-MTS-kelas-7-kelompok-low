import React, { useMemo, useState } from 'react';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { MatchingPair } from '../types/learning';
import { playFeedbackTone } from '../services/speechService';
import { EncouragingCloudMascot, HappyStarMascot } from './PastelDecorations';

interface MatchingExerciseProps {
  title: string;
  subtitle: string;
  pairs: MatchingPair[];
  onComplete?: (score: number, total: number) => void;
}

export const MatchingExercise: React.FC<MatchingExerciseProps> = ({
  title,
  subtitle,
  pairs,
  onComplete,
}) => {
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [wrongNotice, setWrongNotice] = useState<string | null>(null);

  // Deterministic shuffled order for right column
  const shuffledRight = useMemo(() => {
    const arr = [...pairs];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = (i * 7 + 3) % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }, [pairs]);

  const handleRightPick = (rightPairId: string) => {
    if (!selectedLeftId || matchedIds.includes(rightPairId)) return;

    if (selectedLeftId === rightPairId) {
      playFeedbackTone(true);
      const nextMatched = [...matchedIds, rightPairId];
      setMatchedIds(nextMatched);
      setSelectedLeftId(null);
      setWrongNotice(null);
      if (nextMatched.length === pairs.length) {
        onComplete?.(pairs.length, pairs.length);
      }
    } else {
      playFeedbackTone(false);
      setWrongNotice('حَاوِلْ مَرَّةً أُخْرَى! Pasangan belum cocok, coba pilih kartu yang tepat.');
    }
  };

  const handleReset = () => {
    setSelectedLeftId(null);
    setMatchedIds([]);
    setWrongNotice(null);
  };

  const allMatched = matchedIds.length === pairs.length;

  return (
    <div className="rounded-3xl border border-[#FDE68A] bg-white p-5 sm:p-6 space-y-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h3 className="font-display text-lg sm:text-xl font-bold text-[#261C42]">
            {title}
          </h3>
          <p className="text-sm text-[#4D426D]">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] px-3 py-1.5 rounded-xl tabular-nums">
            Cocok: {matchedIds.length}/{pairs.length}
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="min-h-[38px] px-3 py-1.5 rounded-xl bg-white hover:bg-[#FFFBEB] border border-[#FDE68A] text-xs font-semibold text-[#92400E] flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Ulangi</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Arabic Column */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-[#5E5280]">1. Pilih Kata Bahasa Arab</p>
          {pairs.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            const isSelected = selectedLeftId === pair.id;
            return (
              <button
                key={pair.id}
                type="button"
                disabled={isMatched}
                onClick={() => {
                  setSelectedLeftId(pair.id);
                  setWrongNotice(null);
                }}
                className={`w-full min-h-[58px] px-4 py-2.5 rounded-2xl border flex items-center justify-between transition-all ${
                  isMatched
                    ? 'bg-[#EFF6FF] border-[#7DD3FC] text-[#0369A1]'
                    : isSelected
                    ? 'bg-[#F4F0FF] border-[#7C3AED] ring-2 ring-[#C4B5FD]'
                    : 'bg-[#FFFDF9] border-[#E5DCFE] hover:bg-[#F6F2FF]'
                }`}
              >
                <span dir="rtl" className="font-arabic text-2xl font-bold text-[#261C42]">
                  {pair.leftArabic}
                </span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-[#0284C7] shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Meaning / Image Column */}
        <div className="space-y-2.5">
          <p className="text-xs font-bold text-[#5E5280]">2. Klik Pasangan yang Sesuai</p>
          {shuffledRight.map((pair) => {
            const isMatched = matchedIds.includes(pair.id);
            return (
              <button
                key={pair.id}
                type="button"
                disabled={isMatched || !selectedLeftId}
                onClick={() => handleRightPick(pair.id)}
                className={`w-full min-h-[58px] px-4 py-2.5 rounded-2xl border flex items-center justify-between text-left transition-all ${
                  isMatched
                    ? 'bg-[#EFF6FF] border-[#7DD3FC] text-[#0369A1]'
                    : selectedLeftId
                    ? 'bg-white border-[#FDE68A] hover:bg-[#FFFBEB] hover:border-[#F59E0B]'
                    : 'bg-[#FAF8FF] border-[#E5DCFE] text-[#6B5E8E]'
                }`}
              >
                <span className="flex items-center gap-3">
                  {pair.rightEmoji && (
                    <span className="text-2xl leading-none" aria-hidden="true">
                      {pair.rightEmoji}
                    </span>
                  )}
                  <span className="font-display text-sm sm:text-base font-semibold text-[#261C42]">
                    {pair.rightText}
                  </span>
                </span>
                {isMatched && <CheckCircle2 className="w-5 h-5 text-[#0284C7] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {wrongNotice && (
        <div className="rounded-2xl bg-[#FFF3EB] border border-[#FED7AA] p-3.5 flex items-center gap-3">
          <EncouragingCloudMascot className="w-10 h-10 shrink-0" />
          <p className="text-xs sm:text-sm font-medium text-[#9A3412]">{wrongNotice}</p>
        </div>
      )}

      {allMatched && (
        <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4 flex items-center gap-4">
          <HappyStarMascot className="w-12 h-12 shrink-0 animate-gentle-bounce" />
          <div>
            <p className="font-display font-bold text-sm sm:text-base text-[#92400E]">
              أَحْسَنْتَ! Semua {pairs.length} pasangan berhasil dicocokkan!
            </p>
            <p className="text-xs sm:text-sm text-[#78350F]">
              Lanjutkan ke latihan pilihan ganda di bawah untuk menambah skormu.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
