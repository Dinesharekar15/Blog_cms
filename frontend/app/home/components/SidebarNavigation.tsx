'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { getProfileImageUrl } from '@/lib/cloudinary';
import { useAuthGate } from '@/context/AuthGateContext';

interface SidebarNavigationProps {
  onActivityClick?: () => void;
  isActivityOpen?: boolean;
}
type user = {
  name: string,
  email: string,
}
export default function SidebarNavigation({ onActivityClick, isActivityOpen }: SidebarNavigationProps) {
  const { openAuthGate } = useAuthGate();
  const [activeNav, setActiveNav] = useState('home');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  // const [user,setUser]= useState<user|null>(null);
  const { user, signout } = useUser();
  // Update active navigation based on current route
  useEffect(() => {
    if (pathname === '/home') {
      setActiveNav('home');
    } else if (pathname === '/chat') {
      setActiveNav('chat');
    } else if (pathname === '/dashboard') {
      setActiveNav('dashboard');
    } else if (pathname === '/search') {
      setActiveNav('search');
    } else if (pathname === '/publish') {
      setActiveNav('dashboard'); // or create a 'publish' nav item if needed
    }
    // Add more route mappings as needed
  }, [pathname]);

  // Close profile popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const navigationItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'chat', label: 'Chat', icon: '💬' },
    { id: 'activity', label: 'Activity', icon: '📊' },
  ];

  const profileMenuItems = [
    {
      section: 'settings',
      items: [
        { id: 'edit-profile', label: 'Edit Profile', icon: '✏️' },
      ]
    }
  ];

  const handleCreateClick = () => {
    if (!user) { openAuthGate(); return; }
    router.push('/publish');
  };

  const handleProfileClick = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleProfileMenuClick = async (itemId: string) => {
    if (itemId === 'sign-out') {
      setIsProfileOpen(false);
      await signout();
    } else if (itemId === 'view-profile' && user) {
      router.push(`/profile/${user.id}`);
      setIsProfileOpen(false);
    } else if (itemId === 'edit-profile') {
      router.push('/profile/edit');
      setIsProfileOpen(false);
    } else {
      console.log(`Clicked: ${itemId}`);
      setIsProfileOpen(false);
    }
  };


  return (
    <div
      className="bg-gray-900 text-white w-64 md:w-16 lg:w-64 flex-col fixed left-0 top-14 z-40 hidden md:flex"
      style={{ height: 'calc(100vh - 56px)' }}
    >
      {/* Logo Section */}

      {/* Navigation Links */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4 md:px-2 lg:px-4">
          {navigationItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => {
                  if (item.id === 'chat') {
                    if (!user) { openAuthGate(); return; }
                    setActiveNav(item.id);
                    router.push('/chat');
                  } else if (item.id === 'home') {
                    setActiveNav(item.id);
                    router.push('/home');
                  } else if (item.id === 'dashboard') {
                    setActiveNav(item.id);
                    router.push('/dashboard');
                  } else if (item.id === 'activity') {
                    if (!user) { openAuthGate(); return; }
                    if (onActivityClick) onActivityClick();
                  } else {
                    setActiveNav(item.id);
                  }
                }}
                className={`w-full flex items-center space-x-3 md:justify-center lg:justify-start md:space-x-0 lg:space-x-3 px-4 md:px-2 lg:px-4 py-3 rounded-lg text-left md:text-center lg:text-left transition-all duration-200 cursor-pointer group relative ${(item.id === 'activity' && isActivityOpen) || (item.id !== 'activity' && activeNav === item.id)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                title={item.label} // Tooltip for icon-only mode
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium md:hidden lg:block">{item.label}</span>
                {/* Tooltip for tablet mode only */}
                <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap pointer-events-none z-50">
                  {item.label}
                </span>
              </button>
            </li>
          ))}
        </ul>

        {/* Create Button */}
        <div className="px-4 md:px-2 lg:px-4 mt-8">
          <button
            onClick={handleCreateClick}
            className="w-full text-xl bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold py-3 px-6 md:px-2 lg:px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer group relative flex items-center justify-center"
            title="Create"
          >
            <span className="md:hidden lg:block">Create</span>
            <span className="hidden md:block lg:hidden text-xl">✏️</span>
            {/* Tooltip for tablet mode only */}
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap pointer-events-none z-50">
              Create
            </span>
          </button>
        </div>
      </nav>

      {/* User Profile Section — guest vs logged-in */}
      {!user ? (
        <div className="p-4 md:p-2 lg:p-4 border-t border-gray-800">
          <button
            onClick={openAuthGate}
            className="w-full flex items-center justify-center md:justify-center lg:justify-start space-x-2 md:space-x-0 lg:space-x-2 px-3 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-[1.02] group relative"
            style={{ background: 'linear-gradient(135deg, #f97316, #ec4899)' }}
            title="Sign In"
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
            </svg>
            <span className="md:hidden lg:block">Sign In</span>
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap pointer-events-none z-50">Sign In</span>
          </button>
        </div>
      ) : (
      <div className="relative p-4 md:p-2 lg:p-4 border-t border-gray-800" ref={profileRef}>
        <button
          onClick={handleProfileClick}
          className="w-full flex items-center space-x-3 md:justify-center lg:justify-start md:space-x-0 lg:space-x-3 hover:bg-gray-800 rounded-lg p-2 transition-colors duration-200 cursor-pointer group relative"
          title="Profile"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
            {getProfileImageUrl(user?.profileImg) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={getProfileImageUrl(user?.profileImg)!} alt={user?.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                <span className="text-white font-semibold">{user?.name.charAt(0).toUpperCase() || ""}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 text-left md:hidden lg:block">
            <p className="text-sm font-medium text-white truncate">{user?.name}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>
          <div className={`text-gray-400 transition-transform duration-200 md:hidden lg:block ${isProfileOpen ? 'rotate-180' : ''}`}>
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
          {/* Tooltip for tablet mode only */}
          <span className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 hidden md:block lg:hidden whitespace-nowrap pointer-events-none z-50">
            {user?.name}
          </span>
        </button>

        {/* Profile Pop-up Card */}
        {isProfileOpen && (
          <div className="absolute bottom-0 left-full ml-2 md:ml-4 w-80 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                  {getProfileImageUrl(user?.profileImg) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={getProfileImageUrl(user?.profileImg)!} alt={user?.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{user?.name.charAt(0).toUpperCase()}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold">{user?.name}</p>
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
                      <div key={item.id}>
                        <button
                          onClick={() => handleProfileMenuClick(item.id)}
                          className="w-full flex items-center space-x-3 px-4 py-2 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
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
      )}
    </div>
  );
}