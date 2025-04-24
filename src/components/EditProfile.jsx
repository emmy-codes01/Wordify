import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import logo from '../assets/images/logo-primary.png';

export default function EditProfile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    full_name: '',
    ministry_name: '',
    bio: '',
    country: '',
    avatar_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!user) {
          navigate('/auth');
          return;
        }
        
        setUser(user);
        
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }
        
        if (profileData) {
          setProfile(profileData);
          if (profileData.avatar_url) {
            setAvatarPreview(profileData.avatar_url);
          }
        }
      } catch (err) {
        console.error('Error loading user data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async () => {
    if (!avatarFile) return null;
    
    try {
      const fileExt = avatarFile.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, avatarFile);
        
      if (uploadError) throw uploadError;
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);
        
      return publicUrl;
    } catch (err) {
      console.error('Error uploading avatar:', err.message);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setUpdating(true);
      setError(null);
      setSuccessMessage('');
      
      let updatedProfile = { ...profile };
      
      // Upload avatar if a new file was selected
      if (avatarFile) {
        const avatarUrl = await uploadAvatar();
        if (avatarUrl) {
          updatedProfile.avatar_url = avatarUrl;
        }
      }
      
      // Update profile in the database
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updatedProfile,
          updated_at: new Date()
        });
        
      if (updateError) throw updateError;
      
      setProfile(updatedProfile);
      setAvatarFile(null);
      setSuccessMessage('Profile updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error updating profile:', err.message);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="heartbeat">
          <img src={logo} alt="Wordify" className="h-19 w-auto" />
        </div>
        <style jsx>{`
          @keyframes heartbeat {
            0% {
              transform: scale(1);
            }
            25% {
              transform: scale(1.2);
            }
            50% {
              transform: scale(1);
            }
            75% {
              transform: scale(1.2);
            }
            100% {
              transform: scale(1);
            }
          }
          .heartbeat {
            animation: heartbeat 1.5s infinite ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="text-red-600 font-bold text-2xl mr-2">Wordify</div>
        </div>
        <div className="flex items-center">
          {profile?.avatar_url ? (
            <img 
              src={profile.avatar_url} 
              alt="Profile" 
              className="h-8 w-8 rounded-full mr-2"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2">
              <span className="text-sm font-semibold text-gray-500">
                {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <button 
            onClick={() => setMenuOpen(true)} 
            className="focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Sidebar Menu */}
      <SidebarMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)} 
      />

      {/* Main Content */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Edit Profile</h1>
        <p className="text-gray-500">Update your profile information</p>
      </div>

      {/* Edit Profile Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow rounded-md overflow-hidden mb-8">
        {/* Avatar Upload Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Profile Preview" 
                  className="h-24 w-24 rounded-full object-cover"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                  <span className="text-2xl font-semibold text-gray-500">
                    {(profile?.full_name || user?.email || '?').charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <label className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 cursor-pointer">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleAvatarChange} 
                className="hidden" 
              />
              Change Profile Picture
            </label>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-6 space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
            />
            <p className="mt-1 text-xs text-gray-500">
              Email cannot be changed
            </p>
          </div>

          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={profile.full_name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="ministry_name" className="block text-sm font-medium text-gray-700 mb-1">
              Ministry Name
            </label>
            <input
              type="text"
              id="ministry_name"
              name="ministry_name"
              value={profile.ministry_name || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your ministry name"
            />
          </div>

          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={profile.country || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Enter your country"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio || ''}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-red-500 focus:border-red-500"
              placeholder="Tell us about yourself or your ministry"
            ></textarea>
          </div>
        </div>

        {/* Form Actions */}
        <div className="px-6 py-4 bg-gray-50 flex justify-between">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updating}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
          >
            {updating ? 'Updating...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Status Messages */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
          {successMessage}
        </div>
      )}

      {/* Member Since Info */}
      <div className="text-center text-sm text-gray-500 mt-8">
        Member since: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
      </div>
    </div>
  );
}