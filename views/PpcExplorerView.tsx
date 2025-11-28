
import React, { useState } from 'react';
import { DollarSign, Loader2, MousePointer2 } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { PPCDataResult, User } from '../types';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const PpcExplorerView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<PPCDataResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.getPPCData(domain);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">PPC Advertising Explorer</h1>
        </div>
        <p className="text-slate-500 mb-6">Spy on competitors' paid search strategies, budgets, and ad copies. (1 Search)</p>
        
        <form onSubmit={handleAnalyze} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter Competitor Domain (e.g. monday.com)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-green-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze Ads'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase">Est. Monthly Budget</h3>
                    <div className="text-3xl font-black text-slate-900 mt-2">${data.estimatedBudget.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-500 uppercase">Paid Keywords</h3>
                    <div className="text-3xl font-black text-slate-900 mt-2">{data.paidKeywords.toLocaleString()}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Paid Keywords */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900">Top Paid Keywords</h3>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                            <tr>
                                <th className="px-6 py-3">Keyword</th>
                                <th className="px-6 py-3">CPC</th>
                                <th className="px-6 py-3">Vol</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.topAdKeywords.map((kw, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-6 py-3 font-medium text-slate-800">{kw.keyword}</td>
                                    <td className="px-6 py-3 text-slate-600">${kw.cpc.toFixed(2)}</td>
                                    <td className="px-6 py-3 text-slate-600">{kw.volume.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Ad Copy Samples */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-6 border-b border-slate-100">
                        <h3 className="font-bold text-slate-900">Sample Ad Copies</h3>
                    </div>
                    <div className="p-6 space-y-6">
                        {data.sampleAds.map((ad, idx) => (
                            <div key={idx} className="p-4 rounded-lg bg-slate-50 border border-slate-100">
                                <div className="text-xs font-bold text-slate-500 mb-2">Ad Preview</div>
                                <div className="mb-1 text-sm text-slate-800">
                                    <span className="font-bold bg-slate-200 text-slate-600 px-1 rounded mr-2 text-[10px]">Ad</span>
                                    <span className="text-slate-600">{ad.url}</span>
                                </div>
                                <h4 className="text-lg text-[#1a0dab] font-medium hover:underline cursor-pointer mb-1 leading-snug">
                                    {ad.headline}
                                </h4>
                                <p className="text-sm text-[#4d5156] leading-relaxed">
                                    {ad.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default PpcExplorerView;
