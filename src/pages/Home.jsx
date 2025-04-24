import React from 'react'
import Navbar from '../components/Navbar'
import About from '../components/About'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'
import HeroSection from '../components/HeroSection'
import Mission from '../components/Mission'
import PhotoSlides from '../components/PhotoSlides'
import Support from '../components/Support'

const Home = () => {
  return (
      <>
          <Navbar />
          <HeroSection />
          <PhotoSlides />
          <About />
          <AppDownload />
          <Mission />
          <Support />
          <Footer/>
      </>
          

  )
}

export default Home