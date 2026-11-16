# هَيَّا نَتَعَلَّمُ (E-LKPD Bahasa Arab Kelas VII MTs)

Aplikasi web E-LKPD Bahasa Arab interaktif berbasis *Differentiated Learning* untuk siswa Kelas VII MTs kelompok **مُسْتَوَى مُنْخَفِض** dengan konsep visual **Pastel Fantasy Learning**.

## Fitur Utama

1. **Identitas Siswa & Penyimpanan Progres Otomatis (`localStorage`)**:
   - Menyimpan Nama Lengkap, Kelas, Nomor Absen, nilai per maharah, riwayat percakapan kalam, dan persentase penyelesaian per dars.
2. **Tiga Dars Utama**:
   - **Dars 1: التَّعَارُفُ** (*Perkenalan*)
   - **Dars 2: الأَدَوَاتُ الْمَدْرَسِيَّةُ** (*Peralatan Sekolah*)
   - **Dars 3: يَوْمِيَّاتُنَا** (*Kegiatan Sehari-hari*)
3. **Empat Keterampilan Berbahasa (4 Maharah)**:
   - **الِاسْتِمَاعُ (Istima')**: Kartu mufradat bergambar, kalimat sederhana, pemutar audio (Play, Pause, Replay, dan kontrol kecepatan `0.75x / 0.85x / 1.0x`), serta 5 soal latihan menyimak.
   - **الْكَلَامُ (Kalam)**: Latihan dengarkan & ulangi dengan pengenalan suara Arab (`SpeechRecognition ar-SA` + input teks alternatif), **Teman Bicara AI** berbasis Gemini API sesuai konteks tiap dars, dan latihan kalam terbimbing.
   - **الْقِرَاءَةُ (Qira'ah)**: Teks pendek berharakat besar dengan sorotan kosakata kunci, audio bacaan, toggle **Lihat Arti**, latihan menjodohkan, dan 5 soal pemahaman teks.
   - **الْكِتَابَةُ (Kitabah)**: Menyalin tulisan Arab (RTL), melengkapi kalimat dengan bantuan gambar, menulis kalimat berdasarkan gambar, serta **Keyboard Arab Virtual** lengkap dengan harakat.
4. **Arsitektur Siap Ekspansi (`low | middle | high`)**:
   - Struktur data di `src/data/` dan `src/types/learning.ts` telah dipisahkan berdasarkan level kemampuan untuk memudahkan penambahan materi kelompok `middle` dan `high` di tahap berikutnya.

## Menjalankan Secara Lokal

1. Pasang dependensi:
   ```bash
   npm install
   ```
2. Salin `.env.example` menjadi `.env` dan isi `GEMINI_API_KEY`:
   ```env
   GEMINI_API_KEY="your_gemini_api_key"
   ```
3. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```
   Aplikasi berjalan di `http://localhost:3000`.

## Deployment ke Netlify

1. Hubungkan repositori ke Netlify.
2. Pengaturan build sudah terkonfigurasi otomatis melalui `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Functions directory**: `netlify/functions`
3. Tambahkan Environment Variable di Netlify Dashboard (**Site configuration > Environment variables**):
   - `GEMINI_API_KEY`: API key Gemini Anda.
4. Endpoint `/api/arabic-chat` otomatis diarahkan ke `/.netlify/functions/chat` sehingga API key tetap aman di sisi server.
