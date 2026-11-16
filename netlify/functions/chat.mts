import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

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

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = (await req.json()) as ArabicChatRequest;
    const userMessage = (body.userMessage ?? '').trim();
    const themeId = body.themeId ?? 'taaruf';
    const themeTitle = body.themeTitle ?? 'التَّعَارُفُ (Perkenalan)';
    const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Pesan tidak boleh kosong.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY belum diatur pada Netlify environment variables.' }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const conversationText = history
      .map((turn) => `${turn.role === 'user' ? 'Siswa' : 'Guru'}: ${turn.text}`)
      .join('\n');

    const themeScopeInstruction =
      themeId === 'adawat'
        ? 'Fokus topik HANYA pada peralatan sekolah dan warna sederhana.'
        : themeId === 'yawmiyyat'
        ? 'Fokus topik HANYA pada kegiatan sehari-hari dan waktu.'
        : 'Fokus topik HANYA pada perkenalan diri sederhana.';

    const systemInstruction = `Kamu adalah teman belajar dan tutor bahasa Arab yang ramah untuk siswa kelas VII MTs kelompok مُسْتَوَى مُنْخَفِض (pemula).
Tema pelajaran saat ini: ${themeTitle}.
${themeScopeInstruction}
Gunakan bahasa Arab fusha sederhana berharakat lengkap (1-2 kalimat pendek), ajukan SATU pertanyaan singkat sesuai tema, jangan langsung memberi jawaban siswa, dan sertakan transliterasi, arti bahasa Indonesia, serta tips singkat.`;

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
            arabic: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            indonesian: { type: Type.STRING },
            tip: { type: Type.STRING },
          },
          required: ['arabic', 'transliteration', 'indonesian', 'tip'],
        },
      },
    });

    return new Response((response.text ?? '{}').trim(), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Netlify chat function error:', error);
    return new Response(
      JSON.stringify({ error: 'Maaf, teman bicara AI sedang sibuk sebentar. Coba kirim lagi ya!' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
