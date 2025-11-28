
import React, { useState } from 'react';
import { User, GmbLocation } from '../types';
import { GeminiService } from '../services/geminiService';
import { Store, Loader2, Star, Eye, Phone, Navigation } from 'lucide-react';

interface Props {
  user: User;
  onConsumeSearch: () => boolean;
}

const GmbView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [businessName, setBusinessName] = useState('');
  const [data, setData] = useState<GmbLocation | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFetch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.simulateGmbInsights(businessName);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-teal-50 rounded-lg text-teal-600">
                <Store className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Local Business Manager</h1>
        </div>
        <p className="text-slate-500 mb-6">Manage Google Business Profile insights, reviews, and presence. (1 Search)</p>
        
        <form onSubmit={handleFetch} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Enter Business Name (e.g. 'Joe's Pizza New York')"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-teal-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Fetch Data'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
             {/* Main Stats */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                     <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold uppercase text-xs tracking-wider">
                         <Star className="w-4 h-4 text-yellow-500" /> Rating & Reviews
                     </div>
                     <div className="flex items-end gap-3">
                         <span className="text-4xl font-black text-slate-900">{data.rating.toFixed(1)}</span>
                         <span className="text-slate-500 mb-1">/ 5.0</span>
                     </div>
                     <p className="text-sm text-slate-400 mt-2">{data.reviews} total reviews</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                     <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold uppercase text-xs tracking-wider">
                         <Eye className="w-4 h-4 text-blue-500" /> Search Views
                     </div>
                     <div className="text-4xl font-black text-slate-900">{data.views.toLocaleString()}</div>
                     <p className="text-sm text-green-600 mt-2 font-bold">+12% last 28 days</p>
                 </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                     <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold uppercase text-xs tracking-wider">
                         <Phone className="w-4 h-4 text-green-500" /> Customer Interactions
                     </div>
                     <div className="text-4xl font-black text-slate-900">{data.calls.toLocaleString()}</div>
                     <p className="text-sm text-slate-400 mt-2">Calls & Direction requests</p>
                 </div>
             </div>

             <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
                 <h2 className="font-bold text-slate-900 mb-4">Business Details</h2>
                 <div className="grid grid-cols-2 gap-4 text-sm">
                     <div className="p-4 bg-slate-50 rounded-lg">
                         <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Business Name</span>
                         <span className="font-semibold text-slate-800">{data.name}</span>
                     </div>
                     <div className="p-4 bg-slate-50 rounded-lg">
                         <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Address</span>
                         <span className="font-semibold text-slate-800">{data.address}</span>
                     </div>
                 </div>
                 <div className="mt-4 p-4 bg-teal-50 border border-teal-100 rounded-lg text-teal-800 text-sm font-medium flex items-center gap-2">
                     <Navigation className="w-4 h-4" />
                     Your listing is optimized for local search.
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};

export default GmbView;
