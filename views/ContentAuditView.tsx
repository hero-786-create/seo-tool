
import React, { useState } from 'react';
import { FileText, Loader2, CheckCircle, AlertTriangle, Sparkles, Wand2, RefreshCw, Share2, Copy, Check } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { ContentAuditResult, User } from '../types';
import { InfoTooltip } from '../components/InfoTooltip';
import { Skeleton } from '../components/Skeletons';

interface Props {
    user: User;
    onConsumeAICredits: (amount: number) => boolean;
}

const ContentAuditView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [text, setText] = useState('');
  const [result, setResult] = useState<ContentAuditResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [rewriteLoading, setRewriteLoading] = useState(false);
  const [showRewriteInput, setShowRewriteInput] = useState(false);
  const [rewriteInstruction, setRewriteInstruction] = useState('');

  // Social Gen State
  const [socialPlatform, setSocialPlatform] = useState<'Twitter' | 'LinkedIn' | 'Facebook'>('Twitter');
  const [socialFocus, setSocialFocus] = useState('');
  const [socialPost, setSocialPost] = useState('');
  const [socialLoading, setSocialLoading] = useState(false);
  const [socialCopied, setSocialCopied] = useState(false);

  const handleAudit = async () => {
    if (!text.trim() || text.length < 50) return;
    
    // Consume AI Credits (Cost: 5)
    if (!onConsumeAICredits(5)) return;

    setLoading(true);
    setSocialPost(''); // Reset social post when new audit runs
    const auditData = await GeminiService.auditContent(text);
    setResult(auditData);
    setLoading(false);
  };

  const handleRewrite = async () => {
     if (!text || !rewriteInstruction) return;

     // Consume AI Credits (Cost: 10)
     if (!onConsumeAICredits(10)) return;

     setRewriteLoading(true);
     const newText = await GeminiService.rewriteContent(text, rewriteInstruction);
     setText(newText);
     setRewriteLoading(false);
     setShowRewriteInput(false);
     setLoading(true);
     const auditData = await GeminiService.auditContent(newText);
     setResult(auditData);
     setLoading(false);
  };

  const handleSocialGenerate = async () => {
      if (!text.trim()) return;
      if (!onConsumeAICredits(3)) return; // Cost: 3 credits

      setSocialLoading(true);
      const post = await GeminiService.generateSocialPostFromContent(socialPlatform, text, socialFocus);
      setSocialPost(post);
      setSocialLoading(false);
  };

  const copySocialPost = () => {
      navigator.clipboard.writeText(socialPost);
      setSocialCopied(true);
      setTimeout(() => setSocialCopied(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 border-green-500 bg-green-50';
    if (score >= 50) return 'text-amber-500 border-amber-500 bg-amber-50';
    return 'text-red-500 border-red-500 bg-red-50';
  };

  const isTooShort = text.length > 0 && text.length < 50;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto min-h-[calc(100vh-140px)] pb-10">
      {/* Input Section */}
      <div className="flex flex-col space-y-4 h-full">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-none">
           <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
             <div>
                <h1 className="text-2xl font-bold text-slate-900">Content Optimizer</h1>
                <p className="text-slate-500 text-sm mt-1">AI-powered analysis for SEO & Freshness. (5 AI Credits / 10 for Rewrite)</p>
             </div>
             {text.length >= 50 && (
                <button 
                   onClick={() => setShowRewriteInput(!showRewriteInput)}
                   className="flex items-center justify-center gap-2 text-sm font-bold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-4 py-2.5 rounded-xl transition-colors w-full sm:w-auto border border-violet-100"
                >
                   <Wand2 className="w-4 h-4" />
                   Smart Rewrite
                </button>
             )}
           </div>
           
           {showRewriteInput && (
              <div className="mt-4 p-4 bg-violet-50 rounded-xl border border-violet-100 animate-in fade-in slide-in-from-top-2 shadow-inner">
                 <p className="text-xs font-bold text-violet-700 mb-2 uppercase tracking-wide">AI Instruction</p>
                 <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={rewriteInstruction}
                      onChange={(e) => setRewriteInstruction(e.target.value)}
                      placeholder="e.g. Make it more punchy and add 'organic coffee' keywords..."
                      className="flex-1 text-sm p-3 rounded-lg border border-violet-200 focus:border-violet-500 outline-none shadow-sm"
                    />
                    <button 
                      onClick={handleRewrite}
                      disabled={rewriteLoading}
                      className="bg-violet-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-violet-700 disabled:opacity-50 min-w-[80px] shadow-md shadow-violet-200"
                    >
                       {rewriteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Apply'}
                    </button>
                 </div>
              </div>
           )}
        </div>
        
        <div className={`flex-1 bg-white rounded-2xl shadow-sm border p-4 flex flex-col transition-all duration-300 min-h-[400px] ${isTooShort ? 'border-amber-300 ring-4 ring-amber-50' : 'border-slate-100'}`}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here..."
            className="flex-1 w-full p-4 resize-none outline-none text-slate-700 placeholder:text-slate-300 font-serif text-lg leading-relaxed bg-transparent"
          />
          <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-slate-100 mt-2 gap-3">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${isTooShort ? 'text-amber-700 bg-amber-50' : 'text-slate-400 bg-slate-50'}`}>
                {text.length} chars
              </span>
              {isTooShort && (
                <span className="text-xs text-amber-600 flex items-center animate-pulse">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Too short for analysis
                </span>
              )}
            </div>
            <button
              onClick={handleAudit}
              disabled={loading || text.length < 50}
              className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-slate-900/10 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-orange-400"/>}
              Run Audit
            </button>
          </div>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col space-y-4 overflow-y-auto custom-scrollbar">
        {!result && !loading && (
          <div className="flex-1 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 p-8 text-center min-h-[300px]">
             <FileText className="w-16 h-16 mb-4 text-slate-200" />
             <h3 className="font-bold text-slate-600 text-lg">Waiting for content</h3>
             <p className="text-sm max-w-xs mx-auto mt-2">Paste your draft on the left to get scoring, freshness checks, and improvement tips.</p>
          </div>
        )}

        {loading && (
           <div className="space-y-4">
             <div className="bg-white p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                <div className="space-y-2">
                   <Skeleton className="h-6 w-32" />
                   <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-20 w-20 rounded-full" />
             </div>
             <Skeleton className="h-32 w-full rounded-2xl" />
             <Skeleton className="h-64 w-full rounded-2xl" />
           </div>
        )}

        {result && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Score Cards */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2">SEO Score</h3>
                    <div className={`text-4xl font-black ${getScoreColor(result.score).split(' ')[0]}`}>{result.score}</div>
                    <div className={`absolute top-4 right-4 w-12 h-12 rounded-full border-4 flex items-center justify-center opacity-20 ${getScoreColor(result.score)}`}></div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                    <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 flex items-center gap-1">
                        Freshness
                        <InfoTooltip content="AI estimation of how up-to-date the content feels." />
                    </h3>
                    <div className="text-4xl font-black text-blue-600">{result.freshnessScore || 85}</div>
                    <RefreshCw className="absolute top-4 right-4 w-12 h-12 text-blue-500 opacity-10" />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Readability</span>
                <p className="font-bold text-slate-900 mt-1 capitalize text-lg">{result.readability}</p>
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase">Tone</span>
                <p className="font-bold text-slate-900 mt-1 capitalize text-lg">{result.tone}</p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex-1">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                Action Items
              </h3>
              <ul className="space-y-3">
                {result.suggestions.map((suggestion, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="mt-0.5 min-w-[20px]"><AlertTriangle className="w-5 h-5 text-orange-500" /></div>
                    <span className="leading-relaxed">{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Keywords Found */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wide">Keywords Detected</h3>
               <div className="flex flex-wrap gap-2">
                 {result.keywordsDetected.map((kw, idx) => (
                   <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold border border-slate-200">
                     {kw}
                   </span>
                 ))}
               </div>
            </div>

            {/* Social Media Repurposing */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                    <div className="p-1.5 bg-blue-50 rounded-lg">
                        <Share2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Social Repurposing</h3>
                </div>
                
                <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                         <select 
                            value={socialPlatform} 
                            onChange={(e) => setSocialPlatform(e.target.value as any)}
                            className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 text-sm font-medium outline-none focus:border-blue-500"
                         >
                             <option value="Twitter">Twitter / X</option>
                             <option value="LinkedIn">LinkedIn</option>
                             <option value="Facebook">Facebook</option>
                         </select>
                         <input 
                            type="text" 
                            placeholder="Focus on (optional)..." 
                            value={socialFocus}
                            onChange={(e) => setSocialFocus(e.target.value)}
                            className="flex-1 p-2.5 rounded-lg border border-slate-200 text-sm outline-none focus:border-blue-500"
                         />
                         <button 
                            onClick={handleSocialGenerate}
                            disabled={socialLoading}
                            className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-bold hover:bg-slate-800 disabled:opacity-50 min-w-[100px]"
                         >
                             {socialLoading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Draft Post'}
                         </button>
                    </div>

                    {socialPost && (
                        <div className="relative group">
                            <textarea 
                                readOnly
                                value={socialPost}
                                className="w-full h-32 p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 resize-none outline-none"
                            />
                            <button 
                                onClick={copySocialPost}
                                className="absolute top-2 right-2 p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                            >
                                {socialCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-500" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentAuditView;
