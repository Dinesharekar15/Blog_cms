import MobileScreenshot from './MobileScreenshot';
import ContentCard from './ContentCard';

export default function TestimonialSection() {
  return (
    <section className="relative bg-gradient-to-br from-purple-700 via-purple-600 to-purple-800 py-16 lg:py-24 xl:py-32 overflow-hidden">
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl transform translate-x-48 translate-y-48"></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-white rounded-full blur-3xl transform -translate-x-40 -translate-y-40"></div>
        {/* Additional background elements for card areas */}
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full blur-2xl transform -translate-x-24 translate-y-24"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-white rounded-full blur-2xl transform translate-x-24 translate-y-24"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Floating Content Cards - Desktop Only - Positioned at Center Sides with Offset */}
        <div className="hidden xl:block">
          <ContentCard className="absolute top-1/2 -left-32 transform -translate-y-1/2 -rotate-5 hover:-rotate-2 transition-transform duration-500 z-20" />
          <ContentCard className="absolute top-1/2 -right-32 transform -translate-y-1/2 rotate-5 hover:rotate-8 transition-transform duration-500 z-20" />
        </div>

        {/* Layout Container */}
        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-30 py-8">
          {/* Left Mobile Screenshot - Desktop Only */}
          <div className="hidden lg:block xl:hidden flex-shrink-0">
            <MobileScreenshot 
              type="feed"
              size="md"
              className="transform -rotate-6 hover:-rotate-3 transition-transform duration-500"
            />
          </div>

          {/* Central Content Area */}
          <div className="flex flex-col items-center text-center max-w-2xl">
            {/* Brand Icon/Logo */}
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-300 to-purple-100 rounded-2xl flex items-center justify-center shadow-lg">
                <div className="w-8 h-8 bg-purple-600 rounded-lg"></div>
              </div>
            </div>

            {/* Testimonial Quote */}
            <blockquote className="text-xl sm:text-2xl lg:text-3xl font-bold text-white leading-relaxed mb-8">
              "This platform has transformed how I share my stories. The community is incredible, 
              and the tools make publishing effortless. My audience has grown 300% in just 6 months!"
            </blockquote>

            {/* Attribution */}
            <div className="space-y-4">
              <div className="text-purple-100">
                <div className="text-lg font-semibold text-white">Sarah Chen</div>
                <div className="text-purple-200">Creative Chronicles Newsletter</div>
              </div>
              
              {/* Subscribe Button */}
              <button className="bg-gradient-to-r from-purple-400 to-purple-300 hover:from-purple-300 hover:to-purple-200 text-purple-900 font-semibold px-6 py-3 rounded-full text-base transition-all duration-300 transform hover:scale-105 shadow-lg">
                Subscribe to Sarah's Newsletter
              </button>
            </div>

            {/* Featured Person Photo */}
            <div className="mt-8">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <div className="w-full h-full bg-gradient-to-br from-orange-300 via-pink-300 to-purple-300 flex items-center justify-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/50 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Mobile Screenshot - Desktop Only */}
          <div className="hidden lg:block xl:hidden flex-shrink-0">
            <MobileScreenshot 
              type="video"
              size="md"
              className="transform rotate-6 hover:rotate-3 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Mobile Content - Mobile and Tablet */}
        <div className="mt-12 xl:mt-0">
          {/* Mobile Screenshots - Mobile/Tablet Only */}
          <div className="lg:hidden flex justify-center gap-4 mb-8">
            <div className="transform -rotate-3">
              <MobileScreenshot 
                type="feed"
                size="sm"
              />
            </div>
            <div className="transform rotate-3">
              <MobileScreenshot 
                type="video"
                size="sm"
              />
            </div>
          </div>
          
          {/* Content Cards - Mobile Stacked Layout */}
          <div className="xl:hidden flex flex-col items-center gap-6">
            <ContentCard className="transform -rotate-2 hover:rotate-0 transition-transform duration-500" />
            <ContentCard className="transform rotate-2 hover:rotate-0 transition-transform duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
}