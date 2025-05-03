/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import ScrollReveal from 'scrollreveal'; // Import ScrollReveal
import apple from '../assets/images/apple.png'
import playstore from '../assets/images/playstore.png'

const HeroSection = () => {


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
            // scale: 0.8,
        });






    }, []);



    return (
        <div className='flex flex-col justify-center text-center items-center mt-24 md:mt-40 gap-3 md:gap-6 pt-14'>
            <p className='big text-3xl md:text-6xl font-bold reveal'>
                Home of Unlimited Sermons
            </p>
            <p className='details text-sm text-center opacity-50 max-w-xs md:max-w-lg mx-auto reveal'>
                A digital platform that gives unlimited streaming of edifying sermons is now <br className="hidden md:block" /> within your reach.
            </p>
            <div className='download-options flex gap-4 md:mt-10 '>
                <a href='/'>
                    <div style={{ paddingTop: '4px', paddingBottom: '8px' }} className='app-store px-4 md:px-8 flex justify-between items-center gap-2 border-2 rounded-lg'>
                        <div className='flex justify-center items-center'>
                            <img src={apple} alt="download from App Store" className='w-6' />
                        </div>
                        <div className='i flex flex-col items-center justify-center leading-3 mt-1'>
                            <p className='' style={{ fontSize: '8px' }}>Download on the</p>
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
                            <p className='' style={{ fontSize: '8px' }}>GET IT ON</p>
                            <p className='font-medium'>Google Play</p>
                        </div>
                    </div>
                </a>
            </div >
        </div >
    )
}

export default HeroSection