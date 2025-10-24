
import React, { useState, useCallback } from 'react';
import ImageUploader from './components/ImageUploader';
import ResultsDisplay from './components/ResultsDisplay';
import Spinner from './components/Spinner';
import { analyzeImage } from './services/geminiService';
import type { AnalysisResult } from './types';
import { ErrorIcon } from './components/icons';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearState = () => {
    setImageFile(null);
    setImageUrl(null);
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const handleImageUpload = useCallback((file: File) => {
    clearState();
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file));
  }, []);

  const handleClearImage = useCallback(() => {
    clearState();
  }, []);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;

    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);

    try {
      const base64Image = await fileToBase64(imageFile);
      const resultJsonString = await analyzeImage(base64Image, imageFile.type);
      
      const result = JSON.parse(resultJsonString);
      setAnalysisResult(result);

    } catch (err: any) {
      setError(err.toString() || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            Room Dimension Estimator
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-400">
            Upload a photo of a room, and let AI estimate its dimensions and provide an annotated visual guide.
          </p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column: Uploader and Controls */}
          <div className="flex flex-col space-y-6">
            <h2 className="text-2xl font-bold text-sky-400">1. Upload Your Image</h2>
            <ImageUploader
              onImageUpload={handleImageUpload}
              clearImage={handleClearImage}
              imageUrl={imageUrl}
              isProcessing={isLoading}
            />
            {imageFile && (
              <button
                onClick={handleAnalyzeClick}
                disabled={isLoading || !imageFile}
                className="w-full flex items-center justify-center px-6 py-3 text-lg font-semibold bg-sky-500 text-white rounded-md hover:bg-sky-600 disabled:bg-sky-800 disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-6 h-6 mr-3" />
                    Analyzing...
                  </>
                ) : (
                  '2. Analyze Dimensions'
                )}
              </button>
            )}
             {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg flex items-start space-x-3 animate-fade-in">
                <ErrorIcon className="w-6 h-6 mt-1 flex-shrink-0" />
                <div>
                    <h3 className="font-bold">Analysis Failed</h3>
                    <p className="text-sm">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="bg-slate-800/30 border border-slate-700 rounded-xl p-6 min-h-[400px] flex flex-col justify-center">
            {analysisResult && imageUrl ? (
              <ResultsDisplay result={analysisResult} originalImageUrl={imageUrl} />
            ) : (
              <div className="text-center text-slate-500">
                <h3 className="text-xl font-semibold mb-2">Analysis Results</h3>
                <p>Upload an image and click "Analyze" to see the results here.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
