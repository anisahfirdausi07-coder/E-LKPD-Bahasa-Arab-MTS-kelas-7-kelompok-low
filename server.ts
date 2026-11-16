import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface ChatTurn {
  role: 'user' | 'model';
  text: string;
}

interface ArabicChatRequest {
  themeId?: string;
  themeTitle?: string;
  history?: ChatTurn[];
  userMessage?: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true });
  });

  app.post('/api/arabic-chat', async (req, res) => {
    try {
      const body = req.body as ArabicChatRequest;
      const userMessage = (body.userMessage ?? '').trim();
      const themeId = body.themeId ?? 'taaruf';
      const themeTitle = body.themeTitle ?? 'التَّعَارُفُ (Perkenalan)';
      const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

      if (!userMessage) {
        res.status(400).json({ error: 'Pesan tidak boleh kosong.' });
        return;
      }

      if (!process.env.GEMINI_API_KEY) {
        res.status(503).json({
          error: 'Kunci layanan AI belum dikonfigurasi pada server.',
        });
        return;
      }

      const conversationText = history
        .map((turn) => `${turn.role === 'user' ? 'Siswa' : 'Guru'}: ${turn.text}`)
        .join('\n');

      const themeScopeInstruction =
        themeId === 'adawat'
          ? 'Fokus topik HANYA pada peralatan sekolah (كِتَابٌ، قَلَمٌ، حَقِيبَةٌ، مِسْطَرَةٌ، مِمْحَاةٌ، دَفْتَرٌ، مَكْتَبٌ، كُرْسِيٌّ) dan warna sederhana.'
          : themeId === 'yawmiyyat'
          ? 'Fokus topik HANYA pada kegiatan sehari-hari (أَسْتَيْقِظُ، أَسْتَحِمُّ، أَتَنَاوَلُ الْفُطُورَ، أَذْهَبُ إِلَى الْمَدْرَسَةِ، أَدْرُسُ، أَرْجِعُ، أَنَامُ) dan waktu.'
          : 'Fokus topik HANYA pada perkenalan diri sederhana (اِسْمِي، أَنَا طَالِبٌ، أَسْكُنُ فِي، الْفَصْلِ السَّابِعِ).';

      const systemInstruction = `Kamu adalah teman belajar dan tutor bahasa Arab yang ramah, sabar, dan ceria untuk siswa kelas VII MTs kelompok مُسْتَوَى مُنْخَفِض (pemula).
Tema pelajaran saat ini: ${themeTitle}.
${themeScopeInstruction}
Aturan ketat balasan:
1. Gunakan bahasa Arab fusha sederhana yang 100% berharakat lengkap, maksimal 1-2 kalimat pendek.
2. Ajukan SATU pertanyaan singkat saja dalam satu waktu yang sesuai dengan tema pelajaran agar siswa punya ruang menjawab.
3. Jangan langsung memberikan jawaban yang seharusnya diucapkan siswa; beri koreksi ringan dan ramah jika perlu.
4. Sertakan transliterasi Latin yang jelas, terjemahan bahasa Indonesia, dan satu tips singkat (maksimal 1 kalimat) dalam bahasa Indonesia.`;

      const prompt = conversationText
        ? `Riwayat percakapan:\n${conversationText}\n\nPesan terbaru siswa: ${userMessage}`
        : `Pesan pertama siswa: ${userMessage}`;

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              arabic: {
                type: Type.STRING,
                description: 'Short vocalized Arabic reply with full harakat and one simple question.',
              },
              transliteration: {
                type: Type.STRING,
                description: 'Clear Latin transliteration for Indonesian beginners.',
              },
              indonesian: {
                type: Type.STRING,
                description: 'Natural Indonesian translation of the Arabic reply.',
              },
              tip: {
                type: Type.STRING,
                description: 'Encouraging 1-sentence learning tip in Indonesian.',
              },
            },
            required: ['arabic', 'transliteration', 'indonesian', 'tip'],
          },
        },
      });

      const rawText = (response.text ?? '{}').trim();
      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error) {
      console.error('Error in /api/arabic-chat:', error);
      res.status(500).json({
        error: 'Maaf, teman bicara AI sedang sibuk sebentar. Coba kirim lagi ya!',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
