import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-gray-300 py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h4 className="text-lg font-bold text-white mb-4">About</h4>
            <p className="text-sm">
              Sharing insights, tutorials, and stories about web development and technology.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Navigation</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-400 transition">Home</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Blogs</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Categories</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold text-white mb-4">Follow Us</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-orange-400 transition">Twitter</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">LinkedIn</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">GitHub</a></li>
              <li><a href="#" className="hover:text-orange-400 transition">Facebook</a></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm text-gray-500 mt-10">
          © 2025 Blog CMS. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;