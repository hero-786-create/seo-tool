
import React from 'react';
import { Info, Zap, Heart, Users, Target, ShieldCheck } from 'lucide-react';

const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 text-center">
        <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
           <Info className="w-8 h-8 text-orange-600" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">About Genie Metrics</h1>
        <p className="text-xl text-slate-600 leading-relaxed mb-10 max-w-2xl mx-auto">
          We are democratizing SEO. Our mission is to provide <strong>enterprise-level marketing data</strong> to creators, startups, and small businesses for free.
        </p>

        <div className="text-left prose prose-slate max-w-none mb-12">
            <h2 className="text-center font-bold text-2xl text-slate-900 mb-6">Our Story</h2>
            <p className="text-center text-slate-600">
                SEO has traditionally been expensive. Tools like Semrush, Ahrefs, and Moz charge hundreds of dollars a month, pricing out the people who need SEO the most: new bloggers, small business owners, and indie hackers. 
                <br/><br/>
                <strong>Genie Metrics was built to change that.</strong> By leveraging the power of Google's Gemini AI, we can process vast amounts of search data and deliver actionable insights at a fraction of the cost—passing those savings on to you.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left mt-8">
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Target className="w-8 h-8 text-orange-500 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Precision Data</h3>
                <p className="text-sm text-slate-500">We don't guess. We use real-time search APIs and AI analysis to give you the most accurate keyword volumes and difficulty scores.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <ShieldCheck className="w-8 h-8 text-indigo-500 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Privacy First</h3>
                <p className="text-sm text-slate-500">Your data is yours. We do not sell your project data or search history to third parties. Security is our top priority.</p>
            </div>
            <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                <Users className="w-8 h-8 text-blue-500 mb-4" />
                <h3 className="font-bold text-slate-900 mb-2">Community Driven</h3>
                <p className="text-sm text-slate-500">We build what you ask for. Our roadmap is defined by our user community of 10,000+ marketers.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
