/* eslint-disable no-unused-vars */
import React from 'react';
import apple from '../assets/images/apple.png'
import playstore from '../assets/images/playstore.png'
const HeroSection = () => {
    return (
        <div className='flex flex-col justify-center text-center items-center mt-24 md:mt-40 gap-3 md:gap-6 pt-20'>
            <p className='big text-4xl md:text-6xl font-bold'>
                Home of Unlimited Sermons
            </p>
            <p className='details text-sm text-center opacity-50' style={{Width: '280px',}}>
                A digital platform that gives unlimited streaming of edifying sermons is now <br /> within your reach.
            </p>
            <div className='download-options flex gap-4 md:mt-10 '>
                <a href='/'>
                <div style={{ paddingTop: '4px', paddingBottom: '8px' }} className='app-store px-4 md:px-8 flex justify-between items-center gap-2 border-2 rounded-lg'>
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
                <div style={{ paddingTop: '6px', paddingBottom: '8px' }} className='app-store px-4 md:px-8 flex justify-between items-center gap-2 border-2 rounded-lg'>
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
        </div >
    )
}

export default HeroSection
