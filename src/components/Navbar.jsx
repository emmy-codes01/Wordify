/* eslint-disable no-unused-vars */
import logo from '../assets/images/logo.png';
import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link as ScrollLink } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom'; // Import RouterLink

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [scrolled, setScrolled] = useState(false);
  // Define navbar height for offset calculations
  const navbarHeight = 80; 

  const navItems = [
    { title: 'Home', id: 'nav', isRouter: false },
    { title: 'About', id: 'about', isRouter: false },
    { title: 'Support', id: 'support', isRouter: false },
    { title: 'For Artists', id: '/for-artists', isRouter: true }, // Mark as router link and set id to path
  ];

  // Add shadow to navbar after scrolling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0); // Add shadow when scrolled down
    };

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Track active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sectionOffsets = navItems
        .filter(item => item.id && !item.isRouter) // Filter out router items and empty ids
        .map(item => {
          const element = document.getElementById(item.id);
          return {
            id: item.id,
            offsetTop: element?.offsetTop || 0,
            height: element?.clientHeight || 0
          };
        });

      const scrollPosition = window.scrollY + navbarHeight + 20; // Add some buffer

      const currentSection = sectionOffsets.find((section, index) => {
        const nextSection = sectionOffsets[index + 1];
        return (
          scrollPosition >= section.offsetTop &&
          (!nextSection || scrollPosition < nextSection.offsetTop)
        );
      });

      if (currentSection && currentSection.id !== activeSection) {
        setActiveSection(currentSection.id);
      }
    };

    // Initial check
    handleScroll();
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);

  return (
    <div
      className={`w-full px-4 py-4 md:pt-8 fixed top-0 left-0 bg-white z-50 transition-shadow ${
        scrolled ? 'shadow-lg' : ''
      }`}
      style={{ position: 'fixed', width: '100%' }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <img src={logo} alt="Wordify" className="h-8 w-auto" />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center absolute left-1/2 md:gap-11 -translate-x-1/2">
          {navItems.map((item, index) => (
            item.isRouter ? (
              // Use RouterLink for router navigation
              <RouterLink
                key={index}
                to={item.id}
                className={`px-4 py-2 text-sm cursor-pointer text-gray-600 hover:text-gray-900`}
              >
                {item.title}
              </RouterLink>
            ) : (
              // Use ScrollLink for smooth scrolling
              <ScrollLink
                key={index}
                to={item.id}
                spy={true}
                smooth={true}
                duration={500}
                offset={-navbarHeight} // Apply offset to account for navbar height
                isDynamic={true} // Handle dynamic content changes
                activeClass="active"
                className={`px-4 py-2 text-sm cursor-pointer ${
                  activeSection === item.id
                    ? 'text-red-500 border-b-2 border-red-500'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {item.title}
              </ScrollLink>
            )
          ))}
        </nav>

        {/* Download Button (Desktop) */}
        <div className="hidden md:block">
          <button
            className="text-white px-6 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
            style={{ backgroundColor: '#cf0001' }}
          >
            Download
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden p-2"
          aria-label="Open menu"
        >
          <Menu className="w-8 h-8" />
        </button>

        {/* Mobile Menu Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 backdrop-blur-sm bg-opacity-50 transition-opacity z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Mobile Slide-out Menu */}
        <div
          className={`fixed top-0 right-0 w-64 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Menu Navbar */}
          <div className="flex p-4 border-b">
            {/* <div className="text-lg font-medium">Menu</div> */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <nav className="py-2 text-center">
            {navItems.map((item, index) => (
              item.isRouter ? (
                // Use RouterLink for router navigation
                <RouterLink
                  key={index}
                  to={item.id}
                  className="block px-6 py-4 text-sm text-gray-900 hover:bg-gray-50"
                  onClick={() => setIsOpen(false)} // Close menu on link click
                >
                  {item.title}
                </RouterLink>
              ) : item.id ? (
                // Use ScrollLink for smooth scrolling
                <ScrollLink
                  key={index}
                  to={item.id}
                  spy={true}
                  smooth={true}
                  duration={500}
                  offset={-navbarHeight} // Same offset for mobile
                  className={`block px-6 py-4 text-sm ${
                    activeSection === item.id ? 'text-red-500' : 'text-gray-900'
                  } hover:bg-gray-50`}
                  onClick={() => setIsOpen(false)} // Close menu on link click
                >
                  {item.title}
                </ScrollLink>
              ) : (
                <div 
                  key={index}
                  className="block px-6 py-4 text-sm text-gray-900 hover:bg-gray-50"
                >
                  {item.title}
                </div>
              )
            ))}
            
            {/* Add Download Button to mobile menu */}
            <div className="mt-4 px-6 py-2">
              <button
                className="w-full text-white px-6 py-2 rounded-lg text-sm hover:bg-red-600 transition-colors"
                style={{ backgroundColor: '#cf0001' }}
              >
                Download
              </button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Navbar;