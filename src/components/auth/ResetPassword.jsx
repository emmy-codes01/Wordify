// src/components/auth/ResetPassword.jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function ResetPassword({ onNext, data }) {
  const [email, setEmail] = useState(data?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      
      if (error) throw error;
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <div className="flex justify-center mb-6">
        <div className="h-12 w-12 rounded-full bg-red-600 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Reset your password</h2>
      
      {success ? (
        <div className="text-center mb-6">
          <p className="mb-4 text-green-600">
            Password reset link sent!
          </p>
          <p className="text-gray-600 text-sm mb-4">
            We've sent a Magic link to <strong>{email}</strong>. 
            Please check your email and follow the instructions to Log into your account.
          </p>
          <button
            onClick={() => onNext('signin')}
            className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 mt-4"
          >
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <p className="text-gray-600 text-sm mb-6 text-center">
            Enter your email address, and we'll send you a Magic link to Log into your account.
          </p>
          
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="e.g noah2@gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 mb-4"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>
          
          {error && <div className="text-red-600 text-sm mt-2 text-center">{error}</div>}
          
          <div className="text-center text-sm mt-6">
            <button 
              onClick={() => onNext('signin')}
              className="text-red-600"
            >
              Back to sign in
            </button>
          </div>
        </>
      )}
    </div>
  );
}