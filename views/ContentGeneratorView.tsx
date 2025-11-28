
import React, { useState } from 'react';
import { User } from '../types';
import { GeminiService } from '../services/geminiService';
import { PenTool, Loader2, FileText, List, Copy, Check, Zap } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const ContentGeneratorView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [contentType, setContentType] = useState<'Outline' | 'Full Post'>('Outline');
  const [generatedContent, setGeneratedContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    const cost = contentType === 'Outline' ? 5 : 15;
    if (!onConsumeAICredits(cost)) return;

    setLoading(true);
    const content = await GeminiService.generateBlogPost(topic, keywords, contentType);
    setGeneratedContent(content);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto min-h-[calc(100vh-140px)]">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <PenTool className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">AI Article Writer</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Generate SEO-optimized blog outlines and full articles.
            <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Powered by Gemini Pro
            </span>
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Article Topic</label>
                    <input 
                        type="text" 
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="e.g. The Future of AI in Digital Marketing"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Target Keywords (Comma separated)</label>
                    <input 
                        type="text" 
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder="e.g. ai tools, marketing trends, automation"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all"
                    />
                </div>
                
                <div className="flex gap-3">
                    <button 
                       onClick={() => setContentType('Outline')}
                       className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-sm ${contentType === 'Outline' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <List className="w-4 h-4" /> Outline (5 Credits)
                    </button>
                    <button 
                       onClick={() => setContentType('Full Post')}
                       className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all font-bold text-sm ${contentType === 'Full Post' ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                        <FileText className="w-4 h-4" /> Full Post (15 Credits)
                    </button>
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading || !topic.trim()}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate Content'}
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 relative flex flex-col min-h-[400px]">
                {generatedContent ? (
                    <>
                       <div className="absolute top-4 right-4 flex gap-2">
                           <button 
                             onClick={handleCopy}
                             className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-colors"
                           >
                              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                           </button>
                       </div>
                       <div className="prose prose-slate max-w-none flex-1 overflow-y-auto custom-scrollbar pr-2">
                           <div className="whitespace-pre-wrap">{generatedContent}</div>
                       </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                        <PenTool className="w-12 h-12 mb-3 opacity-20" />
                        <p className="text-sm font-medium">Generated article will appear here</p>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGeneratorView;
