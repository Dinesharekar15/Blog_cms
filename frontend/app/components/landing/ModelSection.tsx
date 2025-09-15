export default function ModelSection() {
  return (
    <section className="relative bg-white min-h-[100vh] py-16 lg:py-24 xl:py-32 overflow-hidden">
      {/* Pure white background for clean, spacious design */}
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Central Content Area - Top Center */}
        <div className="text-center mb-16 lg:mb-24 pt-8 lg:pt-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
            A model that makes
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              quality work
            </span>
            possible
          </h2>
          
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Our subscription-based platform ensures creators get paid directly by their audience. 
            No ads, no algorithms deciding your reach—just quality content that readers value and support.
          </p>
          
          <button className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-lg">
            Learn more about the Subscription Model
          </button>
        </div>

        {/* Scattered Cards - Desktop Only with Precise Positioning */}
        <div className="hidden lg:block relative min-h-[80vh]">
          {/* Card 1: Upgrade Card - Top Left */}
          <div className="absolute" style={{ top: '15%', left: '10%' }}>
            <div className="transform -rotate-6 hover:-rotate-3 transition-transform duration-500">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-72">
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl aspect-video relative mb-4">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full text-lg font-semibold transition-colors">
                      Upgrade
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Content</h3>
                <p className="text-sm text-gray-600">Access exclusive videos and premium articles</p>
              </div>
            </div>
          </div>

          {/* Card 2: Video Person with Subscribe - Top Right */}
          <div className="absolute" style={{ top: '15%', right: '10%' }}>
            <div className="transform rotate-4 hover:rotate-7 transition-transform duration-500">
              <div className="bg-white rounded-2xl shadow-xl p-4 w-64">
                <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl aspect-video mb-4 flex items-center justify-center relative">
                  <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/50 rounded-full"></div>
                  </div>
                </div>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg font-semibold transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: Annual/Monthly Pricing - Bottom Left */}
          <div className="absolute" style={{ bottom: '5%', left: '20%' }}>
            <div className="transform -rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-56">
                <h3 className="font-bold text-gray-900 mb-4 text-center">Subscription Plans</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-200">
                    <span className="font-semibold text-gray-900">Annual</span>
                    <span className="font-bold text-orange-600">$99.99</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Monthly</span>
                    <span className="font-semibold text-gray-900">$9.99</span>
                  </div>
                </div>
                <div className="mt-3 text-xs text-orange-600 text-center font-medium">
                  Save 17% with Annual
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Mills Baker Creator Stats - Bottom Center (Prominent) */}
          <div className="absolute" style={{ bottom: '0%', left: '50%', transform: 'translateX(-50%)' }}>
            <div className="transform rotate-2 hover:rotate-0 transition-transform duration-500">
              <div className="bg-white rounded-3xl shadow-2xl p-6 w-80 border-4 border-gray-800">
                {/* Phone-like mockup */}
                <div className="bg-gradient-to-b from-white to-gray-50">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Mills Baker</h3>
                    <p className="text-sm text-gray-600">Creator Analytics</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-blue-600">5.2K</div>
                      <div className="text-sm text-gray-600">Subscribers</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">$12.8K</div>
                      <div className="text-sm text-gray-600">Monthly Revenue</div>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-sm font-medium text-gray-700">📊 Growth Analytics</span>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-3 text-center">
                    <span className="text-sm font-semibold text-orange-700">+23% this month</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Simple Comment Card - Bottom Right */}
          <div className="absolute" style={{ bottom: '5%', right: '20%' }}>
            <div className="transform rotate-5 hover:rotate-8 transition-transform duration-500">
              <div className="bg-white rounded-xl shadow-lg p-5 w-60">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Sarah K.</div>
                    <div className="text-xs text-gray-500">Premium Subscriber</div>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-3">
                  &ldquo;This platform has completely changed how I consume quality content. Worth every penny!&rdquo;
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <span>❤️ 47</span>
                  <span>💬 12 replies</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout - Stacked Cards */}
        <div className="lg:hidden mt-12 space-y-6">
          {/* Main Analytics Card - Mobile (Mills Baker Stats) */}
          <div className="bg-white rounded-2xl shadow-xl p-6 mx-4 border-4 border-gray-800">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Mills Baker</h3>
              <p className="text-sm text-gray-600">Creator Analytics</p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-blue-600">5.2K</div>
                <div className="text-sm text-gray-600">Subscribers</div>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <div className="text-2xl font-bold text-green-600">$12.8K</div>
                <div className="text-sm text-gray-600">Monthly Revenue</div>
              </div>
            </div>
            <div className="h-16 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 rounded-lg flex items-center justify-center mb-3">
              <span className="text-sm font-medium text-gray-700">📊 Growth Analytics</span>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <span className="text-sm font-semibold text-orange-700">+23% this month</span>
            </div>
          </div>

          {/* Additional Mobile Cards */}
          <div className="space-y-4 mx-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 text-center">Subscription Plans</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="font-semibold">Annual</span>
                  <span className="font-bold text-orange-600">$99.99</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span>Monthly</span>
                  <span className="font-semibold">$9.99</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"></div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">Sarah K.</div>
                  <div className="text-xs text-gray-500">Premium Subscriber</div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                &ldquo;This platform has completely changed how I consume quality content. Worth every penny!&rdquo;
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>❤️ 47</span>
                <span>💬 12 replies</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
