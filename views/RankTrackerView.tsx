
import React, { useState } from 'react';
import { BarChart, Loader2, ArrowUp, ArrowDown, Minus, MapPin, Eye } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { RankData, User } from '../types';
import { InfoTooltip } from '../components/InfoTooltip';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const RankTrackerView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<RankData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    // Consume Search Limit
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.checkRankings(domain);
    setData(result);
    setLoading(false);
  };

  const renderChange = (current: number, prev: number) => {
    const diff = prev - current;
    if (diff > 0) return <span className="flex items-center text-green-600 text-xs font-bold"><ArrowUp className="w-3 h-3 mr-1" />{diff}</span>;
    if (diff < 0) return <span className="flex items-center text-red-600 text-xs font-bold"><ArrowDown className="w-3 h-3 mr-1" />{Math.abs(diff)}</span>;
    return <span className="flex items-center text-slate-400 text-xs"><Minus className="w-3 h-3 mr-1" /></span>;
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg">
                <BarChart className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Rank Tracker</h1>
        </div>
        <p className="text-slate-500 mb-6">Monitor your keyword positions and SERP features daily. (1 Search)</p>
        
        <form onSubmit={handleTrack} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. adidas.com)"
            className="flex-1 pl-4 pr-4 py-3 rounded-lg border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-slate-500 font-medium text-sm flex items-center">
                          Visibility
                          <InfoTooltip content="A metric based on click-through rate (CTR) that shows progress in Google's top 100 results for the tracked keywords." />
                        </h3>
                        <div className="text-3xl font-bold text-slate-900 mt-1">{data.visibility}%</div>
                        <p className="text-xs text-green-600 mt-1 font-medium">+1.2% this week</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-full">
                        <Eye className="w-8 h-8 text-blue-500" />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div>
                        <h3 className="text-slate-500 font-medium text-sm flex items-center">
                          Average Position
                          <InfoTooltip content="The average ranking position for all tracked keywords." />
                        </h3>
                        <div className="text-3xl font-bold text-slate-900 mt-1">{data.avgPosition}</div>
                        <p className="text-xs text-slate-400 mt-1">across all tracked keywords</p>
                    </div>
                     <div className="bg-orange-50 p-4 rounded-full">
                        <MapPin className="w-8 h-8 text-orange-500" />
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Keyword Rankings</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase">
                                <th className="px-6 py-4">Keyword</th>
                                <th className="px-6 py-4">Position</th>
                                <th className="px-6 py-4">Diff</th>
                                <th className="px-6 py-4">Volume</th>
                                <th className="px-6 py-4 flex items-center">
                                  SERP Features
                                  <InfoTooltip content="Special results on Google's search result pages (e.g., Featured Snippets, Local Packs, Videos)." />
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {data.keywords.map((kw, idx) => (
                                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-slate-900">{kw.keyword}</td>
                                    <td className="px-6 py-4 font-bold text-slate-800">{kw.position}</td>
                                    <td className="px-6 py-4">
                                        {renderChange(kw.position, kw.previousPosition)}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{kw.volume.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {kw.serpFeatures.map((f, i) => (
                                                <span key={i} className="px-2 py-0.5 bg-slate-100 border border-slate-200 rounded text-xs text-slate-600">
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
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

export default RankTrackerView;
