'use client';

import React, { useRef, useState } from 'react';
import { UploadCloud, FileText, Trash2, HelpCircle, CheckCircle, AlertCircle, Sparkles } from 'lucide-react';
import { ReferenceFile, IndustryOption } from '../types';
import { sampleReferenceData } from '../lib/mockData';
import { industryConfigs } from '../config/industryIntelligence';
import { preprocessImage } from '../lib/imageHelper';

interface FileUploaderProps {
  files: ReferenceFile[];
  setFiles: React.Dispatch<React.SetStateAction<ReferenceFile[]>>;
  selectedIndustry: IndustryOption | null;
  onAddSampleContent: (filename: string, content: string) => void;
}

export default function FileUploader({
  files,
  setFiles,
  selectedIndustry,
  onAddSampleContent
}: FileUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Supported Extensions list
  const ALLOWED_EXTENSIONS = [
    'pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'png', 'jpg', 'jpeg'
  ];

  // Helper to format file size
  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check file extension
  const validateFileExtension = (name: string) => {
    const ext = name.split('.').pop()?.toLowerCase();
    return ext ? ALLOWED_EXTENSIONS.includes(ext) : false;
  };

  // Upload file function
  const uploadFile = async (file: File) => {
    const tempId = Math.random().toString(36).substring(7);
    const newFileEntry: ReferenceFile = {
      id: tempId,
      name: file.name,
      type: file.type || 'unknown',
      size: file.size,
      content: '',
      status: 'processing'
    };

    setFiles(prev => [...prev, newFileEntry]);
    setUploadError(null);

    // Validation checks
    if (!validateFileExtension(file.name)) {
      setFiles(prev =>
        prev.map(f =>
          f.id === tempId
            ? { ...f, status: 'error', errorMessage: 'Unsupported file format.' }
            : f
        )
      );
      return;
    }

    const MAX_SIZE = 5 * 1024 * 1024; // 5MB
    if (file.size > MAX_SIZE) {
      setFiles(prev =>
        prev.map(f =>
          f.id === tempId
            ? { ...f, status: 'error', errorMessage: 'File exceeds 5MB size limit.' }
            : f
        )
      );
      return;
    }

    // Call /api/upload
    try {
      let fileToUpload = file;
      let isCompressed = false;
      let originalSize = file.size;
      let optimizedSize = file.size;

      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const isImage = ['jpg', 'jpeg', 'png'].includes(fileExtension || '') || file.type.startsWith('image/');

      if (isImage) {
        try {
          const result = await preprocessImage(file);
          fileToUpload = result.file;
          isCompressed = result.isCompressed;
          originalSize = result.originalSize;
          optimizedSize = result.optimizedSize;

          // Update entry metadata with optimized file details
          setFiles(prev =>
            prev.map(f =>
              f.id === tempId
                ? {
                    ...f,
                    name: fileToUpload.name,
                    type: fileToUpload.type,
                    size: fileToUpload.size,
                    originalSize,
                    optimizedSize,
                    isCompressed
                  }
                : f
            )
          );
        } catch (preprocessErr) {
          console.error('Client-side image preprocessing error, falling back to original:', preprocessErr);
        }
      }

      const formData = new FormData();
      formData.append('file', fileToUpload);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        let errorMessage = `Upload failed with status ${res.status}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await res.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const textData = await res.text();
            errorMessage = textData || errorMessage;
          }
        } catch (parseErr) {
          // Use default error message if reading response fails
        }
        throw new Error(errorMessage);
      }

      const data = await res.json();

      setFiles(prev =>
        prev.map(f =>
          f.id === tempId
            ? {
                ...f,
                status: 'success',
                content: data.text,
                base64Data: data.base64Data, // Save base64 for image vision
                type: data.type,
                size: fileToUpload.size,
                originalSize,
                optimizedSize,
                isCompressed,
                usedQuotaFallback: data.usedQuotaFallback
              }
            : f
        )
      );
    } catch (err: any) {
      console.error('File upload error:', err);
      setFiles(prev =>
        prev.map(f =>
          f.id === tempId
            ? { ...f, status: 'error', errorMessage: err.message || 'Failed to extract text.' }
            : f
        )
      );
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        uploadFile(file);
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      Array.from(e.dataTransfer.files).forEach(file => {
        uploadFile(file);
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  // Load sample template file
  const handleLoadSample = () => {
    if (!selectedIndustry) return;
    const sample = sampleReferenceData[selectedIndustry];
    if (sample) {
      onAddSampleContent(sample.filename, sample.content);
    }
  };

  return (
    <div className="space-y-4 animate-slide-up [animation-delay:100ms]">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
          Step 3: Upload Reference Materials (Optional)
        </label>
        
        {selectedIndustry && (
          <button
            type="button"
            onClick={handleLoadSample}
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:underline border border-indigo-100 hover:bg-indigo-50 dark:border-indigo-900/50 dark:hover:bg-indigo-950/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
          >
            <Sparkles className="h-3 w-3" />
            Load Sample {industryConfigs[selectedIndustry].name} Brochure
          </button>
        )}
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed transition-all duration-300 cursor-pointer ${
          isDragActive
            ? 'border-indigo-500 bg-indigo-50/10 dark:border-indigo-400 dark:bg-indigo-950/10 scale-[0.99]'
            : 'border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,image/png,image/jpeg,image/jpg"
        />
        
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 mb-3">
          <UploadCloud className="h-6 w-6" />
        </div>
        
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
          Drag and drop files here, or <span className="text-indigo-600 dark:text-indigo-400 underline">browse</span>
        </p>
        
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 text-center max-w-sm">
          Supports PDF, Word, PowerPoint, Excel, Images, TXT. <br />
          Maximum file size is 5MB.
        </p>
      </div>

      {uploadError && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {uploadError}
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="border border-slate-200/80 rounded-2xl bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80">
          {files.map(file => (
            <div key={file.id} className="p-4 flex items-center justify-between gap-3 text-slate-700 dark:text-slate-300">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-700/50">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {file.name}
                  </p>
                  <div className="text-xs text-slate-400 mt-0.5 flex flex-wrap items-center gap-1.5">
                    {file.isCompressed ? (
                      <>
                        <span className="line-through text-slate-400/80">{formatSize(file.originalSize || file.size)}</span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-450">{formatSize(file.optimizedSize || file.size)}</span>
                        <span className="text-[10px] px-1.5 py-0.5 font-bold uppercase tracking-wider rounded bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                          Compressed
                        </span>
                      </>
                    ) : (
                      <>
                        <span>{formatSize(file.size)}</span>
                        {file.type.startsWith('image/') && (
                          <span className="text-[10px] px-1.5 py-0.5 font-semibold rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200/30 dark:border-slate-700/30">
                            Optimized
                          </span>
                        )}
                      </>
                    )}
                    <span>•</span>
                    <span className="font-medium">{file.type.split('/').pop()?.toUpperCase() || 'FILE'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Indicator */}
                {file.status === 'processing' && (
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400">
                    <div className="h-3 w-3 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent dark:border-indigo-400"></div>
                    <span className="font-semibold hidden sm:inline">Extracting...</span>
                  </div>
                )}
                {file.status === 'success' && (
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 px-2 py-0.5 rounded-full">
                    <CheckCircle className="h-3 w-3" />
                    <span>Parsed</span>
                  </div>
                )}
                {file.status === 'error' && (
                  <div className="flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 px-2 py-0.5 rounded-full" title={file.errorMessage}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span className="max-w-[120px] truncate">{file.errorMessage || 'Failed'}</span>
                  </div>
                )}

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 dark:text-slate-500 rounded-lg transition-colors cursor-pointer"
                  title="Remove reference file"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
