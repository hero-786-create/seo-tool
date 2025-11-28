
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, User, Sparkles, BrainCircuit } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { ChatMessage, User as UserType } from '../types';

interface Props {
    user: UserType;
    onConsumeAICredits: (amount: number) => boolean;
}

const ChatView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [thinkingMode, setThinkingMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    // Consume AI Credits (Cost: 2 normal, 5 for thinking)
    const cost = thinkingMode ? 5 : 2;
    if (!onConsumeAICredits(cost)) return;

    const userMsg: ChatMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Prepare history for Gemini
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const responseText = await GeminiService.chatWithGemini(userMsg.text, history, thinkingMode);
    
    const aiMsg: ChatMessage = { role: 'model', text: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] md:h-[calc(100vh-40px)] max-w-5xl mx-auto">
      {/* Chat Header */}
      <div className="bg-white p-4 rounded-t-xl shadow-sm border-b border-slate-100 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 rounded-lg">
               <Sparkles className="w-5 h-5 text-violet-600" />
            </div>
            <div>
               <h1 className="text-lg font-bold text-slate-900">SeoGenie AI Assistant</h1>
               <p className="text-xs text-slate-500">Powered by Gemini 3.0 Pro.</p>
            </div>
        </div>
        
        <button 
           onClick={() => setThinkingMode(!thinkingMode)}
           className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
               thinkingMode 
               ? 'bg-violet-600 text-white border-violet-600 shadow-md shadow-violet-200' 
               : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-violet-300'
           }`}
        >
            <BrainCircuit className={`w-3 h-3 ${thinkingMode ? 'text-white' : 'text-slate-400'}`} />
            Thinking Mode {thinkingMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-slate-50/50">
        {messages.length === 0 && (
           <div className="h-full flex flex-col items-center justify-center text-slate-400 opacity-60">
              <MessageSquare className="w-16 h-16 mb-4" />
              <p>Ask me anything about SEO, strategy, or technical issues.</p>
              {thinkingMode && (
                  <p className="text-xs text-violet-500 font-medium mt-2 flex items-center gap-1">
                      <BrainCircuit className="w-3 h-3" /> Deep reasoning enabled
                  </p>
              )}
           </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${
               msg.role === 'user' 
               ? 'bg-violet-600 text-white rounded-br-none' 
               : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
            }`}>
              <div className="flex items-center gap-2 mb-1 opacity-70 text-xs font-medium">
                 {msg.role === 'user' ? <User className="w-3 h-3" /> : <Sparkles className="w-3 h-3" />}
                 {msg.role === 'user' ? 'You' : 'Gemini'}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">
                 {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {loading && (
           <div className="flex justify-start">
             <div className="bg-white rounded-2xl rounded-bl-none p-4 border border-slate-100 shadow-sm flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-violet-500 animate-spin" />
                {thinkingMode && <span className="text-xs font-medium text-violet-600 animate-pulse">Thinking deeply...</span>}
             </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
         <form onSubmit={handleSend} className="relative flex items-center gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about SEO strategies..."
              className="flex-1 p-4 pr-12 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-violet-500 focus:ring-2 focus:ring-violet-200 outline-none transition-all"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="absolute right-2 p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:hover:bg-violet-600 transition-colors"
            >
               <Send className="w-5 h-5" />
            </button>
         </form>
         <p className="text-[10px] text-slate-400 mt-2 text-center">
             {thinkingMode ? 'Deep Reasoning Active (5 Credits)' : 'Standard Chat (2 Credits)'}
         </p>
      </div>
    </div>
  );
};

export default ChatView;
