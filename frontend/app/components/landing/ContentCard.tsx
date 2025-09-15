interface ContentCardProps {
  className?: string;
  variant?: 'default' | 'compact';
}

export default function ContentCard({ className = '', variant = 'default' }: ContentCardProps) {
  return (
    <div className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-4 sm:p-6 max-w-sm ${className}`}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Profile Picture */}
          <div className="w-10 h-10 rounded-full overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
              <div className="w-6 h-6 bg-white/30 rounded-full"></div>
            </div>
          </div>
          
          {/* Name and Handle */}
          <div>
            <div className="text-sm font-semibold text-gray-900">Alex Rivera</div>
            <div className="text-xs text-gray-500">@alexwrites</div>
          </div>
        </div>
        
        {/* Paid Subscribers Tag */}
        <span className="bg-orange-100 text-orange-600 text-xs font-medium px-2 py-1 rounded-full">
          Paid subscribers only
        </span>
      </div>

      {/* Text Content */}
      <div className="mb-4">
        <p className="text-gray-800 text-sm leading-relaxed">
          Just published my thoughts on the future of content creation. 
          The landscape is shifting rapidly, and creators need to adapt to stay relevant...
        </p>
      </div>

      {/* Media Section */}
      <div className="mb-4">
        <div className="relative rounded-xl overflow-hidden">
          <div className="aspect-video bg-gradient-to-br from-orange-200 via-pink-200 to-purple-200 flex items-center justify-center">
            <div className="text-white/80 text-xs font-medium bg-black/20 px-3 py-1 rounded-full">
              Video: 3:42
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          "The Creator Economy Revolution: What's Next?"
        </p>
      </div>

      {/* Engagement Metrics */}
      <div className="flex items-center justify-between text-gray-500 text-xs mb-3">
        <div className="flex items-center space-x-4">
          {/* Replies */}
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
              <div className="w-2 h-2 bg-gray-400 rounded-sm"></div>
            </div>
            <span>24</span>
          </div>
          
          {/* Likes */}
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-red-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
            </div>
            <span>156</span>
          </div>
          
          {/* Shares */}
          <div className="flex items-center space-x-1">
            <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
              <div className="w-2 h-2 bg-blue-400 rounded-sm"></div>
            </div>
            <span>12</span>
          </div>
        </div>
        
        {/* Timestamp */}
        <span className="text-gray-400">2h ago</span>
      </div>

      {/* Reply Section Footer */}
      <div className="border-t border-gray-100 pt-3">
        <div className="text-xs text-gray-500">
          <span className="font-medium">8 replies</span> from subscribers
        </div>
      </div>
    </div>
  );
}