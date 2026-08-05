import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { X, UploadCloud, Image as ImageIcon, ShieldCheck, Sparkles, FileText, ArrowRight, FolderOpen, RefreshCw } from 'lucide-react';

export const ProofUploadModal = () => {
  const { activeUploadTask, setActiveUploadTask, submitProof } = useApp();
  const fileInputRef = useRef(null);

  const [selectedImage, setSelectedImage] = useState('');
  const [caption, setCaption] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (activeUploadTask) {
      setSelectedImage(activeUploadTask.proofUrl || '');
      setCaption('');
      setIsUploading(false);
      setIsVerified(activeUploadTask.proofStatus === 'approved');
      setFileName('');
    }
  }, [activeUploadTask]);

  if (!activeUploadTask) return null;

  // Process user file selection with automatic Canvas image compression
  const processFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;

    setFileName(file.name);
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Compress image to lightweight JPEG data URL (~60KB - 100KB)
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);
        setSelectedImage(compressedDataUrl);
        setIsUploading(false);
        setIsVerified(true);
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedImage) return;
    submitProof(activeUploadTask.id, selectedImage, caption);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-bg/85 backdrop-blur-xl animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-3xl border border-dark-border/90 p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Hidden Native File Input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-dark-border">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-cyan-glow/10 border border-cyan-glow/30 text-cyan-glow text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Media Proof Verification</span>
            </div>
            <h3 className="text-xl font-display font-extrabold text-white">
              {activeUploadTask.title}
            </h3>
          </div>
          <button
            onClick={() => setActiveUploadTask(null)}
            className="p-2 rounded-full bg-dark-card border border-dark-border text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          
          {/* File Upload Dropzone / Image Preview Area */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !selectedImage && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed transition-all p-4 text-center cursor-pointer ${
              selectedImage
                ? 'border-cyan-glow/60 bg-dark-card/60'
                : 'border-dark-border hover:border-cyan-glow/60 bg-dark-bg/60'
            }`}
          >
            {selectedImage ? (
              <div className="relative group rounded-xl overflow-hidden max-h-64 flex flex-col items-center justify-center bg-black/40 p-2">
                <img
                  src={selectedImage}
                  alt="Uploaded Proof"
                  className="max-h-56 w-auto object-contain rounded-xl shadow-md"
                />

                {/* Instant Verification Badge Overlay */}
                {isVerified && (
                  <div className="absolute top-3 left-3 px-3 py-1.5 rounded-xl bg-emerald-neon/90 text-dark-bg font-extrabold text-xs flex items-center space-x-1.5 shadow-lg backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Photo Verified • Ready to Submit</span>
                  </div>
                )}

                {/* Change photo hover button */}
                <div className="absolute inset-0 bg-dark-bg/70 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center space-y-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-4 py-2.5 rounded-xl bg-cyan-glow text-dark-bg font-extrabold text-xs shadow-cyan-glow hover:scale-105 transition-all flex items-center space-x-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Choose Different Photo</span>
                  </button>
                  {fileName && <span className="text-[11px] text-gray-300 font-mono">{fileName}</span>}
                </div>
              </div>
            ) : (
              <div className="py-10 flex flex-col items-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-cyan-glow/10 border border-cyan-glow/30 flex items-center justify-center text-cyan-glow">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-base">Click to Upload Your Image Proof</h4>
                  <p className="text-xs text-gray-400 mt-1">Or drag & drop any screenshot/photo from your computer</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="px-5 py-2.5 rounded-xl bg-cyan-glow/20 border border-cyan-glow/40 text-cyan-glow hover:bg-cyan-glow/30 font-extrabold text-xs transition-all flex items-center space-x-2"
                >
                  <FolderOpen className="w-4 h-4" />
                  <span>Browse Image File...</span>
                </button>
              </div>
            )}
          </div>

          {/* Caption Input */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1 flex items-center space-x-1">
              <FileText className="w-3.5 h-3.5 text-cyan-glow" />
              <span>Add Proof Caption or Notes (Optional)</span>
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="e.g. Completed morning workout / 12,000 steps achieved!"
              className="w-full px-4 py-3 rounded-xl bg-dark-bg border border-dark-border text-white text-sm focus:outline-none focus:border-cyan-glow"
            />
          </div>

          {/* Submit Trigger */}
          <div className="pt-2 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={() => setActiveUploadTask(null)}
              className="px-5 py-2.5 rounded-xl border border-dark-border text-gray-400 hover:text-white text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedImage || isUploading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-glow to-cyan-accent text-dark-bg font-extrabold text-xs shadow-cyan-glow hover:scale-105 active:scale-95 transition-all flex items-center space-x-2 disabled:opacity-40"
            >
              <span>Submit Proof for Admin Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
