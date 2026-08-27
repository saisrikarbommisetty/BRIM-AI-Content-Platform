'use client';

import React, { useState } from 'react';
import { Copy, Check, ArrowLeft, Calendar, FileDown } from 'lucide-react';
import { GeneratedCalendar, Post } from '../types';
import PostCard from './PostCard';

interface CalendarViewProps {
  calendar: GeneratedCalendar;
  onUpdatePost: (updatedPost: Post) => void;
  onRegeneratePost: (postNumber: number, date: string) => Promise<void>;
  onStartOver: () => void;
  regeneratingPostIds: number[];
}

export default function CalendarView({
  calendar,
  onUpdatePost,
  onRegeneratePost,
  onStartOver,
  regeneratingPostIds
}: CalendarViewProps) {
  const [copyAllStatus, setCopyAllStatus] = useState(false);

  const handleCopyAll = async () => {
    try {
      const fullText = calendar.posts
        .map(
          post =>
            `==============================\nPOST ${String(post.postNumber).padStart(2, '0')} (${post.date})\nPILLAR: ${post.contentPillar.toUpperCase()}\n==============================\n\nCAPTION:\n${post.caption}\n\nVISUAL DIRECTION:\n${post.visualDirection}\n\nHASHTAGS:\n${post.hashtags.join(' ')}`
        )
        .join('\n\n\n');

      await navigator.clipboard.writeText(fullText);
      setCopyAllStatus(true);
      setTimeout(() => setCopyAllStatus(false), 2000);
    } catch (err) {
      console.error('Failed to copy all content:', err);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Action header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onStartOver}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-350 rounded-xl border border-slate-200/60 dark:border-slate-800/80 transition-colors cursor-pointer"
            title="Configure new plan"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 mb-0.5">
              <Calendar className="h-3.5 w-3.5" />
              Interactive Calendar Plan
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {calendar.industry} Content Strategy
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {calendar.duration} Plan • {calendar.totalPosts} Structured Social Posts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onStartOver}
            className="px-4 py-2 text-sm font-semibold border border-slate-200/85 text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer"
          >
            Configure New Plan
          </button>
          <button
            onClick={handleCopyAll}
            className={`px-4 py-2 text-sm font-bold rounded-xl flex items-center gap-1.5 shadow-md transition-all duration-300 cursor-pointer ${
              copyAllStatus
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-100 text-white'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-100 dark:shadow-none hover:shadow-indigo-200 text-white'
            }`}
          >
            {copyAllStatus ? (
              <>
                <Check className="h-4 w-4" />
                Copied Calendar!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy All Content
              </>
            )}
          </button>
        </div>
      </div>

      {/* Calendar grid view */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {calendar.posts.map(post => (
          <PostCard
            key={post.postNumber}
            post={post}
            onUpdatePost={onUpdatePost}
            onRegeneratePost={onRegeneratePost}
            isRegenerating={regeneratingPostIds.includes(post.postNumber)}
          />
        ))}
      </div>

    </div>
  );
}
