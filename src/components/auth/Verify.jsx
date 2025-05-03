// src/components/auth/Verify.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Verify({ onNext, data }) {
  const [email, setEmail] = useState(data?.email || localStorage.getItem('signUpEmail') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check auth status when component mounts
    checkAuthStatus();
    
    // Set up a polling interval to check auth status
    const interval = setInterval(checkAuthStatus, 3000);
    
    return () => clearInterval(interval);
  }, []);

  // This function can be used to manually check auth status
  const checkAuthStatus = async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) throw error;
      
      if (session?.user) {
        console.log('User authenticated:', session.user);
        // User successfully authenticated
        onNext('dashboard');
      }
    } catch (error) {
      console.error('Auth check error:', error.message);
      // Don't set error here as it would show constantly during polling
    }
  };

  const openEmailClient = () => {
    // Create a mailto link with the user's email
    const mailtoLink = `mailto:${email}`;
    
    // Open the mail client
    window.open(mailtoLink, '_blank');
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex justify-center mb-6">
        <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Check your email</h2>
      
      <div className="text-center mb-6">
        <p className="mb-4">
          We've sent a magic login link to <strong>{email}</strong>
        </p>
        <p className="text-gray-600 text-sm mb-4">
          Click the link in your email to verify your account and continue with the sign-up process.
        </p>
      </div>
      
      <div className="mb-6">
        <button
          onClick={openEmailClient}
          className="w-full py-2 text-sm bg-white text-red-600 hover:bg-gray-50 border border-gray-300 rounded-md flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Open Email App
        </button>
      </div>
      
      <div className="text-center">
        <button 
          onClick={() => onNext('signup')}
          className="text-red-600 text-sm"
        >
          Use different email
        </button>
      </div>
      
      {error && <div className="text-red-600 text-sm mt-4 text-center">{error}</div>}
    </div>
  );
}