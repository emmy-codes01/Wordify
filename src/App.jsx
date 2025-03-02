/* eslint-disable no-unused-vars */
import React from 'react'
import Navbar from './components/Navbar'
import HeroSection from './components/HeroSection'
import About from './components/About'
import Mission from './components/Mission'
import PhotoSlides from './components/PhotoSlides'
import AppDownload from './components/AppDownload'
import { Router } from 'lucide-react'
import Footer from './components/Footer'
import Support from './components/Support'


const App = () => {
  return (
    <div className="font-montserrat">
      <section id='nav'><Navbar /></section>
      <section id=""><HeroSection /></section>
      <section id=""><PhotoSlides /></section>
      <section id="about"><About /></section>
      <section id="download"><AppDownload /></section>
      <section id=""><Mission /></section>
      <section id="support"><Support /></section>
      <Footer />
    </div>
  );
};

export default App;
