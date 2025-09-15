'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const [activeNav, setActiveNav] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'auto' | 'light' | 'dark'>('dark');
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsAppearanceOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📚' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'dashboard', label: 'Dashboard', icon: '📈' }
  ];

  const handleCreateClick = () => {
    router.push('/publish');
    onClose();
  };

  const handleNavClick = (itemId: string) => {
    setActiveNav(itemId);
    // Add navigation logic here if needed
    onClose();
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleThemeChange = (theme: 'auto' | 'light' | 'dark') => {
    setCurrentTheme(theme);
    console.log(`Theme changed to: ${theme}`);
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Mobile Menu */}
      <div className={`fixed left-0 top-0 h-full w-80 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 md:hidden ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <span className="text-xl font-bold">CreatorCMS</span>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 py-6 overflow-y-auto">
          <ul className="space-y-2 px-4">
            {navigationItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeNav === item.id
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Create Button */}
          <div className="px-4 mt-8">
            <button 
              onClick={handleCreateClick}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Create New Post
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mx-4 mt-8" />

          {/* User Profile Section */}
          <div className="relative p-4" ref={profileRef}>
            <button 
              onClick={handleProfileClick}
              className="w-full flex items-center space-x-3 hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">JD</span>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-white truncate">John Doe</p>
                <p className="text-xs text-gray-400 truncate">john.doe@example.com</p>
              </div>
              <div className={`text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </button>

            {/* Profile Options */}
            {isProfileOpen && (
              <div className="mt-2 space-y-1">
                {/* View Profile */}
                <button
                  onClick={onClose}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 rounded-lg"
                >
                  <span className="text-lg">👤</span>
                  <span className="text-sm font-medium">View Profile</span>
                </button>

                {/* Appearance Toggle */}
                <div>
                  <button
                    onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-200 rounded-lg ${
                      isAppearanceOpen 
                        ? 'bg-gray-800 text-white' 
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">🎨</span>
                    <span className="text-sm font-medium">Appearance</span>
                    <svg 
                      className={`w-4 h-4 ml-auto text-gray-400 transition-transform duration-200 ${
                        isAppearanceOpen ? 'rotate-90' : ''
                      }`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  
                  {/* Theme Options */}
                  {isAppearanceOpen && (
                    <div className="ml-4 mt-1 space-y-1">
                      {[
                        { id: 'auto', label: 'Auto', icon: '⚙️' },
                        { id: 'light', label: 'Light', icon: '☀️' },
                        { id: 'dark', label: 'Dark', icon: '🌙' }
                      ].map((themeOption) => (
                        <button
                          key={themeOption.id}
                          onClick={() => handleThemeChange(themeOption.id as 'auto' | 'light' | 'dark')}
                          className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm rounded-md transition-colors duration-200 ${
                            currentTheme === themeOption.id
                              ? 'bg-gray-700 text-white font-semibold'
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                          }`}
                        >
                          <span className="text-base">{themeOption.icon}</span>
                          <span className="flex-1">{themeOption.label}</span>
                          {currentTheme === themeOption.id && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sign Out */}
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-200 font-medium rounded-lg"
                >
                  <span className="text-lg">🚪</span>
                  <span className="text-sm font-semibold">Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </>
  );
}