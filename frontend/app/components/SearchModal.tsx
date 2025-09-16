'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, XIcon } from '@heroicons/react/outline';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const recentSearches = [
  'Next.js tutorials',
  'React best practices',
  'TypeScript guide',
  'Web development',
  'JavaScript frameworks'
];

const popularSuggestions = [
  'Getting started with React',
  'Advanced TypeScript patterns',
  'Building scalable applications',
  'Modern web development',
  'Frontend architecture',
  'Performance optimization'
];

const filterTabs = [
  { id: 'top', label: 'Top', active: true },
  { id: 'posts', label: 'Posts', active: false },
  { id: 'publications', label: 'Publications', active: false },
  { id: 'people', label: 'People', active: false },
  { id: 'notes', label: 'Notes', active: false }
];

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('top');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&filter=${activeFilter}`);
      onClose();
      setQuery('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    router.push(`/search?q=${encodeURIComponent(suggestion)}&filter=${activeFilter}`);
    onClose();
    setQuery('');
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
        onClick={handleBackdropClick}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16 md:pt-24">
        <div className="relative bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white">Search</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-6 pb-4">
            <div className="relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Search for posts, people, or topics..."
                className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="px-6 pb-4">
            <div className="flex space-x-1 bg-gray-900 rounded-lg p-1">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeFilter === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            {query.length === 0 ? (
              <div className="space-y-6">
                {/* Recent Searches */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Recent Searches</h3>
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(search)}
                        className="flex items-center w-full p-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors group"
                      >
                        <SearchIcon className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                        <span className="group-hover:text-white">{search}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Popular Suggestions */}
                <div>
                  <h3 className="text-sm font-medium text-gray-300 mb-3">Popular Suggestions</h3>
                  <div className="space-y-2">
                    {popularSuggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center w-full p-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors group"
                      >
                        <div className="w-4 h-4 bg-purple-500/20 rounded mr-3 flex-shrink-0 flex items-center justify-center">
                          <span className="text-purple-400 text-xs">🔥</span>
                        </div>
                        <span className="group-hover:text-white">{suggestion}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              // Show search suggestions when typing
              <div>
                <h3 className="text-sm font-medium text-gray-300 mb-3">Suggestions</h3>
                <div className="space-y-2">
                  {popularSuggestions
                    .filter(suggestion => 
                      suggestion.toLowerCase().includes(query.toLowerCase())
                    )
                    .slice(0, 5)
                    .map((suggestion, index) => (
                      <button
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="flex items-center w-full p-2 text-left text-gray-300 hover:bg-gray-700 rounded-lg transition-colors group"
                      >
                        <SearchIcon className="w-4 h-4 text-gray-500 mr-3 flex-shrink-0" />
                        <span className="group-hover:text-white">{suggestion}</span>
                      </button>
                    ))}
                  
                  {/* Search for current query */}
                  <button
                    onClick={handleSearch}
                    className="flex items-center w-full p-2 text-left text-white hover:bg-purple-600/20 rounded-lg transition-colors group border border-purple-500/30"
                  >
                    <SearchIcon className="w-4 h-4 text-purple-400 mr-3 flex-shrink-0" />
                    <span>Search for "<span className="text-purple-400">{query}</span>"</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-900/50 rounded-b-xl border-t border-gray-700">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">Enter</kbd> to search</span>
                <span>Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded text-xs">Esc</kbd> to close</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}