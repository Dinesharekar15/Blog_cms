'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SidebarNavigation() {
  const [activeNav, setActiveNav] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'auto' | 'light' | 'dark'>('dark');
  const profileRef = useRef<HTMLDivElement>(null);
  const appearanceRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close profile popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
        setIsAppearanceOpen(false); // Also close theme dropdown
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'subscriptions', label: 'Subscriptions', icon: '📚' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'activity', label: 'Activity', icon: '📊' },
    { id: 'search', label: 'Search', icon: '🔍' },
    { id: 'dashboard', label: 'Dashboard', icon: '📈' }
  ];

  const profileMenuItems = [
    {
      section: 'settings',
      items: [
        { id: 'appearance', label: 'Appearance', icon: '🎨' }
      ]
    }
  ];

  const handleCreateClick = () => {
    // Navigate to the publish page
    router.push('/publish');
  };

  const handleProfileClick = () => {
    const wasOpen = isProfileOpen;
    setIsProfileOpen(!isProfileOpen);
    // Close theme dropdown when profile popup closes
    if (wasOpen) {
      setIsAppearanceOpen(false);
    }
  };

  const handleProfileMenuClick = (itemId: string) => {
    if (itemId === 'sign-out') {
      // Handle sign out logic
      console.log('Signing out...');
      setIsProfileOpen(false);
    } else if (itemId === 'appearance') {
      // Toggle appearance dropdown
      setIsAppearanceOpen(!isAppearanceOpen);
      return;
    } else {
      // Handle other menu item clicks
      console.log(`Clicked: ${itemId}`);
      setIsProfileOpen(false);
    }
  };

  const handleThemeChange = (theme: 'auto' | 'light' | 'dark') => {
    setCurrentTheme(theme);
    // Here you would implement actual theme switching logic
    console.log(`Theme changed to: ${theme}`);
    // Don't close the dropdown - let user click "Appearance" to close it
  };

  return (
    <div className="bg-gray-900 text-white w-64 md:w-16 h-screen flex-col fixed left-0 top-0 z-40 hidden md:flex">
      {/* Logo Section */}
      <div className="p-6 md:p-4 border-b border-gray-800">
        <div className="flex items-center space-x-3 md:justify-center">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <span className="text-xl font-bold md:hidden">CreatorCMS</span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4 md:px-2">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setActiveNav(item.id)}
                className={`w-full flex items-center space-x-3 md:justify-center md:space-x-0 px-4 md:px-2 py-3 rounded-lg text-left md:text-center transition-all duration-200 cursor-pointer group relative ${
                  activeNav === item.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                title={item.label} // Tooltip for icon-only mode
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium md:hidden">{item.label}</span>
                {/* Tooltip for tablet mode */}
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Create Button */}
        <div className="px-4 md:px-2 mt-8">
          <button 
            onClick={handleCreateClick}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-6 md:px-2 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer group relative"
            title="Create"
          >
            <span className="md:hidden">Create</span>
            <span className="hidden md:block text-xl">✏️</span>
            {/* Tooltip for tablet mode */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap pointer-events-none z-50">
              Create
            </span>
          </button>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="relative p-4 md:p-2 border-t border-gray-800" ref={profileRef}>
        <button 
          onClick={handleProfileClick}
          className="w-full flex items-center space-x-3 md:justify-center md:space-x-0 hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200 cursor-pointer group relative"
          title="Profile"
        >
          <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">JD</span>
          </div>
          <div className="flex-1 min-w-0 text-left md:hidden">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-gray-400 truncate">john.doe@example.com</p>
          </div>
          <div className={`text-gray-400 transition-transform duration-200 md:hidden ${isProfileOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          {/* Tooltip for tablet mode */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap pointer-events-none z-50">
            John Doe
          </span>
        </button>

        {/* Profile Pop-up Card */}
        {isProfileOpen && (
          <div className="absolute bottom-0 left-full ml-2 md:ml-4 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-lg">JD</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">John Doe</p>
                  <button 
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 cursor-pointer"
                    onClick={() => handleProfileMenuClick('view-profile')}
                  >
                    View profile
                  </button>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="max-h-80 overflow-y-auto scrollbar-auto-hide">
              {profileMenuItems.map((section, sectionIndex) => (
                <div key={section.section} className={sectionIndex > 0 ? 'border-t border-gray-700' : ''}>
                  <div className="py-2">
                    {section.items.map((item) => (
                      <div key={item.id} className="relative">
                        {item.id === 'appearance' ? (
                          <div>
                            <button
                              onClick={() => handleProfileMenuClick(item.id)}
                              className={`w-full flex items-center space-x-3 px-4 py-2 text-left transition-colors duration-200 cursor-pointer ${
                                isAppearanceOpen 
                                  ? 'bg-gray-700 text-white' 
                                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                              }`}
                            >
                              <span className="text-lg">{item.icon}</span>
                              <span className="text-sm font-medium">{item.label}</span>
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
                            
                            {/* Theme Options Below Appearance */}
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
                                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left text-sm rounded-md transition-colors duration-200 cursor-pointer ${
                                      currentTheme === themeOption.id
                                        ? 'bg-gray-600 text-white font-semibold'
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
                        ) : (
                          <button
                            onClick={() => handleProfileMenuClick(item.id)}
                            className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer"
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span className="text-sm font-medium">{item.label}</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {/* Sign Out (Special styling) */}
              <div className="border-t border-gray-700">
                <button
                  onClick={() => handleProfileMenuClick('sign-out')}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-200 font-medium cursor-pointer"
                >
                  <span className="text-lg">🚪</span>
                  <span className="text-sm font-semibold">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}