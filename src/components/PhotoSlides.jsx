/* eslint-disable no-unused-vars */
import React from 'react';
// import r11 from '../assets/images/r11.png';
// import r12 from '../assets/images/r11.png';
// import r13 from '../assets/images/r11.png';
// import r14 from '../assets/images/r11.png';
// import r15 from '../assets/images/r11.png';

// import r22 from '../assets/images/r22.png';
// import r23 from '../assets/images/r23.png';
// import r24 from '../assets/images/r24.png';
// import r25 from '../assets/images/r25.png';


const PhotoSlides = () => {
  const topRowImages = [
    './src/assets/images/r11.png',
    './src/assets/images/r12.png',
    './src/assets/images/r13.png',
    './src/assets/images/r14.png',
    './src/assets/images/r15.png',
  ];

  const bottomRowImages = [
    './src/assets/images/r23.png',
    './src/assets/images/r22.png',
    './src/assets/images/r11.png',
    './src/assets/images/r24.png',
    './src/assets/images/r25.png',
  ];

  // Create duplicates for smooth scrolling
  const duplicatedTopRow = [...topRowImages, ...topRowImages, ...topRowImages, ...topRowImages, ...topRowImages, ...topRowImages];
  const duplicatedBottomRow = [...bottomRowImages, ...bottomRowImages, ...bottomRowImages, ...bottomRowImages, ...bottomRowImages, ...bottomRowImages];

  return (
    <div className="w-full flex items-center justify-center bg-white py-8">
      <div className="w-full max-w-24-xl mx-auto relative">
        {/* Top Row */}
        <div className="relative mb-4 overflow-hidden">
          {/* Container - wider on desktop */}
          <div className="relative mx-auto w-full md:w-[1000px] lg:w-[1200px] overflow-hidden">
            {/* Gradients - only show on desktop */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-white via-white to-transparent z-20" />
            <div className="hidden md:block absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-white via-white to-transparent z-20" />

            {/* Scrolling content */}
            <div className="flex animate-scroll-smooth">
              {duplicatedTopRow.map((src, index) => (
                <div
                  key={index}
                  className="flex-none w-44 h-44 shrink-0 mx-2"
                >
                  <img
                    src={src}
                    alt="Image"
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="relative overflow-hidden">
          {/* Container - wider on desktop */}
          <div className="relative mx-auto w-full md:w-[1000px] lg:w-[1200px] overflow-hidden">
            {/* Gradients - only show on desktop */}
            <div className="hidden md:block absolute left-0 top-0 h-full w-40 bg-gradient-to-r from-white via-white to-transparent z-20" />
            <div className="hidden md:block absolute right-0 top-0 h-full w-40 bg-gradient-to-l from-white via-white to-transparent z-20" />

            {/* Scrolling content */}
            <div className="flex animate-scroll-smooth-reverse">
              {duplicatedBottomRow.map((src, index) => (
       <div
                  key={index}
                  className="flex-none w-44 h-44 shrink-0 mx-2"
                >
                  <img
                    src={src}
                    alt="Image"
                    className="w-full h-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoSlides;