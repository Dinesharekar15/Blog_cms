export default function FooterSection() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Brand Section - Left Side */}
          <div className="lg:col-span-3">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900">CreatorCMS</span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-6">
              CreatorCMS is the home for great stories. Where independent writers and creators build their audience and get paid for their work.
            </p>
            
            {/* App Store Buttons */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 mb-3">Get the app</h4>
              <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3">
                <button className="flex items-center justify-center bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">📱</div>
                    <div className="text-left">
                      <div className="text-xs leading-none">Download on the</div>
                      <div className="text-sm font-semibold leading-none">App Store</div>
                    </div>
                  </div>
                </button>
                <button className="flex items-center justify-center bg-black text-white px-4 py-3 rounded-lg hover:bg-gray-800 transition-colors duration-200">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg">🤖</div>
                    <div className="text-left">
                      <div className="text-xs leading-none">Get it on</div>
                      <div className="text-sm font-semibold leading-none">Google Play</div>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Navigation Links - Central Columns */}
          <div className="lg:col-span-9">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Column 1: Discover */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Discover</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Featured</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Categories</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Top in Culture</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Top in Finance</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Top in Tech</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Trending</a></li>
                </ul>
              </div>

              {/* Column 2: Creators */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Creators</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Switch to CreatorCMS</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Go Paid</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">For Writers</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">For Bloggers</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Creator Guide</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Community</a></li>
                </ul>
              </div>

              {/* Column 3: Company */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Company</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">About</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Careers</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Press</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Contact</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Blog</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Sitemap</a></li>
                </ul>
              </div>

              {/* Column 4: Resources */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Resources</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Resource Center</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Help Center</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Brand Assets</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Documentation</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">API</a></li>
                  <li><a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">Status</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 mt-12 pt-8">
          {/* Bottom Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
            {/* Copyright */}
            <div className="flex flex-col lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-6">
              <p className="text-sm text-gray-500">
                © 2025 CreatorCMS Inc. All rights reserved.
              </p>
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <span className="sr-only">Twitter</span>
                  <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <span className="sr-only">Facebook</span>
                  <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                  <span className="sr-only">LinkedIn</span>
                  <div className="w-5 h-5 bg-gray-400 rounded-full"></div>
                </a>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center space-x-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">Terms of Service</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">Accessibility</a>
              <a href="#" className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200">Collection Notice</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}