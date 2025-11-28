
import React, { useState } from 'react';
import { Unplug, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { BrokenLinkResult, User } from '../types';

interface Props {
    user: User;
    onConsumeSearch: () => boolean;
}

const BrokenLinkView: React.FC<Props> = ({ user, onConsumeSearch }) => {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<BrokenLinkResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    if (!onConsumeSearch()) return;

    setLoading(true);
    const result = await GeminiService.checkBrokenLinks(url);
    setData(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg">
                <Unplug className="w-6 h-6 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Broken Link Checker</h1>
        </div>
        <p className="text-slate-500 mb-6">Scan a page to find broken internal and external links (404 errors). (1 Search)</p>
        
        <form onSubmit={handleCheck} className="flex gap-4 max-w-2xl">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL to crawl (e.g. example.com/blog)"
            className="flex-1 px-4 py-3 rounded-lg border border-slate-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200"
          />
          <button 
            type="submit"
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold transition-all shadow-lg shadow-red-600/20 disabled:opacity-70 flex items-center justify-center min-w-[140px]"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Scan Page'}
          </button>
        </form>
      </div>

      {data && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="font-bold text-slate-900">Scan Results</h2>
                    <p className="text-sm text-slate-500">Found {data.brokenCount} broken links out of {data.totalLinks} scanned.</p>
                </div>
                {data.brokenCount > 0 ? (
                    <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold border border-red-100">
                        Issues Found
                    </span>
                ) : (
                    <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                        No Issues
                    </span>
                )}
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 text-xs font-bold text-slate-500 uppercase">
                        <tr>
                            <th className="px-6 py-4">Broken URL</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Anchor Text</th>
                            <th className="px-6 py-4">Source Page</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.links.map((link, idx) => (
                            <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-red-600 font-medium max-w-[300px] truncate">
                                        <AlertTriangle className="w-4 h-4 shrink-0" />
                                        <span className="truncate" title={link.url}>{link.url}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold">
                                        {link.statusCode}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-700 font-medium">
                                    "{link.anchorText}"
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    <span className="truncate block max-w-[200px]">{link.sourcePage}</span>
                                </td>
                            </tr>
                        ))}
                        {data.links.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-500">
                                    No broken links detected on this page simulation.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
};

export default BrokenLinkView;
