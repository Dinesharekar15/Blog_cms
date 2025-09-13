'use client'
import React, { useState } from 'react';
import { HomeIcon as HomeOutline, BellIcon, SearchIcon, MenuIcon, PlusIcon } from '@heroicons/react/outline';
import { HomeIcon as HomeSolid, UserCircleIcon } from '@heroicons/react/solid';

const Sidebar: React.FC = () => {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar (md and up) */}
      <aside className="hidden md:flex flex-col w-40 lg:w-52 h-screen bg-zinc-950 text-white border-r border-zinc-800 fixed">
        <div className="flex flex-col justify-between h-full">
          {/* Logo */}
          <div className="p-4 text-lg font-bold cursor-pointer">Logo</div>

          {/* Navigation Links & Create Button */}
          <nav className="flex flex-col space-y-4 px-4">
            <a href="#" className={`flex items-center space-x-2 cursor-pointer transition-colors duration-200 ${active === 'home' ? 'font-bold text-white bg-zinc-900' : 'hover:bg-zinc-900 hover:text-orange-400'} rounded-full px-3 py-2`} onClick={() => setActive('home')}>
              {active === 'home' ? <HomeSolid className="w-6 h-6" /> : <HomeOutline className="w-6 h-6" />}
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center space-x-2 cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:text-orange-400 rounded-full px-3 py-2">
              <BellIcon className="w-6 h-6" />
              <span>Activity</span>
            </a>
            <a href="#" className="flex items-center space-x-2 cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:text-orange-400 rounded-full px-3 py-2">
              <SearchIcon className="w-6 h-6" />
              <span>Search</span>
            </a>
            <button className="bg-orange-400 text-white px-4 py-2 rounded-full font-medium hover:bg-orange-500 w-full cursor-pointer mt-4 transition-transform duration-200 hover:scale-105">
              Create
            </button>
          </nav>

          {/* Profile Section */}
          <div className="flex items-center space-x-4 p-4 border-t border-zinc-800 cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:text-orange-400">
            <UserCircleIcon className="w-10 h-10 text-gray-400" />
            <div>
              <h3 className="font-bold">John Doe</h3>
              <p className="text-sm text-gray-400">john.doe@example.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Shrinking Sidebar: only icons and + icon, profile circle at bottom, logo at top, icons centered vertically (sm screens only) */}
      <aside className="hidden sm:flex md:hidden flex-col w-16 h-screen bg-zinc-950 text-white border-r border-zinc-800 fixed">
        {/* Logo at top */}
        <div className="flex items-center justify-center h-16">
          <span className="text-lg font-bold">Logo</span>
        </div>
        {/* Centered nav icons */}
        <div className="flex-1 flex flex-col justify-center items-center space-y-4">
          <a href="#" className={`flex items-center justify-center cursor-pointer transition-colors duration-200 ${active === 'home' ? 'font-bold text-white bg-zinc-900' : 'hover:bg-zinc-900 hover:text-orange-400'} rounded-full w-10 h-10`} onClick={() => setActive('home')}>
            {active === 'home' ? <HomeSolid className="w-6 h-6" /> : <HomeOutline className="w-6 h-6" />}
          </a>
          <a href="#" className="flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:text-orange-400 rounded-full w-10 h-10">
            <BellIcon className="w-6 h-6" />
          </a>
          <a href="#" className="flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:text-orange-400 rounded-full w-10 h-10">
            <SearchIcon className="w-6 h-6" />
          </a>
          <button className="bg-orange-400 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-500 cursor-pointer transition-transform duration-200 hover:scale-105">
            <PlusIcon className="w-6 h-6" />
          </button>
        </div>
        {/* Profile circle at bottom */}
        <div className="flex items-center justify-center h-16 border-t border-zinc-800 cursor-pointer transition-colors duration-200 hover:bg-zinc-900 hover:text-orange-400">
          <UserCircleIcon className="w-10 h-10 text-gray-400" />
        </div>
      </aside>

      {/* Mobile Top Navbar (xs screens) */}
      <nav className="sm:hidden flex items-center justify-between w-full bg-zinc-950 text-white px-4 py-2 border-b border-zinc-800 fixed top-0 left-0 z-50">
        {/* Logo and Home heading on left */}
        <div className="flex items-center space-x-2">
          <div className="text-lg font-bold">Logo</div>
          <span className="font-bold text-white">Home</span>
        </div>
        {/* Icons on the right */}
        <div className="flex items-center space-x-4">
          <BellIcon className="w-7 h-7 cursor-pointer" />
          <SearchIcon className="w-7 h-7 cursor-pointer" />
          <button className="cursor-pointer" onClick={() => setOpen(!open)}>
            <MenuIcon className="w-7 h-7" />
          </button>
        </div>
      </nav>

      {/* Floating + icon on mobile (xs screens) */}
      <button className="sm:hidden fixed bottom-6 right-6 bg-orange-400 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-orange-500 transition-transform duration-200 hover:scale-105 z-50">
        <PlusIcon className="w-8 h-8" />
      </button>

      {/* Slide-in Mobile Menu */}
      {open && (
        <div className="sm:hidden fixed top-12 left-0 w-3/4 h-full bg-zinc-950 text-white z-50 shadow-lg transition-transform duration-300">
          <nav className="flex flex-col space-y-4 p-6">
            <a href="#" className={`flex items-center space-x-2 hover:text-orange-400 cursor-pointer ${active === 'home' ? 'font-bold text-white' : ''}`} onClick={() => setActive('home')}>
              {active === 'home' ? <HomeSolid className="w-6 h-6" /> : <HomeOutline className="w-6 h-6" />}
              <span>Home</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-orange-400 cursor-pointer">
              <BellIcon className="w-6 h-6" />
              <span>Activity</span>
            </a>
            <a href="#" className="flex items-center space-x-2 hover:text-orange-400 cursor-pointer">
              <SearchIcon className="w-6 h-6" />
              <span>Search</span>
            </a>
            <button className="bg-orange-400 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-500 w-full cursor-pointer mt-4">
              Create
            </button>
            <div className="flex items-center space-x-4 mt-6 border-t border-zinc-800 pt-4">
              <UserCircleIcon className="w-10 h-10 text-gray-400" />
              <div>
                <h3 className="font-bold">John Doe</h3>
                <p className="text-sm text-gray-400">john.doe@example.com</p>
              </div>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Sidebar;