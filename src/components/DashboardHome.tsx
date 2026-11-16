import React, { useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Headphones,
  HelpCircle,
  MessageCircle,
  Pencil,
  Play,
  UserCheck,
} from 'lucide-react';
import { SKILLS_META, THEMES } from '../data';
import { getThemeStatus } from '../services/progressService';
import { SkillId, SkillScoreRecord, StudentProfile, ThemeId } from '../types/learning';
import {
  CartoonOpenBook,
  CartoonPencilEraser,
  PastelCloud,
  PastelStar,
} from './PastelDecorations';

interface DashboardHomeProps {
  student: StudentProfile | null;
  completedModules: string[];
  skillScores: Record<string, SkillScoreRecord>;
  onStartJourney: () => void;
  onOpenLesson: (themeId: ThemeId, skillId?: SkillId) => void;
  onOpenGuide: () => void;
  onOpenStudentPage: () => void;
}

const SKILL_ICONS: Record<SkillId, React.ComponentType<{ className?: string }>> = {
  istima: Headphones,
  kalam: MessageCircle,
  qiraah: BookOpen,
  kitabah: Pencil,
};

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  student,
  completedModules,
  skillScores,
  onStartJourney,
  onOpenLesson,
  onOpenGuide,
  onOpenStudentPage,
}) => {
  const [heroImgError, setHeroImgError] = useState(false);
  const [themeImgErrors, setThemeImgErrors] = useState<Record<string, boolean>>({});
  const [quickSkillTheme, setQuickSkillTheme] = useState<ThemeId>('taaruf');

  return (
    <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-12 sm:space-y-16">
      {/* HERO SECTION */}
      <section
        aria-labelledby="hero-greeting"
        className="relative rounded-3xl bg-gradient-to-br from-[#F6F2FF] via-[#FFFDF9] to-[#EEF8FF] border border-[#E5DCFE] p-5 sm:p-8 lg:p-10 shadow-sm overflow-hidden"
      >
        <div className="pointer-events-none absolute top-4 right-8 opacity-75 animate-twinkle-soft hidden md:block">
          <PastelStar className="w-7 h-7" />
        </div>
        <div className="pointer-events-none absolute bottom-5 left-6 opacity-70 animate-drift-cloud hidden lg:block">
          <PastelCloud className="w-20 h-12" fill="#E0F2FE" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Hero Column */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-5">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-[#5E5280]">
              <span>Kelas VII MTs</span>
              <span aria-hidden="true">·</span>
              <span dir="rtl" className="font-arabic font-bold text-[#5B21B6] text-sm sm:text-base">
                مُسْتَوَى مُنْخَفِض
              </span>
              <span aria-hidden="true">·</span>
              <span>E-LKPD Bahasa Arab</span>
            </div>

            <div className="space-y-2.5">
              <p
                id="hero-greeting"
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5B21B6] leading-relaxed"
              >
                السَّلَامُ عَلَيْكُمْ، أَهْلًا وَسَهْلًا بِكُمْ!
              </p>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#261C42] leading-tight text-balance">
                Jelajahi Bahasa Arab, Belajar dengan Seru!
              </h1>
              <p className="text-base sm:text-lg text-[#4D426D] leading-relaxed max-w-xl">
                {student
                  ? `Selamat datang kembali, ${student.fullName} (Kelas ${student.className})! Yuk, lanjutkan petualangan belajar bahasa Arab hari ini.`
                  : 'Yuk, mulai petualangan belajar bahasa Arab! Pahami kosakata, berlatih percakapan AI, membaca teks berharakat, dan menulis huruf Arab.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onStartJourney}
                className="min-h-[48px] px-6 py-3 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] active:scale-[0.98] text-white font-display font-semibold text-base flex items-center gap-2.5 shadow-sm transition-all whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#7C3AED]"
              >
                <Play className="w-4 h-4 fill-current shrink-0" aria-hidden="true" />
                <span>Mulai Belajar</span>
              </button>

              <button
                type="button"
                onClick={onOpenGuide}
                className="min-h-[48px] px-5 py-3 rounded-2xl bg-white hover:bg-[#F5F0FF] text-[#4C1D95] border border-[#DDD6FE] font-display font-semibold text-sm sm:text-base flex items-center gap-2 transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
              >
                <HelpCircle className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>Petunjuk Penggunaan</span>
              </button>

              <button
                type="button"
                onClick={onOpenStudentPage}
                className="min-h-[48px] px-4 py-3 rounded-2xl bg-[#EEF7FF] hover:bg-[#E0F2FE] text-[#0369A1] border border-[#BAE6FD] font-display font-semibold text-sm flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <UserCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span>{student ? 'Ubah Identitas' : 'Isi Identitas Siswa'}</span>
              </button>
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div className="animate-float-slow">
                <CartoonOpenBook className="w-12 h-10" />
              </div>
              <div className="animate-gentle-bounce">
                <CartoonPencilEraser className="w-14 h-10" />
              </div>
              <p className="text-xs sm:text-sm text-[#5E5280] leading-snug">
                3 Dars interaktif · Audio pelafalan Arab · Mikrofon &amp; Teman Bicara AI · Keyboard Arab Virtual
              </p>
            </div>
          </div>

          {/* Right Hero Illustration Column */}
          <div className="lg:col-span-6 flex items-stretch">
            <div className="w-full rounded-2xl overflow-hidden border-2 border-[#E2D9FA] bg-[#FAF7FF] shadow-sm relative flex items-center justify-center min-h-[240px] sm:min-h-[300px]">
              {!heroImgError ? (
                <img
                  src="/src/assets/images/hero_arabic_journey_1794819772527.jpg"
                  alt="Ilustrasi siswa dan siswi MTs belajar bahasa Arab bersama dengan ceria"
                  referrerPolicy="no-referrer"
                  onError={() => setHeroImgError(true)}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="p-8 text-center space-y-3">
                  <CartoonOpenBook className="w-20 h-16 mx-auto" />
                  <p dir="rtl" className="font-arabic text-2xl font-bold text-[#5B21B6]">
                    هَيَّا نَتَعَلَّمُ
                  </p>
                  <p className="text-sm text-[#5E5280]">Petualangan Belajar Bahasa Arab Kelas VII MTs</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MENU PEMBELAJARAN (3 DARS) */}
      <section id="menu-pembelajaran" aria-labelledby="themes-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-[#6D28D9]">
              Menu Pembelajaran · 3 Dars Utama
            </p>
            <h2
              id="themes-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-[#261C42]"
            >
              Pilih Dars Petualanganmu
            </h2>
          </div>
          <p className="text-sm text-[#5E5280]">
            Materi kelompok{' '}
            <span dir="rtl" className="font-arabic font-bold text-[#5B21B6]">
              مُسْتَوَى مُنْخَفِض
            </span>{' '}
            dengan 4 keterampilan lengkap.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEMES.map((theme) => {
            const status = getThemeStatus(completedModules, skillScores, theme.id);
            const imgFailed = themeImgErrors[theme.id];

            return (
              <article
                key={theme.id}
                className={`rounded-3xl border ${theme.palette.cardBorder} ${theme.palette.cardBg} p-5 flex flex-col justify-between gap-5 shadow-xs hover:shadow-md transition-shadow`}
              >
                <div className="space-y-4">
                  <div className="aspect-[4/3] w-full rounded-2xl overflow-hidden border border-white/80 bg-white/70 flex items-center justify-center">
                    {!imgFailed ? (
                      <img
                        src={theme.imagePath}
                        alt={`Ilustrasi ${theme.darsLabel} ${theme.indonesianTitle}`}
                        referrerPolicy="no-referrer"
                        onError={() =>
                          setThemeImgErrors((prev) => ({ ...prev, [theme.id]: true }))
                        }
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="p-6 text-center space-y-2">
                        <CartoonOpenBook className="w-16 h-12 mx-auto" />
                        <p dir="rtl" className="font-arabic text-xl font-bold text-[#261C42]">
                          {theme.arabicTitle}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs font-semibold text-[#5E5280]">
                      <span>
                        {theme.darsLabel} · {status.statusLabel}
                      </span>
                      <span className="tabular-nums font-bold text-[#261C42]">
                        {status.percentage}%
                      </span>
                    </div>

                    <h3 className="space-y-0.5">
                      <span
                        dir="rtl"
                        className="block font-arabic text-2xl sm:text-3xl font-bold text-[#261C42]"
                      >
                        {theme.arabicTitle}
                      </span>
                      <span className={`block font-display text-lg font-bold ${theme.palette.accentText}`}>
                        {theme.indonesianTitle} ({theme.transliteration})
                      </span>
                    </h3>

                    <p className="text-sm text-[#4D426D] leading-relaxed">
                      {theme.shortDesc}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div className="w-full h-2.5 rounded-full bg-white/90 overflow-hidden">
                    <div
                      className={`h-full ${theme.palette.accentBg} rounded-full transition-all duration-300`}
                      style={{ width: `${status.percentage}%` }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenLesson(theme.id, 'istima')}
                    className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl ${theme.palette.accentBg} ${theme.palette.accentHover} text-white font-display font-semibold text-sm sm:text-base flex items-center justify-center gap-2 transition-colors focus:outline-none focus-visible:ring-2 ${theme.palette.ringColor}`}
                  >
                    <span>
                      {status.completedCount > 0 ? 'Lanjutkan Dars' : 'Mulai Dars'}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* MENU EMPAT KETERAMPILAN (4 MAHARAH) */}
      <section aria-labelledby="skills-heading" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs sm:text-sm font-semibold text-[#0369A1]">
              Empat Keterampilan Bahasa Arab
            </p>
            <h2
              id="skills-heading"
              className="font-display text-2xl sm:text-3xl font-bold text-[#261C42]"
            >
              Pilih Keterampilan yang Ingin Dilatih
            </h2>
          </div>

          <div
            className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl bg-[#F4F0FF] border border-[#E2D9FA]"
            role="group"
            aria-label="Pilih Dars untuk membuka keterampilan"
          >
            {THEMES.map((t) => {
              const active = quickSkillTheme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setQuickSkillTheme(t.id)}
                  className={`min-h-[38px] px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
                    active
                      ? 'bg-white text-[#5B21B6] shadow-xs'
                      : 'text-[#5E5280] hover:text-[#261C42]'
                  }`}
                >
                  {t.darsLabel}: {t.indonesianTitle}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {SKILLS_META.map((skill) => {
            const Icon = SKILL_ICONS[skill.id];
            const isCompleted = completedModules.includes(`${quickSkillTheme}:${skill.id}`);

            return (
              <button
                key={skill.id}
                type="button"
                onClick={() => onOpenLesson(quickSkillTheme, skill.id)}
                className={`text-left rounded-3xl border ${skill.borderTint} ${skill.bgTint} p-4 sm:p-5 flex flex-col justify-between gap-4 hover:shadow-md active:scale-[0.99] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]`}
              >
                <div className="flex items-start justify-between gap-2 w-full">
                  <div
                    className={`w-12 h-12 rounded-2xl ${skill.iconBg} flex items-center justify-center shrink-0`}
                  >
                    <Icon className={`w-6 h-6 ${skill.iconColor}`} aria-hidden="true" />
                  </div>
                  {isCompleted && (
                    <CheckCircle2
                      className="w-5 h-5 text-[#0284C7] shrink-0"
                      aria-label="Sudah selesai"
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <p
                    dir="rtl"
                    className="font-arabic text-2xl sm:text-3xl font-bold text-[#261C42] leading-snug"
                  >
                    {skill.arabic}
                  </p>
                  <p className="font-display text-base sm:text-lg font-bold text-[#261C42]">
                    {skill.indonesian}
                  </p>
                  <p className="text-xs sm:text-sm text-[#4D426D] leading-snug">
                    {skill.shortDesc}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#5B21B6]">
                  <span>Mulai Latihan</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                </div>
              </button>
            );
          })}
        </div>
      </section>
    </main>
  );
};
