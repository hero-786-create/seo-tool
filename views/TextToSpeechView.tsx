
import React, { useState } from 'react';
import { User } from '../types';
import { GeminiService } from '../services/geminiService';
import { Mic2, Loader2, Play, Zap } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const TextToSpeechView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [text, setText] = useState('');
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    if (!onConsumeAICredits(5)) return;

    setLoading(true);
    setAudioSrc(null);
    const base64Audio = await GeminiService.generateSpeech(text);
    if (base64Audio) {
       setAudioSrc(`data:audio/mp3;base64,${base64Audio}`);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
                <Mic2 className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Text to Speech</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Generate lifelike speech from text.
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Gemini TTS
            </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <textarea 
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter text to speak..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-green-100 focus:border-green-500 h-48 resize-none"
                />
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !text.trim()}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-green-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Speech'}
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-8 flex flex-col items-center justify-center min-h-[300px]">
                {audioSrc ? (
                    <div className="text-center w-full">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Play className="w-10 h-10 text-green-600 ml-1" />
                        </div>
                        <audio controls src={audioSrc} className="w-full" autoPlay />
                    </div>
                ) : (
                    <div className="text-slate-400 text-center">
                        <Mic2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p className="text-sm">Audio player will appear here</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default TextToSpeechView;
