
import React, { useState } from 'react';
import { User } from '../types';
import { GeminiService } from '../services/geminiService';
import { ScanEye, Loader2, Upload, Zap } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const ImageAnalyzerView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [prompt, setPrompt] = useState('Analyze this image and describe key elements for SEO optimization.');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !preview) return;
    if (!onConsumeAICredits(5)) return;

    setLoading(true);
    const base64Data = preview.split(',')[1];
    const result = await GeminiService.analyzeImage(base64Data, prompt);
    setAnalysis(result);
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <ScanEye className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Image Analyzer</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Get AI insights from your images.
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Gemini 3 Pro
            </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    {preview ? (
                        <img src={preview} alt="Preview" className="max-h-48 mx-auto rounded-lg shadow-sm" />
                    ) : (
                        <div className="text-slate-400">
                            <Upload className="w-10 h-10 mx-auto mb-2" />
                            <p className="text-sm font-medium">Click or Drag to Upload Image</p>
                        </div>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Instruction</label>
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 h-24 resize-none"
                    />
                </div>
                <button 
                    onClick={handleAnalyze}
                    disabled={loading || !selectedFile}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze Image'}
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6">
                <h3 className="font-bold text-slate-700 mb-4">Analysis Result</h3>
                {analysis ? (
                    <div className="prose prose-slate max-w-none text-sm">
                        <div className="whitespace-pre-wrap">{analysis}</div>
                    </div>
                ) : (
                    <p className="text-slate-400 text-sm italic">Results will appear here...</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnalyzerView;
