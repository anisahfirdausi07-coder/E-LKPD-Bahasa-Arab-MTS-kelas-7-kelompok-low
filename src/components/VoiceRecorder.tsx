import React, { useRef, useState } from 'react';
import { Check, Mic, MicOff, Volume2 } from 'lucide-react';
import {
  createArabicSpeechRecognition,
  normalizeArabicForComparison,
  SpeechRecognitionInstance,
} from '../services/speechService';

interface VoiceRecorderProps {
  targetArabic?: string;
  placeholder?: string;
  buttonLabel?: string;
  onSaveTranscript: (transcript: string, feedbackNote: string) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  targetArabic,
  placeholder = 'Hasil ucapan atau ketikan bahasa Arab akan muncul di sini...',
  buttonLabel = 'Simpan Ucapan Latihan',
  onSaveTranscript,
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micNote, setMicNote] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const toggleRecording = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = createArabicSpeechRecognition();
    if (!recognition) {
      setMicNote(
        'Browser ini belum mendukung pengenalan suara otomatis. Silakan ketik ucapan Arabmu langsung pada kotak di bawah sebagai alternatif.'
      );
      return;
    }

    setMicNote(null);
    setFeedback(null);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let combined = '';
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript + ' ';
      }
      setTranscript(combined.trim());
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      if (event.error === 'not-allowed') {
        setMicNote(
          'Izin mikrofon ditolak oleh browser. Kamu tetap dapat mengetik ucapan Arabmu di kotak bawah.'
        );
      } else {
        setMicNote(
          'Suara belum terdengar jelas. Kamu bisa merekam ulang atau mengedit teks secara manual.'
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
      setMicNote('Tidak dapat memulai mikrofon. Silakan ketik jawaban Arab secara manual.');
    }
  };

  const handleEvaluate = () => {
    const clean = transcript.trim();
    if (!clean) return;

    let note = 'Ucapan latihan tersimpan! Terus berlatih melafalkan dengan jelas.';
    if (targetArabic) {
      const normalizedUser = normalizeArabicForComparison(clean);
      const normalizedTarget = normalizeArabicForComparison(targetArabic);
      if (
        normalizedUser &&
        (normalizedUser.includes(normalizedTarget) ||
          normalizedTarget.includes(normalizedUser) ||
          normalizedUser.split(' ').some((w) => w.length >= 2 && normalizedTarget.includes(w)))
      ) {
        note =
          'Bagus! Pelafalanmu sudah mendekati contoh kalimat. (Catatan: ini umpan balik latihan otomatis, bukan penilaian akhir).';
      } else {
        note =
          'Sudah tersimpan sebagai latihan! Dengarkan lagi audio contoh dan bandingkan harakat serta panjang bacaannya.';
      }
    }

    setFeedback(note);
    onSaveTranscript(clean, note);
  };

  return (
    <div className="rounded-2xl border border-[#DDD6FE] bg-[#FAF8FF] p-4 space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={toggleRecording}
          className={`min-h-[46px] px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all ${
            isListening
              ? 'bg-[#E11D48] hover:bg-[#BE123C] text-white shadow-sm'
              : 'bg-[#6D28D9] hover:bg-[#5B21B6] text-white'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Berhenti Merekam</span>
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>Rekam Suara (Mikrofon)</span>
            </>
          )}
        </button>

        {isListening && (
          <span className="inline-flex items-center gap-2 text-xs font-semibold text-[#BE123C]">
            <Volume2 className="w-4 h-4 animate-bounce" aria-hidden="true" />
            <span>Sedang mendengarkan ucapan Arabmu...</span>
          </span>
        )}
      </div>

      {micNote && (
        <p className="text-xs text-[#9A3412] bg-[#FFF3EB] border border-[#FED7AA] rounded-xl px-3 py-2">
          {micNote}
        </p>
      )}

      <div className="space-y-2">
        <label className="block text-xs font-semibold text-[#5E5280]">
          Transkrip Ucapan (boleh diedit sebelum disimpan):
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            dir="rtl"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder={placeholder}
            className="flex-1 min-h-[46px] px-4 py-2 rounded-2xl bg-white border border-[#DDD6FE] font-arabic text-xl text-[#261C42] placeholder:text-[#9CA3AF] placeholder:text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
          />
          <button
            type="button"
            disabled={!transcript.trim()}
            onClick={handleEvaluate}
            className="min-h-[46px] px-4 py-2 rounded-2xl bg-[#0284C7] hover:bg-[#0369A1] disabled:opacity-50 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 shrink-0 transition-colors"
          >
            <Check className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{buttonLabel}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <p className="text-xs sm:text-sm text-[#0369A1] bg-[#EEF7FF] border border-[#BAE6FD] rounded-xl px-3.5 py-2.5">
          {feedback}
        </p>
      )}
    </div>
  );
};
