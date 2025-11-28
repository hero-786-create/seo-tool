
import React, { useState } from 'react';
import { Search, Loader2, Link as LinkIcon, Award, AlignLeft, Globe } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { SerpAnalysisResult, User } from '../types';
import { InfoTooltip } from '../components/InfoTooltip';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const SerpCheckerView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<SerpAnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.getSerpAnalysis(keyword);
    setData(result);
    setLoading(false);
  };

  const getDaColor = (da: number) => {
    if (da > 70) return 'text-green-600 bg-green-50';
    if (da > 40) return 'text-orange-500 bg-orange-50';
    return 'text-red-500 bg-red-50';
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
                <Globe className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">SERP Checker</h1>
        </div>
        <p className="text-slate-500 mb-6">Analyze the top 10 Google results for any keyword to understand why they rank. (1 Search)</p>
        
        <form onSubmit={handleAnalyze} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter Keyword (e.g. 'best crm software')"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check SERP'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             {/* Summary Stats */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase">Difficulty</h3>
                        <div className="text-3xl font-black text-slate-900 mt-1">{data.difficulty}/100</div>
                    </div>
                    <div className="h-12 w-12 rounded-full border-4 border-slate-100 flex items-center justify-center font-bold text-slate-400">KD</div>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase">Volume</h3>
                        <div className="text-3xl font-black text-slate-900 mt-1">{data.volume.toLocaleString()}</div>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center"><Search className="w-6 h-6 text-slate-400"/></div>
                </div>
             </div>

             {/* Results Table */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Top 10 Search Results</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                                <th className="px-6 py-4 w-16">#</th>
                                <th className="px-6 py-4">URL / Title</th>
                                <th className="px-6 py-4">
                                    <div className="flex items-center gap-1">DA <InfoTooltip content="Domain Authority" /></div>
                                </th>
                                <th className="px-6 py-4">
                                    <div className="flex items-center gap-1">Ref. Domains <InfoTooltip content="Backlinks pointing to this page" /></div>
                                </th>
                                <th className="px-6 py-4">Word Count</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.results.map((item, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-400">{item.rank}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-[#1a0dab] hover:underline cursor-pointer truncate max-w-md" title={item.title}>
                                            {item.title}
                                        </div>
                                        <div className="text-xs text-green-700 mt-1 truncate max-w-md">{item.url}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getDaColor(item.domainAuthority)}`}>
                                            {item.domainAuthority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-700 font-mono text-xs">
                                        {item.backlinks.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 text-xs">
                                        {item.wordCount.toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default SerpCheckerView;
