'use client'

import { useState } from 'react';

export default function TopNavigation() {
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
      <div className="px-6 py-4">
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