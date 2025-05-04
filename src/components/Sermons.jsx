import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import SidebarMenu from './SidebarMenu';

export default function Sermons() {
  const [user, setUser] = useState(null);
  const [sermons, setSermons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [searchTerm, setSearchTerm] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        setUser(user);
        
        // Fetch user's sermons
        if (user) {
          const { data: sermonsData, error: sermonsError } = await supabase
            .from('sermons')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
            
          if (sermonsError) throw sermonsError;
          setSermons(sermonsData || []);
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

  const handleUploadClick = () => {
    navigate('/upload-sermon');
  };

  const handleViewSermon = (sermonId) => {
    navigate(`/sermon/${sermonId}`);
  };

  const handleEditSermon = (sermonId) => {
    navigate(`/edit-sermon/${sermonId}`);
  };

  const handleDeleteSermon = async (sermonId) => {
    if (window.confirm('Are you sure you want to delete this sermon? This action cannot be undone.')) {
      try {
        const { error } = await supabase
          .from('sermons')
          .delete()
          .eq('id', sermonId);
          
        if (error) throw error;
        
        // Update local state to remove the deleted sermon
        setSermons(sermons.filter(sermon => sermon.id !== sermonId));
      } catch (err) {
        console.error('Error deleting sermon:', err.message);
        setError(err.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Filter and sort sermons
  const filteredSermons = sermons
    .filter(sermon => {
      // Filter by type
      if (filterType !== 'all' && sermon.category !== filterType) {
        return false;
      }
      
      // Filter by search term
      if (searchTerm && !sermon.title.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      if (sortBy === 'newest') {
        return new Date(b.created_at) - new Date(a.created_at);
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at) - new Date(b.created_at);
      } else if (sortBy === 'most_views') {
        return (b.view_count || 0) - (a.view_count || 0);
      } else if (sortBy === 'most_likes') {
        return (b.like_count || 0) - (a.like_count || 0);
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <div className="text-red-600 font-bold text-2xl mr-2">Wordify</div>
          <h1 className="text-xl font-semibold ml-2">Your Sermons</h1>
        </div>
        <div className="flex items-center">
          <button 
            onClick={handleUploadClick}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center mr-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Upload Sermon</span>
          </button>
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
      
      {/* Search and Filter */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search sermons..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <select
            className="block w-full sm:w-32 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="sunday">Sunday</option>
            <option value="midweek">Midweek</option>
            <option value="conference">Conference</option>
            <option value="special">Special</option>
          </select>
          
          <select
            className="block w-full sm:w-36 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="most_views">Most Views</option>
            <option value="most_likes">Most Likes</option>
          </select>
        </div>
      </div>
      
      {/* Sermons List */}
      <div className="bg-white shadow rounded-md overflow-hidden">
        {filteredSermons.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {filteredSermons.map((sermon) => (
              <div key={sermon.id} className="p-4 sm:p-6 hover:bg-gray-50">
                <div className="flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 mb-4 sm:mb-0">
                    {sermon.thumbnail_url ? (
                      <img 
                        src={sermon.thumbnail_url} 
                        alt={sermon.title} 
                        className="h-32 w-48 rounded-md object-cover"
                      />
                    ) : (
                      <div className="h-32 w-48 rounded-md bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No thumbnail</span>
                      </div>
                    )}
                  </div>
                  <div className="sm:ml-6 flex-grow">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-medium">{sermon.title}</h3>
                      <div className="relative group">
                        <button className="focus:outline-none">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                          </svg>
                        </button>
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block">
                          <button 
                            onClick={() => handleViewSermon(sermon.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            View Sermon
                          </button>
                          <button 
                            onClick={() => handleEditSermon(sermon.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Edit Sermon
                          </button>
                          <button 
                            onClick={() => handleDeleteSermon(sermon.id)}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Delete Sermon
                          </button>
                        </div>
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{sermon.description && sermon.description.length > 150 ? 
                      `${sermon.description.substring(0, 150)}...` : sermon.description}</p>
                    
                    <div className="mt-3 flex flex-wrap items-center text-sm text-gray-500">
                      <div className="mr-6 mb-2">
                        <span className="font-medium">Date: </span>
                        {formatDate(sermon.created_at)}
                      </div>
                      <div className="mr-6 mb-2">
                        <span className="font-medium">Duration: </span>
                        {sermon.duration ? `${Math.floor(sermon.duration / 60)}:${(sermon.duration % 60).toString().padStart(2, '0')}` : 'N/A'}
                      </div>
                      <div className="mr-6 mb-2">
                        <span className="font-medium">Views: </span>
                        {sermon.view_count || 0}
                      </div>
                      <div className="mb-2">
                        <span className="font-medium">Likes: </span>
                        {sermon.like_count || 0}
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        {sermon.category || 'Uncategorized'}
                      </span>
                      {sermon.tags && sermon.tags.map((tag, index) => (
                        <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 ml-2">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No sermons found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || filterType !== 'all' ? 
                'Try adjusting your search or filter criteria.' : 
                'Get started by creating your first sermon upload.'}
            </p>
            {!searchTerm && filterType === 'all' && (
              <div className="mt-6">
                <button
                  onClick={handleUploadClick}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Upload New Sermon
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {error && (
        <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </div>
  );
}