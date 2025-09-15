'use client'

export default function RightSidebar() {
  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 h-screen flex flex-col">
      {/* Featured Content Section */}
      <div className="p-6">
        <h3 className="text-white font-semibold text-lg mb-6">Featured Content</h3>
        
        {/* Coming Soon Placeholder */}
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🚀</span>
          </div>
          <h4 className="text-white font-medium text-base mb-2">Coming Soon</h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            We're working on exciting new features to help you discover amazing content. Stay tuned!
          </p>
        </div>

        {/* Future Feature Placeholders */}
        <div className="space-y-4 mt-8">
          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm">📊</span>
              </div>
              <h5 className="text-white font-medium text-sm">Trending Topics</h5>
            </div>
            <p className="text-gray-400 text-xs">See what's popular right now</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm">👥</span>
              </div>
              <h5 className="text-white font-medium text-sm">Recommended Creators</h5>
            </div>
            <p className="text-gray-400 text-xs">Discover creators you might like</p>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm">🎯</span>
              </div>
              <h5 className="text-white font-medium text-sm">Personalized Feed</h5>
            </div>
            <p className="text-gray-400 text-xs">Content tailored just for you</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-auto p-6 border-t border-gray-700">
        <div className="text-center">
          <p className="text-gray-400 text-xs mb-3">
            Want to suggest a feature?
          </p>
          <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg text-sm transition-colors duration-200">
            Send Feedback
          </button>
        </div>
      </div>
    </div>
  );
}