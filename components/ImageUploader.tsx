
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  clearImage: () => void;
  imageUrl: string | null;
  isProcessing: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, clearImage, imageUrl, isProcessing }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  if (imageUrl) {
    return (
      <div className="w-full">
        <div className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-slate-600">
          <img src={imageUrl} alt="Room preview" className="w-full h-full object-contain" />
        </div>
        <button
          onClick={clearImage}
          disabled={isProcessing}
          className="mt-4 w-full px-4 py-2 bg-slate-700 text-slate-200 rounded-md hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed transition-colors"
        >
          Clear Image
        </button>
      </div>
    );
  }

  return (
    <label
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center w-full aspect-video p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-sky-400 bg-slate-700/50' : 'border-slate-600 hover:border-slate-500 bg-slate-800/50'}`}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <UploadIcon className="w-12 h-12 text-slate-500 mb-4" />
        <p className="mb-2 text-sm text-slate-400">
          <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-slate-500">PNG, JPG, or WEBP</p>
      </div>
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileChange}
      />
    </label>
  );
};

export default ImageUploader;
