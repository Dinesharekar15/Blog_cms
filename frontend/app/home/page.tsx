'use client'

import SidebarNavigation from './components/SidebarNavigation';
import TopNavigation from './components/TopNavigation';
import MainContentFeed from './components/MainContentFeed';
import RightSidebar from './components/RightSidebar';

export default function HomePage() {
  return (
    <div className="bg-gray-900 min-h-screen flex overflow-hidden">
      {/* Fixed Left Sidebar Navigation */}
      <SidebarNavigation />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 mr-80 flex flex-col h-screen">
        {/* Fixed Top Navigation */}
        <TopNavigation />
        
        {/* Scrollable Content Feed */}
        <MainContentFeed />
      </div>

      {/* Fixed Right Sidebar */}
      <div className="fixed right-0 top-0 z-30">
        <RightSidebar />
      </div>
    </div>
  );
}