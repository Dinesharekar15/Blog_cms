'use client'

import { useState, useRef, useEffect } from 'react';

interface MobileBottomMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileBottomMenu({ isOpen, onClose }: MobileBottomMenuProps) {
  const [isAppearanceOpen, setIsAppearanceOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'auto' | 'light' | 'dark'>('dark');
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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

  const handleThemeChange = (theme: 'auto' | 'light' | 'dark') => {
    setCurrentTheme(theme);
    console.log(`Theme changed to: ${theme}`);
  };

  const handleSignOut = () => {
    console.log('Signing out...');
    onClose();
  };

  const handleViewProfile = () => {
    console.log('View profile clicked');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-transparent z-50 md:hidden"
        onClick={onClose}
      />
      
      {/* Bottom Menu Card */}
      <div 
        ref={menuRef}
        className={`fixed bottom-0 left-0 right-0 bg-gray-800 rounded-t-xl shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle Bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-12 h-1 bg-gray-600 rounded-full"></div>
        </div>

        <div className="p-6">
          {/* Profile Section */}
          <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-700 rounded-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">JD</span>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold">John Doe</h3>
              <p className="text-gray-400 text-sm">john.doe@example.com</p>
            </div>
            <button
              onClick={handleViewProfile}
              className="text-orange-500 hover:text-orange-400 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div className="space-y-2">
            {/* Appearance Section */}
            <div>
              <button
                onClick={() => setIsAppearanceOpen(!isAppearanceOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-lg transition-colors duration-200 ${
                  isAppearanceOpen 
                    ? 'bg-gray-700 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xl">🎨</span>
                  <span className="font-medium">Appearance</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isAppearanceOpen ? 'rotate-180' : ''
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Theme Options */}
              {isAppearanceOpen && (
                <div className="mt-2 ml-4 space-y-1">
                  {[
                    { id: 'auto', label: 'Auto', icon: '⚙️' },
                    { id: 'light', label: 'Light', icon: '☀️' },
                    { id: 'dark', label: 'Dark', icon: '🌙' }
                  ].map((themeOption) => (
                    <button
                      key={themeOption.id}
                      onClick={() => handleThemeChange(themeOption.id as 'auto' | 'light' | 'dark')}
                      className={`w-full flex items-center space-x-3 p-3 text-left rounded-lg transition-colors duration-200 ${
                        currentTheme === themeOption.id
                          ? 'bg-gray-600 text-white font-semibold'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      }`}
                    >
                      <span className="text-lg">{themeOption.icon}</span>
                      <span className="flex-1">{themeOption.label}</span>
                      {currentTheme === themeOption.id && (
                        <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 p-4 text-left text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors duration-200 font-medium rounded-lg"
            >
              <span className="text-xl">🚪</span>
              <span className="font-semibold">Sign Out</span>
            </button>
          </div>

          {/* Close button area */}
          <div className="mt-6 pt-4 border-t border-gray-700">
            <button
              onClick={onClose}
              className="w-full py-3 text-gray-400 hover:text-white transition-colors duration-200 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}