'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFAB from './MobileFAB';
export default function BottomNavigationBar() {
  const [activeItem, setActiveItem] = useState('home');
  const router = useRouter();

  const handleCreateClick = () => {
    router.push('/publish');
  };

  return (
    <>
      {/* Floating Plus/Create Icon - Above the bottom bar */}
      <MobileFAB/>

      {/* Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 z-40">
        <div className="flex items-center justify-around px-6 py-3">
          {/* Home Icon */}
          <button
            onClick={() => setActiveItem('home')}
            className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
              activeItem === 'home'
                ? 'text-orange-500 bg-gray-700'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>

          {/* Chat Icon */}
          <button
            onClick={() => setActiveItem('chat')}
            className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
              activeItem === 'chat'
                ? 'text-orange-500 bg-gray-700'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}