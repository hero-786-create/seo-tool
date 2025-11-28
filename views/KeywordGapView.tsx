
import React, { useState } from 'react';
import { GitCompare, Loader2, ArrowRight, ShieldAlert } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { KeywordGapResult, User } from '../types';
import { InfoTooltip } from '../components/InfoTooltip';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const KeywordGapView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [myDomain, setMyDomain] = useState('');
  const [competitorDomain, setCompetitorDomain] = useState('');
  const [data, setData] = useState<KeywordGapResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!myDomain.trim() || !competitorDomain.trim()) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.getKeywordGap(myDomain, competitorDomain);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 rounded-lg">
                <GitCompare className="w-6 h-6 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Keyword Gap Analysis</h1>
        </div>
        <p className="text-slate-500 mb-6">Compare your domain's keywords with a competitor to find missing opportunities. (1 Search)</p>
        
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-4 max-w-3xl">
          <input
            type="text"
            value={myDomain}
            onChange={(e) => setMyDomain(e.target.value)}
            placeholder="Your Domain (e.g. nike.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
          <span className="hidden md:flex items-center text-slate-400 font-bold">VS</span>
          <input
            type="text"
            value={competitorDomain}
            onChange={(e) => setCompetitorDomain(e.target.value)}
            placeholder="Competitor (e.g. adidas.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-purple-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Compare'}
          </button>
        </form>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
            {/* Missing Keywords */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>Missing</span>
                    <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">{data.missing.length} keywords</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">Keywords where competitor ranks but you don't.</p>
                <div className="space-y-3">
                    {data.missing.map((kw, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="font-semibold text-slate-800">{kw.keyword}</div>
                            <div className="flex justify-between mt-2 text-xs">
                                <span className="text-slate-500">Vol: {kw.volume}</span>
                                <span className="text-red-600 font-bold">Comp Pos: #{kw.competitorPos}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

             {/* Weak Keywords */}
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>Weak</span>
                    <span className="text-xs bg-orange-50 text-orange-600 px-2 py-1 rounded-full">{data.weak.length} keywords</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">Keywords where you rank lower than competitor.</p>
                <div className="space-y-3">
                    {data.weak.map((kw, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="font-semibold text-slate-800">{kw.keyword}</div>
                            <div className="flex justify-between mt-2 text-xs">
                                <span className="text-orange-600 font-bold">You: #{kw.myPos}</span>
                                <span className="text-green-600 font-bold">Them: #{kw.competitorPos}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Shared Keywords */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 lg:col-span-1">
                <h3 className="font-bold text-slate-900 mb-4 flex items-center justify-between">
                    <span>Shared</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">{data.shared.length} keywords</span>
                </h3>
                <p className="text-xs text-slate-500 mb-4">Keywords where both domains rank.</p>
                <div className="space-y-3">
                    {data.shared.map((kw, i) => (
                        <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                            <div className="font-semibold text-slate-800">{kw.keyword}</div>
                            <div className="flex justify-between mt-2 text-xs text-slate-500">
                                <span>Vol: {kw.volume}</span>
                                <span>Both Ranked</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default KeywordGapView;
