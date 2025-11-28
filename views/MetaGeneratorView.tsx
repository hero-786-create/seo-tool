
import React, { useState } from 'react';
import { User, MetaTagResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { Search, Loader2, RefreshCw, Copy, Check, Globe, Zap } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const MetaGeneratorView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [result, setResult] = useState<MetaTagResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (!onConsumeAICredits(2)) return; // Cost 2 credits

    setLoading(true);
    const data = await GeminiService.generateMetaTags(topic, keywords);
    setResult(data);
    setLoading(false);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
       <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <Search className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Meta Tag Generator</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Create click-worthy Title Tags and Meta Descriptions instantly.
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Powered by Flash-Lite
            </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Page Topic / Content</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. Best Vegan Protein Powders 2024"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Keywords (Optional)</label>
                    <input 
                        type="text" 
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g. vegan protein, plant based, supplements"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    />
                </div>
                <button 
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><RefreshCw className="w-5 h-5"/> Generate Tags</>}
                </button>
            </div>

            {/* Preview Section */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" /> Google Search Preview
                </h3>
                
                {result ? (
                    <div className="bg-white p-4 rounded shadow-sm border border-slate-100 mb-6">
                        <div className="flex items-center gap-2 text-xs text-slate-700 mb-1">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">G</div>
                            <span className="line-clamp-1">{result.previewUrl || 'example.com'}</span>
                        </div>
                        <h4 className="text-xl text-[#1a0dab] hover:underline cursor-pointer font-medium truncate mb-1">
                            {result.title}
                        </h4>
                        <p className="text-sm text-[#4d5156] line-clamp-2">
                            {result.description}
                        </p>
                    </div>
                ) : (
                    <div className="h-32 flex items-center justify-center text-slate-400 text-sm border border-dashed border-slate-300 rounded-lg">
                        Preview will appear here
                    </div>
                )}

                {result && (
                    <div className="space-y-4">
                        <div className="group relative">
                            <label className="text-xs font-bold text-slate-400 uppercase">Title Tag</label>
                            <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-800 pr-10">
                                {result.title}
                            </div>
                            <button 
                                onClick={() => copyToClipboard(result.title, 'title')}
                                className="absolute right-2 top-6 p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-50 hover:bg-blue-50"
                            >
                                {copiedField === 'title' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        <div className="group relative">
                            <label className="text-xs font-bold text-slate-400 uppercase">Meta Description</label>
                            <div className="bg-white p-3 rounded border border-slate-200 text-sm text-slate-800 pr-10">
                                {result.description}
                            </div>
                            <button 
                                onClick={() => copyToClipboard(result.description, 'desc')}
                                className="absolute right-2 top-6 p-1.5 text-slate-400 hover:text-blue-600 rounded bg-slate-50 hover:bg-blue-50"
                            >
                                {copiedField === 'desc' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
       </div>
    </div>
  );
};

export default MetaGeneratorView;
