
// src/components/auth/CreatePassword.jsx
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function CreatePassword({ onNext }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordCriteria, setPasswordCriteria] = useState({
    length: false,
    special: false,
    uppercase: false
  });

  const validatePassword = (pass) => {
    setPasswordCriteria({
      length: pass.length >= 8,
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass),
      uppercase: /[A-Z]/.test(pass)
    });
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }
    
    if (!passwordCriteria.length || !passwordCriteria.special || !passwordCriteria.uppercase) {
      setError("Password doesn't meet all requirements");
      setLoading(false);
      return;
    }
    
    try {
      const email = localStorage.getItem('signUpEmail');
      
      // In a real implementation, this would be part of the signup flow
      // Here we're simulating setting a password
      localStorage.setItem('tempPassword', password);
      
      onNext('profile');
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      
      <h2 className="text-2xl font-bold mb-6 text-center">Create your Password</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <div className="relative">
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={password}
              onChange={handlePasswordChange}
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => {
                const input = document.getElementById('password');
                input.type = input.type === 'password' ? 'text' : 'password';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => {
                const input = document.getElementById('confirmPassword');
                input.type = input.type === 'password' ? 'text' : 'password';
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">Your password must contain:</p>
          <ul className="text-sm space-y-1">
            <li className={`flex items-center ${passwordCriteria.length ? 'text-green-600' : 'text-gray-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${passwordCriteria.length ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordCriteria.length ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              at least 8 characters
            </li>
            <li className={`flex items-center ${passwordCriteria.special ? 'text-green-600' : 'text-gray-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${passwordCriteria.special ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordCriteria.special ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              1 number or special character (example: # ? ! & )
            </li>
            <li className={`flex items-center ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-600'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${passwordCriteria.uppercase ? 'text-green-600' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={passwordCriteria.uppercase ? "M5 13l4 4L19 7" : "M6 18L18 6M6 6l12 12"} />
              </svg>
              1 UPPERCASE
            </li>
          </ul>
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
          disabled={loading}
        >
          {loading ? 'Creating...' : 'Continue'}
        </button>
      </form>
      
      {error && <div className="text-red-600 text-sm mt-2 text-center">{error}</div>}
      
      <div className="text-center text-sm mt-4">
        Already have an account? <a href="#" onClick={() => onNext('signin')} className="text-red-600">Sign in</a>
      </div>
    </div>
  );
}