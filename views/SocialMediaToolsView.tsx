
import React, { useState } from 'react';
import { User, SocialContentResult } from '../types';
import { GeminiService } from '../services/geminiService';
import { Hash, Youtube, Video, MessageCircle, Loader2, Copy, Check, Zap, FileVideo } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const SocialMediaToolsView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [activeTab, setActiveTab] = useState<'Hashtags' | 'YouTube' | 'TikTok' | 'Captions' | 'Scripts'>('Hashtags');
  const [topic, setTopic] = useState('');
  const [results, setResults] = useState<SocialContentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    if (!onConsumeAICredits(3)) return; // Cost: 3 credits

    setLoading(true);
    setResults(null);
    const data = await GeminiService.generateSocialContent(activeTab, topic);
    setResults(data);
    setLoading(false);
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const tabs = [
    { id: 'Hashtags', icon: Hash, color: 'text-pink-500', bg: 'bg-pink-50' },
    { id: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50' },
    { id: 'TikTok', icon: Video, color: 'text-slate-900', bg: 'bg-slate-100' },
    { id: 'Captions', icon: MessageCircle, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'Scripts', icon: FileVideo, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg text-white">
                <Hash className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Social Media & Content Tools</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Generate viral ideas, hashtags, captions, and video scripts. 
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Powered by Flash-Lite
            </span>
        </p>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-100 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id as any); setResults(null); }}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-bold text-sm transition-all ${
                activeTab === tab.id 
                  ? 'bg-slate-50 text-slate-900 border-b-2 border-orange-500' 
                  : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? tab.color : 'text-slate-400'}`} />
              {tab.id}
            </button>
          ))}
        </div>

        <div className="flex gap-4">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={`Enter topic for ${activeTab}...`}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Generate'}
          </button>
        </div>
      </div>

      {results && (
        <div className={`grid gap-4 animate-in fade-in slide-in-from-bottom-4 ${activeTab === 'Scripts' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
          {results.content.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className={`text-slate-700 font-medium leading-relaxed ${activeTab === 'Scripts' ? 'whitespace-pre-wrap font-mono text-sm' : ''}`}>
                {item}
              </div>
              <button
                onClick={() => handleCopy(item, idx)}
                className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-slate-100"
                title="Copy to clipboard"
              >
                {copiedIndex === idx ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialMediaToolsView;
