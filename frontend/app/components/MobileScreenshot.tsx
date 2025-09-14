interface MobileScreenshotProps {
  className?: string;
  type: 'feed' | 'video';
  size?: 'sm' | 'md' | 'lg';
}

export default function MobileScreenshot({ className = '', type, size = 'md' }: MobileScreenshotProps) {
  const sizeClasses = {
    sm: 'w-32 h-52',
    md: 'w-36 h-60 sm:w-44 sm:h-72 lg:w-56 lg:h-[480px]',
    lg: 'w-56 h-[480px]'
  };

  const borderClasses = {
    sm: 'border-2',
    md: 'border-3 sm:border-4 lg:border-6',
    lg: 'border-6'
  };

  if (type === 'feed') {
    return (
      <div className={`${sizeClasses[size]} bg-white rounded-[2.5rem] shadow-2xl ${borderClasses[size]} border-gray-800 overflow-hidden ${className}`}>
        <div className="h-full bg-gradient-to-b from-white to-gray-50">
          {/* Status Bar */}
          <div className="h-8 bg-black rounded-t-[2rem] flex items-center justify-center">
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>
          
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="h-6 bg-gray-900 rounded w-32 mb-2"></div>
            <div className="h-3 bg-gray-400 rounded w-24"></div>
          </div>
          
          {/* Content Feed */}
          <div className="p-4 space-y-4">
            {/* Post 1 - Image Post */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                <div className="h-3 bg-gray-600 rounded w-20"></div>
              </div>
              <div className="h-32 bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 rounded-xl"></div>
              <div className="h-2 bg-gray-400 rounded w-full"></div>
              <div className="h-2 bg-gray-400 rounded w-3/4"></div>
            </div>
            
            {/* Post 2 - Text Post */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                <div className="h-3 bg-gray-600 rounded w-24"></div>
              </div>
              <div className="h-2 bg-gray-400 rounded w-full"></div>
              <div className="h-2 bg-gray-400 rounded w-5/6"></div>
              <div className="h-2 bg-gray-400 rounded w-2/3"></div>
            </div>
            
            {/* Post 3 - Link Preview */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                <div className="h-3 bg-gray-600 rounded w-16"></div>
              </div>
              <div className="h-16 bg-gray-100 border border-gray-300 rounded-lg p-2">
                <div className="h-2 bg-gray-400 rounded w-3/4 mb-1"></div>
                <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'video') {
    return (
      <div className={`${sizeClasses[size]} bg-white rounded-[2.5rem] shadow-2xl ${borderClasses[size]} border-gray-800 overflow-hidden ${className}`}>
        <div className="h-full bg-black">
          {/* Status Bar */}
          <div className="h-8 bg-black flex items-center justify-center">
            <div className="w-16 h-1 bg-white rounded-full"></div>
          </div>
          
          {/* Video Player Interface */}
          <div className="relative h-64 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 flex items-center justify-center">
            {/* Video Content - Person Speaking */}
            <div className="absolute inset-4 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              {/* Person Avatar/Silhouette */}
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 bg-white/40 rounded-full"></div>
              </div>
            </div>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                <div className="w-0 h-0 border-l-[12px] border-l-gray-800 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1"></div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="absolute bottom-4 left-4 right-4">
              <div className="h-1 bg-white/30 rounded-full">
                <div className="h-full w-1/3 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          
          {/* Video Details */}
          <div className="p-4 bg-white">
            <div className="space-y-2">
              <div className="h-4 bg-gray-800 rounded w-4/5"></div>
              <div className="h-3 bg-gray-400 rounded w-3/5"></div>
              <div className="flex items-center space-x-2 mt-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                <div className="h-3 bg-gray-600 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}