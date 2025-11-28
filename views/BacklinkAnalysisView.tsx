
import React, { useState } from 'react';
import { Link as LinkIcon, Loader2, AlertOctagon, ExternalLink, Shield } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { BacklinkData, User } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { InfoTooltip } from '../components/InfoTooltip';
import { CardSkeleton, Skeleton } from '../components/Skeletons';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const BacklinkAnalysisView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [domain, setDomain] = useState('');
  const [data, setData] = useState<BacklinkData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domain.trim()) return;

    // Consume Search Limit
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.getBacklinkAnalysis(domain);
    setData(result);
    setLoading(false);
  };

  const getSpamScoreColor = (score: number) => {
    if (score < 10) return 'text-green-500 bg-green-50 border-green-200';
    if (score < 30) return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    if (score < 60) return 'text-orange-500 bg-orange-50 border-orange-200';
    return 'text-red-500 bg-red-50 border-red-200';
  };

  const COLORS = ['#3b82f6', '#f97316', '#10b981', '#6366f1'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg">
                <LinkIcon className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900">Backlink Analytics</h1>
        </div>
        <p className="text-slate-500 mb-6">Analyze your link profile, track spam scores, and check referring domains. (1 Search)</p>
        
        <form onSubmit={handleAnalyze} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="Enter domain (e.g. example.com)"
            className="flex-1 pl-4 pr-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-base"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center min-w-[120px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Links'}
          </button>
        </form>
      </div>

      {(loading || data) && (
        <div className={`space-y-6 transition-opacity duration-300 ${loading && data ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Top Metrics */}
          {loading && !data ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <CardSkeleton />
                 <CardSkeleton />
                 <CardSkeleton />
                 <CardSkeleton />
              </div>
          ) : data && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium mb-2 flex items-center">
                  Authority Score
                  <InfoTooltip content="A proprietary metric used to measure the overall quality and SEO performance of a website (0-100)." />
                </h3>
                <div className="text-3xl font-bold text-slate-900">{data.domainAuthority}</div>
                <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full" style={{ width: `${data.domainAuthority}%` }}></div>
                </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium mb-2 flex items-center">
                  Total Backlinks
                  <InfoTooltip content="The total number of incoming hyperlinks to this domain." />
                </h3>
                <div className="text-3xl font-bold text-slate-900">{data.totalBacklinks.toLocaleString()}</div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-slate-500 text-sm font-medium mb-2 flex items-center">
                  Referring Domains
                  <InfoTooltip content="The number of unique domains linking to this website." />
                </h3>
                <div className="text-3xl font-bold text-slate-900">{data.referringDomains.toLocaleString()}</div>
            </div>
            <div className={`p-6 rounded-xl shadow-sm border ${getSpamScoreColor(data.spamScore)}`}>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm opacity-80 flex items-center">
                      Spam Score
                      <InfoTooltip content="Represents the percentage of sites with similar features to sites that Google has penalized or banned." />
                    </h3>
                    <AlertOctagon className="w-5 h-5 opacity-80" />
                </div>
                <div className="text-3xl font-bold">{data.spamScore}%</div>
                <p className="text-xs opacity-70 mt-2">Moz-simulated metric</p>
            </div>
          </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* New vs Lost Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center">
                  New vs Lost Backlinks
                  <InfoTooltip content="The history of acquired and lost backlinks over the last 6 months." />
                </h3>
                <div className="h-[300px]">
                    {loading && !data ? <Skeleton className="w-full h-full" /> : data && (
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data.newLost}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Bar dataKey="new" name="New" fill="#22c55e" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="lost" name="Lost" fill="#ef4444" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Anchor Text Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col min-h-[300px]">
                <h3 className="font-bold text-slate-900 mb-2 flex items-center">
                  Top Anchor Text
                  <InfoTooltip content="The visible, clickable text in a hyperlink. Helps search engines understand what the destination page is about." />
                </h3>
                <div className="flex-1 flex items-center justify-center">
                    {loading && !data ? <div className="w-full flex gap-4"><Skeleton className="w-1/2 h-48 rounded-full" /><div className="w-1/2 space-y-2"><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-full"/></div></div> : data && (
                    <div className="h-[250px] w-full flex flex-col sm:flex-row items-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.topAnchors}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="percent"
                                >
                                    {data.topAnchors.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="w-full sm:w-1/2 space-y-3 mt-4 sm:mt-0">
                            {data.topAnchors.map((item, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <div className="flex items-center">
                                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                        <span className="text-slate-600 truncate max-w-[100px]">{item.anchor}</span>
                                    </div>
                                    <span className="font-semibold text-slate-900">{item.percent}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    )}
                </div>
            </div>
          </div>

          {/* Attributes List */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="font-bold text-slate-900 mb-4 flex items-center">
                Backlink Attributes
                <InfoTooltip content="Breakdown of backlinks by type (e.g., text, image, form)." />
             </h3>
             <div className="flex flex-col sm:flex-row gap-4">
                {loading && !data ? <Skeleton className="h-20 w-full" /> : data && data.backlinkTypes.map((type, i) => (
                    <div key={i} className="flex-1 bg-slate-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-slate-700">{type.count}</div>
                        <div className="text-xs text-slate-500 uppercase font-semibold mt-1">{type.type}</div>
                    </div>
                ))}
             </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default BacklinkAnalysisView;
