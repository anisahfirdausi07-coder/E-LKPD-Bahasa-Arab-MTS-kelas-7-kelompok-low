import React, { useState } from 'react';
import { BookOpen, Maximize2, Minimize2, Star, User } from 'lucide-react';
import { StudentProfile } from '../types/learning';

export type ActivePage = 'dashboard' | 'student' | 'lesson' | 'progress' | 'guide';

interface HeaderProps {
  activePage: ActivePage;
  student: StudentProfile | null;
  totalPoints: number;
  completedCount: number;
  totalModules: number;
  onNavigate: (page: ActivePage) => void;
  onOpenMaterials: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  student,
  totalPoints,
  completedCount,
  totalModules,
  onNavigate,
  onOpenMaterials,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const progressPercent = Math.round((completedCount / totalModules) * 100);

  const toggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/92 backdrop-blur-md border-b border-[#E9E1FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Logo + Title */}
        <button
          type="button"
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2.5 sm:gap-3 text-left min-w-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED] rounded-xl pr-2"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <div className="relative flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#6D28D9]" aria-hidden="true" />
              <span
                className="font-arabic text-[11px] font-bold text-[#EA580C] absolute -top-2 -right-2 bg-[#FEF9C3] border border-[#FDE68A] w-4 h-4 rounded-full flex items-center justify-center leading-none"
                aria-hidden="true"
              >
                ض
              </span>
            </div>
          </div>
          <div className="min-w-0">
            <p
              dir="rtl"
              className="font-arabic text-base sm:text-lg font-bold text-[#261C42] leading-snug truncate"
            >
              هَيَّا نَتَعَلَّمُ
            </p>
            <p className="font-display text-[11px] sm:text-xs font-medium text-[#5E5280] truncate">
              Hayyā Nata‘allam · E-LKPD Bahasa Arab
            </p>
          </div>
        </button>

        {/* Zone 2: Primary Text Navigation */}
        <nav
          aria-label="Navigasi utama"
          className="hidden lg:flex items-center gap-5 text-sm font-semibold text-[#5E5280]"
        >
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={`whitespace-nowrap shrink-0 hover:text-[#5B21B6] transition-colors ${
              activePage === 'dashboard' ? 'text-[#5B21B6] underline underline-offset-4' : ''
            }`}
          >
            Beranda
          </button>
          <button
            type="button"
            onClick={onOpenMaterials}
            className={`whitespace-nowrap shrink-0 hover:text-[#5B21B6] transition-colors ${
              activePage === 'lesson' ? 'text-[#5B21B6] underline underline-offset-4' : ''
            }`}
          >
            Materi
          </button>
          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className={`whitespace-nowrap shrink-0 hover:text-[#5B21B6] transition-colors ${
              activePage === 'progress' ? 'text-[#5B21B6] underline underline-offset-4' : ''
            }`}
          >
            Progres Belajar
          </button>
          <button
            type="button"
            onClick={() => onNavigate('guide')}
            className={`whitespace-nowrap shrink-0 hover:text-[#5B21B6] transition-colors ${
              activePage === 'guide' ? 'text-[#5B21B6] underline underline-offset-4' : ''
            }`}
          >
            Petunjuk
          </button>
        </nav>

        {/* Zone 3: Group Label + Progress & Points + Profile / Fullscreen */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div
            className="hidden xl:flex items-center px-3 py-1.5 rounded-xl bg-[#F4F0FF] border border-[#DDD6FE]"
            title="Kelompok Belajar"
          >
            <span dir="rtl" className="font-arabic text-sm font-bold text-[#5B21B6] leading-none">
              مُسْتَوَى مُنْخَفِض
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#EEF7FF] hover:bg-[#E0F2FE] border border-[#BAE6FD] transition-colors"
            title="Lihat Progres Belajar"
          >
            <div className="w-12 h-2 rounded-full bg-white overflow-hidden border border-[#BAE6FD]/60">
              <div
                className="h-full bg-[#0284C7] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-[#0369A1] tabular-nums whitespace-nowrap">
              {completedCount}/{totalModules}
            </span>
          </button>

          <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FFFBEB] border border-[#FDE68A]">
            <Star className="w-4 h-4 text-[#D97706] fill-[#FDE047] shrink-0" aria-hidden="true" />
            <span className="text-xs sm:text-sm font-bold text-[#92400E] tabular-nums whitespace-nowrap">
              {totalPoints}
            </span>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('student')}
            title={student ? `${student.fullName} (${student.className})` : 'Isi Identitas Siswa'}
            className="min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-xl bg-[#F4F0FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-[#5B21B6] text-xs font-semibold flex items-center gap-1.5 transition-colors max-w-[130px]"
          >
            <User className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span className="truncate hidden sm:inline">
              {student ? student.fullName.split(' ')[0] : 'Identitas'}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
            aria-label={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh'}
            className="hidden md:flex min-h-[38px] min-w-[38px] rounded-xl bg-white hover:bg-[#F4F0FF] border border-[#E5DCFE] text-[#5E5280] items-center justify-center transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" aria-hidden="true" />
            ) : (
              <Maximize2 className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Compact mobile sub-strip for level + quick links */}
      <div className="lg:hidden border-t border-[#F2ECFD] px-4 py-1.5 flex items-center justify-between gap-2 bg-[#FAF7FF]/80 text-xs">
        <span dir="rtl" className="font-arabic font-bold text-[#5B21B6] shrink-0">
          مُسْتَوَى مُنْخَفِض
        </span>
        <div className="flex items-center gap-3 font-semibold text-[#5E5280]">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className={activePage === 'dashboard' ? 'text-[#5B21B6] underline' : ''}
          >
            Beranda
          </button>
          <button
            type="button"
            onClick={onOpenMaterials}
            className={activePage === 'lesson' ? 'text-[#5B21B6] underline' : ''}
          >
            Materi
          </button>
          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className={activePage === 'progress' ? 'text-[#5B21B6] underline' : ''}
          >
            Progres
          </button>
          <button
            type="button"
            onClick={() => onNavigate('guide')}
            className={activePage === 'guide' ? 'text-[#5B21B6] underline' : ''}
          >
            Petunjuk
          </button>
        </div>
      </div>
    </header>
  );
};
