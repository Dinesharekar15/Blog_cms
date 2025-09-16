'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import { SearchIcon, EyeIcon, ThumbUpIcon, ChatIcon, UserGroupIcon } from '@heroicons/react/outline';

const filterTabs = [
  { id: 'top', label: 'Top' },
  { id: 'posts', label: 'Posts' },
  { id: 'publications', label: 'Publications' },
  { id: 'people', label: 'People' },
  { id: 'notes', label: 'Notes' }
];

// Mock search results data
const mockSearchResults = [
  {
    id: 1,
    type: 'post',
    title: "Getting Started with Next.js 15 - A Complete Guide",
    author: "Dinesh Arekar",
    authorAvatar: "/images/blog/1.jpeg",
    content: "Learn how to build modern web applications with Next.js 15. This comprehensive guide covers everything from installation to deployment...",
    publishedAt: "2 days ago",
    views: 15420,
    likes: 847,
    comments: 123,
    thumbnail: "/images/blog/1.jpeg"
  },
  {
    id: 2,
    type: 'post',
    title: "Advanced React Patterns Every Developer Should Know",
    author: "Sarah Johnson",
    authorAvatar: "/images/blog/2.jpeg",
    content: "Explore advanced React patterns including render props, higher-order components, and custom hooks. These patterns will help you write more reusable...",
    publishedAt: "5 days ago",
    views: 12350,
    likes: 692,
    comments: 89,
    thumbnail: "/images/blog/2.jpeg"
  },
  {
    id: 3,
    type: 'people',
    name: "Dinesh Kumar",
    username: "@dineshkumar",
    bio: "Full-stack developer passionate about React, Node.js, and modern web technologies. Building the future of web development.",
    followers: 2340,
    following: 892,
    avatar: "/images/blog/3.jpeg"
  },
  {
    id: 4,
    type: 'post',
    title: "Building Scalable APIs with Node.js and TypeScript",
    author: "Mike Chen",
    authorAvatar: "/images/blog/1.jpeg",
    content: "Learn how to architect and build scalable REST APIs using Node.js and TypeScript. This guide covers best practices, error handling...",
    publishedAt: "1 week ago",
    views: 9870,
    likes: 523,
    comments: 67,
    thumbnail: "/images/blog/3.jpeg"
  },
  {
    id: 5,
    type: 'publication',
    name: "Tech Weekly",
    description: "Your weekly dose of technology news, tutorials, and insights from industry experts.",
    subscribers: 45200,
    posts: 324,
    avatar: "/images/blog/2.jpeg"
  }
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('top');
  const [filteredResults, setFilteredResults] = useState(mockSearchResults);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get query and filter from URL parameters
  useEffect(() => {
    if (searchParams) {
      const urlQuery = searchParams.get('q') || '';
      const urlFilter = searchParams.get('filter') || 'top';
      setQuery(urlQuery);
      setActiveFilter(urlFilter);
    }
  }, [searchParams]);

  // Filter results based on active filter
  useEffect(() => {
    if (activeFilter === 'top') {
      setFilteredResults(mockSearchResults);
    } else {
      setFilteredResults(mockSearchResults.filter(result => result.type === activeFilter.slice(0, -1))); // Remove 's' from 'posts' -> 'post'
    }
  }, [activeFilter]);

  const handleSearch = () => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}&filter=${activeFilter}`);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
    router.push(`/search?q=${encodeURIComponent(query)}&filter=${filterId}`);
  };

  const renderSearchResult = (result: any) => {
    if (result.type === 'post') {
      return (
        <div key={result.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex gap-4">
            {result.thumbnail && (
              <img 
                src={result.thumbnail} 
                alt={result.title}
                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">{result.title}</h3>
              <div className="flex items-center gap-2 mb-3">
                <img 
                  src={result.authorAvatar} 
                  alt={result.author}
                  className="w-6 h-6 rounded-full"
                />
                <span className="text-gray-300 text-sm">{result.author}</span>
                <span className="text-gray-500 text-sm">•</span>
                <span className="text-gray-500 text-sm">{result.publishedAt}</span>
              </div>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">{result.content}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <EyeIcon className="w-4 h-4" />
                  {result.views?.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbUpIcon className="w-4 h-4" />
                  {result.likes}
                </span>
                <span className="flex items-center gap-1">
                  <ChatIcon className="w-4 h-4" />
                  {result.comments}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (result.type === 'people') {
      return (
        <div key={result.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center gap-4">
            <img 
              src={result.avatar} 
              alt={result.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{result.name}</h3>
              <p className="text-gray-400 text-sm mb-2">{result.username}</p>
              <p className="text-gray-300 text-sm mb-3">{result.bio}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span>{result.followers?.toLocaleString()} followers</span>
                <span>{result.following?.toLocaleString()} following</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
              Follow
            </button>
          </div>
        </div>
      );
    } else if (result.type === 'publication') {
      return (
        <div key={result.id} className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
          <div className="flex items-center gap-4">
            <img 
              src={result.avatar} 
              alt={result.name}
              className="w-16 h-16 rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{result.name}</h3>
              <p className="text-gray-300 text-sm mb-3">{result.description}</p>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <UserGroupIcon className="w-4 h-4" />
                  {result.subscribers?.toLocaleString()} subscribers
                </span>
                <span>{result.posts} posts</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <DashboardLayout>
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 md:p-6 lg:p-8">
            
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-white mb-6">Search Results</h1>
              
              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative max-w-2xl">
                  <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Search for posts, people, or topics..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="mb-6">
                <div className="flex space-x-1 bg-gray-800 rounded-lg p-1 w-fit">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleFilterChange(tab.id)}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeFilter === tab.id
                          ? 'bg-purple-600 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Results Count */}
              {query && (
                <div className="mb-6">
                  <p className="text-gray-400">
                    Found <span className="text-white font-medium">{filteredResults.length}</span> results for 
                    <span className="text-purple-400 font-medium"> "{query}"</span>
                  </p>
                </div>
              )}
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {filteredResults.length > 0 ? (
                filteredResults.map(renderSearchResult)
              ) : (
                <div className="text-center py-12">
                  <SearchIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">No results found</h3>
                  <p className="text-gray-500">
                    {query ? `No results for "${query}". Try different keywords or check your spelling.` : 'Enter a search term to get started'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
    </DashboardLayout>
  );
}