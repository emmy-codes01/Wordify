import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';
import logo from '../assets/images/logo-primary.png';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [sermons, setSermons] = useState([]);
  const [stats, setStats] = useState({
    followers: 0,
    likes: 0,
    comments: 0,
    shares: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
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
          
          // Fetch user's sermons
          const { data: sermonsData, error: sermonsError } = await supabase
            .from('sermons')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (sermonsError) throw sermonsError;
          setSermons(sermonsData || []);
          
          // Fetch user stats
          const { data: statsData, error: statsError } = await supabase
            .from('user_stats')
            .select('*')
            .eq('user_id', user.id)
            .single();
            
          if (statsData) {
            setStats(statsData);
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
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (err) {
      console.error('Error signing out:', err.message);
      setError(err.message);
    }
  };

  const handleUploadClick = () => {
    navigate('/upload-sermon');
  };

  const handleEditProfileClick = () => {
    navigate('/edit-profile');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

      {/* Greeting */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          Hello {profile?.full_name || profile?.ministry_name || 'there'}! Ready to Inspire?
        </h1>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-4 mb-8">
        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
          Interact
        </button>
        <button 
          onClick={handleUploadClick}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          Upload
        </button>
      </div>

      {/* Date Range Selector */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm">
          <span className={`mr-4 cursor-pointer ${activeTab === 'overview' ? 'font-bold' : ''}`} 
                onClick={() => setActiveTab('overview')}>
            Overview
          </span>
          <span className="text-gray-400">
            {formatDate(dateRange.start)} - {formatDate(dateRange.end)}
          </span>
        </div>
      </div>

      {/* Posts Record */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Posts Record</h2>
          <div className="flex space-x-2">
            <button className="focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
              </svg>
            </button>
            <button className="focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-md overflow-hidden">
          <div className="divide-y divide-gray-200">
            {sermons.length > 0 ? (
              sermons.map((sermon) => (
                <div key={sermon.id} className="p-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {sermon.thumbnail_url ? (
                      <img 
                        src={sermon.thumbnail_url} 
                        alt={sermon.title} 
                        className="h-12 w-12 rounded-md mr-3 object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-md mr-3 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No img</span>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">{sermon.title}</h3>
                      <p className="text-sm text-gray-500">{formatDate(sermon.created_at)}</p>
                    </div>
                  </div>
                  <button className="focus:outline-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No sermons uploaded yet. Click the Upload button to get started!
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Action Buttons */}
      {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-8">
        <button 
          onClick={handleEditProfileClick}
          className="px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 flex justify-center items-center"
        >
          <span>Edit Profile</span>
        </button>
        <button 
          onClick={handleSignOut}
          className="px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 flex justify-center items-center"
        >
          <span>Sign Out</span>
        </button>
      </div> */}
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}