export default function CTASection() {
  return (
    <section className="relative bg-gray-900 py-20 lg:py-32 overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h2 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight mb-8">
          Join the community of
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
            creators
          </span>
        </h2>
        
        {/* Supporting Text */}
        <p className="text-xl lg:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
          Start your journey with thousands of creators who are already earning from their passion. 
          No setup fees, no hidden costs—just pure creative freedom.
        </p>
        
        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center">
          <button className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-bold text-lg lg:text-xl px-12 py-5 lg:px-16 lg:py-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-orange-500/25">
            Start Your Free Trial
          </button>
          
          {/* Secondary CTA (optional) */}
          <button className="w-full sm:w-auto border-2 border-white/30 hover:border-white text-white hover:bg-white hover:text-gray-900 font-semibold text-lg px-8 py-4 lg:px-12 lg:py-5 rounded-full transition-all duration-300">
            Learn More
          </button>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <p className="text-gray-400 text-sm lg:text-base mb-4">
            Trusted by 10,000+ creators worldwide
          </p>
          <div className="flex items-center justify-center space-x-8 opacity-60">
            <div className="text-2xl lg:text-3xl">⭐⭐⭐⭐⭐</div>
            <div className="text-sm lg:text-base text-gray-400">4.9/5 rating</div>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-orange-500/20 to-pink-500/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl"></div>
    </section>
  );
}