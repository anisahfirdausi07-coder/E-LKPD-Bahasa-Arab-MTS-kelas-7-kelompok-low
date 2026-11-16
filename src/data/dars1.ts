import { ThemeContent } from '../types/learning';

export const dars1Low: ThemeContent = {
  id: 'taaruf',
  level: 'low',
  orderNumber: '01',
  darsLabel: 'Dars 1',
  arabicTitle: 'التَّعَارُفُ',
  transliteration: 'At-Ta‘āruf',
  indonesianTitle: 'Perkenalan',
  shortDesc:
    'Belajar kosakata perkenalan, menyapa teman baru, memperkenalkan diri, membaca teks pendek, dan menulis identitas.',
  objective:
    'Siswa mampu mengenali kosakata perkenalan, memahami ungkapan sederhana, memperkenalkan diri secara lisan, membaca teks pendek, dan menulis identitas sederhana.',
  imagePath: '/src/assets/images/theme_taaruf_intro_1794819773026.jpg',
  palette: {
    cardBg: 'bg-[#F6F2FF]',
    cardBorder: 'border-[#DDD6FE]',
    softSurface: 'bg-[#EDE9FE]',
    accentBg: 'bg-[#6D28D9]',
    accentHover: 'hover:bg-[#5B21B6]',
    accentText: 'text-[#5B21B6]',
    badgeBg: 'bg-[#E9DDFD]',
    ringColor: 'focus-visible:ring-[#7C3AED]',
  },
  istima: {
    intro:
      'Tekan tombol speaker pada setiap kartu untuk mendengarkan pelafalan kosakata dan kalimat sederhana. Kamu bisa memutar ulang atau mengatur kecepatan suara.',
    hint:
      'Petunjuk: Putar tombol "Putar Audio Soal" terlebih dahulu pada setiap nomor sebelum memilih jawaban. Perhatikan bunyi kata awal yang terdengar.',
    vocabulary: [
      { id: 'd1-v1', arabic: 'اِسْمٌ', transliteration: 'Ismun', indonesian: 'Nama', emoji: '🪪' },
      { id: 'd1-v2', arabic: 'أَنَا', transliteration: 'Anā', indonesian: 'Saya', emoji: '🙋' },
      { id: 'd1-v3', arabic: 'أَنْتَ', transliteration: 'Anta', indonesian: 'Kamu (laki-laki)', emoji: '👦' },
      { id: 'd1-v4', arabic: 'أَنْتِ', transliteration: 'Anti', indonesian: 'Kamu (perempuan)', emoji: '👧' },
      { id: 'd1-v5', arabic: 'طَالِبٌ', transliteration: 'Ṭālibun', indonesian: 'Siswa laki-laki', emoji: '🧑‍🎓' },
      { id: 'd1-v6', arabic: 'طَالِبَةٌ', transliteration: 'Ṭālibatun', indonesian: 'Siswi perempuan', emoji: '👩‍🎓' },
      { id: 'd1-v7', arabic: 'مُعَلِّمٌ', transliteration: 'Mu‘allimun', indonesian: 'Guru laki-laki', emoji: '👨‍🏫' },
      { id: 'd1-v8', arabic: 'مُعَلِّمَةٌ', transliteration: 'Mu‘allimatun', indonesian: 'Guru perempuan', emoji: '👩‍🏫' },
      { id: 'd1-v9', arabic: 'مَدْرَسَةٌ', transliteration: 'Madrasatun', indonesian: 'Sekolah', emoji: '🏫' },
      { id: 'd1-v10', arabic: 'فَصْلٌ', transliteration: 'Faṣlun', indonesian: 'Kelas', emoji: '🪑' },
      { id: 'd1-v11', arabic: 'مَدِينَةٌ', transliteration: 'Madīnatun', indonesian: 'Kota', emoji: '🏙️' },
      { id: 'd1-v12', arabic: 'بَيْتٌ', transliteration: 'Baitun', indonesian: 'Rumah', emoji: '🏠' },
    ],
    sentences: [
      { id: 'd1-s1', arabic: 'اِسْمِي أَحْمَدُ.', transliteration: 'Ismī Aḥmad.', indonesian: 'Namaku Ahmad.' },
      { id: 'd1-s2', arabic: 'أَنَا طَالِبٌ.', transliteration: 'Anā ṭālibun.', indonesian: 'Saya seorang siswa.' },
      { id: 'd1-s3', arabic: 'أَسْكُنُ فِي سُورَابَايَا.', transliteration: 'Askunu fī Sūrābāyā.', indonesian: 'Saya tinggal di Surabaya.' },
      { id: 'd1-s4', arabic: 'أَنَا فِي الْفَصْلِ السَّابِعِ.', transliteration: 'Anā fil-faṣlis-sābi‘.', indonesian: 'Saya di kelas tujuh.' },
      { id: 'd1-s5', arabic: 'هٰذَا صَدِيقِي.', transliteration: 'Hādzā ṣadīqī.', indonesian: 'Ini temanku.' },
    ],
    questions: [
      {
        id: 'd1-lq1',
        promptAudioText: 'اِسْمِي أَحْمَدُ',
        promptHint: 'مَا اسْمُهُ؟ (Siapa namanya sesuai audio yang kamu dengar?)',
        options: [
          { id: 'a', arabic: 'أَحْمَدُ', transliteration: 'Aḥmad', indonesian: 'Ahmad', emoji: '👦' },
          { id: 'b', arabic: 'مُحَمَّدٌ', transliteration: 'Muḥammad', indonesian: 'Muhammad', emoji: '🧑' },
          { id: 'c', arabic: 'عَلِيٌّ', transliteration: '‘Aliyy', indonesian: 'Ali', emoji: '🙋‍♂️' },
        ],
        correctOptionId: 'a',
        explanation: 'Audio menyebutkan: اِسْمِي أَحْمَدُ (Namaku Ahmad).',
      },
      {
        id: 'd1-lq2',
        promptAudioText: 'أَنَا طَالِبٌ',
        promptHint: 'Dengarkan kalimat berikut! Apakah profesi atau status pembicara?',
        options: [
          { id: 'a', arabic: 'مُعَلِّمٌ', transliteration: 'Mu‘allimun', indonesian: 'Guru laki-laki', emoji: '👨‍🏫' },
          { id: 'b', arabic: 'طَالِبٌ', transliteration: 'Ṭālibun', indonesian: 'Siswa laki-laki', emoji: '🧑‍🎓' },
          { id: 'c', arabic: 'طَالِبَةٌ', transliteration: 'Ṭālibatun', indonesian: 'Siswi', emoji: '👩‍🎓' },
        ],
        correctOptionId: 'b',
        explanation: 'Audio menyebutkan: أَنَا طَالِبٌ (Saya siswa laki-laki).',
      },
      {
        id: 'd1-lq3',
        promptAudioText: 'أَسْكُنُ فِي سُورَابَايَا',
        promptHint: 'Di kota mana pembicara tinggal sesuai audio?',
        options: [
          { id: 'a', arabic: 'جَاكَرْتَا', transliteration: 'Jākartā', indonesian: 'Jakarta', emoji: '🏙️' },
          { id: 'b', arabic: 'بَانْدُونْج', transliteration: 'Bāndūng', indonesian: 'Bandung', emoji: '🌄' },
          { id: 'c', arabic: 'سُورَابَايَا', transliteration: 'Sūrābāyā', indonesian: 'Surabaya', emoji: '🌆' },
        ],
        correctOptionId: 'c',
        explanation: 'Audio menyebutkan: أَسْكُنُ فِي سُورَابَايَا (Saya tinggal di Surabaya).',
      },
      {
        id: 'd1-lq4',
        promptAudioText: 'أَنَا فِي الْفَصْلِ السَّابِعِ',
        promptHint: 'Di kelas berapa pembicara belajar?',
        options: [
          { id: 'a', arabic: 'الْفَصْلِ السَّابِعِ', transliteration: 'Al-faṣlis-sābi‘', indonesian: 'Kelas VII (Tujuh)', emoji: '7️⃣' },
          { id: 'b', arabic: 'الْفَصْلِ الثَّامِنِ', transliteration: 'Al-faṣlits-tsāmin', indonesian: 'Kelas VIII (Delapan)', emoji: '8️⃣' },
          { id: 'c', arabic: 'الْفَصْلِ التَّاسِعِ', transliteration: 'Al-faṣlit-tāsi‘', indonesian: 'Kelas IX (Sembilan)', emoji: '9️⃣' },
        ],
        correctOptionId: 'a',
        explanation: 'الْفَصْلِ السَّابِعِ artinya kelas tujuh.',
      },
      {
        id: 'd1-lq5',
        promptAudioText: 'مَدْرَسَةٌ',
        promptHint: 'Dengarkan satu kata ini! Apa artinya dalam bahasa Indonesia?',
        options: [
          { id: 'a', arabic: 'بَيْتٌ', transliteration: 'Baitun', indonesian: 'Rumah', emoji: '🏠' },
          { id: 'b', arabic: 'مَدْرَسَةٌ', transliteration: 'Madrasatun', indonesian: 'Sekolah', emoji: '🏫' },
          { id: 'c', arabic: 'مَدِينَةٌ', transliteration: 'Madīnatun', indonesian: 'Kota', emoji: '🏙️' },
        ],
        correctOptionId: 'b',
        explanation: 'Kata yang terdengar adalah مَدْرَسَةٌ yang berarti Sekolah.',
      },
    ],
  },
  kalam: {
    intro:
      'Berlatih mengucapkan ungkapan perkenalan langkah demi langkah: dengarkan dan ulangi, bercakap dengan Teman AI, lalu praktik terbimbing.',
    hint:
      'Petunjuk: Dengarkan contoh kalimat terlebih dahulu, tekan tombol mikrofon untuk merekam suara Arabmu (atau ketik langsung jika mikrofon tidak tersedia), lalu periksa hasilnya.',
    repeatSentences: [
      { id: 'd1-k1', arabic: 'السَّلَامُ عَلَيْكُمْ.', transliteration: 'As-salāmu ‘alaikum.', indonesian: 'Semoga keselamatan atas kalian.' },
      { id: 'd1-k2', arabic: 'مَا اسْمُكَ؟', transliteration: 'Masmuka?', indonesian: 'Siapa namamu?' },
      { id: 'd1-k3', arabic: 'اِسْمِي أَحْمَدُ.', transliteration: 'Ismī Aḥmad.', indonesian: 'Namaku Ahmad.' },
      { id: 'd1-k4', arabic: 'أَيْنَ تَسْكُنُ؟', transliteration: 'Aina taskun?', indonesian: 'Di mana kamu tinggal?' },
      { id: 'd1-k5', arabic: 'أَسْكُنُ فِي سُورَابَايَا.', transliteration: 'Askunu fī Sūrābāyā.', indonesian: 'Saya tinggal di Surabaya.' },
      { id: 'd1-k6', arabic: 'فِي أَيِّ فَصْلٍ أَنْتَ؟', transliteration: 'Fī ayyi faṣlin anta?', indonesian: 'Di kelas berapa kamu?' },
      { id: 'd1-k7', arabic: 'أَنَا فِي الْفَصْلِ السَّابِعِ.', transliteration: 'Anā fil-faṣlis-sābi‘.', indonesian: 'Saya di kelas tujuh.' },
    ],
    dialogueTitle: 'حِوَارُ التَّعَارُفِ (Contoh Percakapan Perkenalan)',
    dialogue: [
      {
        id: 'd1-dlg1',
        speaker: 'أَحْمَدُ (Ahmad)',
        speakerRole: 'boy',
        arabic: 'السَّلَامُ عَلَيْكُمْ، مَا اسْمُكَ؟',
        transliteration: 'As-salāmu ‘alaikum, masmuka?',
        indonesian: 'Assalamu’alaikum, siapa namamu?',
      },
      {
        id: 'd1-dlg2',
        speaker: 'عُمَرُ (Umar)',
        speakerRole: 'boy',
        arabic: 'وَعَلَيْكُمُ السَّلَامُ، اِسْمِي عُمَرُ.',
        transliteration: 'Wa ‘alaikumus-salām, ismī ‘Umar.',
        indonesian: 'Wa’alaikumsalam, namaku Umar.',
      },
      {
        id: 'd1-dlg3',
        speaker: 'أَحْمَدُ (Ahmad)',
        speakerRole: 'boy',
        arabic: 'أَيْنَ تَسْكُنُ يَا عُمَرُ؟',
        transliteration: 'Aina taskunu yā ‘Umar?',
        indonesian: 'Di mana kamu tinggal wahai Umar?',
      },
      {
        id: 'd1-dlg4',
        speaker: 'عُمَرُ (Umar)',
        speakerRole: 'boy',
        arabic: 'أَسْكُنُ فِي سِيدُوَارْجُو. أَنَا فِي الْفَصْلِ السَّابِعِ.',
        transliteration: 'Askunu fī Sīduwārjū. Anā fil-faṣlis-sābi‘.',
        indonesian: 'Saya tinggal di Sidoarjo. Saya di kelas tujuh.',
      },
    ],
    aiOpeningMessage: {
      arabic: 'السَّلَامُ عَلَيْكَ! مَا اسْمُكَ؟',
      transliteration: 'As-salāmu ‘alaika! Masmuka?',
      indonesian: 'Assalamu’alaikum! Siapa namamu?',
      tip: 'Jawab dengan: اِسْمِي ... (Namaku ...). Kamu bisa memakai mikrofon atau memilih kalimat cepat di bawah.',
    },
    starterPrompts: [
      {
        arabic: 'السَّلَامُ عَلَيْكُمْ، اِسْمِي زَيْدٌ',
        transliteration: 'As-salāmu ‘alaikum, ismī Zaid',
        indonesian: 'Assalamu’alaikum, namaku Zaid',
      },
      {
        arabic: 'أَنَا طَالِبٌ فِي الْفَصْلِ السَّابِعِ',
        transliteration: 'Anā ṭālibun fil-faṣlis-sābi‘',
        indonesian: 'Saya siswa di kelas tujuh',
      },
      {
        arabic: 'أَسْكُنُ فِي سِيدُوَارْجُو',
        transliteration: 'Askunu fī Sīduwārjū',
        indonesian: 'Saya tinggal di Sidoarjo',
      },
    ],
    guidedPrompt: {
      title: 'Latihan Kalam Terbimbing: Perkenalkan Identitas Ini',
      description:
        'Amati kartu identitas berikut, lalu perkenalkan dirimu seolah menjadi tokoh pada kartu dengan pola kalimat yang disediakan.',
      visualEmoji: '🪪',
      characterSummary: 'Nama: هَاشِمٌ (Hasyim) · Status: طَالِبٌ (Siswa) · Kota: سُورَابَايَا (Surabaya)',
      patternLines: [
        'اِسْمِي ...',
        'أَنَا طَالِبٌ.',
        'أَسْكُنُ فِي ...',
      ],
      sampleAnswer: 'اِسْمِي هَاشِمٌ. أَنَا طَالِبٌ. أَسْكُنُ فِي سُورَابَايَا.',
    },
  },
  qiraah: {
    intro:
      'Bacalah teks perkenalan berikut dengan suara jelas. Tekan tombol "Lihat Arti" untuk mengecek terjemahan, lalu kerjakan latihan menjodohkan dan soal bacaan.',
    hint:
      'Petunjuk: Perhatikan kata-kata yang diberi sorotan warna karena kata tersebut muncul pada latihan menjodohkan dan soal pemahaman.',
    passageTitleArabic: 'أَنَا أَحْمَدُ',
    passageTitleIndonesian: 'Saya Ahmad',
    highlightedWords: ['اِسْمِي', 'أَنَا', 'الْمَدْرَسَةِ', 'سُورَابَايَا', 'الْفَصْلِ', 'صَدِيقٌ'],
    sentences: [
      {
        arabic: 'السَّلَامُ عَلَيْكُمْ. اِسْمِي أَحْمَدُ.',
        transliteration: 'As-salāmu ‘alaikum. Ismī Aḥmad.',
        indonesian: 'Assalamu’alaikum. Namaku Ahmad.',
      },
      {
        arabic: 'أَنَا طَالِبٌ فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ.',
        transliteration: 'Anā ṭālibun fil-madrasatil-mutawassiṭah.',
        indonesian: 'Saya adalah siswa di Madrasah Tsanawiyah (MTs).',
      },
      {
        arabic: 'أَسْكُنُ فِي سُورَابَايَا.',
        transliteration: 'Askunu fī Sūrābāyā.',
        indonesian: 'Saya tinggal di Surabaya.',
      },
      {
        arabic: 'أَنَا فِي الْفَصْلِ السَّابِعِ.',
        transliteration: 'Anā fil-faṣlis-sābi‘.',
        indonesian: 'Saya berada di kelas tujuh.',
      },
      {
        arabic: 'لِي صَدِيقٌ اسْمُهُ مُحَمَّدٌ.',
        transliteration: 'Lī ṣadīqun ismuhu Muḥammad.',
        indonesian: 'Saya mempunyai seorang teman, namanya Muhammad.',
      },
    ],
    vocabMatchPairs: [
      { id: 'd1-m1', leftArabic: 'اِسْمِي', rightText: 'Nama saya' },
      { id: 'd1-m2', leftArabic: 'أَنَا', rightText: 'Saya' },
      { id: 'd1-m3', leftArabic: 'مَدْرَسَةٌ', rightText: 'Sekolah' },
      { id: 'd1-m4', leftArabic: 'صَدِيقٌ', rightText: 'Teman' },
      { id: 'd1-m5', leftArabic: 'فَصْلٌ', rightText: 'Kelas' },
    ],
    questions: [
      {
        id: 'd1-rq1',
        questionArabic: 'مَا اسْمُ الطَّالِبِ فِي النَّصِّ؟',
        questionIndonesian: 'Siapa nama siswa yang bercerita dalam teks?',
        options: [
          { id: 'a', arabic: 'أَحْمَدُ', indonesian: 'Ahmad' },
          { id: 'b', arabic: 'حَسَنٌ', indonesian: 'Hasan' },
          { id: 'c', arabic: 'زَيْدٌ', indonesian: 'Zaid' },
        ],
        correctOptionId: 'a',
        explanation: 'Di awal teks tertulis: اِسْمِي أَحْمَدُ.',
      },
      {
        id: 'd1-rq2',
        questionArabic: 'أَيْنَ يَسْكُنُ أَحْمَدُ؟',
        questionIndonesian: 'Di kota mana Ahmad tinggal?',
        options: [
          { id: 'a', arabic: 'مَالَانْج', indonesian: 'Malang' },
          { id: 'b', arabic: 'سُورَابَايَا', indonesian: 'Surabaya' },
          { id: 'c', arabic: 'جَاكَرْتَا', indonesian: 'Jakarta' },
        ],
        correctOptionId: 'b',
        explanation: 'Teks menyebutkan: أَسْكُنُ فِي سُورَابَايَا.',
      },
      {
        id: 'd1-rq3',
        questionArabic: 'فِي أَيِّ فَصْلٍ أَحْمَدُ؟',
        questionIndonesian: 'Di kelas berapa Ahmad belajar?',
        options: [
          { id: 'a', arabic: 'الْفَصْلِ السَّابِعِ', indonesian: 'Kelas VII' },
          { id: 'b', arabic: 'الْفَصْلِ الثَّامِنِ', indonesian: 'Kelas VIII' },
          { id: 'c', arabic: 'الْفَصْلِ التَّاسِعِ', indonesian: 'Kelas IX' },
        ],
        correctOptionId: 'a',
        explanation: 'Tertulis pada kalimat keempat: أَنَا فِي الْفَصْلِ السَّابِعِ.',
      },
      {
        id: 'd1-rq4',
        questionArabic: 'مَا اسْمُ صَدِيقِ أَحْمَدَ؟',
        questionIndonesian: 'Siapa nama teman Ahmad?',
        options: [
          { id: 'a', arabic: 'عُمَرُ', indonesian: 'Umar' },
          { id: 'b', arabic: 'عَلِيٌّ', indonesian: 'Ali' },
          { id: 'c', arabic: 'مُحَمَّدٌ', indonesian: 'Muhammad' },
        ],
        correctOptionId: 'c',
        explanation: 'Kalimat terakhir berbunyi: لِي صَدِيقٌ اسْمُهُ مُحَمَّدٌ.',
      },
      {
        id: 'd1-rq5',
        questionArabic: 'أَيْنَ يَدْرُسُ أَحْمَدُ؟',
        questionIndonesian: 'Di mana Ahmad bersekolah?',
        options: [
          { id: 'a', arabic: 'فِي الْمَدْرَسَةِ الْمُتَوَسِّطَةِ', indonesian: 'Di Madrasah Tsanawiyah (MTs)' },
          { id: 'b', arabic: 'فِي الْمَدْرَسَةِ الِابْتِدَائِيَّةِ', indonesian: 'Di Madrasah Ibtidaiyah (MI)' },
          { id: 'c', arabic: 'فِي السُّوقِ', indonesian: 'Di pasar' },
        ],
        correctOptionId: 'a',
        explanation: 'Ahmad adalah siswa di الْمَدْرَسَةِ الْمُتَوَسِّطَةِ (MTs).',
      },
    ],
  },
  kitabah: {
    intro:
      'Latih tulisan Arabmu dari kanan ke kiri! Kamu dapat menyalin kata contoh dan melengkapi kalimat menggunakan keyboard Arab virtual.',
    hint:
      'Petunjuk: Aktifkan tombol "Keyboard Arab Virtual" di bawah kotak ketik bila perangkatmu belum memiliki keyboard bahasa Arab.',
    copyTasks: [
      { id: 'd1-c1', targetArabic: 'أَنَا', indonesian: 'Saya' },
      { id: 'd1-c2', targetArabic: 'اِسْمِي', indonesian: 'Namaku' },
      { id: 'd1-c3', targetArabic: 'أَحْمَدُ', indonesian: 'Ahmad' },
      { id: 'd1-c4', targetArabic: 'طَالِبٌ', indonesian: 'Siswa' },
      { id: 'd1-c5', targetArabic: 'أَنَا طَالِبٌ.', indonesian: 'Saya seorang siswa.' },
    ],
    fillTasks: [
      {
        id: 'd1-f1',
        instruction: 'Lengkapi kalimat perkenalan namamu (contoh: أَحْمَدُ / فَاطِمَةُ / زَيْدٌ):',
        promptPrefix: 'اِسْمِي',
        hintEmoji: '🪪',
        hintText: 'Tulis nama dalam huruf Arab (misalnya: أَحْمَدُ)',
        expectedAnswers: ['أَحْمَدُ', 'فَاطِمَةُ', 'زَيْدٌ', 'عَلِيٌّ', 'مُحَمَّدٌ'],
        sampleFullSentence: 'اِسْمِي أَحْمَدُ',
      },
      {
        id: 'd1-f2',
        instruction: 'Lengkapi kalimat statusmu sebagai siswa/siswi (طَالِبٌ atau طَالِبَةٌ):',
        promptPrefix: 'أَنَا',
        hintEmoji: '🧑‍🎓',
        hintText: 'Tulis طَالِبٌ (siswa) atau طَالِبَةٌ (siswi)',
        expectedAnswers: ['طَالِبٌ', 'طَالِبَةٌ'],
        sampleFullSentence: 'أَنَا طَالِبٌ',
      },
      {
        id: 'd1-f3',
        instruction: 'Lengkapi tempat tinggalmu (contoh: سُورَابَايَا atau سِيدُوَارْجُو):',
        promptPrefix: 'أَسْكُنُ فِي',
        hintEmoji: '🏙️',
        hintText: 'Tulis nama kota (misalnya: سُورَابَايَا atau سِيدُوَارْجُو)',
        expectedAnswers: ['سُورَابَايَا', 'سِيدُوَارْجُو', 'بَانْدُونْج', 'جَاكَرْتَا', 'الْمَدِينَةِ'],
        sampleFullSentence: 'أَسْكُنُ فِي سُورَابَايَا',
      },
    ],
  },
};
