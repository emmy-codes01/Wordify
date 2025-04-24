// src/components/auth/AuthWrapper.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SignUp from './SignUp';
import Verify from './Verify';
import ResetPassword from './ResetPassword';
import UpdatePassword from './UpdatePassword';
import Profile from './Profile';
import SignIn from './SignIn';
import bgImage from '../public/authbg.png'




export default function AuthWrapper() {
  const [currentStep, setCurrentStep] = useState('signup');
  const [user, setUser] = useState(null);
  const [stepData, setStepData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
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
        setError(error.message);
      }
    };
    
    checkSession();
    
    // Check URL for password reset or verify
    const url = new URL(window.location.href);
    const hashParams = new URLSearchParams(url.hash.substring(1));
    const type = hashParams.get('type');
    
    if (type === 'recovery') {
      setCurrentStep('updatePassword');
    } else if (type === 'signup') {
      setCurrentStep('verify');
    }
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth event:', event);
        if (event === 'SIGNED_IN' && session?.user) {
          setUser(session.user);
          setCurrentStep('dashboard');
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
  
  const handleNext = (step, data = {}) => {
    console.log(`Moving to step: ${step} with data:`, data);
    setStepData(prev => ({ ...prev, ...data }));
    setCurrentStep(step);
    
    // If next step is dashboard, redirect to dashboard page
    if (step === 'dashboard' && user) {
      navigate('/dashboard');
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 'signup':
        return <SignUp onNext={handleNext} />;
      case 'verify':
        return <Verify onNext={handleNext} data={stepData} />;
      case 'resetPassword':
        return <ResetPassword onNext={handleNext} data={stepData} />;
      case 'updatePassword':
        return <UpdatePassword onNext={handleNext} />;
      case 'profile':
        return <Profile onNext={handleNext} data={stepData} />;
      case 'signin':
        return <SignIn onNext={handleNext} />;
      case 'dashboard':
        return (
          <div className="text-center py-4">
            <p>Successfully authenticated! Redirecting to dashboard...</p>
          </div>
        );
      default:
        return <SignUp onNext={handleNext} />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-cover bg-center"  style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && <div className="mb-4 text-red-600 text-sm">{error}</div>}
          {renderStep()}
        </div>
      </div>
    </div>
  );
}