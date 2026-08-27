'use client';

import React from 'react';
import { Home, Gem, Wind, Utensils, Calendar, Clock, Sparkles } from 'lucide-react';
import { IndustryOption, DurationOption } from '../types';
import { industryConfigs } from '../config/industryIntelligence';

interface ConfigurationPanelProps {
  selectedIndustry: IndustryOption | null;
  setSelectedIndustry: (ind: IndustryOption) => void;
  selectedDuration: DurationOption | null;
  setSelectedDuration: (dur: DurationOption) => void;
  fileCount: number;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function ConfigurationPanel({
  selectedIndustry,
  setSelectedIndustry,
  selectedDuration,
  setSelectedDuration,
  fileCount,
  onGenerate,
  isGenerating
}: ConfigurationPanelProps) {
  
  // Industry Cards details
  const industries = [
    {
      id: 'realestate' as IndustryOption,
      icon: Home,
      color: 'from-blue-500 to-indigo-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      borderColor: 'border-blue-200 dark:border-blue-900/50'
    },
    {
      id: 'jewellery' as IndustryOption,
      icon: Gem,
      color: 'from-amber-500 to-yellow-600',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/30',
      borderColor: 'border-amber-200 dark:border-amber-900/50'
    },
    {
      id: 'perfume' as IndustryOption,
      icon: Wind,
      color: 'from-purple-500 to-pink-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-950/30',
      borderColor: 'border-purple-200 dark:border-purple-900/50'
    },
    {
      id: 'food' as IndustryOption,
      icon: Utensils,
      color: 'from-emerald-500 to-teal-500',
      textColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      borderColor: 'border-emerald-200 dark:border-emerald-900/50'
    }
  ];

  // Duration Options
  const durations = [
    { id: '1week' as DurationOption, label: '1 Week', posts: 3, desc: 'Logical distribution' },
    { id: '2weeks' as DurationOption, label: '2 Weeks', posts: 6, desc: 'Optimal engagement' },
    { id: '1month' as DurationOption, label: '1 Month', posts: 12, desc: 'Full branding mix' }
  ];

  return (
    <div className="space-y-8 animate-slide-up [animation-delay:150ms]">
      
      {/* 1. Industry Selection */}
      <div>
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">
          Step 1: Select Target Industry
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind) => {
            const config = industryConfigs[ind.id];
            const isSelected = selectedIndustry === ind.id;
            const Icon = ind.icon;
            
            return (
              <button
                key={ind.id}
                type="button"
                onClick={() => setSelectedIndustry(ind.id)}
                className={`relative flex flex-col text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-md shadow-indigo-100/50 dark:shadow-none ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 hover:dark:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${ind.bgColor} ${ind.textColor} border ${ind.borderColor} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {config.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 flex-grow line-clamp-3">
                  {config.description}
                </p>
                {isSelected && (
                  <span className="absolute top-4 right-4 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-600 dark:bg-indigo-500"></span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Duration Selection */}
      <div>
        <label className="block text-sm font-bold text-slate-800 dark:text-slate-200 mb-4 uppercase tracking-wider">
          Step 2: Choose Content Plan Duration
        </label>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {durations.map((dur) => {
            const isSelected = selectedDuration === dur.id;
            return (
              <button
                key={dur.id}
                type="button"
                onClick={() => setSelectedDuration(dur.id)}
                className={`flex items-center gap-4 text-left p-5 rounded-2xl border transition-all duration-300 ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/20 dark:border-indigo-500 dark:bg-indigo-950/20 shadow-md shadow-indigo-100/50 dark:shadow-none ring-2 ring-indigo-500/20'
                    : 'border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 hover:dark:border-slate-700 hover:shadow-sm'
                }`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  isSelected 
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400' 
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">{dur.label}</span>
                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      ({dur.posts} Posts)
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{dur.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Config Summary & CTAs */}
      <div className="p-6 rounded-2xl border border-slate-200/80 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Calendar className="h-4 w-4 text-indigo-500" />
          Configuration Summary
        </h3>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-6">
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Selected Industry</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {selectedIndustry ? industryConfigs[selectedIndustry].name : 'Not Selected'}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Calendar Plan</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {selectedDuration ? durations.find(d => d.id === selectedDuration)?.label : 'Not Selected'}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Publications</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {selectedDuration ? `${durations.find(d => d.id === selectedDuration)?.posts} Social Posts` : '0 Posts'}
            </p>
          </div>
          <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400">Reference Materials</span>
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
              {fileCount > 0 ? `${fileCount} File${fileCount > 1 ? 's' : ''} Attached` : 'No references'}
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={!selectedIndustry || !selectedDuration || isGenerating}
          onClick={onGenerate}
          className={`w-full py-4 px-6 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg transition-all duration-300 ${
            !selectedIndustry || !selectedDuration || isGenerating
              ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-gradient-to-r from-indigo-600 to-violet-500 hover:from-indigo-500 hover:to-violet-400 shadow-indigo-200 dark:shadow-none hover:shadow-indigo-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
          }`}
        >
          <Sparkles className="h-5 w-5" />
          {isGenerating ? 'Drafting Content Plan...' : 'Generate Content Calendar'}
        </button>
      </div>

    </div>
  );
}
