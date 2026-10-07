import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, Send, Loader2, User as UserIcon, Sprout, ChevronRight, Info, Bot, Trash2, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { getFarmingAdvice } from "../services/gemini";
import { Language } from "../types";
import { TRANSLATIONS } from "../constants";
import { cn } from "../lib/utils";
import { useAuth } from "../context/AuthContext";

interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: number;
}

export default function Chat({ language }: { language: Language }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const t = TRANSLATIONS[language];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const promptWithContext = user 
        ? `Farmer Context: Name is ${user.name}, Location: ${user.location}, Primary Crops: ${user.crops.join(", ")}. Question: ${currentInput}`
        : currentInput;

      const response = await getFarmingAdvice(promptWithContext, language);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "ai",
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[80vh] flex flex-col gap-6">
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#5A5A40] text-white rounded-2xl flex items-center justify-center shadow-lg shadow-[#5A5A40]/20">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#5A5A40] leading-none">{t.chatbot}</h1>
            <p className="text-xs text-[#1A1A1A]/40 mt-1 font-medium uppercase tracking-widest">Online • AI Expert</p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-3 text-[#1A1A1A]/40 hover:text-red-500 transition-colors rounded-xl hover:bg-red-50"
          title="Clear Chat"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="flex-1 bg-white rounded-[2.5rem] border border-[#5A5A40]/10 shadow-sm flex flex-col overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 space-y-6">
              <div className="w-20 h-20 bg-[#5A5A40]/5 rounded-3xl flex items-center justify-center text-[#5A5A40]/40">
                <MessageSquare size={40} />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-[#1A1A1A]/60">How can I help you today?</h3>
                <p className="text-sm text-[#1A1A1A]/40 max-w-xs mx-auto">
                  Ask me about crop diseases, seasonal planting, soil health, or any farming advice.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                {[
                  "Best crops for summer?",
                  "How to treat tomato blight?",
                  "Organic fertilizer tips",
                  "Watering schedule for rice"
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="p-4 text-left text-sm font-medium bg-[#5A5A40]/5 rounded-2xl hover:bg-[#5A5A40]/10 transition-colors border border-transparent hover:border-[#5A5A40]/20"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex gap-4 max-w-[85%]",
                msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                msg.sender === "user" ? "bg-[#5A5A40] text-white" : "bg-white border border-[#5A5A40]/10 text-[#5A5A40]"
              )}>
                {msg.sender === "user" ? <UserIcon size={20} /> : <Bot size={20} />}
              </div>
              <div className={cn(
                "p-5 rounded-[1.5rem] shadow-sm",
                msg.sender === "user" 
                  ? "bg-[#5A5A40] text-white rounded-tr-none" 
                  : "bg-[#F5F5F0] text-[#1A1A1A] rounded-tl-none border border-[#5A5A40]/5"
              )}>
                <div className="markdown-body text-sm leading-relaxed">
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
                <p className={cn(
                  "text-[10px] mt-2 font-bold uppercase tracking-widest opacity-40",
                  msg.sender === "user" ? "text-white text-right" : "text-[#1A1A1A]"
                )}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 mr-auto max-w-[85%]"
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-[#5A5A40]/10 text-[#5A5A40] flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={20} />
              </div>
              <div className="p-5 rounded-[1.5rem] bg-[#F5F5F0] text-[#1A1A1A] rounded-tl-none border border-[#5A5A40]/5 flex items-center gap-3">
                <Loader2 className="animate-spin text-[#5A5A40]" size={18} />
                <span className="text-sm font-medium text-[#1A1A1A]/40">Expert is typing...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-[#5A5A40]/10">
          <form onSubmit={handleSend} className="relative flex items-center gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.askMe}
              className="flex-1 p-5 pr-16 rounded-2xl bg-[#5A5A40]/5 border-2 border-transparent focus:border-[#5A5A40]/20 focus:bg-white transition-all outline-none text-sm font-medium"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 w-12 h-12 bg-[#5A5A40] text-white rounded-xl flex items-center justify-center disabled:opacity-50 hover:bg-[#4A4A30] transition-all shadow-lg shadow-[#5A5A40]/20"
            >
              <Send size={20} />
            </button>
          </form>
          <p className="text-center text-[10px] text-[#1A1A1A]/40 mt-4 uppercase font-bold tracking-widest">
            AI can make mistakes. Verify important agricultural advice.
          </p>
        </div>
      </div>
    </div>
  );
}
