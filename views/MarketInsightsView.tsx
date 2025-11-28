
import React, { useState } from 'react';
import { TrendingUp, Loader2, Search, ExternalLink, Globe } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { MarketInsightResult, User } from '../types';
import { InfoTooltip } from '../components/InfoTooltip';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const MarketInsightsView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<MarketInsightResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Consume Search Limit
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.getMarketInsights(query);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-pink-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Market Insights</h1>
        </div>
        <p className="text-slate-500 mb-6">Discover real-time trends and news using Google Search data. (1 Search)</p>
        
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <div className="relative flex-1">
             <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
             <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="e.g. Latest Google algorithm updates 2024"
               className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 outline-none transition-all"
             />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Research'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                 <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    AI Insight Report
                    <InfoTooltip content="Generated using Gemini 2.5 Flash with live Google Search Grounding." />
                 </h2>
                 <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                    {data.text}
                 </div>
              </div>

              {/* Sources */}
              <div className="lg:col-span-1">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 sticky top-4">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                       <Globe className="w-4 h-4 mr-2 text-slate-400" />
                       Sources Found
                    </h3>
                    {data.sources.length > 0 ? (
                       <ul className="space-y-3">
                          {data.sources.map((source, idx) => (
                             <li key={idx} className="group">
                                <a 
                                   href={source.uri} 
                                   target="_blank" 
                                   rel="noopener noreferrer"
                                   className="block p-3 rounded-lg bg-slate-50 hover:bg-pink-50 transition-colors border border-slate-100 hover:border-pink-200"
                                >
                                   <div className="text-sm font-medium text-slate-800 group-hover:text-pink-700 line-clamp-2">
                                      {source.title || "Untitled Source"}
                                   </div>
                                   <div className="flex items-center mt-2 text-xs text-slate-400 group-hover:text-pink-600/70">
                                      <ExternalLink className="w-3 h-3 mr-1" />
                                      {source.uri ? new URL(source.uri).hostname : "source"}
                                   </div>
                                </a>
                             </li>
                          ))}
                       </ul>
                    ) : (
                       <p className="text-sm text-slate-500 italic">No specific source links returned for this query.</p>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MarketInsightsView;
