import MobileScreenshot from './MobileScreenshot';

export default function FeatureSection() {
  return (
    <section className="relative bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout: Flex Column with better spacing */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 max-w-sm sm:max-w-md md:max-w-full mx-auto">
          {/* Mobile: Images First, Desktop: Left Visuals Area */}
          <div className="w-full lg:flex-1 order-1 lg:order-none">
            {/* Mobile: Static Layout, Desktop: Absolute Positioned */}
            <div className="flex justify-center items-center gap-2 sm:gap-4 lg:relative lg:min-h-[500px] lg:justify-center mb-8 lg:mb-0">
              {/* Content Feed Screenshot */}
              <div className="transform -rotate-2 lg:absolute lg:left-0 lg:top-8 lg:-rotate-3 lg:hover:rotate-0 transition-transform duration-500 lg:z-10">
                <MobileScreenshot 
                  type="feed"
                  size="md"
                />
              </div>
              
              {/* Video Player Screenshot */}
              <div className="transform rotate-2 lg:absolute lg:right-0 lg:top-16 lg:rotate-3 lg:hover:-rotate-1 transition-transform duration-500 lg:z-20">
                <MobileScreenshot 
                  type="video"
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Mobile: Content Second, Desktop: Right Content Area */}
          <div className="w-full lg:flex-1 max-w-lg lg:max-w-xl text-center lg:text-left order-2 lg:order-none">
            {/* Content Block - Grouped for Mobile */}
            <div className="flex flex-col items-center lg:items-start space-y-6">
              {/* Headline - Reduced size on mobile */}
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-gray-900 leading-tight text-center lg:text-left">
                Discover the best
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                  work
                </span>
                from creators
              </h2>
              
              {/* Paragraph 1 */}
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 leading-relaxed text-center lg:text-left">
                Explore a diverse world of content where video, podcasts, and written stories come together. 
                Our platform makes it easy to discover new voices and connect with creators who share your interests.
              </p>
              
              {/* Paragraph 2 */}
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed text-center lg:text-left">
                With dedicated spaces for video content, the ability to subscribe to your favorite publications, 
                and seamless content discovery, diving into great stories has never been easier.
              </p>
              
              {/* CTA Button */}
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start exploring in the app
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}