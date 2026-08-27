'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Sparkles, Database, Check } from 'lucide-react';

interface ProcessingStateProps {
  hasFiles: boolean;
}

export default function ProcessingState({ hasFiles }: ProcessingStateProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { text: 'Setting up social strategy parameters...', sub: 'Constructing brand persona, tone curves, and vocabulary guardrails.' },
    { text: 'Ingesting reference briefs and documents...', sub: hasFiles ? 'Extracting text and identifying configurations, USPs, and specs.' : 'Reviewing industry standard guidelines and target demographics.' },
    { text: 'Constructing industry-specific content pillars...', sub: 'Structuring balanced mix of brand, product, occasion, and conversion posts.' },
    { text: 'Crafting publication-ready copy...', sub: 'Formulating captivating captions and inserting context-aware facts.' },
    { text: 'Designing detailed visual instructions...', sub: 'Writing useful directives for designers, photography, and image generators.' },
    { text: 'Finalizing calendar grid...', sub: 'Arranging dates, post order, and generating relevant hashtag groups.' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 max-w-xl mx-auto text-center animate-fade-in">
      
      {/* Premium Loader Ring */}
      <div className="relative flex items-center justify-center h-24 w-24 mb-8">
        {/* Outer glowing pulsing orb */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 opacity-20 blur-xl animate-pulse"></div>
        {/* Inner spinning gradient border */}
        <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800"></div>
        <div className="absolute inset-0 rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
        {/* Center icon */}
        <Sparkles className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-pulse" />
      </div>

      <h2 className="text-xl font-extrabold text-slate-900 dark:text-white mb-2">
        Drafting Your Content Calendar
      </h2>
      
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mb-8">
        Our strategy layers are combining industry intelligence with your uploaded reference files to build an optimized content schedule.
      </p>

      {/* Progress Timeline List */}
      <div className="w-full space-y-4 text-left border border-slate-200/60 dark:border-slate-800/80 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/30">
        {steps.map((step, idx) => {
          const isCompleted = currentStep > idx;
          const isActive = currentStep === idx;
          
          return (
            <div key={idx} className="flex gap-3 transition-opacity duration-300">
              <div className="flex flex-col items-center">
                <div className={`flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                  isCompleted 
                    ? 'bg-indigo-600 border-indigo-600 text-white' 
                    : isActive 
                      ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400 font-extrabold animate-pulse'
                      : 'border-slate-200 text-slate-400 dark:border-slate-800'
                }`}>
                  {isCompleted ? <Check className="h-3 w-3" /> : idx + 1}
                </div>
                {idx < steps.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-200 dark:bg-slate-800'}`}></div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className={`text-xs font-bold ${isActive ? 'text-indigo-600 dark:text-indigo-400' : isCompleted ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-500'}`}>
                  {step.text}
                </p>
                {isActive && (
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 animate-slide-up">
                    {step.sub}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
