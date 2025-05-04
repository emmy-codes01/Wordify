// src/components/auth/AuthCallback.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Handle the OAuth callback
    const handleAuthCallback = async () => {
      setLoading(true);
      
      try {
        // When user arrives from OAuth redirect, Supabase auth will handle
        // the URL fragments automatically, extract tokens and establish the session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) throw error;
        
        setSession(data.session);
      } catch (err) {
        console.error('Error in auth callback:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, []);

  // Show loading indicator
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600 mb-4"></div>
        <p className="text-gray-600">Completing authentication...</p>
      </div>
    );
  }

  // Show error if any occurred
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-red-100 p-4 rounded-md mb-4">
          <p className="text-red-700">Authentication failed: {error}</p>
        </div>
        <a href="/auth" className="text-red-600 underline">Back to sign in</a>
      </div>
    );
  }

  // Redirect to dashboard if authenticated
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  // Fallback redirect to auth page if no session was established
  return <Navigate to="/auth" replace />;
}