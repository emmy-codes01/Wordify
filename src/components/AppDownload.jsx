/* eslint-disable no-unused-vars */
import React from 'react';
import mockup from '../assets/images/mockup.png'
import apple from '../assets/images/apple.png'
import playstore from '../assets/images/playstore.png'

const AppDownload = () => {
  return (
    <div className="w-full bg-red-600" style={{backgroundColor: '#cf0001'}}>
      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Text Content */}
          <div className="w-full md:w-1/2 md:text-left text-center text-white mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 md:mb-6">
              Download
             App
            </h2>
            <p className="text-sm md:text-base mb-8 max-w-xl">
              Your ultimate destination for spiritual growth and enlightenment.
              We, as commissioned by our Lord Jesus Christ, have designed a
              digital platform which originated from our desire to see that the
              gospel of Jesus which he has ordained special messengers to
              preach, is being shared and propagated in the media space to all
              ends of the earth.
            </p>
            
            {/* App Store Buttons */}
            <div className='download-options flex gap-4 md:mt-10'>
                            <a href='/'>
                    <div style={{ paddingTop: '4px', paddingBottom: '8px', backgroundColor: 'white', color: 'black',}} className='app-store px-4 md:px-8 flex justify-between items-center gap-2 border-2 rounded-lg'>
                                <div className='flex justify-center items-center'>
                                    <img src={apple} alt="download from App Store" className='w-6' />
                                </div>
                                <div className='i flex flex-col items-center justify-center leading-3 mt-1'>
                                    <p className='' style={{fontSize: '8px'}}>Download on the</p>
                                    <p className='font-medium'>App Store</p>
                                </div>
                            </div>
                            </a>
            
                            <a href='/'>
                            <div style={{ paddingTop: '6px', paddingBottom: '8px', backgroundColor: 'white', color: 'black', }} className='app-store px-4 md:px-8 flex justify-between items-center gap-2 border-2 rounded-lg'>
                                <div className='flex justify-center items-center'>
                                    <img src={playstore} alt="download from App Store" className='w-6' />
                                </div>
                                <div className='i flex flex-col text-left leading-3 mt-1'>
                                    <p className='' style={{fontSize: '8px'}}>GET IT ON</p>
                                    <p className='font-medium'>Google Play</p>
                                </div>
                            </div>
                            </a>
                        </div >
          </div>

          {/* Phone Mockup */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-64 md:w-80">
              {/* iPhone Frame */}
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl">
                <img 
                  src={mockup}
                  alt="Wordify App Screenshot" 
                  className="w-full h-auto"
                />
                
                {/* App Content Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-between py-12">
                  <div className="flex items-center">
                    {/* <img 
                      src="/wordify-logo-white.svg" 
                      alt="Wordify" 
                      className="h-6"
                    /> */}
                  </div>
                  {/* <button className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                    GET STARTED
                  </button> */}
                </div>
              </div>

              {/* Phone Border/Frame Effect */}
              <div className="absolute inset-0 rounded-[3rem] ring-1 ring-black/10"></div>
            </div>
                  </div>
                  




        </div>
      </div>
    </div>
  );
};

export default AppDownload;