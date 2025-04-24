/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logo from '../assets/images/logo.png';

const ArtistsNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow to navbar after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Features', path: '/for-artists#features' },
    { title: 'Pricing', path: '/for-artists#pricing' },
    { title: 'FAQ', path: '/for-artists#faq' },
  ];

  return (
    <div
      className={`w-full px-4 py-2 md:pt-6 fixed top-0 left-0 bg-white z-50 transition-shadow ${
        scrolled ? 'shadow-lg' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/">
            <img src={logo} alt="Wordify" className="h-8 w-auto" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Sign Up Button (Desktop) */}
        <div className="hidden md:block">
          <Link
            to="/signup"
            className="text-white px-6 py-2 rounded-lg text-sm bg-[#cf0001] hover:bg-red-600 transition-colors"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2"
          aria-label="Open menu"
        >
          <Menu className="size-10" />
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Slide-out Menu */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="text-lg font-medium">Menu</div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <nav className="py-2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="block px-6 py-3 text-sm text-gray-900 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </Link>
            ))}
            
            {/* Sign Up Button (Mobile) */}
            <div className="mt-4 px-6 py-2">
              <Link
                to="/signup"
                className="block w-full text-center text-white px-6 py-2 rounded-lg text-sm bg-[#cf0001] hover:bg-red-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default ArtistsNavbar;