/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal'; // Import ScrollReveal
import communityprayer from '../assets/images/communityprayer.png'

const Support = () => {
  ScrollReveal().reveal('.reveal', {
    distance: '50px',
    duration: 1000,
    delay: 200,
    easing: 'ease-in-out',
    opacity: 0,
    origin: 'bottom',
    reset: true, // Optional: Reset animation on scroll back
    // scale: 0.8,
});


  return (
    <div className=" text-white py-16 px-4" style={{ backgroundColor: '#1f1f1f', }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
          {/* Text Content */}
          <div className="w-full md:w-1/2 space-y-6 flex flex-col justify-center items-center md:justify-start md:items-start">
            <div className="text-left mb-5 relative reveal">
              <h2 className="text-4xl font-bold mb-2 md:text-left text-center">Join Community</h2>
              {/* Curved underline SVG - flipped to face upward */}
              <svg
                className="absolute left-1/2 -translate-x-1/2 -bottom-2"
                width="120"
                height="10"
                viewBox="0 0 120 10"
                fill="none"
              >
                <path
                  d="M3 3C20 11 100 11 117 3"
                  stroke="#CF0001"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-gray-300 text-sm md:text-base md:text-left text-center reveal">
              The scope of Wordify is nothing less than what our Lord Jesus said and is still saying to us: <span className="italic"> &quot; And he said unto them, Go ye into all the world, and preach the gospel to every creature.&quot;</span>
            </p>
            <button className="bg-red-600 text-white px-8 py-2.5 rounded md:text-left reveal text-center hover:bg-red-700 transition-colors">
              Support
            </button>
          </div>

          {/* Image */}
          <div className="w-full md:w-1/2">
            <div className="rounded-lg overflow-hidden">
              <img
                src={communityprayer}
                alt="People joining hands in unity"
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support
