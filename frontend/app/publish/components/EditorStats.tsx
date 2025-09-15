'use client';

import React from 'react';

interface EditorStatsProps {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  lastSaved?: Date;
}

export default function EditorStats({
  wordCount,
  characterCount,
  readingTime,
  saveStatus,
  lastSaved
}: EditorStatsProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700 px-6 py-3">
      <div className="flex items-center justify-between text-sm">
        {/* Left side - Statistics */}
        <div className="flex items-center space-x-6 text-gray-400">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>{wordCount.toLocaleString()} words</span>
          </div>

          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <span>{characterCount.toLocaleString()} characters</span>
          </div>

          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Right side - Save status */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className={`w-2 h-2 rounded-full mr-2 ${
              saveStatus === 'saved' ? 'bg-green-500' : 
              saveStatus === 'saving' ? 'bg-yellow-500 animate-pulse' : 
              'bg-red-500'
            }`} />
            <span className={`text-sm font-medium ${
              saveStatus === 'saved' ? 'text-green-400' : 
              saveStatus === 'saving' ? 'text-yellow-400' : 
              'text-red-400'
            }`}>
              {saveStatus === 'saved' ? 'Saved' : 
               saveStatus === 'saving' ? 'Saving...' : 
               'Unsaved'}
            </span>
          </div>

          {lastSaved && saveStatus === 'saved' && (
            <span className="text-xs text-gray-500">
              Last saved at {formatTime(lastSaved)}
            </span>
          )}

          {/* Online status */}
          <div className="flex items-center text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
}