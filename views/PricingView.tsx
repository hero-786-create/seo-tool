
import React from 'react';
import { Check, HelpCircle } from 'lucide-react';
import { ViewState } from '../types';

interface Props {
  onChangeView: (view: ViewState) => void;
}

const PricingView: React.FC<Props> = ({ onChangeView }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-16 pb-12">
      <div className="text-center pt-8">
        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">Choose a Plan That Fits Your Growth</h1>
        <p className="text-slate-500 text-lg">Simple pricing, no hidden fees.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Free Plan</h3>
            <p className="text-slate-500 text-sm mt-1">For beginners learning SEO</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-slate-900">$0</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {['Limited daily searches', 'Basic domain overview', 'Limited AI credits', '5 keyword list saves', 'Rank tracking for 5 keywords'].map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
          <button 
             onClick={() => onChangeView(ViewState.DASHBOARD)}
             className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-bold transition-colors"
          >
             Start Free
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-orange-500 text-white px-3 py-1 rounded-b-lg text-xs font-bold uppercase tracking-wider">
            Most Popular
          </div>
          <div className="mb-6 mt-2">
            <h3 className="text-xl font-bold text-white">Pro Plan</h3>
            <p className="text-slate-400 text-sm mt-1">For serious creators and small businesses</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-white">$29</span>
            <span className="text-slate-400">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {['Unlimited keyword searches', 'Full Keyword Magic Tool', 'Full Domain + Competitor Analysis', 'Full Site Audit Reports', 'Full AI Assistant Access', '500 tracked keywords', 'Backlink Analytics', 'Priority Email Support'].map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                <Check className="w-5 h-5 text-orange-500 flex-shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
          <button 
             className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold transition-colors shadow-lg shadow-orange-600/20"
          >
             Get Pro
          </button>
        </div>

        {/* Business Plan */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">Business Plan</h3>
            <p className="text-slate-500 text-sm mt-1">For agencies and large teams</p>
          </div>
          <div className="mb-6">
            <span className="text-4xl font-black text-slate-900">$99</span>
            <span className="text-slate-500">/mo</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            {['Everything in Pro', 'Team Accounts', 'Bulk Keyword Tools', 'API Access', 'White-label Reporting', 'Unlimited Tracked Keywords', 'Fastest Support'].map((feat, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-700">
                <Check className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                {feat}
              </li>
            ))}
          </ul>
          <button 
             className="w-full py-3 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 rounded-xl font-bold transition-colors"
          >
             Choose Business
          </button>
        </div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-xl border border-slate-100">
             <h4 className="font-bold text-slate-900 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-slate-400"/> Can I cancel anytime?</h4>
             <p className="text-slate-600 mt-2 text-sm ml-6">Yes. No contract. You can cancel your subscription from your dashboard at any time.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100">
             <h4 className="font-bold text-slate-900 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-slate-400"/> Do you offer refunds?</h4>
             <p className="text-slate-600 mt-2 text-sm ml-6">Yes, within the first 7 days. If you are not satisfied, just email us.</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-100">
             <h4 className="font-bold text-slate-900 flex items-center gap-2"><HelpCircle className="w-4 h-4 text-slate-400"/> Does the Free plan stay free?</h4>
             <p className="text-slate-600 mt-2 text-sm ml-6">Yes. The free plan is free forever, with limited daily credits.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingView;
