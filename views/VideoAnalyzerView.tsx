
import React, { useState } from 'react';
import { User } from '../types';
import { GeminiService } from '../services/geminiService';
import { Video, Loader2, Upload, Zap } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const VideoAnalyzerView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [prompt, setPrompt] = useState('Summarize this video.');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    if (!onConsumeAICredits(15)) return; // Video is expensive

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await GeminiService.analyzeVideo(base64Data, prompt);
        setAnalysis(result);
        setLoading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-50 rounded-lg text-red-600">
                <Video className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Video Understanding</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Extract insights and summaries from video content.
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Gemini 3 Pro
            </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="video/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-slate-400">
                        <Upload className="w-10 h-10 mx-auto mb-2" />
                        <p className="text-sm font-medium">{selectedFile ? selectedFile.name : "Upload Video (MP4, < 10MB for demo)"}</p>
                    </div>
                </div>
                <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-red-100 focus:border-red-500 h-24 resize-none"
                    placeholder="Ask something about the video..."
                />
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !selectedFile}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze Video'}
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 min-h-[300px]">
                <h3 className="font-bold text-slate-700 mb-4">Analysis Result</h3>
                {analysis ? (
                    <div className="prose prose-slate max-w-none text-sm whitespace-pre-wrap">
                        {analysis}
                    </div>
                ) : (
                    <p className="text-slate-400 text-sm italic">Insights will appear here...</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default VideoAnalyzerView;
