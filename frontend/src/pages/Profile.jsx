import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, MapPin, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function Profile() {
  const { user: authUser } = useAuth();
  
  const [profileData, setProfileData] = useState(null);
  const [trips, setTrips] = useState([]);
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: '', location: '' });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch User Profile
        const userRes = await api.getUserProfile(authUser?.id || 1);
        setProfileData(userRes.user);
        setEditForm({ bio: userRes.user?.bio || '', location: userRes.user?.location || '' });

        // Fetch Trips
        const tripsRes = await api.getTrips();
        setTrips(tripsRes.trips || []);

        // Fetch Community Posts
        const postsRes = await api.getCommunityPosts();
        // Filter by user's own posts
        const ownPosts = (postsRes.posts || []).filter(p => p.user?.id === (authUser?.id || 1));
        setPosts(ownPosts);

      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (authUser) {
      fetchData();
    }
  }, [authUser]);

  const handleSaveProfile = async () => {
    try {
      const res = await api.updateProfile(editForm);
      setProfileData({ ...profileData, ...res.user });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    }
  };

  const SquareCard = ({ trip }) => (
    <div className="flex flex-col bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden w-40 shrink-0">
      <div className="h-32 w-full bg-slate-100 dark:bg-slate-800">
        <img src={trip.image || `https://source.unsplash.com/400x300/?${trip.destination || trip.title || 'travel'}`} alt={trip.title || 'Trip'} className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{trip.title || trip.name || 'Trip'}</h3>
        <Link to={`/trips/${trip.id || trip.share_slug}`} className="mt-auto block text-center py-1.5 text-xs font-medium bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg transition-colors">
          View
        </Link>
      </div>
    </div>
  );

  if (isLoading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header section */}
      <div className="flex flex-col md:flex-row gap-8 bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 mb-10">
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden mb-4 border-4 border-white shadow-md">
            <img 
              src={`https://ui-avatars.com/api/?name=${authUser?.name || 'User'}&background=0D8ABC&color=fff&size=128`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="text-sm font-medium text-slate-600 dark:text-slate-400 flex items-center hover:text-blue-600">
            <Edit2 className="w-4 h-4 mr-1" /> Change Avatar
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Personal Details</h1>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-slate-600 text-sm font-medium">Cancel</button>
                <button onClick={handleSaveProfile} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">Save</button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
              <div className="text-slate-900 dark:text-white font-medium">{authUser?.name || 'Jane Doe'}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
              <div className="text-slate-900 dark:text-white font-medium">{authUser?.email || 'jane@example.com'}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Location</label>
              {isEditing ? (
                <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full px-2 py-1 border rounded bg-transparent" />
              ) : (
                <div className="text-slate-900 dark:text-white font-medium flex items-center">
                  <MapPin className="w-4 h-4 mr-1 text-slate-400" /> {profileData?.location || 'Not set'}
                </div>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Bio</label>
              {isEditing ? (
                <textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="w-full px-2 py-1 border rounded bg-transparent resize-none" rows="2" />
              ) : (
                <div className="text-slate-900 dark:text-white font-medium">{profileData?.bio || 'Add a bio to tell others about yourself.'}</div>
              )}
            </div>
            <div className="col-span-1 sm:col-span-2 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-6">
              <div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{trips.length}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">Total Trips</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-slate-900 dark:text-white">{posts.length}</span>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">Community Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Sections */}
      <div className="mb-10">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">My Trips</h2>
        {trips.length === 0 ? (
          <p className="text-slate-500">You haven't planned any trips yet.</p>
        ) : (
          <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
            {trips.map(trip => (
              <div key={trip.id} className="snap-start">
                 <SquareCard trip={trip} />
              </div>
            ))}
            {/* Add blank slot */}
            <Link to="/trips/new" className="snap-start flex flex-col bg-slate-50 dark:bg-slate-800 rounded-xl shadow-sm border border-dashed border-slate-300 dark:border-slate-600 overflow-hidden w-40 shrink-0 justify-center items-center h-[202px] hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer transition-colors group">
               <span className="text-slate-400 font-medium text-sm group-hover:text-blue-500">+ Add New</span>
            </Link>
          </div>
        )}
      </div>

      {/* My Posts Section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">My Community Posts</h2>
        {posts.length === 0 ? (
           <div className="bg-white dark:bg-slate-900 rounded-xl p-8 text-center border border-slate-200 dark:border-slate-700">
             <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
             <p className="text-slate-500">You haven't shared any experiences yet.</p>
             <Link to="/community" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium">Go to Community</Link>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map(post => (
              <div key={post.id} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700 flex flex-col">
                <div className="flex items-center text-xs text-slate-500 mb-2 gap-2">
                  <MapPin className="w-3 h-3" /> {post.destination || 'Unknown Location'}
                </div>
                <p className="text-slate-800 dark:text-slate-200 text-sm mb-3 line-clamp-3">{post.content}</p>
                <div className="mt-auto flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {post.likes || 0}</span>
                  <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments || 0}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
