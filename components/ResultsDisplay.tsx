
import React from 'react';
import type { AnalysisResult } from '../types';

interface ResultsDisplayProps {
  result: AnalysisResult;
  originalImageUrl: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, originalImageUrl }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-sky-400 mb-4">Annotated Image</h2>
        <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
          <img
            src={originalImageUrl}
            alt="Analyzed room"
            className="w-full h-full object-contain"
          />
          <div
            className="absolute inset-0 w-full h-full"
            dangerouslySetInnerHTML={{ __html: result.annotatedImageSvg }}
          />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-sky-400 mb-4">Estimated Dimensions</h2>
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
          <ul className="divide-y divide-slate-700">
            {result.dimensions.map((dim, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <span className="text-slate-300">{dim.label}</span>
                <span className="font-mono text-sky-300 bg-sky-900/50 px-2 py-1 rounded-md text-sm">{dim.estimate}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;
