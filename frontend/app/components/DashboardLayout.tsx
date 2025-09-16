'use client'

import { useState, ReactNode } from 'react';
import SidebarNavigation from '../home/components/SidebarNavigation';
import ActivitySidebar from '../components/ActivitySidebar';
import SearchModal from '../components/SearchModal';

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

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
        {children}
      </div>
    </div>
  );
}