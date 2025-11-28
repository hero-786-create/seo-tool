
import React from 'react';
import { ViewState } from '../types';
import { Map, ArrowRight, LayoutDashboard, Search, Globe, FileText, Link as LinkIcon, Activity, BarChart, TrendingUp, MapPin, MessageSquare, Code } from 'lucide-react';

interface Props {
  onChangeView: (view: ViewState) => void;
}

const SitemapView: React.FC<Props> = ({ onChangeView }) => {
  const sections = [
    {
      title: "Core Platform",
      links: [
        { label: "Dashboard", view: ViewState.DASHBOARD, icon: LayoutDashboard, desc: "Main project overview and stats" },
        { label: "AI Assistant", view: ViewState.AI_CHAT, icon: MessageSquare, desc: "Chat with Gemini Pro for SEO advice" }
      ]
    },
    {
      title: "Competitive Research",
      links: [
        { label: "Domain Overview", view: ViewState.DOMAIN_OVERVIEW, icon: Globe, desc: "Analyze any website's traffic" },
        { label: "Keyword Magic", view: ViewState.KEYWORD_MAGIC, icon: Search, desc: "Find profitable keywords" },
        { label: "Market Insights", view: ViewState.MARKET_INSIGHTS, icon: TrendingUp, desc: "Real-time search trends" }
      ]
    },
    {
      title: "Link Building & Local",
      links: [
        { label: "Backlink Analytics", view: ViewState.BACKLINK_ANALYSIS, icon: LinkIcon, desc: "Check backlinks and spam score" },
        { label: "Local SEO", view: ViewState.LOCAL_SEO, icon: MapPin, desc: "Google Maps grounding tool" }
      ]
    },
    {
      title: "On-Page & Technical",
      links: [
        { label: "Site Audit", view: ViewState.SITE_AUDIT, icon: Activity, desc: "Technical health check" },
        { label: "Content Optimizer", view: ViewState.CONTENT_AUDIT, icon: FileText, desc: "Improve content readability" },
        { label: "Rank Tracker", view: ViewState.RANK_TRACKER, icon: BarChart, desc: "Track keyword positions" },
        { label: "Schema Generator", view: ViewState.SCHEMA_GENERATOR, icon: Code, desc: "Create JSON-LD markup" }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-slate-100 rounded-lg">
            <Map className="w-6 h-6 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Website Sitemap</h1>
        </div>
        <p className="text-slate-500">Overview of all tools and pages available in SeoGenie.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">{section.title}</h3>
            <div className="space-y-3">
              {section.links.map((link, linkIdx) => {
                 const Icon = link.icon;
                 return (
                  <button 
                    key={linkIdx}
                    onClick={() => onChangeView(link.view)}
                    className="w-full group flex items-start p-3 bg-white border border-slate-100 rounded-xl hover:border-orange-200 hover:shadow-md transition-all text-left"
                  >
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors mr-3">
                      <Icon className="w-5 h-5 text-slate-500 group-hover:text-orange-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900 group-hover:text-orange-700">{link.label}</div>
                      <div className="text-xs text-slate-500 mt-1">{link.desc}</div>
                    </div>
                  </button>
                 );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SitemapView;
