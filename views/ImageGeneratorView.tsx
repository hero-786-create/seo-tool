
import React, { useState } from 'react';
import { User } from '../types';
import { GeminiService } from '../services/geminiService';
import { Image, Loader2, Download, Zap } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const ImageGeneratorView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    if (!onConsumeAICredits(10)) return; // Cost 10 credits

    setLoading(true);
    setImageSrc(null);
    const result = await GeminiService.generateImage(prompt, aspectRatio);
    setImageSrc(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Image className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">AI Image Generator</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Create visuals for your content instantly.
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Gemini 3 Pro
            </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Prompt</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="A futuristic robot analyzing SEO data charts..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all h-32 resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Aspect Ratio</label>
                    <div className="grid grid-cols-4 gap-2">
                        {['1:1', '4:3', '16:9', '9:16'].map(ratio => (
                            <button
                                key={ratio}
                                onClick={() => setAspectRatio(ratio)}
                                className={`py-2 rounded-lg text-sm font-medium border ${aspectRatio === ratio ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                </div>
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !prompt.trim()}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Image'}
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-center min-h-[300px] overflow-hidden relative">
                {imageSrc ? (
                    <>
                        <img src={imageSrc} alt="Generated" className="w-full h-full object-contain max-h-[500px]" />
                        <a 
                           href={imageSrc} 
                           download="generated-image.png"
                           className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-lg shadow-sm hover:bg-white text-slate-700 hover:text-purple-600 transition-colors"
                        >
                            <Download className="w-5 h-5" />
                        </a>
                    </>
                ) : (
                    <div className="text-slate-400 text-center p-8">
                        {loading ? <Loader2 className="w-10 h-10 animate-spin mx-auto mb-2 text-purple-400" /> : <Image className="w-12 h-12 mx-auto mb-2 opacity-20" />}
                        <p className="text-sm">{loading ? 'Generating...' : 'Image preview will appear here'}</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageGeneratorView;
