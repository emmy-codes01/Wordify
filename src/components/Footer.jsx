import React from 'react';
import logoAlt from '../assets/images/logoAlt.png'
import X from '../assets/images/icons/x.png'
import 'boxicons/css/boxicons.min.css';

const Footer = () => {
    return (
        <div className="w-full bg-white p-4 md:p-8">
            {/* Footer Content */}
            <div className="max-w-7xl mx-auto mt-8">
                {/* Updated responsive layout */}
                <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-8">
                    {/* Navigation links - now in a grid for better medium screen display */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 md:gap-16 w-full lg:w-auto">
                        <div className="text-center sm:text-left">
                            <h3 className="font-semibold mb-4">Organization</h3>
                            <div className="space-y-3">
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Contact Us</a></p>
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Work With Us</a></p>
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Blog & News</a></p>
                            </div>
                        </div>

                        <div className="text-center sm:text-left">
                            <h3 className="font-semibold mb-4">Resources</h3>
                            <div className="space-y-3">
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Documentation</a></p>
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Papers</a></p>
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Brand Guidelines</a></p>
                            </div>
                        </div>

                        <div className="text-center sm:text-left">
                            <h3 className="font-semibold mb-4">Legal</h3>
                            <div className="space-y-3">
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Terms of Service</a></p>
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Privacy Policy</a></p>
                                <p><a href="#" className="text-gray-500 hover:text-gray-700">Cookies Policy</a></p>
                            </div>
                        </div>
                    </div>

                    {/* Announcement box - better responsive sizing */}
                    <div className="rounded-3xl flex flex-col gap-2 justify-center items-center w-full sm:w-96 lg:w-80 p-4"
                        style={{ backgroundColor: '#f2f2f2', border: '1px solid #a7a7a7' }}
                    >
                        {/* Name & logo*/}
                        <div className='flex items-center justify-between w-full px-4'>
                            <div className='flex items-center gap-2'>
                                <div>
                                    <img src={logoAlt} alt="Logo" className='w-8' />
                                </div>
                                <div style={{ lineHeight: '1.2' }}>
                                    <h4 className="text-medium font-medium">Wordify</h4>
                                    <p className='opacity-50 text-xs'>@wordifyapp</p>
                                </div>
                            </div>

                            <div>
                                <img src={X} alt="X logo" />
                            </div>
                        </div>

                        {/* Message */}
                        <div className="text-left px-2">
                            <p className='opacity-70 text-sm'>
                                We've just announced new features that would help you increase your experience using Wordify!
                            </p>
                        </div>
                    </div>
                </div>

                {/* Follow Us - improved responsive layout */}
                <div className="text-center my-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <h3 className="font-semibold">Follow Us</h3>
                    <div className="flex justify-center gap-2">
                        <a href="#"><i className='bx bxl-facebook p-2 border rounded-full' style={{backgroundColor: '#f2f2f2', border: '1px solid #a7a7a7'}}></i></a>
                        <a href="#"><i className='bx bxl-instagram p-2 border rounded-full' style={{backgroundColor: '#f2f2f2', border: '1px solid #a7a7a7'}}></i></a>
                        <a href="#"><i className='bx bxl-linkedin p-2 border rounded-full' style={{backgroundColor: '#f2f2f2', border: '1px solid #a7a7a7'}}></i></a>
                        <a href="#"><i className='bx bxl-twitter p-2 border rounded-full' style={{backgroundColor: '#f2f2f2', border: '1px solid #a7a7a7'}}></i></a>
                    </div>
                </div>
                
                <hr />
                {/* Copyright */}
                <div className="flex items-center justify-center text-sm text-gray-500 mt-6">
                    <img src={logoAlt} alt="Wordify" className="w-5 h-5 mr-2" />
                    <span>Wordify, 2024. All rights reserved</span>
                </div>
            </div>
        </div>
    );
};

export default Footer;