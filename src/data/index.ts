import { LearningLevel, SkillId, ThemeContent } from '../types/learning';
import { dars1Low } from './dars1';
import { dars2Low } from './dars2';
import { dars3Low } from './dars3';

export const SKILLS_META: {
  id: SkillId;
  arabic: string;
  indonesian: string;
  shortDesc: string;
  bgTint: string;
  borderTint: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: 'istima',
    arabic: 'الِاسْتِمَاعُ',
    indonesian: 'Menyimak',
    shortDesc: 'Dengar kosakata, kalimat & kuis audio bergambar',
    bgTint: 'bg-[#EEF7FF]',
    borderTint: 'border-[#BAE6FD]',
    iconBg: 'bg-[#D6EEFF]',
    iconColor: 'text-[#0369A1]',
  },
  {
    id: 'kalam',
    arabic: 'الْكَلَامُ',
    indonesian: 'Berbicara',
    shortDesc: 'Ulangi kalimat, bicara dengan Teman AI & latihan terbimbing',
    bgTint: 'bg-[#F4F0FF]',
    borderTint: 'border-[#DDD6FE]',
    iconBg: 'bg-[#E5DCFF]',
    iconColor: 'text-[#6D28D9]',
  },
  {
    id: 'qiraah',
    arabic: 'الْقِرَاءَةُ',
    indonesian: 'Membaca',
    shortDesc: 'Baca teks berharakat, jodohkan kata & jawab kuis',
    bgTint: 'bg-[#FFFBE6]',
    borderTint: 'border-[#FDE68A]',
    iconBg: 'bg-[#FEF08A]/70',
    iconColor: 'text-[#A16207]',
  },
  {
    id: 'kitabah',
    arabic: 'الْكِتَابَةُ',
    indonesian: 'Menulis',
    shortDesc: 'Salin tulisan Arab RTL, lengkapi kalimat & keyboard virtual',
    bgTint: 'bg-[#FFF2EB]',
    borderTint: 'border-[#FED7AA]',
    iconBg: 'bg-[#FFDFCA]',
    iconColor: 'text-[#C2410C]',
  },
];

// Extensible curriculum registry keyed by differentiated learning level
export const CURRICULUM_BY_LEVEL: Record<LearningLevel, ThemeContent[]> = {
  low: [dars1Low, dars2Low, dars3Low],
  middle: [],
  high: [],
};

export function getThemesForLevel(level: LearningLevel = 'low'): ThemeContent[] {
  const list = CURRICULUM_BY_LEVEL[level];
  return list.length > 0 ? list : CURRICULUM_BY_LEVEL.low;
}

export const THEMES: ThemeContent[] = CURRICULUM_BY_LEVEL.low;
