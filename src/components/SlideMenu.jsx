/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

const SlideMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { title: 'Home', active: true },
    { title: 'About', active: false },
    { title: 'Support', active: false },
    { title: 'For Artists', active: false },
  ];

  return (
    <div className="relative">
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg   "
        aria-label="Open menu"
      >
        <Menu className="w-8 h-8" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Menu Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <div className="text-lg font-medium">Menu bar</div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="py-2">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className="border-b border-gray-100 last:border-b-0"
            >
              <a
                href="#"
                className={`block px-6 py-4 text-sm ${item.active ? 'text-red-500' : 'text-gray-900'
                  } hover:bg-gray-50`}
              >
                {item.title}
              </a>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SlideMenu;