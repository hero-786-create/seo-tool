
import React, { useState, useRef, useEffect } from 'react';
import { Globe, Loader2, Trophy, BarChart3, Link, ArrowUp, ArrowDown, RefreshCw, Eye, MoreVertical, Search, Layers } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { DomainMetrics, User } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoTooltip } from '../components/InfoTooltip';
import { CardSkeleton, ListSkeleton, Skeleton } from '../components/Skeletons';

const POPULAR_DOMAINS = ["google.com", "youtube.com", "facebook.com", "amazon.com", "wikipedia.org", "netflix.com"];

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const DomainOverviewView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<DomainMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [trendPeriod, setTrendPeriod] = useState<'monthly' | 'weekly'>('monthly');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const fetchData = async () => {
    if (!domain.trim()) return;
    if (!onConsumeSearch()) return;
    setShowSuggestions(false);
    setLoading(true);
    const result = await GeminiService.analyzeDomain(domain);
    setData(result);
    setLoading(false);
  };

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData();
  };

  const chartData = data ? (trendPeriod === 'monthly' ? data.trafficTrend : (data.weeklyTrend || [])) : [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100 relative z-10">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2">Domain Overview</h1>
        <p className="text-sm md:text-base text-slate-500 mb-8">Get instant insights into any website's SEO performance. (1 Search)</p>
        
        <form onSubmit={handleAnalyze} className="flex flex-col md:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1" ref={wrapperRef}>
            <Globe className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              value={domain}
              onChange={(e) => {
                  setDomain(e.target.value);
                  if(e.target.value) {
                    setSuggestions(POPULAR_DOMAINS.filter(d => d.includes(e.target.value)).slice(0,5));
                    setShowSuggestions(true);
                  }
              }}
              onFocus={() => { if(domain) setShowSuggestions(true); }}
              placeholder="e.g. google.com"
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            />
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-100 py-2 z-50">
                {suggestions.map((s, i) => (
                  <div key={i} onClick={() => { setDomain(s); setShowSuggestions(false); }} className="px-4 py-2 hover:bg-orange-50 cursor-pointer flex items-center gap-2">
                    <Globe className="w-4 h-4 text-slate-400" /><span>{s}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-medium transition-colors disabled:opacity-70 flex items-center justify-center min-w-[120px]">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
          </button>
        </form>
      </div>

      {(loading || data) && (
        <div className={`space-y-6 transition-opacity duration-300 ${loading && data ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          {loading && !data ? <CardSkeleton /> : data && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-orange-500">
                  <div className="flex items-center gap-2 mb-2"><Trophy className="w-4 h-4 text-orange-500" /><span className="text-sm font-semibold text-slate-500 uppercase">Authority Score</span></div>
                  <div className="text-3xl font-bold text-slate-900">{data.authorityScore}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-blue-500">
                  <div className="flex items-center gap-2 mb-2"><BarChart3 className="w-4 h-4 text-blue-500" /><span className="text-sm font-semibold text-slate-500 uppercase">Organic Traffic</span></div>
                  <div className="text-3xl font-bold text-slate-900">{data.organicTraffic.toLocaleString()}</div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-purple-500">
                  <div className="flex items-center gap-2 mb-2"><Link className="w-4 h-4 text-purple-500" /><span className="text-sm font-semibold text-slate-500 uppercase">Backlinks</span></div>
                  <div className="text-3xl font-bold text-slate-900">{data.backlinks.toLocaleString()}</div>
                </div>
              </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100">
               <div className="flex items-center justify-between mb-6">
                 <h3 className="font-bold text-slate-900 flex items-center">Traffic Trend</h3>
                 {data && (
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                      <button onClick={() => setTrendPeriod('monthly')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${trendPeriod === 'monthly' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Monthly</button>
                      <button onClick={() => setTrendPeriod('weekly')} className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${trendPeriod === 'weekly' ? 'bg-white shadow-sm' : 'text-slate-500'}`}>Weekly</button>
                    </div>
                 )}
               </div>
               <div className="h-[300px]">
                 {loading && !data ? <Skeleton className="w-full h-full" /> : data && (
                   <ResponsiveContainer width="100%" height="100%">
                     <BarChart data={chartData}>
                       <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                       <XAxis dataKey={trendPeriod === 'monthly' ? 'month' : 'date'} axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                       <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                       <Tooltip cursor={{fill: '#f8fafc'}} formatter={(value: number) => [value.toLocaleString(), 'Visits']} />
                       <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={trendPeriod === 'monthly' ? 40 : 20} />
                     </BarChart>
                   </ResponsiveContainer>
                 )}
               </div>
             </div>

             <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 min-h-[250px]">
                   <h3 className="font-bold text-slate-900 mb-4 flex items-center">Top Competitors</h3>
                   {loading && !data ? <ListSkeleton items={3} /> : data && (
                     <div className="space-y-3">
                        {data.competitors.map((comp, idx) => (
                          <div key={idx} className="group relative flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-all duration-200 cursor-help border border-transparent hover:border-slate-200 hover:shadow-sm hover:-translate-y-0.5 z-10 hover:z-20">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500 uppercase">{comp.domain.charAt(0)}</div>
                                <span className="text-slate-700 font-medium">{comp.domain}</span>
                            </div>
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-56 bg-slate-800 text-white p-3 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none transform translate-y-2 group-hover:translate-y-0 hidden md:block">
                                <div className="text-xs font-semibold mb-2 border-b border-slate-600 pb-1 text-slate-200">{comp.domain} Stats</div>
                                <div className="flex justify-between items-center mb-1"><span className="text-xs text-slate-400">Authority Score:</span><span className="text-xs font-bold text-orange-400">{comp.authorityScore}</span></div>
                                <div className="flex justify-between items-center"><span className="text-xs text-slate-400">Organic Traffic:</span><span className="text-xs font-bold text-blue-400">{comp.organicTraffic.toLocaleString()}</span></div>
                            </div>
                          </div>
                        ))}
                     </div>
                   )}
                </div>
                {/* Visual Gap Analysis */}
                <div className="bg-slate-900 p-6 rounded-xl shadow-sm border border-slate-800 text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-2xl"></div>
                   <h3 className="font-bold mb-4 flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-400"/> Keyword Overlap</h3>
                   {data && (
                      <div className="flex items-center justify-center py-4">
                         <div className="flex items-center">
                            <div className="w-20 h-20 rounded-full bg-orange-500/50 flex items-center justify-center border-2 border-orange-500 z-10 -mr-4 backdrop-blur-sm">
                               <div className="text-center"><div className="text-xs font-bold">You</div><div className="text-[10px]">Unique</div></div>
                            </div>
                             <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 z-20 backdrop-blur-md">
                               <div className="text-center"><div className="text-xs font-bold">Shared</div></div>
                            </div>
                             <div className="w-20 h-20 rounded-full bg-indigo-500/50 flex items-center justify-center border-2 border-indigo-500 z-10 -ml-4 backdrop-blur-sm">
                               <div className="text-center"><div className="text-xs font-bold">Comp</div><div className="text-[10px]">Unique</div></div>
                            </div>
                         </div>
                      </div>
                   )}
                   <p className="text-center text-xs text-slate-400">Run a full Gap Analysis to see specific keywords.</p>
                </div>
             </div>
          </div>

          {/* SERP Snapshot Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900 flex items-center gap-2"><Eye className="w-5 h-5 text-slate-400" /> SERP Snapshot (Top 3 Keywords)</h3>
             </div>
             {loading && !data ? <Skeleton className="h-24 w-full" /> : data && data.serpSnapshots && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.serpSnapshots.map((serp, idx) => (
                        <div key={idx} className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide bg-slate-50 px-2 py-1 rounded border border-slate-100">Query: {serp.keyword}</span>
                                <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-1 rounded border border-green-100 flex items-center gap-1"><Trophy className="w-3 h-3" /> Pos #{serp.position}</span>
                            </div>
                            <div className="font-sans">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-7 h-7 bg-slate-100 rounded-full flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-200 shrink-0">{new URL(serp.url).hostname.charAt(0).toUpperCase()}</div>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-sm font-medium text-slate-900">{new URL(serp.url).hostname}</span>
                                        <span className="text-xs text-slate-500 truncate max-w-[180px] mt-0.5">{serp.url}</span>
                                    </div>
                                    <div className="ml-auto text-slate-300"><MoreVertical className="w-4 h-4" /></div>
                                </div>
                                <a href={serp.url} target="_blank" rel="noreferrer" className="block text-xl text-[#1a0dab] hover:underline font-normal leading-snug mb-2 truncate">{serp.title}</a>
                                <p className="text-sm text-[#4d5156] leading-relaxed line-clamp-3">{serp.snippet}</p>
                            </div>
                        </div>
                    ))}
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainOverviewView;
