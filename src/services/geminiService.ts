export interface ArabicChatReply {
  arabic: string;
  transliteration: string;
  indonesian: string;
  tip: string;
}

export interface ChatTurnPayload {
  role: 'user' | 'model';
  text: string;
}

export async function sendArabicChatMessage(params: {
  themeId: string;
  themeTitle: string;
  history: ChatTurnPayload[];
  userMessage: string;
}): Promise<ArabicChatReply> {
  const response = await fetch('/api/arabic-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Gagal terhubung ke teman bicara AI.');
  }

  return {
    arabic: data.arabic || 'مُمْتَازٌ! أَحْسَنْتَ.',
    transliteration: data.transliteration || '',
    indonesian: data.indonesian || '',
    tip: data.tip || '',
  };
}
