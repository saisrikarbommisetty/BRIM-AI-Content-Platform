'use client';

import React, { useState } from 'react';
import { Copy, Check, RefreshCw, Edit, ChevronDown, ChevronUp, Image, MessageSquare, Hash } from 'lucide-react';
import { Post } from '../types';
import PostEditor from './PostEditor';

interface PostCardProps {
  post: Post;
  onUpdatePost: (updatedPost: Post) => void;
  onRegeneratePost: (postNumber: number, date: string) => Promise<void>;
  isRegenerating: boolean;
}

export default function PostCard({
  post,
  onUpdatePost,
  onRegeneratePost,
  isRegenerating
}: PostCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'caption' | 'hashtags' | 'all'>('idle');

  // Helper function to handle copying
  const copyToClipboard = async (text: string, type: 'caption' | 'hashtags' | 'all') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus(type);
      setTimeout(() => setCopyStatus('idle'), 1500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handleCopyAll = () => {
    const text = `Post #${String(post.postNumber).padStart(2, '0')} (${post.date})\nPILLAR: ${post.contentPillar}\n\nCAPTION:\n${post.caption}\n\nVISUAL DIRECTION:\n${post.visualDirection}\n\nHASHTAGS:\n${post.hashtags.join(' ')}`;
    copyToClipboard(text, 'all');
  };

  const handleRegenerate = async () => {
    if (isRegenerating) return;
    await onRegeneratePost(post.postNumber, post.date);
  };

  return (
    <div className={`relative flex flex-col border border-slate-200/80 rounded-2xl bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 shadow-sm ${
      isRegenerating ? 'opacity-80 scale-[0.99] border-indigo-300 ring-2 ring-indigo-500/10' : ''
    }`}>
      
      {/* Regeneration overlay loader */}
      {isRegenerating && (
        <div className="absolute inset-0 z-10 bg-white/60 dark:bg-slate-950/65 rounded-2xl flex flex-col items-center justify-center gap-2 backdrop-blur-[1px]">
          <RefreshCw className="h-6 w-6 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Regenerating post...</span>
        </div>
      )}

      {/* Card Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-col items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-sm shadow-indigo-100 dark:shadow-none">
            <span className="text-[10px] leading-tight opacity-80 uppercase">Post</span>
            <span className="text-sm font-extrabold leading-none">{String(post.postNumber).padStart(2, '0')}</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">
              {post.date}
            </p>
            <span className="inline-flex text-[10px] font-semibold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mt-0.5">
              {post.contentPillar}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsEditorOpen(true)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 rounded-lg transition-colors cursor-pointer"
            title="Edit post content"
          >
            <Edit className="h-4 w-4" />
          </button>
          
          <button
            onClick={handleRegenerate}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg transition-colors cursor-pointer"
            title="Regenerate this post with AI"
            disabled={isRegenerating}
          >
            <RefreshCw className="h-4 w-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Card Content */}
      {isExpanded && (
        <div className="p-5 flex-grow space-y-4 text-slate-700 dark:text-slate-300">
          
          {/* Caption */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                Caption
              </span>
              <button
                onClick={() => copyToClipboard(post.caption, 'caption')}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {copyStatus === 'caption' ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 bg-slate-50/50 dark:bg-slate-950/20 p-3 rounded-xl border border-slate-100 dark:border-slate-800/50 whitespace-pre-line leading-relaxed font-sans">
              {post.caption}
            </p>
          </div>

          {/* Visual direction */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <Image className="h-3 w-3" />
                Visual Direction
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 italic bg-indigo-50/10 dark:bg-slate-950/20 p-3 rounded-xl border border-indigo-100/10 dark:border-slate-800/50 border-l-2 border-l-indigo-500 dark:border-l-indigo-400">
              {post.visualDirection}
            </p>
          </div>

          {/* Hashtags */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1">
                <Hash className="h-3 w-3" />
                Hashtags
              </span>
              <button
                onClick={() => copyToClipboard(post.hashtags.join(' '), 'hashtags')}
                className="inline-flex items-center gap-1 text-[10px] font-semibold text-slate-400 hover:text-indigo-600 transition-colors cursor-pointer"
              >
                {copyStatus === 'hashtags' ? (
                  <>
                    <Check className="h-3 w-3 text-emerald-500" />
                    <span className="text-emerald-600 dark:text-emerald-400">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {post.hashtags.map((tag, idx) => (
                <span
                  key={idx}
                  className="text-[10px] sm:text-xs font-medium text-slate-500 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950/30 px-2 py-0.5 rounded-md transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Card Footer Actions */}
      {isExpanded && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30 rounded-b-2xl flex items-center justify-end gap-3 mt-auto">
          <button
            type="button"
            onClick={handleCopyAll}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
              copyStatus === 'all'
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                : 'bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 dark:bg-slate-850 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800'
            }`}
          >
            {copyStatus === 'all' ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied Full Post
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy Full Post
              </>
            )}
          </button>
        </div>
      )}

      {/* Edit modal */}
      {isEditorOpen && (
        <PostEditor
          post={post}
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={onUpdatePost}
        />
      )}

    </div>
  );
}
