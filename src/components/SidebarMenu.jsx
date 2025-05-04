import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function SidebarMenu({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);
        
        // Get user profile
        if (user) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }
          
          setProfile(profileData || {});
        }
      } catch (err) {
        console.error('Error loading user data:', err.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    // Close menu when clicking outside of it
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      onClose();
      navigate('/auth');
    } catch (err) {
      console.error('Error signing out:', err.message);
    }
  };

  const navigateTo = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
      <div 
        ref={menuRef}
        className="fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out"
        style={{ transform: isOpen ? 'translateX(0)' : 'translateX(100%)' }}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <button onClick={onClose} className="focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* User Info */}
        {user && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="Profile" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <span className="text-xl font-semibold text-gray-500">
                    {(profile?.full_name || user.email || '?').charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <p className="font-medium">{profile?.full_name || profile?.ministry_name || 'User'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Menu Items */}
        <div className="py-2">
          <button 
            onClick={() => navigateTo('/dashboard')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Dashboard</span>
            </div>
          </button>
          
          <button 
            onClick={() => navigateTo('/upload-sermon')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>Upload Sermon</span>
            </div>
          </button>
          
          <button 
            onClick={() => navigateTo('/edit-profile')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Edit Profile</span>
            </div>
          </button>
          
          {/* <button 
            onClick={() => navigateTo('/sermons')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
              <span>My Sermons</span>
            </div>
          </button> */}
          
          <button 
            onClick={() => navigateTo('/analytics')}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Analytics</span>
            </div>
          </button>
        </div>
        
        {/* Divider */}
        <div className="border-t border-gray-200 my-2"></div>
        
        {/* Sign Out */}
        <div className="py-2">
          <button 
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:outline-none text-red-600"
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span>Sign Out</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}