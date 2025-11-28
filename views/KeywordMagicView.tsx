
import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, Loader2, Filter, Layers, Tag, Flame, Gem, FolderPlus, Folder, Plus, Trash2, ListPlus, X, Check, Eye
} from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { KeywordData, User } from '../types';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { TableSkeleton } from '../components/Skeletons';
import { InfoTooltip } from '../components/InfoTooltip';

const POPULAR_KEYWORDS = ["seo tools", "seo audit", "search engine optimization", "digital marketing", "backlinks"];
const INTENTS = ['Informational', 'Commercial', 'Transactional', 'Navigational'];

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const MiniTrend = ({ data }: { data: number[] }) => {
  if (!data || data.length === 0) return <div className="h-8 w-20 bg-slate-50 rounded" />;
  const isPositive = data[data.length - 1] >= data[0];
  return (
    <div className="h-8 w-24">
       <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.map((val, i) => ({ i, val }))}>
            <Area type="monotone" dataKey="val" stroke={isPositive ? "#22c55e" : "#ef4444"} fill={isPositive ? "#dcfce7" : "#fee2e2"} fillOpacity={0.4} strokeWidth={2} isAnimationActive={false} />
          </AreaChart>
       </ResponsiveContainer>
    </div>
  );
};

const KeywordMagicView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [seed, setSeed] = useState('');
  const [results, setResults] = useState<KeywordData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Features
  const [heatmapMode, setHeatmapMode] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<string | null>(null);
  const [groupingMode, setGroupingMode] = useState<'topic' | 'intent'>('topic');

  // Manual Grouping
  const [customGroups, setCustomGroups] = useState<Record<string, Set<string>>>({});
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [showAddToListModal, setShowAddToListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(new Set());
  const [excludedKeywords, setExcludedKeywords] = useState<Set<string>>(new Set());

  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('genie_custom_groups');
    if (saved) setCustomGroups(JSON.parse(saved, (key, value) => key === '' ? value : new Set(value)));
  }, []);

  useEffect(() => {
    localStorage.setItem('genie_custom_groups', JSON.stringify(customGroups, (key, value) => value instanceof Set ? [...value] : value));
  }, [customGroups]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) setShowSuggestions(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seed.trim()) return;
    if (!onConsumeSearch()) return;

    setShowSuggestions(false);
    setLoading(true);
    setHasSearched(true);
    setResults(await GeminiService.generateKeywords(seed));
    setLoading(false);
  };

  const getDifficultyBadge = (kd: number) => {
    let color = 'bg-slate-100 text-slate-700';
    if (kd < 30) color = 'bg-green-100 text-green-700';
    else if (kd < 50) color = 'bg-yellow-100 text-yellow-700';
    else if (kd < 70) color = 'bg-orange-100 text-orange-700';
    else color = 'bg-red-100 text-red-700';
    
    return (
        <div className="flex items-center gap-2">
            <span className={`inline-flex items-center justify-center w-9 h-6 rounded text-xs font-bold ${color}`}>{kd}</span>
            <div className={`h-2 w-12 rounded-full bg-slate-100 overflow-hidden hidden xl:block`}>
                <div className={`h-full ${color.replace('text-', 'bg-').split(' ')[1]}`} style={{width: `${kd}%`}}></div>
            </div>
        </div>
    );
  };

  const computedGroups = results.reduce((acc, curr) => {
    const key = groupingMode === 'topic' ? curr.topic : curr.intent;
    if (key && !excludedKeywords.has(curr.keyword)) acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedGroups = Object.entries(computedGroups).sort((a, b) => (b[1] as number) - (a[1] as number));

  const filteredResults = results.filter(r => {
    const isExcluded = excludedKeywords.has(r.keyword);
    if (selectedList) return customGroups[selectedList]?.has(r.keyword) && !isExcluded;
    const matchTopic = selectedTopic ? r.topic === selectedTopic : true;
    const matchIntent = selectedIntent ? r.intent === selectedIntent : true;
    return matchTopic && matchIntent && !isExcluded;
  });

  const toggleSelection = (keyword: string) => {
    const newSelection = new Set(selectedKeywords);
    newSelection.has(keyword) ? newSelection.delete(keyword) : newSelection.add(keyword);
    setSelectedKeywords(newSelection);
  };

  const createList = (name: string) => {
      if (!name.trim()) return;
      setCustomGroups(prev => ({ ...prev, [name]: new Set() }));
      setNewListName('');
  };

  const addSelectedToGroup = (groupName: string) => {
      setCustomGroups(prev => {
          const group = new Set(prev[groupName] || []);
          selectedKeywords.forEach(k => group.add(k));
          return { ...prev, [groupName]: group };
      });
      setSelectedKeywords(new Set());
      setShowAddToListModal(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto min-h-[calc(100vh-6rem)] flex flex-col relative pb-20">
      
      {/* Add To List Modal */}
      {showAddToListModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <h3 className="font-bold text-slate-900">Add to List</h3>
                  <button onClick={() => setShowAddToListModal(false)}><X className="w-5 h-5 text-slate-400"/></button>
               </div>
               <div className="p-4">
                  <div className="mb-4 flex gap-2">
                      <input type="text" value={newListName} onChange={(e) => setNewListName(e.target.value)} placeholder="New List Name" className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm outline-none"/>
                      <button onClick={() => { createList(newListName); if(newListName) addSelectedToGroup(newListName); }} disabled={!newListName.trim()} className="bg-orange-600 text-white px-3 py-2 rounded-lg text-sm font-bold">Add</button>
                  </div>
                  <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                      {Object.keys(customGroups).map(group => (
                          <button key={group} onClick={() => addSelectedToGroup(group)} className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm font-medium flex justify-between group">
                              <span className="flex items-center gap-2"><Folder className="w-4 h-4 text-slate-400"/> {group}</span>
                          </button>
                      ))}
                  </div>
               </div>
           </div>
        </div>
      )}

      {/* Bulk Actions Bar */}
      {selectedKeywords.size > 0 && !showAddToListModal && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
              <div className="bg-slate-900 text-white px-2 py-2 rounded-full shadow-2xl flex items-center gap-1 border border-slate-700/50 backdrop-blur-md">
                  <div className="px-4 font-semibold text-sm border-r border-slate-700 mr-1">{selectedKeywords.size} selected</div>
                  <button onClick={() => setShowAddToListModal(true)} className="flex items-center gap-2 px-4 py-2 hover:bg-slate-800 rounded-full transition-colors text-sm font-medium"><ListPlus className="w-4 h-4 text-orange-400" /> Add to List</button>
                  <button onClick={() => setSelectedKeywords(new Set())} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white ml-1"><X className="w-4 h-4" /></button>
              </div>
          </div>
      )}

      {/* Header */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative z-10 flex-none overflow-hidden">
        <h1 className="text-2xl font-bold text-slate-900 mb-2 relative">Keyword Magic Tool</h1>
        <p className="text-slate-500 mb-6 relative">Unlock hidden long-tail gems with Gemini AI. (1 Search)</p>
        
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 relative">
          <div className="relative flex-1" ref={wrapperRef}>
            <Search className="absolute left-4 top-3.5 h-5 w-5 text-slate-400" />
            <input type="text" value={seed} onChange={(e) => { setSeed(e.target.value); if(e.target.value) { setSuggestions(POPULAR_KEYWORDS.filter(k=>k.includes(e.target.value)).slice(0,5)); setShowSuggestions(true); } }} onFocus={() => seed && setShowSuggestions(true)} placeholder="Enter a seed keyword (e.g. 'vegan recipes')" className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition-all text-base shadow-sm"/>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                {suggestions.map((s, i) => <div key={i} onClick={() => { setSeed(s); setShowSuggestions(false); }} className="px-4 py-3 hover:bg-slate-50 cursor-pointer flex items-center gap-3"><Search className="w-4 h-4 text-slate-400"/>{s}</div>)}
              </div>
            )}
          </div>
          <button type="submit" disabled={loading} className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg shadow-orange-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]">{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Find Keywords'}</button>
        </form>
      </div>

      <div className="flex-1 min-h-0 flex flex-col">
        {loading && !hasSearched && <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mt-6"><TableSkeleton rows={8} /></div>}
        {(hasSearched || results.length > 0) && (
        <div className="flex flex-col lg:flex-row gap-6 min-h-0 mt-2">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 flex-none bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col h-fit max-h-[calc(100vh-10rem)] sticky top-6">
             <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center"><h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm"><FolderPlus className="w-4 h-4 text-slate-500" /> My Lists</h3></div>
             <div className="p-2 border-b border-slate-100">
                <div className="flex gap-2 mb-2">
                   <input type="text" placeholder="New List..." className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded outline-none focus:border-orange-400" value={newListName} onChange={(e) => setNewListName(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter') createList(newListName); }}/>
                   <button onClick={() => createList(newListName)} className="p-1.5 bg-slate-100 hover:bg-orange-100 text-slate-600 hover:text-orange-600 rounded transition-colors"><Plus className="w-4 h-4" /></button>
                </div>
                {Object.keys(customGroups).length > 0 ? (
                    <div className="space-y-0.5 max-h-32 overflow-y-auto custom-scrollbar">
                        {Object.keys(customGroups).map(group => (
                            <button key={group} onClick={() => setSelectedList(group)} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${selectedList === group ? 'bg-orange-50 text-orange-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                                <span className="flex items-center gap-2 overflow-hidden"><Folder className="w-3 h-3 shrink-0"/> <span className="truncate">{group}</span></span>
                                <span className="text-xs opacity-70">{customGroups[group].size}</span>
                            </button>
                        ))}
                    </div>
                ) : <div className="text-xs text-slate-400 text-center py-2">No lists created yet</div>}
             </div>

             <div className="p-3 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-2">
                <div className="flex items-center justify-between"><h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm"><Filter className="w-4 h-4 text-slate-500" /> AI Clusters</h3></div>
                <div className="flex bg-slate-200/50 p-1 rounded-lg">
                    <button onClick={() => setGroupingMode('topic')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all ${groupingMode === 'topic' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Layers className="w-3 h-3" /> Topic</button>
                    <button onClick={() => setGroupingMode('intent')} className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold rounded-md transition-all ${groupingMode === 'intent' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}><Tag className="w-3 h-3" /> Intent</button>
                </div>
             </div>
             
             <div className="p-2 overflow-y-auto custom-scrollbar flex-1">
                <button onClick={() => { setSelectedTopic(null); setSelectedIntent(null); setSelectedList(null); }} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium flex justify-between items-center transition-colors ${selectedTopic === null && selectedIntent === null && selectedList === null ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}>
                   <span>All Keywords</span>
                   <span className="text-xs opacity-70 bg-white/50 px-1.5 py-0.5 rounded border border-black/5">{results.length}</span>
                </button>
                <div className="mt-3 space-y-0.5">
                    {sortedGroups.map(([key, count]) => {
                        const isSelected = groupingMode === 'topic' ? selectedTopic === key : selectedIntent === key;
                        return (
                        <button key={key} onClick={() => { setSelectedList(null); groupingMode === 'topic' ? setSelectedTopic(isSelected ? null : key) : setSelectedIntent(isSelected ? null : key); }} className={`w-full text-left px-3 py-2 rounded-lg text-sm flex justify-between items-center transition-colors ${isSelected ? 'bg-orange-50 text-orange-700 font-medium' : 'text-slate-600 hover:bg-slate-50'}`}>
                            <span className="truncate pr-2">{key}</span><span className="text-xs opacity-70">{count}</span>
                        </button>
                    )})}
                </div>
             </div>
          </div>

          <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col min-h-[600px] transition-opacity duration-200 ${loading ? 'opacity-70 pointer-events-none' : 'opacity-100'}`}>
             <div className="p-4 border-b border-slate-100 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                   <div className="flex items-center gap-3">
                      <h2 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                         {selectedList ? <><Folder className="w-5 h-5 text-orange-500"/> {selectedList}</> : selectedTopic ? <><Layers className="w-5 h-5 text-orange-500"/> {selectedTopic}</> : 'All Keywords'}
                      </h2>
                      <span className="bg-slate-100 text-slate-600 text-xs px-2.5 py-1 rounded-full font-bold">{filteredResults.length}</span>
                   </div>
                   <button onClick={() => setHeatmapMode(!heatmapMode)} className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors border ${heatmapMode ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}><Flame className="w-3 h-3" /> Heatmap Mode</button>
                </div>
             </div>
             <div className="overflow-x-auto flex-1 relative custom-scrollbar">
               <table className="w-full text-left min-w-[900px]">
                 <thead className="bg-slate-50/80 backdrop-blur sticky top-0 z-20">
                   <tr className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                     <th className="px-4 py-4 w-10 text-center"><input type="checkbox" onChange={() => { if(selectedKeywords.size === filteredResults.length) setSelectedKeywords(new Set()); else setSelectedKeywords(new Set(filteredResults.map(r=>r.keyword))); }} checked={filteredResults.length > 0 && selectedKeywords.size === filteredResults.length} className="w-4 h-4 rounded text-orange-600 cursor-pointer"/></th>
                     <th className="px-6 py-4">Keyword</th>
                     <th className="px-6 py-4">Intent</th>
                     <th className="px-6 py-4">Volume / Trend</th>
                     <th className="px-6 py-4 flex items-center gap-1">Difficulty <InfoTooltip content="0-100 AI Score" /></th>
                     <th className="px-6 py-4">CPC</th>
                     <th className="px-6 py-4">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredResults.map((item, idx) => (
                     <tr key={idx} className={`transition-colors group ${selectedKeywords.has(item.keyword) ? 'bg-orange-50/50' : 'hover:bg-slate-50/80'}`} style={heatmapMode ? {backgroundColor: `rgba(244, 63, 94, ${Math.min(item.difficulty/100, 1) * 0.3})`} : {}}>
                       <td className="px-4 py-4 text-center"><input type="checkbox" checked={selectedKeywords.has(item.keyword)} onChange={() => toggleSelection(item.keyword)} className="w-4 h-4 rounded text-orange-600 cursor-pointer"/></td>
                       <td className="px-6 py-4"><div className="flex items-center gap-2"><span className={`font-medium ${selectedKeywords.has(item.keyword) ? 'text-orange-700' : 'text-slate-900'}`}>{item.keyword}</span>{item.isLongTail && <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200"><Gem className="w-3 h-3 mr-1" /> GEM</span>}</div></td>
                       <td className="px-6 py-4"><span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wide border bg-slate-50 text-slate-700 border-slate-200`}>{item.intent.charAt(0)}</span></td>
                       <td className="px-6 py-4"><div className="flex items-center gap-3"><span className="font-mono text-sm text-slate-700 min-w-[60px]">{item.volume.toLocaleString()}</span><MiniTrend data={item.trend} /></div></td>
                       <td className="px-6 py-4">{getDifficultyBadge(item.difficulty)}</td>
                       <td className="px-6 py-4 font-mono text-sm text-slate-600">${item.cpc.toFixed(2)}</td>
                       <td className="px-6 py-4"><button className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-orange-500" title="View SERP"><Eye className="w-4 h-4"/></button></td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default KeywordMagicView;
