import React, { useState } from 'react';
import { Delete, Keyboard, RotateCcw } from 'lucide-react';

interface ArabicTextInputProps {
  value: string;
  onChange: (nextValue: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

const ARABIC_ROWS: string[][] = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'د'],
  ['ش', 'س', 'ي', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ك', 'ط'],
  ['ئ', 'ء', 'ؤ', 'ر', 'لا', 'ى', 'ة', 'و', 'ز', 'ظ', 'ذ'],
  ['أ', 'إ', 'آ', 'َ', 'ِ', 'ُ', 'ْ', 'ّ', 'ً', 'ٌ', 'ٍ', '؟'],
];

export const ArabicTextInput: React.FC<ArabicTextInputProps> = ({
  value,
  onChange,
  placeholder = 'اُكْتُبْ هُنَا (Ketik tulisan Arab di sini)...',
  onClear,
}) => {
  const [showKeyboard, setShowKeyboard] = useState(false);

  const insertChar = (ch: string) => {
    onChange(value + ch);
  };

  const handleBackspace = () => {
    if (!value) return;
    onChange(value.slice(0, -1));
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          dir="rtl"
          lang="ar"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 min-h-[54px] px-4 py-2.5 rounded-2xl bg-white border-2 border-[#FDBA74] font-arabic text-2xl sm:text-3xl text-[#261C42] placeholder:text-[#9CA3AF] placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EA580C]"
        />
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowKeyboard((prev) => !prev)}
            className={`min-h-[54px] px-3.5 py-2 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              showKeyboard
                ? 'bg-[#6D28D9] border-[#6D28D9] text-white'
                : 'bg-[#F6F2FF] border-[#DDD6FE] text-[#5B21B6] hover:bg-[#EDE9FE]'
            }`}
          >
            <Keyboard className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Keyboard Arab</span>
          </button>

          <button
            type="button"
            onClick={() => {
              onChange('');
              onClear?.();
            }}
            title="Hapus tulisan"
            className="min-h-[54px] px-3.5 py-2 rounded-2xl bg-white hover:bg-[#FFF3EB] border border-[#FED7AA] text-[#9A3412] text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>Hapus</span>
          </button>
        </div>
      </div>

      {showKeyboard && (
        <div
          dir="rtl"
          className="rounded-2xl border border-[#DDD6FE] bg-[#FAF8FF] p-3 sm:p-4 space-y-2 shadow-xs"
          aria-label="Keyboard Virtual Huruf Arab"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold text-[#5E5280]" dir="ltr">
            <span>Keyboard Virtual Arab &amp; Harakat</span>
            <span>Klik huruf untuk mengetik</span>
          </div>
          {ARABIC_ROWS.map((row, rowIdx) => (
            <div key={rowIdx} className="flex flex-wrap justify-center gap-1.5">
              {row.map((keyChar) => (
                <button
                  key={keyChar}
                  type="button"
                  onClick={() => insertChar(keyChar)}
                  className="min-w-[36px] sm:min-w-[42px] h-10 sm:h-11 px-2 rounded-xl bg-white hover:bg-[#EDE9FE] border border-[#DDD6FE] font-arabic text-xl font-bold text-[#261C42] flex items-center justify-center transition-colors shadow-2xs"
                >
                  {keyChar}
                </button>
              ))}
            </div>
          ))}
          <div className="flex items-center justify-center gap-2 pt-1" dir="ltr">
            <button
              type="button"
              onClick={() => insertChar(' ')}
              className="min-h-[40px] px-8 rounded-xl bg-white hover:bg-[#EDE9FE] border border-[#DDD6FE] text-xs font-semibold text-[#261C42]"
            >
              Spasi
            </button>
            <button
              type="button"
              onClick={() => insertChar('.')}
              className="min-h-[40px] px-4 rounded-xl bg-white hover:bg-[#EDE9FE] border border-[#DDD6FE] text-sm font-bold text-[#261C42]"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleBackspace}
              className="min-h-[40px] px-4 rounded-xl bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] text-xs font-semibold text-[#9F1239] flex items-center gap-1.5"
            >
              <Delete className="w-4 h-4" aria-hidden="true" />
              <span>Hapus 1 Huruf</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
