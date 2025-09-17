'use client'

import { useState } from 'react';

export default function HeaderNavigation() {
  

  

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo - Left Side */}
          <div className="flex items-center">
            <a href="#" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">CreatorCMS</span>
            </a>
          </div>



          {/* CTA & Sign-in - Far Right */}
          <div className="flex items-center space-x-4">
            {/* Sign In Link */}
            <a href="/auth/signin" className="text-gray-700 hover:text-gray-900 font-medium transition-colors duration-200 cursor-pointer">
              Sign in
            </a>
            
            {/* Primary CTA Button */}
            <a href="/auth/signup" className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold px-4 py-2 lg:px-6 lg:py-2.5 rounded-full text-sm lg:text-base transition-all duration-300 transform hover:scale-105 shadow-lg cursor-pointer inline-block">
              Start Publishing
            </a>

            
          </div>
        </div>

        
      </div>
    </header>
  );
}