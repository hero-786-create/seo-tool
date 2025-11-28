
import React, { useState } from 'react';
import { GitCompare, Loader2, Trophy, ArrowRight, Minus } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { DomainComparisonResult, User } from '../types';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const DomainComparisonView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [domains, setDomains] = useState<string[]>(['', '', '']);
  const [data, setData] = useState<DomainComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (index: number, value: string) => {
    const newDomains = [...domains];
    newDomains[index] = value;
    setDomains(newDomains);
  };

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    const validDomains = domains.filter(d => d.trim());
    if (validDomains.length < 2) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.compareDomains(validDomains);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-50 rounded-lg">
                <GitCompare className="w-6 h-6 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Domain vs Domain</h1>
        </div>
        <p className="text-slate-500 mb-6">Compare up to 3 competitors side-by-side to find the market leader. (1 Search)</p>
        
        <form onSubmit={handleCompare} className="space-y-4 max-w-2xl">
           <div className="flex flex-col sm:flex-row gap-4">
              {domains.map((domain, i) => (
                  <input
                    key={i}
                    type="text"
                    value={domain}
                    onChange={(e) => handleInputChange(i, e.target.value)}
                    placeholder={`Domain ${i + 1}`}
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                  />
              ))}
           </div>
           <button 
            type="submit"
            disabled={loading || domains.filter(d => d.trim()).length < 2}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-orange-600/20 disabled:opacity-70 flex items-center justify-center w-full sm:w-auto"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Compare Domains'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            
            {/* Insights */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-xl shadow-lg text-white">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-white/10 rounded-lg"><Trophy className="w-6 h-6 text-yellow-400" /></div>
                    <div>
                        <h3 className="font-bold text-lg text-yellow-400 mb-1">Winner: {data.winner}</h3>
                        <p className="text-slate-300 leading-relaxed">{data.insight}</p>
                    </div>
                </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                            <th className="p-6 text-xs font-bold text-slate-500 uppercase w-48">Metric</th>
                            {data.domains.map((d, i) => (
                                <th key={i} className="p-6 font-bold text-slate-900 text-lg border-l border-slate-100">
                                    {d.domain}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="p-6 font-medium text-slate-600">Authority Score</td>
                            {data.domains.map((d, i) => (
                                <td key={i} className={`p-6 font-bold text-lg border-l border-slate-100 ${d.authorityScore === Math.max(...data.domains.map(x=>x.authorityScore)) ? 'text-green-600' : 'text-slate-800'}`}>
                                    {d.authorityScore}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 font-medium text-slate-600">Organic Traffic</td>
                            {data.domains.map((d, i) => (
                                <td key={i} className="p-6 font-mono text-slate-800 border-l border-slate-100">
                                    {d.organicTraffic.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-6 font-medium text-slate-600">Total Keywords</td>
                            {data.domains.map((d, i) => (
                                <td key={i} className="p-6 font-mono text-slate-800 border-l border-slate-100">
                                    {d.keywords.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                         <tr>
                            <td className="p-6 font-medium text-slate-600">Backlinks</td>
                            {data.domains.map((d, i) => (
                                <td key={i} className="p-6 font-mono text-slate-800 border-l border-slate-100">
                                    {d.backlinks.toLocaleString()}
                                </td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default DomainComparisonView;
