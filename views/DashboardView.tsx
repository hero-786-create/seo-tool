
import React, { useState, useEffect } from 'react';
import { ViewState, Notification, User, SerpVolatility } from '../types';
import { GeminiService } from '../services/geminiService';
import { 
  ArrowUpRight, ArrowDownRight, TrendingUp, Users, Globe, Search, FileText, 
  Bell, MoreHorizontal, Activity, Crown, Lock, Zap, Gift, Copy, Check, CloudLightning
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { InfoTooltip } from '../components/InfoTooltip';

interface Props {
  onChangeView: (view: ViewState) => void;
  user: User;
  onUpgrade: () => void;
}

const data = [
  { name: 'Jan', uv: 4000 },
  { name: 'Feb', uv: 3000 },
  { name: 'Mar', uv: 5000 },
  { name: 'Apr', uv: 4780 },
  { name: 'May', uv: 5890 },
  { name: 'Jun', uv: 6390 },
  { name: 'Jul', uv: 8490 },
];

const NOTIFICATIONS: Notification[] = [
    { id: '1', type: 'alert', message: 'Competitor adidas.com gained 3 new featured snippets.', time: '2h ago' },
    { id: '2', type: 'success', message: 'Site Audit complete: Health score improved by 5%.', time: '5h ago' },
];

const StatCard = ({ title, value, trend, isPositive, icon: Icon, tooltip }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] border border-slate-100 hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-300 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
       <Icon className="w-24 h-24 text-slate-900" />
    </div>
    <div className="flex items-center justify-between mb-4 relative z-10">
      <div className="p-2.5 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-100/50">
        <Icon className="w-5 h-5 text-orange-600" />
      </div>
      <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {trend}
      </span>
    </div>
    <div className="relative z-10">
      <div className="flex items-center mb-1">
         <h3 className="text-slate-500 text-sm font-medium tracking-wide">{title}</h3>
         {tooltip && <InfoTooltip content={tooltip} />}
      </div>
      <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
    </div>
  </div>
);

const VolatilityWidget = () => {
    const [volatility, setVolatility] = useState<SerpVolatility | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        GeminiService.getSerpVolatility().then(data => {
            setVolatility(data);
            setLoading(false);
        });
    }, []);

    const getColor = (s: string) => {
        if(s === 'Very High') return 'text-red-500 bg-red-50 border-red-200';
        if(s === 'High') return 'text-orange-500 bg-orange-50 border-orange-200';
        return 'text-green-500 bg-green-50 border-green-200';
    };

    if(loading || !volatility) return <div className="h-full bg-slate-50 animate-pulse rounded-2xl"></div>;

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between h-full">
            <div className="flex justify-between items-start">
                <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <CloudLightning className="w-4 h-4 text-blue-500" /> SERP Volatility
                </h3>
                <InfoTooltip content="Measures daily fluctuations in Google search results. High volatility suggests an algorithm update." />
            </div>
            <div className="mt-4 flex items-center justify-between">
                <div className={`px-4 py-2 rounded-xl border ${getColor(volatility.status)}`}>
                    <span className="block text-2xl font-black">{volatility.score}/10</span>
                    <span className="text-xs font-bold uppercase tracking-wider">{volatility.status}</span>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400">Updated: Today</p>
                </div>
            </div>
        </div>
    );
};

const ReferralWidget = ({ user }: { user: User }) => {
    const [copied, setCopied] = useState(false);
    const code = user.referralCode || "GENIE2024";

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl pointer-events-none"></div>
            <div className="flex items-start justify-between relative z-10">
                <div>
                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2"><Gift className="w-5 h-5" /> Invite & Earn</h3>
                    <p className="text-indigo-100 text-sm mb-4">Get 50 free AI credits for every friend you invite.</p>
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-1 rounded-lg flex items-center border border-white/20">
                <code className="flex-1 text-center font-mono font-bold tracking-widest text-sm">{code}</code>
                <button onClick={copyCode} className="p-2 hover:bg-white/20 rounded-md transition-colors">
                    {copied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
        </div>
    );
};

const DashboardView: React.FC<Props> = ({ onChangeView, user, onUpgrade }) => {
  const isFree = user.plan === 'Free';
  const displayData = isFree ? data.slice(-3) : data;
  const usedSearches = isFree ? (5 - user.searchesLeft) : 0;
  const usedCredits = isFree ? (50 - user.aiCreditsLeft) : 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             Dashboard
             <span className={`text-xs px-2.5 py-1 rounded-full border uppercase tracking-wider font-bold ${isFree ? 'bg-slate-100 text-slate-500 border-slate-200' : 'bg-indigo-100 text-indigo-700 border-indigo-200'}`}>
                {user.plan} Plan
             </span>
          </h1>
          <p className="text-slate-500 mt-1 font-medium">Overview for {user.name}</p>
        </div>
        <div className="flex items-center gap-3">
            {isFree && (
                <button 
                  onClick={onUpgrade}
                  className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-500/20 text-sm flex items-center gap-2 animate-pulse"
                >
                  <Crown className="w-4 h-4" />
                  Upgrade
                </button>
            )}
            <button 
              onClick={() => onChangeView(ViewState.DOMAIN_OVERVIEW)}
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-slate-900/20 text-sm flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Analyze Domain
            </button>
        </div>
      </div>

      {isFree && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 w-full">
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                      <span className="flex items-center gap-2"><Search className="w-4 h-4 text-orange-500"/> Daily Searches</span>
                      <span className={user.searchesLeft === 0 ? "text-red-500" : ""}>{usedSearches} / 5</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${user.searchesLeft === 0 ? 'bg-red-500' : 'bg-orange-500'}`} style={{ width: `${(usedSearches/5)*100}%` }}></div>
                  </div>
              </div>
              <div className="flex-1 w-full">
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                      <span className="flex items-center gap-2"><Zap className="w-4 h-4 text-blue-500"/> AI Credits</span>
                      <span className={user.aiCreditsLeft === 0 ? "text-red-500" : ""}>{usedCredits} / 50</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${user.aiCreditsLeft === 0 ? 'bg-red-500' : 'bg-blue-500'}`} style={{ width: `${(usedCredits/50)*100}%` }}></div>
                  </div>
              </div>
          </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
        <StatCard title="Organic Traffic" value="128.4K" trend="+12.5%" isPositive={true} icon={Users} tooltip="Estimated monthly visits from organic search." />
        <StatCard title="Keywords Top 3" value="4,291" trend="+5.2%" isPositive={true} icon={TrendingUp} tooltip="Keywords ranking in positions 1-3." />
        <StatCard title="Backlinks" value="892.1K" trend="-2.4%" isPositive={false} icon={Globe} tooltip="Total active backlinks." />
        <div className="md:col-span-3 lg:col-span-1 h-full">
             <VolatilityWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">Traffic Trend <InfoTooltip content="Estimated organic traffic over time." /></h2>
            <div className="flex items-center gap-2"><span className="text-xs font-medium text-slate-500">{isFree ? 'Last 3 months' : 'Last 6 months'}</span></div>
          </div>
          <div className="flex-1 min-h-[300px] w-full relative group">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={displayData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip />
                <Area type="monotone" dataKey="uv" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorUv)" />
              </AreaChart>
            </ResponsiveContainer>
            {isFree && (
                <div className="absolute top-2 right-2 md:bottom-2 md:top-auto md:right-auto md:left-2 z-10 animate-in fade-in zoom-in duration-300">
                    <div className="bg-slate-900/95 text-white text-xs px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 backdrop-blur-md border border-slate-700/50">
                        <Lock className="w-3 h-3 text-orange-400" />
                        <span className="text-slate-300">Limited History.</span>
                        <button onClick={onUpgrade} className="font-bold text-orange-400 hover:text-orange-300 underline">Unlock Full</button>
                    </div>
                </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 flex flex-col gap-6">
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex-1 relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Bell className="w-4 h-4 text-orange-500" /> Updates</h2>
                </div>
                <div className="space-y-4">
                    {NOTIFICATIONS.map(note => (
                        <div key={note.id} className="flex gap-3 items-start p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                            <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${note.type === 'alert' ? 'bg-red-500' : 'bg-green-500'}`} />
                            <div>
                                <p className="text-xs font-medium text-slate-700 leading-snug">{note.message}</p>
                                <span className="text-[10px] text-slate-400 mt-1 block">{note.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
             </div>
             <ReferralWidget user={user} />
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
