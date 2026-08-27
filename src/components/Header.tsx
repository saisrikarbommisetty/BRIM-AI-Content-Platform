'use client';

import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface HeaderProps {
  isDemoMode: boolean;
}

export default function Header({ isDemoMode }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/80 dark:bg-slate-900/85">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 shadow-md shadow-indigo-100 dark:shadow-none">
            <span className="text-xl font-bold tracking-wider text-white">B</span>
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              BRIM <span className="text-xs font-semibold text-indigo-500 tracking-normal px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 ml-1">AI</span>
            </span>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Content Writing Platform</p>
          </div>
        </div>

        {/* Navigation & Status Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isDemoMode ? 'bg-amber-400' : 'bg-emerald-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isDemoMode ? 'bg-amber-500' : 'bg-emerald-500'
              }`}></span>
            </span>
            <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
              {isDemoMode ? (
                <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/30">
                  Demo Mode
                  <span title="GEMINI_API_KEY is not configured in .env, falling back to dynamic simulations.">
                    <HelpCircle className="h-3 w-3" />
                  </span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/30">
                  Live AI Active
                  <Sparkles className="h-3 w-3" />
                </span>
              )}
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
