import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, UserCheck } from 'lucide-react';
import { StudentProfile } from '../types/learning';
import { CartoonOpenBook, PastelStar } from '../components/PastelDecorations';

interface StudentPageProps {
  currentStudent: StudentProfile | null;
  onSaveStudent: (profile: StudentProfile) => void;
  onBack: () => void;
}

export const StudentPage: React.FC<StudentPageProps> = ({
  currentStudent,
  onSaveStudent,
  onBack,
}) => {
  const [fullName, setFullName] = useState(currentStudent?.fullName || '');
  const [className, setClassName] = useState(currentStudent?.className || 'VII-A');
  const [attendanceNumber, setAttendanceNumber] = useState(
    currentStudent?.attendanceNumber || ''
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !className.trim() || !attendanceNumber.trim()) {
      setErrorMsg('Lengkapi nama lengkap, kelas, dan nomor absen terlebih dahulu ya.');
      return;
    }
    setErrorMsg(null);
    onSaveStudent({
      fullName: fullName.trim(),
      className: className.trim(),
      attendanceNumber: attendanceNumber.trim(),
    });
  };

  return (
    <main className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 pt-6 pb-16 space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="min-h-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-[#F6F2FF] border border-[#DDD6FE] text-[#4C1D95] text-sm font-semibold flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Kembali ke Beranda</span>
      </button>

      <section className="relative rounded-3xl border border-[#DDD6FE] bg-gradient-to-br from-[#F6F2FF] via-[#FFFDF9] to-[#EEF8FF] p-6 sm:p-8 shadow-sm space-y-6 overflow-hidden">
        <div className="pointer-events-none absolute top-4 right-5 opacity-75 animate-twinkle-soft hidden sm:block">
          <PastelStar className="w-7 h-7" />
        </div>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center shrink-0">
            <CartoonOpenBook className="w-10 h-8" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#6D28D9]">
              Identitas Peserta Didik ·{' '}
              <span dir="rtl" className="font-arabic font-bold text-sm">
                مُسْتَوَى مُنْخَفِض
              </span>
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#261C42]">
              Isi Data Diri Sebelum Belajar
            </h1>
          </div>
        </div>

        <p className="text-sm sm:text-base text-[#4D426D] leading-relaxed">
          Data dirimu digunakan untuk mencatat skor latihan, riwayat percakapan, dan progres
          belajar pada perangkat ini secara otomatis.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="student-name" className="block text-sm font-semibold text-[#261C42]">
              Nama Lengkap
            </label>
            <input
              id="student-name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Contoh: Ahmad Fauzan"
              className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-white border border-[#DDD6FE] text-base text-[#261C42] placeholder:text-[#9CA3AF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="student-class" className="block text-sm font-semibold text-[#261C42]">
                Kelas
              </label>
              <input
                id="student-class"
                type="text"
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                placeholder="Contoh: VII-A"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-white border border-[#DDD6FE] text-base text-[#261C42] placeholder:text-[#9CA3AF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="student-absen" className="block text-sm font-semibold text-[#261C42]">
                Nomor Absen
              </label>
              <input
                id="student-absen"
                type="text"
                inputMode="numeric"
                value={attendanceNumber}
                onChange={(e) => setAttendanceNumber(e.target.value)}
                placeholder="Contoh: 07"
                className="w-full min-h-[48px] px-4 py-2.5 rounded-2xl bg-white border border-[#DDD6FE] text-base text-[#261C42] placeholder:text-[#9CA3AF] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              />
            </div>
          </div>

          {errorMsg && (
            <p
              role="alert"
              className="rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] px-4 py-3 text-sm text-[#9F1239]"
            >
              {errorMsg}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-display font-semibold text-base flex items-center gap-2 shadow-sm transition-colors"
            >
              <UserCheck className="w-5 h-5 shrink-0" aria-hidden="true" />
              <span>Masuk</span>
            </button>

            {currentStudent && (
              <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-[#0369A1]">
                <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                Tersimpan sebagai {currentStudent.fullName}
              </span>
            )}
          </div>
        </form>
      </section>
    </main>
  );
};
