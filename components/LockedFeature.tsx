
import React from 'react';
import { Lock, ArrowRight, CheckCircle } from 'lucide-react';

interface Props {
  onSignup: () => void;
  onLogin: () => void;
  featureName?: string;
}

export const LockedFeature: React.FC<Props> = ({ onSignup, onLogin, featureName = "this tool" }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-300">
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100 max-w-2xl w-full relative overflow-hidden">
        
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="w-20 h-20 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10">
          <Lock className="w-10 h-10 text-slate-400" />
        </div>
        
        <h2 className="text-3xl font-black text-slate-900 mb-4 relative z-10">
          Unlock {featureName}
        </h2>
        
        <p className="text-lg text-slate-500 mb-8 max-w-lg mx-auto relative z-10">
          Create a free account to access this tool and start optimizing your website today.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left max-w-md mx-auto relative z-10">
           <div className="flex items-center gap-3 text-slate-600 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" /> Free Keyword Research
           </div>
           <div className="flex items-center gap-3 text-slate-600 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" /> Domain Analysis
           </div>
           <div className="flex items-center gap-3 text-slate-600 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" /> Technical Audits
           </div>
           <div className="flex items-center gap-3 text-slate-600 text-sm">
              <CheckCircle className="w-5 h-5 text-green-500" /> AI Content Tools
           </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button 
            onClick={onSignup}
            className="px-8 py-3.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-base shadow-lg shadow-orange-600/20 transition-all transform hover:scale-105 flex items-center justify-center"
          >
            Sign Up Free
            <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          <button 
            onClick={onLogin}
            className="px-8 py-3.5 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 rounded-xl font-bold text-base transition-all"
          >
            Log In
          </button>
        </div>
        
        <p className="mt-6 text-xs text-slate-400 relative z-10">
           No credit card required for free plan.
        </p>
      </div>
    </div>
  );
};
