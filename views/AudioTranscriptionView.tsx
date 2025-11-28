
import React, { useState } from 'react';
import { User } from '../types';
import { GeminiService } from '../services/geminiService';
import { Mic, Loader2, FileAudio, Zap } from 'lucide-react';

interface Props {
  user: User;
  onConsumeAICredits: (amount: number) => boolean;
}

const AudioTranscriptionView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleTranscribe = async () => {
    if (!selectedFile) return;
    if (!onConsumeAICredits(5)) return;

    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const result = await GeminiService.transcribeAudio(base64Data);
        setTranscription(result);
        setLoading(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-pink-50 rounded-lg text-pink-600">
                <Mic className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Audio Transcription</h1>
        </div>
        <p className="text-slate-500 mb-8 flex items-center gap-2">
            Convert audio files to text.
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                <Zap className="w-3 h-3" /> Gemini Flash
            </span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                    <input 
                        type="file" 
                        accept="audio/*" 
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-slate-400">
                        <FileAudio className="w-10 h-10 mx-auto mb-2" />
                        <p className="text-sm font-medium">{selectedFile ? selectedFile.name : "Upload Audio File (MP3/WAV)"}</p>
                    </div>
                </div>
                <button 
                    onClick={handleTranscribe}
                    disabled={loading || !selectedFile}
                    className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-pink-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Transcribe'}
                </button>
            </div>

            <div className="bg-slate-50 rounded-xl border border-slate-200 p-6 min-h-[300px]">
                <h3 className="font-bold text-slate-700 mb-4">Transcription</h3>
                {transcription ? (
                    <div className="prose prose-slate max-w-none text-sm whitespace-pre-wrap">
                        {transcription}
                    </div>
                ) : (
                    <p className="text-slate-400 text-sm italic">Text will appear here...</p>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AudioTranscriptionView;
