import React, { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal'; // Import ScrollReveal
import { ArrowUpRight, Users, Lightbulb, Shield, Rss, Anchor } from 'lucide-react';

const About = () => {

  
  useEffect(() => {
    // ScrollReveal setup
    ScrollReveal().reveal('.reveal', {
        distance: '50px',
        duration: 1000,
        delay: 200,
        easing: 'ease-in-out',
        opacity: 0,
        origin: 'bottom',
        reset: true, // Optional: Reset animation on scroll back
        scale: 0.9,
    });






  }, []);
  



  return (
    <div className="max-w-6xl mx-auto px-4 py-16 mt-24 " id='About'>
      <div className="text-center mb-16 relative">
        <h2 className="text-4xl font-bold mb-2">Our Values</h2>
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

      <div className="bg-gray-50 rounded-lg reveal">
        {/* Main grid */}
        <div className="relative grid md:grid-cols-2">
          {/* Vertical divider line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 w-px bg-gray-200 -translate-x-1/2"></div>

          {/* Left column */}
          <div>
            {/* Spiritual Growth */}
            <div className="p-8">
              <ArrowUpRight className="w-6 h-6 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Spiritual Growth</h3>
              <p className="text-gray-600">We are committed to fostering spiritual growth and personal development through its curated collection of sermons.</p>
            </div>
            
            <div className="h-px bg-gray-200" />
            
            {/* Inspiration */}
            <div className="p-8">
              <Lightbulb className="w-6 h-6 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inspiration</h3>
              <p className="text-gray-600">Wordify aims to inspire and uplift users by providing access to motivational and thought-provoking content.</p>
            </div>
            
            <div className="h-px bg-gray-200" />
            
            {/* Community */}
            <div className="p-8">
              <Users className="w-6 h-6 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Community</h3>
              <p className="text-gray-600">Wordify fosters a sense of community among its users, encouraging interaction, discussion, and shared learning experiences.</p>
            </div>
          </div>

          {/* Right column */}
          <div>
            {/* Inclusivity */}
            <div className="p-8">
              <Users className="w-6 h-6 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Inclusivity</h3>
              <p className="text-gray-600">Embracing diversity and inclusivity, Wordify welcomes individuals from all walks of life and spiritual backgrounds.</p>
            </div>
            
            <div className="h-px bg-gray-200" />
            
            {/* Authenticity */}
            <div className="p-8">
              <Shield className="w-6 h-6 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Authenticity</h3>
              <p className="text-gray-600">Wordify values authenticity and integrity, ensuring that all contents is genuine, relevant and impactful.</p>
            </div>
            
            <div className="h-px bg-gray-200" />
            
            {/* Accessibility */}
            <div className="p-8">
              <Rss className="w-6 h-6 text-red-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Accessibility</h3>
              <p className="text-gray-600">Wordify is committed to making spiritual wisdom accessible to everyone, regardless of geographical location or financial means.</p>
            </div>
          </div>
        </div>

        {/* Bottom section - Empowerment */}
        <div className="border-t border-gray-200">
          <div className="p-8 text-center">
            <Anchor className="w-6 h-6 text-red-500 mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Empowerment</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">Wordify empowers individuals to take control of their spiritual journey, providing the tools and resources needed for personal growth and transformation.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;