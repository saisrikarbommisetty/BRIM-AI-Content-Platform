'use client';

import React, { useState } from 'react';
import { X, Check, FileText, Image, Hash } from 'lucide-react';
import { Post } from '../types';

interface PostEditorProps {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedPost: Post) => void;
}

export default function PostEditor({
  post,
  isOpen,
  onClose,
  onSave
}: PostEditorProps) {
  const [caption, setCaption] = useState(post.caption);
  const [visualDirection, setVisualDirection] = useState(post.visualDirection);
  const [hashtagsStr, setHashtagsStr] = useState(post.hashtags.join(', '));

  if (!isOpen) return null;

  const handleSave = () => {
    // Split and clean hashtags
    const hashtags = hashtagsStr
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0)
      .map(tag => (tag.startsWith('#') ? tag : `#${tag}`));

    onSave({
      ...post,
      caption,
      visualDirection,
      hashtags
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh] animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-950 dark:text-white">
              Edit Post #{String(post.postNumber).padStart(2, '0')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize publication caption, visual instruction, and tags.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-grow">
          {/* Caption field */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5 text-indigo-500" />
              Social Media Caption
            </label>
            <textarea
              rows={6}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all dark:bg-slate-950 dark:border-slate-800 dark:focus:border-indigo-400 dark:text-slate-200"
              placeholder="Write caption here..."
            />
          </div>

          {/* Visual direction field */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Image className="h-3.5 w-3.5 text-indigo-500" />
              Visual Direction
            </label>
            <textarea
              rows={3}
              value={visualDirection}
              onChange={(e) => setVisualDirection(e.target.value)}
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all dark:bg-slate-950 dark:border-slate-800 dark:focus:border-indigo-400 dark:text-slate-200"
              placeholder="Describe graphic or photography details..."
            />
          </div>

          {/* Hashtags field */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <Hash className="h-3.5 w-3.5 text-indigo-500" />
              Hashtags (comma separated)
            </label>
            <input
              type="text"
              value={hashtagsStr}
              onChange={(e) => setHashtagsStr(e.target.value)}
              className="w-full p-4 text-sm bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all dark:bg-slate-950 dark:border-slate-800 dark:focus:border-indigo-400 dark:text-slate-200"
              placeholder="e.g. #RealEstate, #NewHome, #Luxury"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-400 hover:dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-100 dark:shadow-none rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Check className="h-4 w-4" />
            Save Changes
          </button>
        </div>

      </div>
    </div>
  );
}
