'use client'

import { useRouter } from 'next/navigation';

interface MobileFABProps {
  onClick?: () => void;
}

export default function MobileFAB({ onClick }: MobileFABProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push('/publish');
    }
  };

  return (
    <button
      onClick={handleClick}
      className="md:hidden fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-40 flex items-center justify-center group fab-pulse"
      title="Create New Post"
    >
      {/* Plus Icon */}
      <svg 
        className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 4v16m8-8H4" 
        />
      </svg>
      
      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 transition-opacity duration-200"></span>
    </button>
  );
}