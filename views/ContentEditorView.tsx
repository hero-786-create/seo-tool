
import React, { useState, useEffect } from 'react';
import { User, SemanticKeyword } from '../types';
import { GeminiService } from '../services/geminiService';
import { PenTool, Loader2, Sparkles, CheckCircle, AlertCircle, RefreshCw, Zap } from 'lucide-react';
import { InfoTooltip } from '../components/InfoTooltip';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const ContentEditorView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [keywords, setKeywords] = useState<SemanticKeyword[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnalyze = async () => {
    if (!topic.trim()) return;
    if (keywords.length === 0 && !onConsumeAICredits(10)) return; // Initial analysis cost

    setLoading(true);
    // Simulate analyzing current content
    const result = await GeminiService.getSemanticAnalysis(topic, content);
    setKeywords(result);
    calculateScore(result);
    setLoading(false);
  };

  const calculateScore = (kws: SemanticKeyword[]) => {
      if (kws.length === 0) return;
      const total = kws.length;
      const used = kws.filter(k => k.currentCount > 0).length;
      const rawScore = Math.round((used / total) * 100);
      setScore(rawScore);
  };

  // Real-time update simulation (in a real app, we'd count locally)
  useEffect(() => {
      if (keywords.length > 0) {
          const updatedKeywords = keywords.map(k => {
              const regex = new RegExp(`\\b${k.keyword}\\b`, 'gi');
              const count = (content.match(regex) || []).length;
              return { ...k, currentCount: count };
          });
          // Only update if counts changed to avoid loops, simplistic check
          if (JSON.stringify(updatedKeywords) !== JSON.stringify(keywords)) {
              setKeywords(updatedKeywords);
              calculateScore(updatedKeywords);
          }
      }
  }, [content]);

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><PenTool className="w-5 h-5" /></div>
             <div>
                 <h1 className="font-bold text-slate-900">Content Editor</h1>
                 <p className="text-xs text-slate-500">Optimize with NLP terms.</p>
             </div>
        </div>
        <div className="flex gap-2">
            <input 
               type="text" 
               value={topic} 
               onChange={(e) => setTopic(e.target.value)} 
               placeholder="Target Keyword..." 
               className="px-4 py-2 border border-slate-200 rounded-lg text-sm outline-none w-64"
            />
            <button 
               onClick={handleAnalyze} 
               disabled={loading || !topic}
               className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2"
            >
               {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Analyze'}
            </button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
          {/* Editor Area */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden relative">
             <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center text-xs text-slate-500">
                 <span>{content.split(/\s+/).filter(w => w.length > 0).length} words</span>
                 <span>{content.length} chars</span>
             </div>
             <textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing your SEO-optimized content here..."
                className="flex-1 w-full p-6 resize-none outline-none text-slate-800 leading-relaxed font-serif text-lg"
             />
          </div>

          {/* Sidebar Guidelines */}
          <div className="w-80 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 text-center bg-slate-50/30">
                  <div className="relative inline-block">
                      <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                          <circle cx="48" cy="48" r="40" stroke={score > 70 ? "#22c55e" : score > 40 ? "#eab308" : "#ef4444"} strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - score / 100)} />
                      </svg>
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl font-black text-slate-800">
                          {score}
                      </div>
                  </div>
                  <p className="text-xs font-bold text-slate-400 uppercase mt-2">Content Score</p>
              </div>

              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  <h3 className="font-bold text-slate-900 mb-3 text-sm flex items-center gap-2">
                      NLP Keywords <InfoTooltip content="LSI/Semantic keywords found in top ranking pages." />
                  </h3>
                  {keywords.length === 0 ? (
                      <div className="text-center py-10 text-slate-400">
                          <Zap className="w-8 h-8 mx-auto mb-2 opacity-20" />
                          <p className="text-sm">Run analysis to see suggestions.</p>
                      </div>
                  ) : (
                      <div className="space-y-2">
                          {keywords.map((kw, idx) => (
                              <div key={idx} className={`flex items-center justify-between text-sm p-2 rounded-lg border ${kw.currentCount >= kw.recommendedCount ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                                  <span className={kw.currentCount >= kw.recommendedCount ? 'text-green-800 font-medium' : 'text-slate-600'}>{kw.keyword}</span>
                                  <span className="text-xs font-bold text-slate-400">{kw.currentCount}/{kw.recommendedCount}</span>
                              </div>
                          ))}
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
};

export default ContentEditorView;
