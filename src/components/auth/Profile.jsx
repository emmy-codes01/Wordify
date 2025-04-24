
// src/components/auth/Profile.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Profile({ onNext }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    ministryName: '',
    country: '',
    bio: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user logged in');
      
      // Update the user's metadata
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          ministry_name: formData.ministryName
        }
      });
      
      if (updateError) throw updateError;
      
      // Insert into profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          full_name: formData.fullName,
          ministry_name: formData.ministryName,
          country: formData.country,
          bio: formData.bio,
          updated_at: new Date()
        });
      
      if (profileError) throw profileError;
      
      // Clear any temp storage
      localStorage.removeItem('signUpEmail');
      localStorage.removeItem('tempPassword');
      
      // Proceed to dashboard or completion
      onNext('dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('No user logged in');
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('profile-photos')
        .upload(fileName, file, { upsert: true });
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data } = supabase.storage
        .from('profile-photos')
        .getPublicUrl(fileName);
      
      // Update user avatar_url in profiles table
      const { error: updateError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          avatar_url: data.publicUrl,
          updated_at: new Date()
        });
      
      if (updateError) throw updateError;
      
      alert('Profile photo uploaded successfully!');
    } catch (error) {
      alert('Error uploading profile photo: ' + error.message);
    }
  };
return (
  <div className="max-w-md mx-auto p-6">
    <div className="flex justify-center mb-6">
      <div className="relative">
        <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
        </div>
        <label className="absolute bottom-0 right-0 bg-gray-100 rounded-full p-1 cursor-pointer">
          <input type="file" className="hidden" accept="image/*" onChange={handleProfilePhotoUpload} />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </label>
      </div>
    </div>
    
    <h2 className="text-2xl font-bold mb-6 text-center">Create your Password</h2>
    
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="ministryName" className="block text-sm font-medium text-gray-700 mb-1">Name of Ministry</label>
        <input
          id="ministryName"
          name="ministryName"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          value={formData.ministryName}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-4">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
        <input
          id="country"
          name="country"
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          value={formData.country}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="mb-6">
        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
        <textarea
          id="bio"
          name="bio"
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          placeholder="Tell us something about yourself..."
          value={formData.bio}
          onChange={handleChange}
        ></textarea>
      </div>
      
      <button
        type="submit"
        className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700"
        disabled={loading}
      >
        {loading ? 'Creating account...' : 'Create account'}
      </button>
    </form>
    
    {error && <div className="text-red-600 text-sm mt-2 text-center">{error}</div>}
  </div>
);
}