import React from 'react';
import {
  ArrowLeft,
  BookOpen,
  Headphones,
  Keyboard,
  MessageCircle,
  Mic,
  Pencil,
  Volume2,
} from 'lucide-react';
import { CartoonOpenBook, CartoonPencilEraser } from '../components/PastelDecorations';

interface GuidePageProps {
  onBackHome: () => void;
  onStartLearning: () => void;
}

export const GuidePage: React.FC<GuidePageProps> = ({
  onBackHome,
  onStartLearning,
}) => {
  return (
    <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16 space-y-8">
      <button
        type="button"
        onClick={onBackHome}
        className="min-h-[44px] px-4 py-2 rounded-2xl bg-white hover:bg-[#F6F2FF] border border-[#DDD6FE] text-[#4C1D95] text-sm font-semibold flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span>Kembali ke Beranda</span>
      </button>

      <section className="rounded-3xl border border-[#DDD6FE] bg-gradient-to-br from-[#F6F2FF] via-[#FFFDF9] to-[#EEF8FF] p-6 sm:p-8 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#6D28D9]">
              Panduan Siswa Kelas VII MTs ·{' '}
              <span dir="rtl" className="font-arabic font-bold text-sm">
                مُسْتَوَى مُنْخَفِض
              </span>
            </p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#261C42]">
              Petunjuk Penggunaan E-LKPD Bahasa Arab
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <CartoonOpenBook className="w-14 h-11" />
            <CartoonPencilEraser className="w-14 h-11" />
          </div>
        </div>
        <p className="text-sm sm:text-base text-[#4D426D] leading-relaxed">
          Media ini dirancang khusus agar kamu bisa belajar bahasa Arab secara bertahap,
          nyaman, dan menyenangkan. Ikuti langkah-langkah mudah di bawah ini!
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-3xl border border-[#BAE6FD] bg-[#EEF7FF] p-5 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#D6EEFF] flex items-center justify-center">
            <Headphones className="w-6 h-6 text-[#0369A1]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#261C42]">
            1. الِاسْتِمَاعُ (Menyimak Audio)
          </h2>
          <p className="text-sm text-[#4D426D] leading-relaxed">
            Tekan tombol <strong>Putar Audio</strong> atau <strong>Ulangi</strong> pada kartu
            kosakata untuk mendengar pelafalan bahasa Arab. Pada kuis menyimak, putar audio soal
            terlebih dahulu sebelum memilih jawaban yang sesuai.
          </p>
        </div>

        <div className="rounded-3xl border border-[#DDD6FE] bg-[#F4F0FF] p-5 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E5DCFF] flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-[#6D28D9]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#261C42]">
            2. الْكَلَامُ (Berbicara &amp; Teman AI)
          </h2>
          <p className="text-sm text-[#4D426D] leading-relaxed">
            Dengarkan kalimat lalu tirukan dengan menekan tombol mikrofon (<Mic className="w-3.5 h-3.5 inline" />).
            Jika browser belum mendukung mikrofon atau hasil suara kurang tepat, kamu dapat mengedit
            atau mengetik kalimat Arabmu sebelum mengirim ke Teman Bicara AI.
          </p>
        </div>

        <div className="rounded-3xl border border-[#FDE68A] bg-[#FFFBE6] p-5 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FEF08A]/80 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-[#A16207]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#261C42]">
            3. الْقِرَاءَةُ (Membaca &amp; Menjodohkan)
          </h2>
          <p className="text-sm text-[#4D426D] leading-relaxed">
            Baca teks pendek berharakat dengan bantuan tombol suara (<Volume2 className="w-3.5 h-3.5 inline" />)
            dan tombol <strong>Lihat Arti</strong>. Lalu pasangkan kosakata dengan gambar atau
            artinya dan jawab 5 soal pemahaman bacaan.
          </p>
        </div>

        <div className="rounded-3xl border border-[#FED7AA] bg-[#FFF2EB] p-5 space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[#FFDFCA] flex items-center justify-center">
            <Pencil className="w-6 h-6 text-[#C2410C]" aria-hidden="true" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#261C42]">
            4. الْكِتَابَةُ (Menulis &amp; Keyboard Virtual)
          </h2>
          <p className="text-sm text-[#4D426D] leading-relaxed">
            Salin huruf dan kata Arab dari arah kanan ke kiri (RTL). Klik tombol{' '}
            <strong>Keyboard Arab</strong> (<Keyboard className="w-3.5 h-3.5 inline" />) kapan saja
            bila perangkatmu belum terpasang keyboard bahasa Arab.
          </p>
        </div>
      </section>

      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={onStartLearning}
          className="min-h-[48px] px-7 py-3 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white font-display font-semibold text-base shadow-sm transition-colors"
        >
          Mulai Belajar Sekarang
        </button>
      </div>
    </main>
  );
};
