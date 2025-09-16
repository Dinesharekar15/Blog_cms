'use client'

import { useState } from 'react';
import SidebarNavigation from '../home/components/SidebarNavigation';
import ActivitySidebar from '../components/ActivitySidebar';
import SearchModal from '../components/SearchModal';
import { 
  EyeIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon, 
  ThumbUpIcon, 
  ChatIcon,
  CalendarIcon,
  ChevronDownIcon
} from '@heroicons/react/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Mock data for charts
const performanceData = [
  { name: 'Jan', views: 4000, subscribers: 240, revenue: 240 },
  { name: 'Feb', views: 3000, subscribers: 139, revenue: 221 },
  { name: 'Mar', views: 2000, subscribers: 980, revenue: 229 },
  { name: 'Apr', views: 2780, subscribers: 390, revenue: 200 },
  { name: 'May', views: 1890, subscribers: 480, revenue: 218 },
  { name: 'Jun', views: 2390, subscribers: 380, revenue: 250 },
  { name: 'Jul', views: 3490, subscribers: 430, revenue: 210 },
];

const deviceData = [
  { name: 'Desktop', value: 400, color: '#8B5CF6' },
  { name: 'Mobile', value: 300, color: '#06B6D4' },
  { name: 'Tablet', value: 100, color: '#10B981' },
];

const topPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js 15",
    views: 15420,
    likes: 847,
    comments: 123,
    thumbnail: "/images/blog/1.jpeg"
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    views: 12350,
    likes: 692,
    comments: 89,
    thumbnail: "/images/blog/2.jpeg"
  },
  {
    id: 3,
    title: "Building Scalable APIs",
    views: 9870,
    likes: 523,
    comments: 67,
    thumbnail: "/images/blog/3.jpeg"
  }
];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "subscribed to your blog",
    time: "2 minutes ago"
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "commented on 'Getting Started with Next.js 15'",
    time: "15 minutes ago"
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "liked your post 'Advanced React Patterns'",
    time: "1 hour ago"
  },
  {
    id: 4,
    user: "Sarah Wilson",
    action: "shared your post",
    time: "3 hours ago"
  }
];

export default function DashboardPage() {
  const [selectedDateRange, setSelectedDateRange] = useState('Last 30 Days');
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const dateRanges = ['Today', 'Last 7 Days', 'Last 30 Days', 'All Time'];

  const handleActivityToggle = () => {
    setIsActivitySidebarOpen(!isActivitySidebarOpen);
  };

  const handleActivityClose = () => {
    setIsActivitySidebarOpen(false);
  };

  const handleSearchToggle = () => {
    setIsSearchModalOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchModalOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex overflow-hidden">
      {/* Desktop Left Sidebar Navigation */}
      <SidebarNavigation 
        onActivityClick={handleActivityToggle} 
        isActivityOpen={isActivitySidebarOpen}
        onSearchClick={handleSearchToggle}
      />
      
      {/* Activity Sidebar */}
      <ActivitySidebar 
        isOpen={isActivitySidebarOpen} 
        onClose={handleActivityClose} 
      />
      
      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={handleSearchClose} 
      />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-0 md:ml-16 lg:ml-64 flex flex-col h-screen">
        
        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">
            
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
                <h1 className="text-3xl font-bold text-white mb-4 sm:mb-0">Dashboard</h1>
                
                {/* Date Selector */}
                <div className="relative">
                  <button
                    onClick={() => setIsDateDropdownOpen(!isDateDropdownOpen)}
                    className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <CalendarIcon className="w-4 h-4" />
                    <span>{selectedDateRange}</span>
                    <ChevronDownIcon className={`w-4 h-4 transition-transform ${isDateDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isDateDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                      {dateRanges.map((range) => (
                        <button
                          key={range}
                          onClick={() => {
                            setSelectedDateRange(range);
                            setIsDateDropdownOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white first:rounded-t-lg last:rounded-b-lg transition-colors"
                        >
                          {range}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {/* Total Views Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        <EyeIcon className="w-5 h-5 text-purple-400" />
                      </div>
                      <h3 className="text-gray-300 text-sm font-medium">Total Views</h3>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">24,892</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-green-400 text-sm font-medium">+15%</span>
                        <span className="text-gray-400 text-xs">vs last period</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Subscribers Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-500/20 rounded-lg">
                        <UserGroupIcon className="w-5 h-5 text-cyan-400" />
                      </div>
                      <h3 className="text-gray-300 text-sm font-medium">Subscribers</h3>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">1,249</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-green-400 text-sm font-medium">+8%</span>
                        <span className="text-gray-400 text-xs">vs last period</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <CurrencyDollarIcon className="w-5 h-5 text-emerald-400" />
                      </div>
                      <h3 className="text-gray-300 text-sm font-medium">Revenue</h3>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">$3,247</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-red-400 text-sm font-medium">-3%</span>
                        <span className="text-gray-400 text-xs">vs last period</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Engagement Card */}
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500/20 rounded-lg">
                        <ThumbUpIcon className="w-5 h-5 text-yellow-400" />
                      </div>
                      <h3 className="text-gray-300 text-sm font-medium">Engagement</h3>
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-white">87%</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-green-400 text-sm font-medium">+12%</span>
                        <span className="text-gray-400 text-xs">vs last period</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Performance Chart */}
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 mb-8">
              <h2 className="text-xl font-semibold text-white mb-6">Performance Overview</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="name" 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      fontSize={12}
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        color: '#F3F4F6'
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Views"
                      dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="subscribers" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      name="Subscribers"
                      dot={{ fill: '#06B6D4', strokeWidth: 2, r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#10B981" 
                      strokeWidth={3}
                      name="Revenue ($)"
                      dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Grid - Detailed Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              
              {/* Top Performing Posts */}
              <div className="lg:col-span-2 xl:col-span-2 bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Top Performing Posts</h3>
                <div className="space-y-4">
                  {topPosts.map((post) => (
                    <div key={post.id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
                      <img 
                        src={post.thumbnail} 
                        alt={post.title}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium truncate">{post.title}</h4>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <EyeIcon className="w-4 h-4" />
                            {post.views.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <ThumbUpIcon className="w-4 h-4" />
                            {post.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <ChatIcon className="w-4 h-4" />
                            {post.comments}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience Demographics */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Audience by Device</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                          color: '#F3F4F6'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-4">
                  {deviceData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-gray-300 text-sm">{item.name}</span>
                      </div>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="lg:col-span-2 xl:col-span-1 bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <UserGroupIcon className="w-4 h-4 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-300 text-sm">
                          <span className="text-white font-medium">{activity.user}</span>
                          {' '}
                          {activity.action}
                        </p>
                        <p className="text-gray-400 text-xs mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
