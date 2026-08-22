import React, { useState, useEffect } from "react";
import { Search, Heart, MessageCircle, Send, Edit2, Trash2, Plus, Filter, MapPin, Clock } from "lucide-react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Community() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [postData, setPostData] = useState({ content: "", destination: "", image: "" });

  const [expandedComments, setExpandedComments] = useState({});
  const [newComments, setNewComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const data = await api.getCommunityPosts();
      // Fake some data if empty for demo purposes
      let fetchedPosts = data.posts || [];
      if (fetchedPosts.length === 0) {
        fetchedPosts = [
          { id: 1, user: { name: "Alice", id: 2 }, destination: "Paris, France", content: "Just came back from an amazing trip to Paris! The Eiffel Tower at night is breathtaking.", image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a", likes: 24, comments: 2, created_at: new Date().toISOString() },
          { id: 2, user: { name: "Bob", id: 3 }, destination: "Kyoto, Japan", content: "Spring in Kyoto is magical. Cherry blossoms everywhere!", image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e", likes: 56, comments: 5, created_at: new Date(Date.now() - 86400000).toISOString() }
        ];
      }
      setPosts(fetchedPosts);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateOrUpdate = async () => {
    if (!postData.content) return;
    try {
      if (editingPost) {
        const res = await api.updatePost(editingPost.id, postData);
        setPosts(posts.map(p => p.id === editingPost.id ? { ...p, ...res.post } : p));
      } else {
        const res = await api.createPost({ ...postData, user: { id: user?.id, name: user?.name || "Anonymous" }});
        setPosts([res.post, ...posts]);
      }
      setIsModalOpen(false);
      setEditingPost(null);
      setPostData({ content: "", destination: "", image: "" });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this post?")) {
      try {
        await api.deletePost(id);
        setPosts(posts.filter(p => p.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLike = async (id) => {
    try {
      await api.toggleLike(id);
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComments = async (id) => {
    if (expandedComments[id]) {
      setExpandedComments({ ...expandedComments, [id]: false });
    } else {
      setExpandedComments({ ...expandedComments, [id]: true });
      if (!expandedComments[`${id}_data`]) {
        try {
          const res = await api.getComments(id);
          const comments = res.comments?.length > 0 ? res.comments : [{id: 1, content: "Great post!", user: {name: "John"}}];
          setExpandedComments(prev => ({ ...prev, [`${id}_data`]: comments }));
        } catch (err) {}
      }
    }
  };

  const handleAddComment = async (postId) => {
    const content = newComments[postId];
    if (!content) return;
    try {
      const res = await api.addComment(postId, content);
      setExpandedComments(prev => ({
        ...prev,
        [`${postId}_data`]: [...(prev[`${postId}_data`] || []), res.comment]
      }));
      setNewComments({ ...newComments, [postId]: "" });
      setPosts(posts.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredPosts = posts
    .filter(p => p.content?.toLowerCase().includes(searchTerm.toLowerCase()) || p.destination?.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => filterDestination ? p.destination?.toLowerCase().includes(filterDestination.toLowerCase()) : true)
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "likes") return b.likes - a.likes;
      return 0;
    });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Travel Community</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Share your experiences and get inspired.</p>
        </div>
        <button 
          onClick={() => {
            setEditingPost(null);
            setPostData({ content: "", destination: "", image: "" });
            setIsModalOpen(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center font-medium shrink-0"
        >
          <Plus className="w-5 h-5 mr-2" />
          Share Experience
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-2.5 text-slate-400" />
          <input 
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Filter className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <select 
              value={filterDestination}
              onChange={(e) => setFilterDestination(e.target.value)}
              className="pl-9 pr-8 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Destinations</option>
              <option value="paris">Paris</option>
              <option value="kyoto">Kyoto</option>
              <option value="new york">New York</option>
            </select>
          </div>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="likes">Most Liked</option>
          </select>
        </div>
      </div>

      {/* Feed */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-12 text-center">
          <MessageCircle className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No travel experiences yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Be the first to share your journey!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredPosts.map(post => (
            <div key={post.id} className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${post.user?.name || 'User'}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 dark:text-white">{post.user?.name}</h4>
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2 mt-0.5">
                        <span className="flex items-center"><MapPin className="w-3 h-3 mr-0.5" /> {post.destination || 'Unknown Location'}</span>
                        <span className="flex items-center"><Clock className="w-3 h-3 mr-0.5" /> {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  {user?.id === post.user?.id && (
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingPost(post); setPostData(post); setIsModalOpen(true); }} className="p-1.5 text-slate-400 hover:text-blue-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(post.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 mb-4 whitespace-pre-wrap">{post.content}</p>
                
                {post.image && (
                  <div className="rounded-lg overflow-hidden mb-4 bg-slate-100 dark:bg-slate-800 h-64 sm:h-96">
                    <img src={post.image} alt="Post attachment" className="w-full h-full object-cover" />
                  </div>
                )}
                
                <div className="flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <button onClick={() => handleLike(post.id)} className="flex items-center gap-1.5 text-slate-500 hover:text-red-500 transition-colors group">
                    <Heart className={`w-5 h-5 group-hover:fill-current`} />
                    <span className="font-medium">{post.likes}</span>
                  </button>
                  <button onClick={() => toggleComments(post.id)} className="flex items-center gap-1.5 text-slate-500 hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="font-medium">{post.comments}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              {expandedComments[post.id] && (
                <div className="bg-slate-50 dark:bg-slate-800/50 p-4 sm:p-6 border-t border-slate-100 dark:border-slate-800">
                  <div className="space-y-4 mb-4">
                    {expandedComments[`${post.id}_data`]?.map((comment, idx) => (
                      <div key={idx} className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0 overflow-hidden">
                           <img src={`https://ui-avatars.com/api/?name=${comment.user?.name || 'User'}&background=random`} alt="Avatar" className="w-full h-full object-cover" />
                         </div>
                         <div className="flex-1 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                           <h5 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">{comment.user?.name || 'User'}</h5>
                           <p className="text-sm text-slate-700 dark:text-slate-300">{comment.content}</p>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Add a comment..." 
                      value={newComments[post.id] || ""}
                      onChange={(e) => setNewComments({...newComments, [post.id]: e.target.value})}
                      className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-900"
                    />
                    <button onClick={() => handleAddComment(post.id)} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{editingPost ? 'Edit Experience' : 'Share Experience'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                <Trash2 className="w-5 h-5 hidden" />&times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Destination</label>
                <input 
                  type="text" 
                  value={postData.destination}
                  onChange={(e) => setPostData({...postData, destination: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                  placeholder="e.g. Kyoto, Japan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea 
                  value={postData.content}
                  onChange={(e) => setPostData({...postData, content: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 resize-none h-32"
                  placeholder="Share the details of your trip..."
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={postData.image}
                  onChange={(e) => setPostData({...postData, image: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800"
                  placeholder="https://..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-end gap-3 bg-slate-50 dark:bg-slate-800/50">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 font-medium hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">Cancel</button>
              <button onClick={handleCreateOrUpdate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                {editingPost ? 'Update Post' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
