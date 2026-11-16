import React, { useRef, useState } from 'react';
import {
  Bot,
  Loader2,
  Mic,
  MicOff,
  RotateCcw,
  Send,
  Square,
  Volume2,
} from 'lucide-react';
import { sendArabicChatMessage } from '../services/geminiService';
import {
  createArabicSpeechRecognition,
  speakArabicText,
  SpeechRecognitionInstance,
} from '../services/speechService';
import { ThemeContent } from '../types/learning';

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  arabic: string;
  transliteration?: string;
  indonesian?: string;
  tip?: string;
}

interface AIConversationProps {
  theme: ThemeContent;
  onSaveChatTurn: (prompt: string, studentResponse: string) => void;
}

export const AIConversation: React.FC<AIConversationProps> = ({
  theme,
  onSaveChatTurn,
}) => {
  const initialMsg: ChatMessage = {
    id: `welcome-${theme.id}`,
    role: 'model',
    arabic: theme.kalam.aiOpeningMessage.arabic,
    transliteration: theme.kalam.aiOpeningMessage.transliteration,
    indonesian: theme.kalam.aiOpeningMessage.indonesian,
    tip: theme.kalam.aiOpeningMessage.tip,
  };

  const [messages, setMessages] = useState<ChatMessage[]>([initialMsg]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isAISpeakingId, setIsAISpeakingId] = useState<string | null>(null);
  const [conversationEnded, setConversationEnded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [micNote, setMicNote] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const lastAiMessage = [...messages].reverse().find((m) => m.role === 'model');

  const playAiVoice = (msgId: string, arabicText: string) => {
    speakArabicText(arabicText, 0.85, {
      onStart: () => setIsAISpeakingId(msgId),
      onEnd: () => setIsAISpeakingId(null),
    });
  };

  const toggleMic = () => {
    if (conversationEnded) return;
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const recognition = createArabicSpeechRecognition();
    if (!recognition) {
      setMicNote(
        'Browser ini belum mendukung pengenalan suara Arab. Silakan ketik jawabanmu di kotak teks atau klik kalimat pemula di bawah.'
      );
      return;
    }

    setMicNote(null);
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let combined = '';
      for (let i = 0; i < event.results.length; i++) {
        combined += event.results[i][0].transcript + ' ';
      }
      setInput(combined.trim());
    };

    recognition.onerror = () => {
      setIsListening(false);
      setMicNote('Suara belum tertangkap jelas. Kamu bisa mengedit teks lalu menekan Kirim.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      setIsListening(true);
      recognition.start();
    } catch {
      setIsListening(false);
      setMicNote('Mikrofon tidak dapat dijalankan. Silakan gunakan input teks.');
    }
  };

  const sendMessage = async (textToSend: string) => {
    const cleanText = textToSend.trim();
    if (!cleanText || loading || conversationEnded) return;

    setErrorMsg(null);
    const currentLastPrompt = lastAiMessage?.arabic || '';

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      arabic: cleanText,
    };

    const nextMessages = [...messages, userMsg];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendArabicChatMessage({
        themeId: theme.id,
        themeTitle: `${theme.arabicTitle} (${theme.indonesianTitle})`,
        history: nextMessages.map((m) => ({
          role: m.role,
          text: m.arabic,
        })),
        userMessage: cleanText,
      });

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'model',
        arabic: reply.arabic,
        transliteration: reply.transliteration,
        indonesian: reply.indonesian,
        tip: reply.tip,
      };

      setMessages((prev) => [...prev, aiMsg]);
      onSaveChatTurn(currentLastPrompt, cleanText);
      playAiVoice(aiMsg.id, aiMsg.arabic);
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Maaf, teman bicara AI sedang sibuk sebentar. Coba kirim lagi ya.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRestartConversation = () => {
    setMessages([initialMsg]);
    setConversationEnded(false);
    setErrorMsg(null);
    setInput('');
  };

  return (
    <div className="rounded-3xl border border-[#DDD6FE] bg-white p-5 sm:p-6 space-y-5 shadow-xs">
      {/* Header with AI Avatar & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2ECFD] pb-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl bg-[#EDE9FE] border border-[#DDD6FE] flex items-center justify-center shrink-0 ${
              isAISpeakingId ? 'animate-gentle-bounce ring-2 ring-[#8B5CF6]' : ''
            }`}
          >
            <Bot className="w-6 h-6 text-[#6D28D9]" aria-hidden="true" />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-[#261C42]">
              Teman Bicara AI — {theme.indonesianTitle}
            </h3>
            <p className="text-xs sm:text-sm text-[#5E5280]">
              {isAISpeakingId
                ? 'Teman AI sedang berbicara...'
                : 'Berlatih percakapan Arab sederhana dengan suara atau ketik'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {lastAiMessage && (
            <button
              type="button"
              onClick={() => playAiVoice(lastAiMessage.id, lastAiMessage.arabic)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#F6F2FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] text-[#5B21B6] text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Ulangi Pertanyaan</span>
            </button>
          )}

          {!conversationEnded ? (
            <button
              type="button"
              onClick={() => setConversationEnded(true)}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#FFF3EB] hover:bg-[#FFE4CC] border border-[#FED7AA] text-[#C2410C] text-xs font-semibold flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Akhiri Percakapan</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleRestartConversation}
              className="min-h-[40px] px-3 py-1.5 rounded-xl bg-[#6D28D9] hover:bg-[#5B21B6] text-white text-xs font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Mulai Percakapan Baru</span>
            </button>
          )}
        </div>
      </div>

      {/* Starter Prompts */}
      <div className="space-y-2">
        <p className="text-xs font-semibold text-[#5E5280]">
          Contoh jawaban cepat (klik untuk langsung mengirim):
        </p>
        <div className="flex flex-wrap gap-2">
          {theme.kalam.starterPrompts.map((starter, idx) => (
            <button
              key={idx}
              type="button"
              disabled={loading || conversationEnded}
              onClick={() => sendMessage(starter.arabic)}
              className="text-left px-3.5 py-2 rounded-2xl bg-[#F6F2FF] hover:bg-[#EDE9FE] border border-[#DDD6FE] transition-colors disabled:opacity-50"
            >
              <span dir="rtl" className="block font-arabic text-base font-bold text-[#261C42]">
                {starter.arabic}
              </span>
              <span className="block text-[11px] text-[#5E5280]">{starter.indonesian}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Bubbles */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          const speakingThis = isAISpeakingId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[92%] sm:max-w-[82%] rounded-2xl p-4 space-y-2 ${
                  isUser
                    ? 'bg-[#6D28D9] text-white'
                    : 'bg-[#F8F5FF] border border-[#E5DCFE] text-[#261C42]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <p
                    dir="rtl"
                    className={`font-arabic text-xl sm:text-2xl font-bold leading-relaxed ${
                      isUser ? 'text-white' : 'text-[#261C42]'
                    }`}
                  >
                    {msg.arabic}
                  </p>
                  {!isUser && (
                    <button
                      type="button"
                      onClick={() => playAiVoice(msg.id, msg.arabic)}
                      title="Dengarkan jawaban AI"
                      aria-label="Dengarkan jawaban AI"
                      className={`min-h-[38px] px-2.5 rounded-xl flex items-center gap-1 text-xs font-semibold shrink-0 transition-colors ${
                        speakingThis
                          ? 'bg-[#6D28D9] text-white'
                          : 'bg-white border border-[#DDD6FE] text-[#6D28D9] hover:bg-[#EDE9FE]'
                      }`}
                    >
                      <Volume2 className="w-4 h-4" aria-hidden="true" />
                      <span className="hidden sm:inline">Dengar</span>
                    </button>
                  )}
                </div>

                {msg.transliteration && (
                  <p className="text-xs sm:text-sm font-medium italic text-[#5B21B6]">
                    {msg.transliteration}
                  </p>
                )}
                {msg.indonesian && (
                  <p className="text-sm text-[#3E335C]">{msg.indonesian}</p>
                )}
                {msg.tip && (
                  <p className="text-xs text-[#92400E] bg-[#FFFBEB] border border-[#FDE68A] rounded-xl px-3 py-1.5">
                    Petunjuk: {msg.tip}
                  </p>
                )}
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3 bg-[#F8F5FF] border border-[#E5DCFE] flex items-center gap-2 text-sm text-[#5B21B6]">
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Teman AI sedang menyusun balasan Arab...</span>
            </div>
          </div>
        )}
      </div>

      {conversationEnded && (
        <div className="rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] p-4 text-sm text-[#92400E]">
          Percakapan selesai! Riwayat jawabanmu telah tersimpan pada halaman Progres Belajar.
        </div>
      )}

      {micNote && (
        <div className="rounded-2xl bg-[#FFF3EB] border border-[#FED7AA] px-4 py-2.5 text-xs sm:text-sm text-[#9A3412]">
          {micNote}
        </div>
      )}

      {errorMsg && (
        <div
          role="alert"
          className="rounded-2xl bg-[#FFF1F2] border border-[#FECDD3] px-4 py-3 text-sm text-[#9F1239]"
        >
          {errorMsg}
        </div>
      )}

      {/* Large Mic Button + Editable Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage(input);
        }}
        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1"
      >
        <button
          type="button"
          disabled={loading || conversationEnded}
          onClick={toggleMic}
          className={`min-h-[50px] px-4 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shrink-0 transition-all ${
            isListening
              ? 'bg-[#E11D48] text-white shadow-sm'
              : 'bg-[#EDE9FE] hover:bg-[#DDD6FE] text-[#5B21B6]'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="w-5 h-5" aria-hidden="true" />
              <span>Stop Suara</span>
            </>
          ) : (
            <>
              <Mic className="w-5 h-5" aria-hidden="true" />
              <span>Bicara (Mikrofon)</span>
            </>
          )}
        </button>

        <input
          type="text"
          dir="auto"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Hasil suara muncul di sini (bisa diedit) atau ketik jawaban Arab..."
          disabled={loading || conversationEnded}
          className="flex-1 min-h-[50px] px-4 py-2.5 rounded-2xl bg-[#FFFDF9] border border-[#DDD6FE] text-sm sm:text-base text-[#261C42] placeholder:text-[#8E82AD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7C3AED]"
        />

        <button
          type="submit"
          disabled={loading || conversationEnded || !input.trim()}
          className="min-h-[50px] px-5 rounded-2xl bg-[#6D28D9] hover:bg-[#5B21B6] disabled:opacity-50 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shrink-0"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
          <span>Kirim</span>
        </button>
      </form>
    </div>
  );
};
