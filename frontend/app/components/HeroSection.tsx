'use client'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-20 gap-8 lg:gap-16">
          {/* Left Content Area */}
          <div className="flex-1 max-w-lg lg:max-w-xl xl:max-w-2xl text-center lg:text-left mb-12 lg:mb-0">
            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight mb-6">
              The home for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
                great stories
              </span>
              and ideas
            </h1>
            
            {/* Sub-headline */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed">
              Create, publish, and share your stories with a community of passionate readers. 
              Your voice matters, and every story deserves to be heard.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center lg:justify-start">
              <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
                Start Your Blog
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 hover:bg-gray-50">
                See Features
              </button>
            </div>
          </div>
          
          {/* Right Visuals Area */}
          <div className="flex-1 relative min-h-[400px] sm:min-h-[500px] lg:min-h-[600px] w-full lg:w-auto">
            {/* Background Blur Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 to-pink-100/30 rounded-3xl blur-3xl"></div>
            
            {/* Mobile: Single Phone, Desktop: Multiple Floating Phones */}
            <div className="relative h-full flex items-center justify-center">
              {/* Main Central Phone */}
              <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
                <div className="w-48 sm:w-56 lg:w-64 h-80 sm:h-96 lg:h-[500px] bg-white rounded-[2.5rem] lg:rounded-[3rem] shadow-2xl border-4 sm:border-6 lg:border-8 border-gray-800 overflow-hidden">
                  <div className="h-full bg-gradient-to-b from-white to-gray-50 p-4 lg:p-6">
                    <div className="w-full h-4 lg:h-6 bg-gray-200 rounded-full mb-3 lg:mb-4"></div>
                    <div className="space-y-3 lg:space-y-4">
                      <div className="h-20 sm:h-24 lg:h-32 bg-gradient-to-r from-orange-200 to-pink-200 rounded-xl lg:rounded-2xl"></div>
                      <div className="h-3 lg:h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-3 lg:h-4 bg-gray-300 rounded w-1/2"></div>
                      <div className="h-12 sm:h-16 lg:h-20 bg-gray-100 rounded-lg lg:rounded-xl"></div>
                      <div className="h-3 lg:h-4 bg-gray-300 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Left Floating Phone - Hidden on Mobile */}
              <div className="hidden lg:block absolute left-0 top-16 transform -rotate-12 hover:rotate-6 transition-transform duration-500 opacity-80">
                <div className="w-48 h-80 bg-white rounded-[2.5rem] shadow-xl border-6 border-gray-700 overflow-hidden">
                  <div className="h-full bg-gradient-to-b from-blue-50 to-indigo-50 p-4">
                    <div className="w-full h-4 bg-gray-200 rounded-full mb-3"></div>
                    <div className="space-y-3">
                      <div className="h-24 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-xl"></div>
                      <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-300 rounded w-3/5"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Right Floating Phone - Hidden on Mobile */}
              <div className="hidden lg:block absolute right-0 top-32 transform rotate-12 hover:-rotate-6 transition-transform duration-500 opacity-80">
                <div className="w-48 h-80 bg-white rounded-[2.5rem] shadow-xl border-6 border-gray-700 overflow-hidden">
                  <div className="h-full bg-gradient-to-b from-green-50 to-emerald-50 p-4">
                    <div className="w-full h-4 bg-gray-200 rounded-full mb-3"></div>
                    <div className="space-y-3">
                      <div className="h-16 bg-gradient-to-r from-green-200 to-emerald-200 rounded-xl"></div>
                      <div className="h-3 bg-gray-300 rounded w-full"></div>
                      <div className="h-3 bg-gray-300 rounded w-2/3"></div>
                      <div className="h-16 bg-gray-100 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom Floating Element - Hidden on Mobile */}
              <div className="hidden lg:block absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 rotate-6 hover:rotate-12 transition-transform duration-500 opacity-70">
                <div className="w-40 h-24 bg-white rounded-2xl shadow-lg border-4 border-gray-600 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-50 to-pink-50 p-3">
                    <div className="h-3 bg-purple-200 rounded w-full mb-2"></div>
                    <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-300 rounded w-1/2 mt-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}