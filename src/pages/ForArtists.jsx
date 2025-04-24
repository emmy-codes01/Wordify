import React from 'react';
import { Link } from 'react-router-dom';
// import one from '../assets/images/one.png'
// import two from '../assets/images/two.png'
// import three from '../assets/images/three.png'
import artists from '../assets/images/artists.png'

const ForArtists = () => {
  return (
    <div className="pt-24">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12 flex justify-center items-center text-center flex-col">
        <div className="max-w-3xl mx-auto">
          <p className="text-sm md:text-lg mb-3 opacity-70">For preachers to upload their sermons, make impact, and engage users.</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6">Share Your Message With The World</h1>
          <Link 
            to="/signup" 
            className='text-white px-5 py-3 rounded-lg bg-[#cf0001] hover:bg-red-700 transition-colors inline-block mb-10 text-sm md:text-base'
          >
            Get started
          </Link>

          <div className='flex justify-center items-center'>
            <img src={artists} alt="artists" className='md:w-80'/>
          </div>

          {/* <div className="w-full flex justify-center items-center py-8">
  <div className="relative w-64 h-64 flex items-center justify-center mx-auto">
    
    <div 
      className="absolute transform -rotate-6 border-4 border-red-600 rounded-md overflow-hidden shadow-lg" 
      style={{ width: '90%', height: '90%', zIndex: 1 }}
    >
      <img 
      src={three}
        alt="First image" 
        className="w-full h-full object-cover"
      />
    </div>
    
    
    <div 
      className="absolute transform rotate-6 border-4 border-red-600 rounded-md overflow-hidden shadow-lg" 
      style={{ width: '90%', height: '90%', zIndex: 2 }}
    >
      <img 
        src={two}
        alt="Second image" 
        className="w-full h-full object-cover"
      />
    </div>
    
    
    <div 
      className="absolute border-4 border-red-600 rounded-md overflow-hidden shadow-lg" 
      style={{ width: '90%', height: '90%', zIndex: 3 }}
    >
      <img 
        src={one}
        alt="Third image" 
        className="w-full h-full object-cover"
      />
    </div>
  </div>
</div> */}
        </div>
      </div>
      

    </div>
  );
};

export default ForArtists;