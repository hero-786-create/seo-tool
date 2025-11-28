
import React, { useState } from 'react';
import { User, KeywordVisualResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { Network, Loader2, HelpCircle, ArrowRight, Share2, Layers } from 'lucide-react';

interface Props {
  user: User;
  onConsumeSearch: () => boolean;
}

const KeywordVisualizationView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<KeywordVisualResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'Questions' | 'Prepositions' | 'Comparisons'>('Questions');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim()) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.generateKeywordVisuals(keyword);
    setData(result);
    setLoading(false);
  };

  const renderList = (items: string[], colorClass: string) => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border ${colorClass} bg-opacity-10 shadow-sm hover:scale-105 transition-transform cursor-default`}>
                  <p className="text-sm font-medium text-slate-800">{item}</p>
              </div>
          ))}
      </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Network className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Keyword Visualization</h1>
        </div>
        <p className="text-slate-500 mb-6">Visualizes search questions, prepositions, and comparisons for better content ideas. (1 Search)</p>
        
        <form onSubmit={handleSearch} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter a broad topic (e.g. 'Bitcoin')"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-200"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-amber-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Visualize'}
          </button>
        </form>
      </div>

      {data && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
           {/* Tab Navigation */}
           <div className="flex gap-2 border-b border-slate-200 pb-1">
               {['Questions', 'Prepositions', 'Comparisons'].map(tab => (
                   <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`px-6 py-2 font-bold text-sm rounded-t-lg transition-colors ${activeTab === tab ? 'bg-amber-50 text-amber-700 border-b-2 border-amber-500' : 'text-slate-500 hover:bg-slate-50'}`}
                   >
                       {tab}
                   </button>
               ))}
           </div>

           {/* Content Area */}
           <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 min-h-[400px]">
               <div className="mb-6 flex items-center justify-between">
                   <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                       {activeTab === 'Questions' && <HelpCircle className="w-5 h-5 text-amber-500" />}
                       {activeTab === 'Prepositions' && <Layers className="w-5 h-5 text-green-500" />}
                       {activeTab === 'Comparisons' && <Share2 className="w-5 h-5 text-blue-500" />}
                       {activeTab} for "{keyword}"
                   </h2>
                   <div className="text-sm text-slate-400 font-medium">
                       {data[activeTab.toLowerCase() as keyof KeywordVisualResult]?.length || 0} results
                   </div>
               </div>

               {activeTab === 'Questions' && renderList(data.questions, 'border-amber-200 bg-amber-50')}
               {activeTab === 'Prepositions' && renderList(data.prepositions, 'border-green-200 bg-green-50')}
               {activeTab === 'Comparisons' && renderList(data.comparisons, 'border-blue-200 bg-blue-50')}
           </div>
        </div>
      )}
    </div>
  );
};

export default KeywordVisualizationView;
