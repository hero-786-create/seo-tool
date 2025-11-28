import React from 'react';
import { Info } from 'lucide-react';

interface Props {
  content: string;
}

export const InfoTooltip: React.FC<Props> = ({ content }) => {
  return (
    <div className="group relative inline-flex items-center ml-1.5 align-middle z-50">
      <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help transition-colors" />
      <div className="invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-slate-800 text-white text-xs rounded-lg p-3 shadow-xl z-50 text-center leading-relaxed pointer-events-none font-normal">
        {content}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
      </div>
    </div>
  );
};
