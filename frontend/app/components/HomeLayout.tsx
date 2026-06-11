'use client'

import { useState, ReactNode } from 'react';
import SidebarNavigation from '../home/components/SidebarNavigation';
import MobileBottomMenu from '../home/components/MobileBottomMenu';
import MobileFAB from '../home/components/MobileFAB';
import BottomNavigationBar from '../home/components/BottomNavigationBar';
import SearchBar from '../components/SearchBar';
import AuthGateModal from '../components/AuthGateModal';
import { useRouter } from 'next/navigation';
import { useUser } from '@/context/UserContext';

interface HomeLayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export default function HomeLayout({ children, showSidebar = true }: HomeLayoutProps) {
  const [isMobileBottomMenuOpen, setIsMobileBottomMenuOpen] = useState(false);
  const router = useRouter();
  const { user, loading } = useUser();

  const closeMobileBottomMenu = () => setIsMobileBottomMenuOpen(false);

  return (
    <div className="bg-gray-900 min-h-screen flex flex-col overflow-hidden">

      {/* ── Full-width fixed top bar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-4">
        {/* Logo */}
        <button
          onClick={() => router.push('/home')}
          className="flex items-center gap-2 flex-shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">C</span>
          </div>
          <span className="text-white font-bold text-base hidden lg:block">CreatorCMS</span>
        </button>

        {/* Search bar */}
        <div className="flex-1 min-w-0">
          <SearchBar />
        </div>

        {/* Auth buttons — only shown to guests */}
        {!loading && !user && (
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => router.push('/auth/signin')}
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-gray-200 hover:text-white transition-all duration-200 hover:bg-white/10"
              style={{ border: '1px solid rgba(255,255,255,0.18)' }}
            >
              Log In
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              className="px-4 py-1.5 rounded-full text-sm font-semibold text-white transition-all duration-200 hover:scale-105 shadow-md"
              style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            >
              Sign Up
            </button>
          </div>
        )}
      </header>

      {/* ── Body ── */}
      <div className="flex flex-1 pt-14">

        {/* Left Sidebar — only on home/chat/activity pages */}
        {showSidebar && <SidebarNavigation />}

        {/* Thin vertical divider — only when sidebar is shown */}
        {showSidebar && (
          <div className="fixed top-14 bottom-0 z-30 w-px bg-gray-800 left-16 lg:left-64 hidden md:block" />
        )}

        {/* Mobile Bottom Menu */}
        <MobileBottomMenu isOpen={isMobileBottomMenuOpen} onClose={closeMobileBottomMenu} />

        {/* Main content */}
        <main className={`flex-1 flex flex-col min-h-0 ${showSidebar ? 'ml-0 md:ml-16 lg:ml-64' : 'ml-0'}`}>
          {children}
        </main>
      </div>

      <MobileFAB />
      <BottomNavigationBar />

      {/* Auth Gate Modal — mounted once here, opened from anywhere */}
      <AuthGateModal />
    </div>
  );
}