// src/components/auth/AuthWrapper.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate, Routes, Route } from 'react-router-dom';
import SignUp from './SignUp';
import ResetPassword from './ResetPassword';
import UpdatePassword from './UpdatePassword';
import Profile from './Profile';
import SignIn from './SignIn';
import bgImage from '../public/authbg.png';

export default function AuthWrapper() {
  const [currentStep, setCurrentStep] = useState('signup');
  const [user, setUser] = useState(null);
  const [stepData, setStepData] = useState({});
  const [notification, setNotification] = useState({
    message: null,
    type: null // 'success' or 'error'
  });
  const navigate = useNavigate();
  
  // Show notification with auto-dismiss
  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setNotification({ message: null, type: null });
    }, 5000);
  };
  
  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (session?.user) {
          setUser(session.user);
          setCurrentStep('dashboard');
          // Redirect to dashboard page
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Session check error:', error.message);
        showNotification(error.message);
      }
    };
    
    checkSession();
    
    // Check URL for password reset
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'recovery') {
      setCurrentStep('updatePassword');
    }
    
    // Check pathname for specific auth routes
    const pathname = window.location.pathname;
    if (pathname.includes('/auth/signin')) {
      setCurrentStep('signin');
    } else if (pathname.includes('/auth/signup')) {
      setCurrentStep('signup');
    } else if (pathname.includes('/auth/reset-password')) {
      setCurrentStep('resetPassword');
    }
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setCurrentStep('dashboard');
          showNotification('Successfully signed in!', 'success');
          // Use navigate to redirect
          navigate('/dashboard');
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setCurrentStep('signin');
        } else if (event === 'PASSWORD_RECOVERY') {
          setCurrentStep('updatePassword');
        }
      }
    );
    
    return () => {
      subscription?.unsubscribe();
    };
  }, [navigate]);
  
  const handleNext = (step, data = {}, message = null) => {
    console.log(`Moving to step: ${step} with data:`, data);
    setStepData(prev => ({ ...prev, ...data }));
    setCurrentStep(step);
    
    // Show success message if provided
    if (message) {
      showNotification(message, 'success');
    }
    
    // If next step is dashboard, redirect to dashboard page
    if (step === 'dashboard' && user) {
      navigate('/dashboard');
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'signup':
        return <SignUp onNext={handleNext} showNotification={showNotification} />;
      case 'resetPassword':
        return <ResetPassword onNext={handleNext} data={stepData} showNotification={showNotification} />;
      case 'updatePassword':
        return <UpdatePassword onNext={handleNext} showNotification={showNotification} />;
      case 'profile':
        return <Profile onNext={handleNext} data={stepData} showNotification={showNotification} />;
      case 'signin':
        return <SignIn onNext={handleNext} showNotification={showNotification} />;
      case 'dashboard':
        return (
          <div className="text-center py-4">
            <p>Successfully authenticated! Redirecting to dashboard...</p>
          </div>
        );
      default:
        return <SignUp onNext={handleNext} showNotification={showNotification} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Modern notification display at the top */}
          {notification.message && (
            <div 
              className={`mb-6 p-4 rounded-md ${
                notification.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              } flex items-center justify-between`}
            >
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <svg className="h-5 w-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span>{notification.message}</span>
              </div>
              <button 
                onClick={() => setNotification({ message: null, type: null })}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
          
          {/* Render current auth step component */}
          <Routes>
            <Route index element={renderStep()} />
            <Route path="signin" element={<SignIn onNext={handleNext} showNotification={showNotification} />} />
            <Route path="signup" element={<SignUp onNext={handleNext} showNotification={showNotification} />} />
            <Route path="reset-password" element={<ResetPassword onNext={handleNext} data={stepData} showNotification={showNotification} />} />
            <Route path="update-password" element={<UpdatePassword onNext={handleNext} showNotification={showNotification} />} />
            <Route path="profile" element={<Profile onNext={handleNext} data={stepData} showNotification={showNotification} />} />
            <Route path="*" element={renderStep()} />
          </Routes>
        </div>
      </div>
    </div>
  );
}