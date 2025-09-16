'use client'

import { useState } from 'react';

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    profileImage: string;
  };
  action: 'liked' | 'replied' | 'restacked' | 'followed' | 'mentioned';
  content?: {
    title: string;
    preview: string;
  };
  timestamp: string;
  type: 'reply' | 'restack' | 'general';
}

interface ActivitySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ActivitySidebar({ isOpen, onClose }: ActivitySidebarProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'replies' | 'restacks'>('all');

  // Dummy activity data to show the design
  const activities: ActivityItem[] = [
    {
      id: '1',
      user: {
        name: 'Sarah Chen',
        avatar: '👩‍💻',
        profileImage: '/api/placeholder/40/40'
      },
      action: 'liked',
      content: {
        title: 'Building Modern Web Applications',
        preview: 'Your insights on React development patterns were exactly what I needed for my current project...'
      },
      timestamp: '2 hours ago',
      type: 'general'
    },
    {
      id: '2',
      user: {
        name: 'Marcus Williams',
        avatar: '👨‍💼',
        profileImage: '/api/placeholder/40/40'
      },
      action: 'replied',
      content: {
        title: 'The Future of Remote Work',
        preview: 'Great points about async communication. I\'d add that time zone management is crucial...'
      },
      timestamp: '4 hours ago',
      type: 'reply'
    },
    {
      id: '3',
      user: {
        name: 'Elena Rodriguez',
        avatar: '🎨',
        profileImage: '/api/placeholder/40/40'
      },
      action: 'restacked',
      content: {
        title: 'Design System Best Practices',
        preview: 'This article perfectly captures the challenges we face in maintaining consistency across teams...'
      },
      timestamp: '6 hours ago',
      type: 'restack'
    },
    {
      id: '4',
      user: {
        name: 'David Kim',
        avatar: '☕',
        profileImage: '/api/placeholder/40/40'
      },
      action: 'followed',
      timestamp: '1 day ago',
      type: 'general'
    },
    {
      id: '5',
      user: {
        name: 'Maya Patel',
        avatar: '🧘‍♀️',
        profileImage: '/api/placeholder/40/40'
      },
      action: 'mentioned',
      content: {
        title: 'Mindful Productivity Techniques',
        preview: 'Thanks for the inspiration! @you your approach to work-life balance has really helped me...'
      },
      timestamp: '2 days ago',
      type: 'general'
    },
    {
      id: '6',
      user: {
        name: 'James Thompson',
        avatar: '🌍',
        profileImage: '/api/placeholder/40/40'
      },
      action: 'replied',
      content: {
        title: 'Digital Nomad Guide 2025',
        preview: 'Your section on remote work tools is spot on. I\'ve been using similar setups for years...'
      },
      timestamp: '3 days ago',
      type: 'reply'
    }
  ];

  const filteredActivities = activities.filter(activity => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'replies') return activity.type === 'reply';
    if (activeFilter === 'restacks') return activity.type === 'restack';
    return true;
  });

  const getActionText = (action: string, userName: string) => {
    switch (action) {
      case 'liked':
        return `${userName} liked your post`;
      case 'replied':
        return `${userName} replied to your post`;
      case 'restacked':
        return `${userName} restacked your post`;
      case 'followed':
        return `${userName} started following you`;
      case 'mentioned':
        return `${userName} mentioned you in a post`;
      default:
        return `${userName} interacted with your content`;
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'liked':
        return (
          <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'replied':
        return (
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        );
      case 'restacked':
        return (
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
          </div>
        );
      case 'followed':
        return (
          <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        );
      case 'mentioned':
        return (
          <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* Semi-transparent Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Activity Sidebar - Slides in from right */}
      <div 
        className={`fixed right-0 top-0 h-full w-96 bg-gray-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Activity</h2>
          <div className="flex items-center space-x-4">
            <button className="text-sm text-orange-400 hover:text-orange-300 transition-colors font-medium">
              See all
            </button>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
              aria-label="Close activity sidebar"
            >
              <svg className="w-5 h-5 text-gray-400 hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex space-x-1 bg-gray-700 p-1 rounded-lg">
            {[
              { key: 'all', label: 'All' },
              { key: 'replies', label: 'Replies' },
              { key: 'restacks', label: 'Restacks' }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => setActiveFilter(filter.key as 'all' | 'replies' | 'restacks')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activeFilter === filter.key
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'text-gray-300 hover:text-white hover:bg-gray-600'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Feed */}
        <div className="flex-1 overflow-y-auto">
          {filteredActivities.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center p-6">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No activity yet</h3>
              <p className="text-gray-400 text-sm max-w-xs">
                When people interact with your content, you'll see their activity here
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {filteredActivities.map((activity) => (
                <div key={activity.id} className="p-4 hover:bg-gray-750 transition-colors cursor-pointer">
                  <div className="flex space-x-3">
                    {/* Profile Picture with Action Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center text-lg font-medium">
                        {activity.user.avatar}
                      </div>
                      
                      {/* Action Icon Overlay */}
                      <div className="absolute -bottom-1 -right-1">
                        {getActionIcon(activity.action)}
                      </div>
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-sm text-gray-300 font-medium">
                          {getActionText(activity.action, activity.user.name)}
                        </p>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
                          {activity.timestamp}
                        </span>
                      </div>
                      
                      {activity.content && (
                        <div className="mt-3 p-3 bg-gray-900 rounded-lg border border-gray-600">
                          <h4 className="text-sm font-semibold text-white mb-2 line-clamp-1">
                            {activity.content.title}
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {activity.content.preview}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}