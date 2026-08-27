'use client';

import React from 'react';
import { Calendar, Sparkles, Sliders, FileText } from 'lucide-react';

export default function Hero() {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-200/40 blur-3xl dark:bg-indigo-900/10"></div>
      <div className="absolute right-1/4 top-10 -z-10 h-72 w-72 translate-x-1/2 rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-900/10"></div>

      <div className="text-center max-w-3xl mx-auto px-4 sm:px-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50/50 px-3 py-1 text-xs font-semibold text-indigo-600 dark:border-indigo-900/30 dark:bg-indigo-950/20 dark:text-indigo-400 mb-6 animate-fade-in">
          <Sparkles className="h-3.5 w-3.5" />
          Enterprise Social Media Architect
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl animate-slide-up">
          Draft Industry-Specific <br />
          <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
            AI Social Media Calendars
          </span>
        </h1>
        
        <p className="mt-4 text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto sm:text-lg animate-slide-up [animation-delay:100ms]">
          No more generic ChatGPT captions. Select your industry, set the duration, upload your brochures or catalogs, and let our custom strategic intelligence design your perfect publication-ready content schedule.
        </p>

        {/* Feature Cards Grid (Compact & Stylish) */}
        <div className="mt-8 grid grid-cols-2 gap-4 max-w-xl mx-auto sm:grid-cols-3 sm:max-w-none sm:gap-6 animate-slide-up [animation-delay:200ms]">
          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white/50 backdrop-blur shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-2">
              <Sliders className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Industry Guardrails</span>
            <span className="text-[10px] text-slate-500 mt-0.5 text-center">Tone, vocab, target strategies</span>
          </div>

          <div className="flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white/50 backdrop-blur shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-2">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Reference-Aware</span>
            <span className="text-[10px] text-slate-500 mt-0.5 text-center">Factual ingestion, zero rumors</span>
          </div>

          <div className="col-span-2 sm:col-span-1 flex flex-col items-center p-4 rounded-xl border border-slate-100 bg-white/50 backdrop-blur shadow-sm dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-2">
              <Calendar className="h-5 w-5" />
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white">Structured Output</span>
            <span className="text-[10px] text-slate-500 mt-0.5 text-center">Non-repeating content pillars</span>
          </div>
        </div>
      </div>
    </div>
  );
}
