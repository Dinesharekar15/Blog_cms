'use client'

import { useState } from 'react';

interface TopNavigationProps {
  onMobileMenuToggle?: () => void;
}

export default function TopNavigation({ onMobileMenuToggle }: TopNavigationProps) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All' },
    { id: 'culture', label: 'Culture' },
    { id: 'business', label: 'Business' },
    { id: 'politics', label: 'Politics' },
    { id: 'food-drink', label: 'Food & Drink' },
    { id: 'technology', label: 'Technology' },
    { id: 'science', label: 'Science' },
    { id: 'travel', label: 'Travel' },
    { id: 'health', label: 'Health' }
  ];

  const featuredContent = [
    {
      id: 1,
      title: "The Future of Remote Work",
      author: "Sarah Chen",
      image: "📊",
      category: "Business"
    },
    {
      id: 2,
      title: "Culinary Adventures in Tokyo",
      author: "Marcus Kim",
      image: "🍜",
      category: "Food"
    },
    {
      id: 3,
      title: "Climate Change Solutions",
      author: "Elena Rodriguez",
      image: "🌱",
      category: "Science"
    },
    {
      id: 4,
      title: "Digital Art Revolution",
      author: "Alex Morgan",
      image: "🎨",
      category: "Culture"
    }
  ];

  return (
    <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
      {/* Mobile Header */}
      <div className="md:hidden px-4 py-3 flex items-center justify-between">
        {/* Left: Logo and Page Name */}
        <div className=" flex items-center space-x-3">
          <div className="cursor-pointer w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <h1 className="text-lg font-semibold text-white">Home</h1>
        </div>
        
        {/* Center: Empty space */}
        <div className="flex-1"></div>
        
        {/* Right: Action Icons */}
        <div className="flex items-center space-x-1">
          {/* Search Icon */}
          <button className="p-2 cursor-pointer rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          {/* Activity Icon (Bell) */}
          <button className="p-2 cursor-pointer rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
          </button>
          
          {/* Three Line Menu Icon */}
          <button
            onClick={onMobileMenuToggle}
            className="p-2 cursor-pointer rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Content */}
      <div className="hidden md:block px-6 py-4">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-200"
              placeholder="What's on your mind?"
            />
          </div>
        </div>

        {/* Content Categories */}
        <div className="mb-6">
          <div className="flex space-x-1 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>


    </div>
  );
}