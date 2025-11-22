import React from 'react';

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex-shrink-0">
            <a href="/" className="text-2xl font-bold text-gray-900">
              U
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Categories
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Channels
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              A-Z
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              TV Guide
            </a>
          </nav>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <a href="#" className="text-gray-700 hover:text-gray-900 font-medium">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

