'use client';

import React, { useState, useEffect } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ConfigurationPanel from '@/components/ConfigurationPanel';
import FileUploader from '@/components/FileUploader';
import ProcessingState from '@/components/ProcessingState';
import CalendarView from '@/components/CalendarView';
import { ReferenceFile, GeneratedCalendar, Post, IndustryOption, DurationOption } from '@/types';

export default function Home() {
  // Config & Ingestion State
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryOption | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<DurationOption | null>(null);
  const [files, setFiles] = useState<ReferenceFile[]>([]);
  
  // App Control States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCalendar, setGeneratedCalendar] = useState<GeneratedCalendar | null>(null);
  const [regeneratingPostIds, setRegeneratingPostIds] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to true, updated on mount
  const [quotaWarning, setQuotaWarning] = useState<boolean>(false);

  // Check demo mode status on mount
  useEffect(() => {
    const checkMode = async () => {
      try {
        const res = await fetch('/api/generate');
        if (res.ok) {
          const data = await res.json();
          setIsDemoMode(data.isDemoMode);
        }
      } catch (err) {
        console.error('Failed to fetch api mode status:', err);
      }
    };
    checkMode();
  }, []);

  // Inject sample industry briefs
  const handleAddSampleContent = (filename: string, content: string) => {
    const tempId = Math.random().toString(36).substring(7);
    const newSampleFile: ReferenceFile = {
      id: tempId,
      name: filename,
      type: 'text/plain',
      size: content.length,
      content: content,
      status: 'success'
    };
    // Replace any existing files from sample data if they have the same name, or append
    setFiles(prev => {
      const filtered = prev.filter(f => f.name !== filename);
      return [...filtered, newSampleFile];
    });
  };

  // Content Generation Flow
  const handleGenerate = async () => {
    if (!selectedIndustry || !selectedDuration) return;
    
    setIsGenerating(true);
    setError(null);
    setGeneratedCalendar(null);
    setQuotaWarning(false);

    // Aggregate text context from all successfully parsed files
    const referenceText = files
      .filter(f => f.status === 'success' && f.content)
      .map(f => `[Source: ${f.name}]\n${f.content}`)
      .join('\n\n');

    // We process the images on upload and include their descriptions in referenceText.
    // To prevent Vercel payload limit issues, we do not send the raw base64 data to /api/generate again.
    const images: string[] = [];

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: selectedIndustry,
          duration: selectedDuration,
          referenceText,
          images
        })
      });

      if (!res.ok) {
        let errorMessage = `Request failed with status ${res.status}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            errorMessage = errData.error || errorMessage;
          } else {
            const textData = await res.text();
            errorMessage = textData || errorMessage;
          }
        } catch (parseErr) {
          // Use default error message if reading response fails
        }
        throw new Error(errorMessage);
      }

      const calendar = await res.json();
      setGeneratedCalendar(calendar);
      if (calendar.usedQuotaFallback) {
        setQuotaWarning(true);
      }
    } catch (err: any) {
      console.error('Generate handler error:', err);
      setError(err.message || 'An error occurred during AI compilation. Please retry.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Inline post modifications
  const handleUpdatePost = (updatedPost: Post) => {
    if (!generatedCalendar) return;
    setGeneratedCalendar({
      ...generatedCalendar,
      posts: generatedCalendar.posts.map(p =>
        p.postNumber === updatedPost.postNumber ? updatedPost : p
      )
    });
  };

  // Single-Post Regeneration Flow
  const handleRegeneratePost = async (postNumber: number, date: string) => {
    if (!selectedIndustry || !generatedCalendar) return;
    
    setRegeneratingPostIds(prev => [...prev, postNumber]);

    const referenceText = files
      .filter(f => f.status === 'success' && f.content)
      .map(f => `[Source: ${f.name}]\n${f.content}`)
      .join('\n\n');

    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          industry: selectedIndustry,
          postNumber,
          date,
          referenceText,
          existingCalendar: generatedCalendar.posts
        })
      });

      if (!res.ok) {
        let errorMessage = `Request failed with status ${res.status}`;
        try {
          const contentType = res.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errData = await res.json();
            errorMessage = errData.error || errorMessage;
          } else {
            const textData = await res.text();
            errorMessage = textData || errorMessage;
          }
        } catch (parseErr) {
          // Use default error message if reading response fails
        }
        throw new Error(errorMessage);
      }

      const newPost = await res.json();
      if (newPost.usedQuotaFallback) {
        setQuotaWarning(true);
      }
      
      // Update in-memory calendar state
      setGeneratedCalendar(prev => {
        if (!prev) return null;
        return {
          ...prev,
          posts: prev.posts.map(p => (p.postNumber === postNumber ? newPost : p))
        };
      });
    } catch (err: any) {
      console.error('Regenerate handler error:', err);
      alert(`Could not regenerate Post #${postNumber}: ${err.message || err}`);
    } finally {
      setRegeneratingPostIds(prev => prev.filter(id => id !== postNumber));
    }
  };

  // Reset Application State
  const handleStartOver = () => {
    setGeneratedCalendar(null);
    setError(null);
    setFiles([]);
    setSelectedIndustry(null);
    setSelectedDuration(null);
    setQuotaWarning(false);
  };

  // Reactive check for quota warning from any source
  const hasQuotaFallback =
    quotaWarning ||
    files.some(f => f.usedQuotaFallback) ||
    generatedCalendar?.usedQuotaFallback ||
    generatedCalendar?.posts.some(p => p.usedQuotaFallback);

  return (
    <div className="min-h-screen bg-slate-50/30 text-slate-900 dark:bg-slate-950 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300">
      
      {/* 1. Header Navigation */}
      <Header isDemoMode={isDemoMode} />

      {/* 2. Main Container */}
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Quota Warning Alert Display */}
        {hasQuotaFallback && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl flex items-center gap-3 dark:bg-amber-950/20 dark:border-amber-900/30 dark:text-amber-400 max-w-7xl mx-auto animate-fade-in shadow-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-amber-500" />
            <div className="text-sm font-semibold">
              AI quota temporarily unavailable — using demo generation
            </div>
          </div>
        )}

        {/* State A: Processing Loader */}
        {isGenerating && (
          <div className="flex items-center justify-center py-16">
            <ProcessingState hasFiles={files.length > 0} />
          </div>
        )}

        {/* State B: Output Calendar */}
        {!isGenerating && generatedCalendar && (
          <div className="animate-fade-in">
            <CalendarView
              calendar={generatedCalendar}
              onUpdatePost={handleUpdatePost}
              onRegeneratePost={handleRegeneratePost}
              onStartOver={handleStartOver}
              regeneratingPostIds={regeneratingPostIds}
            />
          </div>
        )}

        {/* State C: Input Generator Panel */}
        {!isGenerating && !generatedCalendar && (
          <div className="space-y-10">
            {/* Landing Hero (Intro) */}
            <Hero />

            {/* Error Alert Display */}
            {error && (
              <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-400 max-w-3xl mx-auto animate-shake">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <div className="text-sm font-semibold">
                    {error}
                  </div>
                </div>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-center"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Retry Generation
                </button>
              </div>
            )}

            {/* Dashboard configuration Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              
              {/* Form parameters selection (Left, span 2) */}
              <div className="lg:col-span-2 space-y-6">
                <ConfigurationPanel
                  selectedIndustry={selectedIndustry}
                  setSelectedIndustry={setSelectedIndustry}
                  selectedDuration={selectedDuration}
                  setSelectedDuration={setSelectedDuration}
                  fileCount={files.filter(f => f.status === 'success').length}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>

              {/* Upload Panel (Right, span 1) */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
                  <h2 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Context Ingestor
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Add facts to avoid AI rumors. If you attach brochures or datasheets, BRIM extracts details automatically.
                  </p>
                  <FileUploader
                    files={files}
                    setFiles={setFiles}
                    selectedIndustry={selectedIndustry}
                    onAddSampleContent={handleAddSampleContent}
                  />
                </div>
              </div>

            </div>
          </div>
        )}

      </main>

      {/* 3. Footer */}
      <footer className="w-full border-t border-slate-200/60 bg-white py-6 dark:border-slate-850 dark:bg-slate-950 transition-colors duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500">
          <p>© {new Date().getFullYear()} BRIM AI. Built as a candidate tech assessment project.</p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-500 dark:text-slate-400">Internship Interview Project</span>
            <span>•</span>
            <span>Targeting Production Quality</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
