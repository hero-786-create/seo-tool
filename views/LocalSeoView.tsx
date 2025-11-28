
import React, { useState } from 'react';
import { MapPin, Loader2, Navigation, Star, Globe } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { LocalSeoResult, User } from '../types';
import { InfoTooltip } from '../components/InfoTooltip';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const LocalSeoView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<LocalSeoResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Consume Search Limit
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.getLocalSeo(query);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-50 rounded-lg">
                <MapPin className="w-6 h-6 text-teal-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Local SEO Explorer</h1>
        </div>
        <p className="text-slate-500 mb-6">Find local competitors and analyze business listings using Google Maps. (1 Search)</p>
        
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <div className="relative flex-1">
             <Navigation className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
             <input
               type="text"
               value={query}
               onChange={(e) => setQuery(e.target.value)}
               placeholder="e.g. Digital Marketing Agencies in Austin, TX"
               className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all"
             />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search Maps'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
               <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                   Local Insights
                   <InfoTooltip content="Analysis generated based on Google Maps data." />
               </h2>
               <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-line">
                   {data.text}
               </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default LocalSeoView;
