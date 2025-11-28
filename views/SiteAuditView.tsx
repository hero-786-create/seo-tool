
import React, { useState } from 'react';
import { Activity, Loader2, AlertTriangle, CheckCircle, Info, Zap, Wrench, ChevronDown, ChevronUp, Copy, Layout, Globe, Share2, Image as ImageIcon, Server, Link, Lock } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { SiteAuditData, User } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { InfoTooltip } from '../components/InfoTooltip';
import { Skeleton } from '../components/Skeletons';

interface Props {
    user: User;
    onConsumeAICredits: (amount: number) => boolean;
}

type Tab = 'Overview' | 'Indexability' | 'Social Tags' | 'Images' | 'HTTP Headers' | 'Outgoing Links' | 'Web Vitals';

const SiteAuditView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<SiteAuditData | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const [openFixId, setOpenFixId] = useState<number | null>(null);

  const handleAudit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (!onConsumeAICredits(20)) return;

    setLoading(true);
    setData(null);
    const result = await GeminiService.runSiteAudit(url);
    setData(result);
    setLoading(false);
  };

  const getHealthColor = (score: number) => {
    if (score >= 90) return '#22c55e';
    if (score >= 70) return '#eab308';
    return '#ef4444';
  };

  const renderMetricCard = (label: string, value: string | number, subLabel?: string, locked = false) => (
      <div className="flex flex-col border-r border-slate-100 last:border-0 px-6 py-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
              {label} {locked && <Lock className="w-3 h-3 text-slate-300" />}
          </span>
          <span className="text-xl font-black text-slate-900">{value}</span>
          {subLabel && <span className="text-[10px] text-slate-500 font-medium">{subLabel}</span>}
      </div>
  );

  const tabs: {id: Tab, icon: any}[] = [
      { id: 'Overview', icon: Layout },
      { id: 'Indexability', icon: Globe },
      { id: 'Social Tags', icon: Share2 },
      { id: 'Images', icon: ImageIcon },
      { id: 'HTTP Headers', icon: Server },
      { id: 'Outgoing Links', icon: Link },
      { id: 'Web Vitals', icon: Zap }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Header & Search */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-6 h-6 text-emerald-600" />
                    Site Audit
                </h1>
                <p className="text-slate-500 text-sm mt-1">Deep technical analysis including Indexability, Headers, and Core Web Vitals.</p>
            </div>
            <form onSubmit={handleAudit} className="flex gap-2 w-full md:w-auto">
                <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="flex-1 md:w-64 px-4 py-2.5 rounded-lg border border-slate-200 outline-none focus:border-emerald-500 text-sm"
                />
                <button 
                    type="submit"
                    disabled={loading}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-bold text-sm disabled:opacity-70 flex items-center justify-center min-w-[100px]"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Start Audit'}
                </button>
            </form>
        </div>
      </div>

      {/* Main Analysis Area */}
      {(loading || data) && (
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-opacity duration-500 ${loading && data ? 'opacity-60 pointer-events-none' : 'opacity-100'}`}>
            
            {/* Top Metrics Bar (Ahrefs style) */}
            <div className="border-b border-slate-100 bg-slate-50/30 flex overflow-x-auto">
               {loading && !data ? <div className="p-4 w-full"><Skeleton className="h-10 w-full" /></div> : data && (
                   <>
                     <div className="p-4 pr-8 border-r border-slate-100 flex items-center gap-3">
                        <div className="w-12 h-12 relative flex items-center justify-center">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={[{ value: data.healthScore }, { value: 100 - data.healthScore }]} innerRadius={18} outerRadius={24} startAngle={90} endAngle={-270} dataKey="value" stroke="none">
                                        <Cell fill={getHealthColor(data.healthScore)} />
                                        <Cell fill="#e2e8f0" />
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <span className="absolute text-xs font-bold text-slate-900">{data.healthScore}</span>
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-900">Health Score</div>
                            <div className="text-xs text-slate-500">Excellent</div>
                        </div>
                     </div>
                     {renderMetricCard("Domain Rating", data.dr, "Ahrefs metric")}
                     {renderMetricCard("URL Rating", data.ur, "Page strength")}
                     {renderMetricCard("Backlinks", data.backlinks.toLocaleString())}
                     {renderMetricCard("Ref. Domains", data.refDomains.toLocaleString())}
                     {renderMetricCard("Keywords", data.organicKeywords.toLocaleString())}
                     {renderMetricCard("Traffic", data.organicTraffic.toLocaleString(), "Monthly Est.")}
                   </>
               )}
            </div>

            <div className="flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-64 border-r border-slate-100 bg-slate-50/30 p-4">
                    <nav className="space-y-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id ? 'bg-white text-emerald-700 shadow-sm border border-slate-100' : 'text-slate-600 hover:bg-slate-100/50 hover:text-slate-900'}`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-emerald-500' : 'text-slate-400'}`} />
                                {tab.id}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 md:p-8">
                    {loading && !data ? (
                        <div className="space-y-6">
                            <Skeleton className="h-8 w-1/3" />
                            <div className="grid grid-cols-2 gap-4"><Skeleton className="h-32 w-full" /><Skeleton className="h-32 w-full" /></div>
                            <Skeleton className="h-64 w-full" />
                        </div>
                    ) : data && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            
                            {/* OVERVIEW TAB */}
                            {activeTab === 'Overview' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="bg-rose-50 border border-rose-100 p-5 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2 text-rose-700 font-bold text-sm uppercase"><AlertTriangle className="w-4 h-4"/> Errors</div>
                                            <div className="text-3xl font-black text-rose-700">{data.errors}</div>
                                        </div>
                                        <div className="bg-amber-50 border border-amber-100 p-5 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-sm uppercase"><Info className="w-4 h-4"/> Warnings</div>
                                            <div className="text-3xl font-black text-amber-700">{data.warnings}</div>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-100 p-5 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2 text-blue-700 font-bold text-sm uppercase"><CheckCircle className="w-4 h-4"/> Notices</div>
                                            <div className="text-3xl font-black text-blue-700">{data.notices}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Wrench className="w-4 h-4" /> Top Issues</h3>
                                        <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
                                            {data.topIssues.map((issue, idx) => (
                                                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                                                    <div className="flex justify-between items-center cursor-pointer" onClick={() => setOpenFixId(openFixId === idx ? null : idx)}>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${issue.priority === 'High' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                                                            <span className="font-medium text-slate-800">{issue.issue}</span>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{issue.count} pages</span>
                                                            {openFixId === idx ? <ChevronUp className="w-4 h-4 text-slate-400"/> : <ChevronDown className="w-4 h-4 text-slate-400"/>}
                                                        </div>
                                                    </div>
                                                    {openFixId === idx && issue.fixSuggestion && (
                                                        <div className="mt-4 p-4 bg-slate-900 rounded-lg text-slate-300 text-sm font-mono border border-slate-800 relative group">
                                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"><Copy className="w-4 h-4 text-slate-500 hover:text-white cursor-pointer"/></div>
                                                            <p className="text-emerald-400 font-bold mb-1 text-xs uppercase">Fix Suggestion:</p>
                                                            {issue.fixSuggestion}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* INDEXABILITY TAB */}
                            {activeTab === 'Indexability' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900">Robots & Canonicalization</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="p-5 border border-slate-200 rounded-xl">
                                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Canonical URL</div>
                                            <code className="text-sm bg-slate-50 p-2 rounded block break-all text-slate-700">{data.indexability.canonical}</code>
                                        </div>
                                        <div className="p-5 border border-slate-200 rounded-xl">
                                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Meta Robots</div>
                                            <code className="text-sm bg-slate-50 p-2 rounded block text-slate-700">{data.indexability.metaRobots}</code>
                                        </div>
                                        <div className="p-5 border border-slate-200 rounded-xl">
                                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Robots.txt Status</div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm font-medium text-slate-900">Found</span>
                                            </div>
                                            <code className="text-xs text-slate-500 mt-2 block">{data.indexability.robotsTxt}</code>
                                        </div>
                                        <div className="p-5 border border-slate-200 rounded-xl">
                                            <div className="text-xs font-bold text-slate-400 uppercase mb-2">Sitemap.xml</div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-green-500" />
                                                <span className="text-sm font-medium text-slate-900">Found</span>
                                            </div>
                                            <code className="text-xs text-slate-500 mt-2 block">{data.indexability.sitemap}</code>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* SOCIAL TAGS TAB */}
                            {activeTab === 'Social Tags' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-4">Open Graph (Facebook/LinkedIn)</h3>
                                            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm max-w-sm">
                                                {data.socialTags.ogImage ? (
                                                    <img src={data.socialTags.ogImage} alt="OG Preview" className="w-full h-48 object-cover bg-slate-100" />
                                                ) : (
                                                    <div className="w-full h-48 bg-slate-100 flex items-center justify-center text-slate-400"><ImageIcon className="w-8 h-8"/></div>
                                                )}
                                                <div className="p-4 bg-slate-50 border-t border-slate-100">
                                                    <div className="text-xs text-slate-500 uppercase mb-1">{new URL(url).hostname}</div>
                                                    <div className="font-bold text-slate-900 leading-tight mb-2">{data.socialTags.ogTitle}</div>
                                                    <div className="text-xs text-slate-500">Auto-generated preview based on og:tags found on page.</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 mb-4">Schema Markup Detected</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {data.socialTags.schemaTypes.map((t, i) => (
                                                    <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-bold border border-blue-100 flex items-center gap-2">
                                                        <Layout className="w-3 h-3" /> {t}
                                                    </span>
                                                ))}
                                                {data.socialTags.schemaTypes.length === 0 && <span className="text-slate-500 italic">No schema detected</span>}
                                            </div>
                                            <div className="mt-8">
                                                <h3 className="font-bold text-slate-900 mb-2">Twitter Card</h3>
                                                <code className="block bg-slate-50 p-3 rounded-lg text-sm text-slate-700">{data.socialTags.twitterCard}</code>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* HTTP HEADERS TAB */}
                            {activeTab === 'HTTP Headers' && (
                                <div className="space-y-6">
                                    <h3 className="text-lg font-bold text-slate-900">Response Headers</h3>
                                    <div className="bg-slate-900 rounded-xl p-6 text-emerald-400 font-mono text-sm shadow-inner">
                                        <div className="flex gap-4">
                                            <span className="w-32 text-slate-400">Status</span>
                                            <span>{data.httpHeaders.statusCode} OK</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="w-32 text-slate-400">content-type</span>
                                            <span>{data.httpHeaders.contentType}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="w-32 text-slate-400">server</span>
                                            <span>{data.httpHeaders.server}</span>
                                        </div>
                                        <div className="flex gap-4">
                                            <span className="w-32 text-slate-400">x-frame-options</span>
                                            <span>{data.httpHeaders.xFrameOptions}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* IMAGES TAB */}
                            {activeTab === 'Images' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-slate-50 rounded-xl border border-slate-100 text-center">
                                        <div className="text-3xl font-black text-slate-900 mb-1">{data.images.total}</div>
                                        <div className="text-sm text-slate-500 font-medium uppercase">Total Images</div>
                                    </div>
                                    <div className="p-6 bg-rose-50 rounded-xl border border-rose-100 text-center">
                                        <div className="text-3xl font-black text-rose-600 mb-1">{data.images.missingAlt}</div>
                                        <div className="text-sm text-rose-800 font-medium uppercase">Missing Alt Text</div>
                                    </div>
                                    <div className="p-6 bg-amber-50 rounded-xl border border-amber-100 text-center">
                                        <div className="text-3xl font-black text-amber-600 mb-1">{data.images.largeFiles}</div>
                                        <div className="text-sm text-amber-800 font-medium uppercase">Large Files (&gt;100kb)</div>
                                    </div>
                                </div>
                            )}

                            {/* OUTGOING LINKS TAB */}
                            {activeTab === 'Outgoing Links' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="p-6 bg-white border border-slate-200 rounded-xl">
                                        <h4 className="font-bold text-slate-900 mb-2">Internal Links</h4>
                                        <div className="text-2xl font-bold text-slate-700">{data.outgoingLinks.internal}</div>
                                    </div>
                                    <div className="p-6 bg-white border border-slate-200 rounded-xl">
                                        <h4 className="font-bold text-slate-900 mb-2">External Links</h4>
                                        <div className="text-2xl font-bold text-slate-700">{data.outgoingLinks.external}</div>
                                    </div>
                                    <div className="p-6 bg-white border border-slate-200 rounded-xl">
                                        <h4 className="font-bold text-slate-900 mb-2">Broken Links</h4>
                                        <div className={`text-2xl font-bold ${data.outgoingLinks.broken > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                            {data.outgoingLinks.broken}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* WEB VITALS TAB */}
                            {activeTab === 'Web Vitals' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                    {data.coreWebVitals.map((cwv, idx) => {
                                        const statusColors = cwv.status === 'Good' ? 'text-emerald-700 bg-emerald-50 border-emerald-100' : 
                                            cwv.status === 'Poor' ? 'text-rose-700 bg-rose-50 border-rose-100' : 'text-amber-700 bg-amber-50 border-amber-100';
                                        
                                        return (
                                            <div key={idx} className={`p-6 rounded-2xl border ${statusColors}`}>
                                                <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-4">{cwv.metric}</div>
                                                <div className="text-3xl font-black mb-1">{cwv.value}</div>
                                                <div className="text-xs font-bold opacity-80">{cwv.status}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default SiteAuditView;
