export default function CreatorDirectorySection() {
  const creators = [
    {
      name: "Sarah Chen",
      publication: "The Open Journal",
      description: "Exploring the intersection of technology and humanity through thoughtful analysis and personal stories.",
      profileImage: "👩‍💻",
      bannerColor: "bg-blue-500"
    },
    {
      name: "Marcus Williams",
      publication: "Daily Insights",
      description: "Business strategy and entrepreneurship lessons from the trenches of startup life.",
      profileImage: "👨‍💼",
      bannerColor: "bg-green-500"
    },
    {
      name: "Elena Rodriguez",
      publication: "Creative Canvas",
      description: "Art, design, and the creative process. Inspiration and tutorials for fellow artists.",
      profileImage: "🎨",
      bannerColor: "bg-purple-500"
    },
    {
      name: "David Kim",
      publication: "Code & Coffee",
      description: "Programming tutorials, tech reviews, and the developer lifestyle from a senior engineer.",
      profileImage: "☕",
      bannerColor: "bg-orange-500"
    },
    {
      name: "Maya Patel",
      publication: "Wellness Weekly",
      description: "Holistic health, mindfulness practices, and sustainable living for the modern world.",
      profileImage: "🧘‍♀️",
      bannerColor: "bg-pink-500"
    },
    {
      name: "James Thompson",
      publication: "Travel Tales",
      description: "Adventure stories and practical travel guides from off-the-beaten-path destinations.",
      profileImage: "🌍",
      bannerColor: "bg-teal-500"
    },
    {
      name: "Sophia Liu",
      publication: "Food & Philosophy",
      description: "Culinary adventures and the cultural stories behind every dish around the world.",
      profileImage: "👩‍🍳",
      bannerColor: "bg-red-500"
    },
    {
      name: "Alex Morgan",
      publication: "Future Finance",
      description: "Cryptocurrency, fintech innovations, and personal finance strategies for the digital age.",
      profileImage: "💰",
      bannerColor: "bg-indigo-500"
    }
  ];

  return (
    <section className="relative bg-gray-50 py-16 lg:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* First Row of Cards - Above Header (Centered) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8 mb-16">
          {creators.slice(0, 4).map((creator, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden relative group"
            >
              {/* Profile Section */}
              <div className="p-6 pb-20">
                <div className="flex flex-col items-center text-center mb-4">
                  {/* Profile Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
                    {creator.profileImage}
                  </div>
                  
                  {/* Creator Info */}
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    By {creator.name}
                  </h3>
                  <h4 className="font-semibold text-gray-700 text-base mb-3">
                    {creator.publication}
                  </h4>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {creator.description}
                </p>
                
                {/* Subscribe Button */}
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              
              {/* Colored Banner */}
              <div className={`absolute bottom-0 left-0 right-0 h-4 ${creator.bannerColor}`}></div>
            </div>
          ))}
        </div>

        {/* Header Section - Middle */}
        <div className="text-center my-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Independent voices on
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              CreatorCMS
            </span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Here are just a few of the many people you can subscribe to.
          </p>
          
          {/* CTA Button */}
          <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Discover even more voices
          </button>
        </div>

        {/* Second Row of Cards - Below Header (Centered) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
          {creators.slice(4, 8).map((creator, index) => (
            <div 
              key={index + 4}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 overflow-hidden relative group"
            >
              {/* Profile Section */}
              <div className="p-6 pb-20">
                <div className="flex flex-col items-center text-center mb-4">
                  {/* Profile Image */}
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center text-3xl mb-4 shadow-inner">
                    {creator.profileImage}
                  </div>
                  
                  {/* Creator Info */}
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    By {creator.name}
                  </h3>
                  <h4 className="font-semibold text-gray-700 text-base mb-3">
                    {creator.publication}
                  </h4>
                </div>
                
                {/* Description */}
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {creator.description}
                </p>
                
                {/* Subscribe Button */}
                <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200">
                  Subscribe
                </button>
              </div>
              
              {/* Colored Banner */}
              <div className={`absolute bottom-0 left-0 right-0 h-4 ${creator.bannerColor}`}></div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm mb-4">
            And many more creators sharing their unique perspectives
          </p>
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-orange-300 rounded-full"></div>
            <div className="w-2 h-2 bg-pink-300 rounded-full"></div>
            <div className="w-2 h-2 bg-purple-300 rounded-full"></div>
          </div>
        </div>
      </div>
    </section>
  );
}