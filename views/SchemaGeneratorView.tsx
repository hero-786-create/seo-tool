
import React, { useState } from 'react';
import { Code, Loader2, Copy, Check, FileJson } from 'lucide-react';
import { GeminiService } from '../services/geminiService';
import { InfoTooltip } from '../components/InfoTooltip';
import { User } from '../types';

const SCHEMA_TYPES = [
  "FAQPage",
  "Article",
  "Product",
  "LocalBusiness",
  "Organization",
  "BreadcrumbList",
  "Recipe",
  "Event",
  "JobPosting"
];

interface Props {
    user: User;
    onConsumeAICredits: (amount: number) => boolean;
}

const SchemaGeneratorView: React.FC<Props> = ({ user, onConsumeAICredits }) => {
  const [schemaType, setSchemaType] = useState(SCHEMA_TYPES[0]);
  const [inputData, setInputData] = useState('');
  const [generatedSchema, setGeneratedSchema] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!inputData.trim()) return;

    // Consume AI Credits (Cost: 5)
    if (!onConsumeAICredits(5)) return;

    setLoading(true);
    setCopied(false);
    const result = await GeminiService.generateSchemaMarkup(schemaType, inputData);
    setGeneratedSchema(result);
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedSchema);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-cyan-50 rounded-lg">
                <Code className="w-6 h-6 text-cyan-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Schema Markup Generator</h1>
        </div>
        <p className="text-slate-500 mb-6">Create valid JSON-LD structured data for your pages to improve search visibility. (5 AI Credits)</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Schema Type
                        <InfoTooltip content="Select the type of structured data you want to generate." />
                    </label>
                    <select 
                        value={schemaType}
                        onChange={(e) => setSchemaType(e.target.value)}
                        className="w-full p-3 rounded-lg border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all bg-white"
                    >
                        {SCHEMA_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                        Input Details
                        <InfoTooltip content="Paste your content, URL, or describe the object you want to mark up. Gemini will extract the data." />
                    </label>
                    <textarea 
                        value={inputData}
                        onChange={(e) => setInputData(e.target.value)}
                        placeholder={`Paste content or provide details for ${schemaType}...`}
                        className="w-full h-64 p-4 rounded-lg border border-slate-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 outline-none transition-all resize-none"
                    />
                </div>

                <button 
                    onClick={handleGenerate}
                    disabled={loading || !inputData.trim()}
                    className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg font-medium transition-colors shadow-sm disabled:opacity-70 flex items-center justify-center"
                >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <FileJson className="w-5 h-5 mr-2" />}
                    Generate JSON-LD
                </button>
            </div>

            <div className="bg-slate-900 rounded-xl p-6 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-4 text-slate-400 border-b border-slate-800 pb-2">
                    <span className="text-sm font-mono">schema.json</span>
                    {generatedSchema && (
                        <button 
                            onClick={handleCopy}
                            className="text-xs flex items-center hover:text-white transition-colors"
                        >
                            {copied ? <Check className="w-4 h-4 mr-1 text-green-500" /> : <Copy className="w-4 h-4 mr-1" />}
                            {copied ? 'Copied' : 'Copy Code'}
                        </button>
                    )}
                </div>
                
                <div className="flex-1 font-mono text-sm overflow-auto text-green-400">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-slate-500">
                             <Loader2 className="w-8 h-8 animate-spin" />
                        </div>
                    ) : generatedSchema ? (
                        <pre className="whitespace-pre-wrap">{generatedSchema}</pre>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50">
                             <Code className="w-12 h-12 mb-2" />
                             <p>Generated code will appear here</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default SchemaGeneratorView;
