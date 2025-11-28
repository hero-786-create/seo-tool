
import React from 'react';
import { ViewState } from '../types';
import { 
  Globe, Search, BarChart, Link as LinkIcon, 
  FileText, MapPin, Activity, MessageSquare, ArrowRight, Zap, ShieldCheck, Users, LineChart
} from 'lucide-react';

interface Props {
  onChangeView: (view: ViewState) => void;
}

const FeatureCard = ({ icon: Icon, title, desc, onClick }: any) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-orange-200 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
  >
    <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-orange-50 transition-colors">
      <Icon className="w-6 h-6 text-slate-700 group-hover:text-orange-600 transition-colors" />
    </div>
    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-700">{title}</h3>
    <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

const HomeView: React.FC<Props> = ({ onChangeView }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-20 pb-12">
      
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />
        
        <div className="flex items-center justify-center gap-2 mb-6">
           <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 border border-indigo-100">
              <Zap className="w-4 h-4 fill-indigo-500 text-indigo-500" /> Professional SEO Platform
           </span>
        </div>

        <h1 className="text-4xl md:text-7xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
          Data-Driven Decisions for <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-indigo-600">Smarter SEO Growth</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto mb-10 leading-relaxed font-medium">
          Genie Metrics gives you the professional tools you need to analyze competitors, research keywords, and optimize content. No guesswork, just actionable data powered by AI.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={() => onChangeView(ViewState.DASHBOARD)}
            className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/20 transition-all transform hover:scale-105 flex items-center"
          >
            Start Analyzing
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button 
            onClick={() => onChangeView(ViewState.PRICING)}
            className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-bold text-lg shadow-sm transition-all"
          >
            View Plans
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div className="text-center mb-12">
           <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Comprehensive SEO Suite</h2>
           <p className="text-slate-500 mt-3 text-lg">Everything you need to improve your search visibility.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          <FeatureCard 
            icon={Globe} 
            title="Competitor Analysis" 
            desc="Estimate organic traffic and authority scores for any domain. Understand who you are competing against." 
            onClick={() => onChangeView(ViewState.DOMAIN_OVERVIEW)}
          />
          <FeatureCard 
            icon={Search} 
            title="Keyword Research" 
            desc="Discover high-potential keywords with volume estimates and difficulty scores to guide your content strategy." 
            onClick={() => onChangeView(ViewState.KEYWORD_MAGIC)}
          />
          <FeatureCard 
            icon={Activity} 
            title="Technical Site Audit" 
            desc="Identify potential technical issues that could be holding your site back, with AI-suggested fixes." 
            onClick={() => onChangeView(ViewState.SITE_AUDIT)}
          />
          <FeatureCard 
            icon={FileText} 
            title="Content Optimization" 
            desc="Score your content for SEO friendliness and readability using our advanced NLP algorithms." 
            onClick={() => onChangeView(ViewState.CONTENT_AUDIT)}
          />
          <FeatureCard 
            icon={LinkIcon} 
            title="Backlink Analyzer" 
            desc="Review backlink profiles to understand authority signals and identify link-building opportunities." 
            onClick={() => onChangeView(ViewState.BACKLINK_ANALYSIS)}
          />
          <FeatureCard 
            icon={MapPin} 
            title="Local SEO" 
            desc="Research local business listings and find citation opportunities in your specific geographic area." 
            onClick={() => onChangeView(ViewState.LOCAL_SEO)}
          />
          <FeatureCard 
            icon={LineChart} 
            title="SERP Tracking" 
            desc="Monitor keyword positions over time to track the effectiveness of your SEO campaigns." 
            onClick={() => onChangeView(ViewState.RANK_TRACKER)}
          />
          <FeatureCard 
            icon={MessageSquare} 
            title="AI Consultant" 
            desc="Get instant answers to complex SEO strategy questions powered by the Gemini Pro model." 
            onClick={() => onChangeView(ViewState.AI_CHAT)}
          />
        </div>
      </section>

      {/* Trust & Methodology */}
      <section className="bg-slate-900 py-20 px-6 rounded-3xl mx-4 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Transparent & Accurate Data</h2>
          <p className="text-lg text-slate-300 max-w-3xl mb-10 leading-relaxed">
             We believe in transparency. Genie Metrics uses advanced LLMs and real-time data sources to provide estimates you can trust. We clearly label estimates vs. verified data so you can make informed decisions.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl w-full">
             <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                <div className="font-bold text-xl mb-3 text-orange-400 flex items-center gap-2">
                    <Zap className="w-5 h-5" /> Fast Insights
                </div>
                <p className="text-slate-300">Our modern architecture ensures you get the data you need without long loading times.</p>
             </div>
             <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                <div className="font-bold text-xl mb-3 text-orange-400 flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5" /> Reliable Estimates
                </div>
                <p className="text-slate-300">We use sophisticated modeling to estimate traffic and difficulty scores, giving you a realistic view of the landscape.</p>
             </div>
             <div className="p-6 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
                <div className="font-bold text-xl mb-3 text-orange-400 flex items-center gap-2">
                    <Users className="w-5 h-5" /> Marketer Focused
                </div>
                <p className="text-slate-300">Built by SEOs for SEOs. We focus on the metrics that actually move the needle for your business.</p>
             </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-slate-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
           <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Is Genie Metrics accurate?</h3>
              <p className="text-slate-600">We strive for high accuracy by using Google's Gemini AI to process and analyze data. However, like all third-party SEO tools, our metrics for traffic and difficulty are estimations based on available data points.</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-2">Can I use it for free?</h3>
              <p className="text-slate-600">Yes, our Free plan allows you to test the platform with limited daily credits. It's perfect for freelancers or small site owners getting started.</p>
           </div>
           <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <h3 className="font-bold text-lg text-slate-900 mb-2">What data sources do you use?</h3>
              <p className="text-slate-600">We combine real-time search engine result page (SERP) analysis with advanced AI modeling to generate keywords, audit sites, and estimate traffic.</p>
           </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-16">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to improve your rankings?</h2>
        <button 
           onClick={() => onChangeView(ViewState.SIGNUP)}
           className="px-10 py-5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg shadow-xl shadow-orange-600/20 transition-all"
        >
           Create Free Account
        </button>
        <p className="mt-4 text-sm text-slate-500">Instant Access • No Credit Card Required</p>
      </section>

    </div>
  );
};

export default HomeView;
