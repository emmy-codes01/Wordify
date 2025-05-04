/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import Navbar from './components/Navbar';
import ArtistsNavbar from './components/ArtistsNavbar';
import HeroSection from './components/HeroSection';
import About from './components/About';
import Mission from './components/Mission';
import PhotoSlides from './components/PhotoSlides';
import AppDownload from './components/AppDownload';
import Footer from './components/Footer';
import Support from './components/Support';
import ForArtists from './pages/ForArtists';
import UploadSermon from './components/UploadSermon';
import AuthWrapper from './components/auth/AuthWrapper';
import Dashboard from './components/Dashboard';
import EditProfile from './components/EditProfile';
import Sermons from './components/Sermons';
// import SecuritySettings from './components/SecuritySettings';
import Analytics from './components/Analytics';
import { supabase } from './lib/supabase';

// Create a Home component for the main page
const Home = () => {
  return (
    <>
      <section id=""><HeroSection /></section>
      <section id=""><PhotoSlides /></section>
      <section id="about"><About /></section>
      <section id="download"><AppDownload /></section>
      <section id=""><Mission /></section>
      <section id="support"><Support /></section>
    </>
  );
};

// Create a navigation controller component
const NavigationController = () => {
  const location = useLocation();
  
  return (
    <>
      {location.pathname.startsWith('/for-artists') ? (
        <ArtistsNavbar />
      ) : location.pathname.startsWith('/dashboard') ? (
        <div className="bg-red-600 text-white px-6 py-2 hidden">Dashboard Navigation</div>
      ) : (
        <Navbar />
      )}
    </>
  );
};

const App = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for an active session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        setSession(session);
      } catch (error) {
        console.error('Error checking session:', error.message);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();
    
    // Listen for authentication state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <Router>
      <div className="font-montserrat">
        <NavigationController />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Home />} />
          <Route path="/for-artists" element={<ForArtists />} />
          <Route path="/auth/*" element={session ? <Navigate to="/dashboard" /> : <AuthWrapper />} />
          
          {/* Protected dashboard routes */}
          <Route path="/dashboard" element={!session ? <Navigate to="/auth" /> : <Dashboard />} />
          <Route path="/dashboard/upload-sermon" element={!session ? <Navigate to="/auth" /> : <UploadSermon />} />
          <Route path="/dashboard/edit-profile" element={!session ? <Navigate to="/auth" /> : <EditProfile />} />
          <Route path="/dashboard/sermons" element={!session ? <Navigate to="/auth" /> : <Sermons />} />
          {/* <Route path="/dashboard/security-settings" element={!session ? <Navigate to="/auth" /> : <SecuritySettings />} /> */}
          <Route path="/dashboard/analytics" element={!session ? <Navigate to="/auth" /> : <Analytics />} />
          
          {/* Redirects for old routes */}
          <Route path="/upload-sermon" element={<Navigate to="/dashboard/upload-sermon" />} />
          <Route path="/edit-profile" element={<Navigate to="/dashboard/edit-profile" />} />
          <Route path="/my-sermons" element={<Navigate to="/dashboard/my-sermons" />} />
          <Route path="/security-settings" element={<Navigate to="/dashboard/security-settings" />} />
          <Route path="/analytics" element={<Navigate to="/dashboard/analytics" />} />
          
          {/* Redirect auth related paths to the AuthWrapper */}
          <Route path="/signup" element={<Navigate to="/auth" />} />
          <Route path="/signin" element={<Navigate to="/auth" replace />} />
          <Route path="/verify" element={<Navigate to="/auth" replace />} />
          
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;