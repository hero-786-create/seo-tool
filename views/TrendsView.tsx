
import React, { useState } from 'react';
import { User, TrendData } from '../types';
import { GeminiService } from '../services/geminiService';
import { LineChart, Loader2, MapPin, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Props {
  user: User;
  onConsumeSearch: () => boolean;
}

const TrendsView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [query, setQuery] = useState('');
  const [data, setData] = useState<TrendData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleExplore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.getTrendData(query);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <LineChart className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Trends Explorer</h1>
        </div>
        <p className="text-slate-500 mb-6">Explore search interest over time to identify viral topics. (1 Search)</p>
        
        <form onSubmit={handleExplore} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter a topic (e.g. 'Taylor Swift')"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Explore'}
          </button>
        </form>
      </div>

      {data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4">
           {/* Interest Over Time */}
           <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-6">Interest Over Time (12 Months)</h3>
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.interestOverTime}>
                          <defs>
                              <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                              </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                          <Tooltip />
                          <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorVal)" />
                      </AreaChart>
                  </ResponsiveContainer>
               </div>
           </div>

           {/* Regional Interest */}
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400"/> Regional Interest</h3>
               <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
                   {data.regionalInterest.map((reg, idx) => (
                       <div key={idx} className="flex items-center justify-between">
                           <span className="text-sm font-medium text-slate-700">{reg.region}</span>
                           <div className="flex items-center gap-2 w-1/2">
                               <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-blue-500 rounded-full" style={{ width: `${reg.value}%` }}></div>
                               </div>
                               <span className="text-xs font-bold text-slate-400 w-8 text-right">{reg.value}</span>
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

export default TrendsView;
