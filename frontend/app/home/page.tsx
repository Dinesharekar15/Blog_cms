'use client'

import { useState } from 'react';
import SidebarNavigation from './components/SidebarNavigation';
import TopNavigation from './components/TopNavigation';
import MainContentFeed from './components/MainContentFeed';
import RightSidebar from './components/RightSidebar';
import MobileBottomMenu from './components/MobileBottomMenu';
import MobileFAB from './components/MobileFAB';
import BottomNavigationBar from './components/BottomNavigationBar';

export default function HomePage() {
  const [isMobileBottomMenuOpen, setIsMobileBottomMenuOpen] = useState(false);

  const toggleMobileBottomMenu = () => {
    setIsMobileBottomMenuOpen(!isMobileBottomMenuOpen);
  };

  const closeMobileBottomMenu = () => {
    setIsMobileBottomMenuOpen(false);
  };

  return (
    <div className="bg-gray-900 min-h-screen flex overflow-hidden">
      {/* Desktop Left Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Mobile Bottom Menu */}
      <MobileBottomMenu isOpen={isMobileBottomMenuOpen} onClose={closeMobileBottomMenu} />
      
      {/* Main Content Area */}
      <div className="flex-1 
        ml-0 md:ml-16 lg:ml-64 
        mr-0 lg:mr-80 
        flex flex-col h-screen responsive-transition">
        
        {/* Fixed Top Navigation */}
        <TopNavigation onMobileMenuToggle={toggleMobileBottomMenu} />
        
        {/* Scrollable Content Feed */}
        <MainContentFeed />
      </div>

      {/* Desktop Right Sidebar */}
      <div className="fixed right-0 top-0 z-30 hidden lg:block">
        <RightSidebar />
      </div>

      {/* Mobile Floating Create Button */}
      <MobileFAB />

      {/* Bottom Navigation Bar */}
      <BottomNavigationBar />

    </div>
  );
}