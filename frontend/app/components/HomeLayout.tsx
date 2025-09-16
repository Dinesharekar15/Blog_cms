'use client'

import { useState, ReactNode } from 'react';
import SidebarNavigation from '../home/components/SidebarNavigation';
import TopNavigation from '../home/components/TopNavigation';
import RightSidebar from '../home/components/RightSidebar';
import MobileBottomMenu from '../home/components/MobileBottomMenu';
import MobileFAB from '../home/components/MobileFAB';
import BottomNavigationBar from '../home/components/BottomNavigationBar';
import ActivitySidebar from '../components/ActivitySidebar';
import SearchModal from '../components/SearchModal';

interface HomeLayoutProps {
  children: ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  const [isMobileBottomMenuOpen, setIsMobileBottomMenuOpen] = useState(false);
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const toggleMobileBottomMenu = () => {
    setIsMobileBottomMenuOpen(!isMobileBottomMenuOpen);
  };

  const closeMobileBottomMenu = () => {
    setIsMobileBottomMenuOpen(false);
  };

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
      
      {/* Activity Sidebar - Slides in from right */}
      <ActivitySidebar 
        isOpen={isActivitySidebarOpen}
        onClose={handleActivityClose}
      />

      {/* Search Modal */}
      <SearchModal 
        isOpen={isSearchModalOpen} 
        onClose={handleSearchClose} 
      />
      
      {/* Mobile Bottom Menu */}
      <MobileBottomMenu isOpen={isMobileBottomMenuOpen} onClose={closeMobileBottomMenu} />
      
      {/* Main Content Area */}
      <div className="flex-1 
        ml-0 md:ml-16 lg:ml-64 
        mr-0 lg:mr-80 
        flex flex-col h-screen responsive-transition relative">
        
        {/* Fixed Top Navigation */}
        <TopNavigation onMobileMenuToggle={toggleMobileBottomMenu} />
        
        {/* Content */}
        {children}
      </div>

      {/* Desktop Right Sidebar */}
      <div className="fixed right-0 top-0 z-30 hidden lg:block">
        <RightSidebar />
      </div>

      {/* Mobile FAB */}
      <MobileFAB />

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar />
    </div>
  );
}