// src/components/auth/Verify.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Verify({ onNext, data }) {
  const [email, setEmail] = useState(data?.email || localStorage.getItem('signUpEmail') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendCountdown, setResendCountdown] = useState(0);

  useEffect(() => {
    // Check auth status when component mounts
    checkAuthStatus();
    
    // Set up a polling interval to check auth status
    const interval = setInterval(checkAuthStatus, 3000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleResendLink = async () => {
    if (resendCountdown > 0) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });
      
      if (error) throw error;
      
      // Set a cooldown for resend button
      setResendCountdown(60);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
          onClick={handleResendLink}
          className={`w-full py-2 text-sm ${
            resendCountdown > 0 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-white text-red-600 hover:bg-gray-50'
          } border border-gray-300 rounded-md`}
          disabled={resendCountdown > 0 || loading}
        >
          {loading ? 'Sending...' : 
            resendCountdown > 0 ? `Resend in ${resendCountdown}s` : 'Resend link'}
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