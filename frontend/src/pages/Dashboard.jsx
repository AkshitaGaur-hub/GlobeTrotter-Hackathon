import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search as SearchIcon, Filter, ListFilter, SlidersHorizontal, Plus, MapPin, Calendar, ArrowRight, Award, Map, Navigation } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  const [recentTrips, setRecentTrips] = useState([]);
  const [stats, setStats] = useState({ totalTrips: 0, totalCountries: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.getTrips();
        const trips = res.trips || [];
        setRecentTrips(trips.slice(0, 3));
        setStats({
          totalTrips: trips.length,
          totalCountries: new Set(trips.map(t => t.name)).size
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    fetchDashboardData();
  }, []);

  const regionalSelections = [
    { id: 1, name: 'Europe', image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Asia', image: 'https://images.unsplash.com/photo-1535139262971-c51845709a48?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'North America', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' },
    { id: 4, name: 'South America', image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&w=800&q=80' },
    { id: 5, name: 'Africa', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=400&q=80' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="relative min-h-screen pb-20">
      {/* Hero Banner */}
      <div className="relative h-[40vh] min-h-[300px] w-full flex flex-col justify-center items-center text-center px-4 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center" 
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1600&q=80")' }} 
        />
        {/* Overlay */}
        <div className="absolute inset-0 z-0 bg-black/40" />
        
        <div className="relative z-10 text-white shadow-sm rounded-xl">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-md">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}
          </h1>
          <p className="text-lg md:text-xl text-slate-100 max-w-2xl drop-shadow-md">
            Where will your next adventure take you?
          </p>
          
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="flex flex-col items-center bg-black/30 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
              <span className="text-2xl font-bold">{stats.totalTrips}</span>
              <span className="text-sm text-slate-200">Trips Planned</span>
            </div>
            <div className="flex flex-col items-center bg-black/30 backdrop-blur-md px-6 py-3 rounded-xl border border-white/10">
              <span className="text-2xl font-bold">{stats.totalCountries}</span>
              <span className="text-sm text-slate-200">Destinations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* Search Bar + Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-4 md:p-6 border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 rounded-xl leading-5 bg-slate-50 dark:bg-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white dark:bg-slate-900 transition-all sm:text-lg"
                placeholder="Search destinations, activities, or trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Explore
            </button>
          </form>
          
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <button className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Group by
            </button>
            <button className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 transition-colors">
              <ListFilter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-800 transition-colors">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort by
            </button>
          </div>
        </div>

        {/* Top Regional Selections */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Top Regional Selections</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">
            {regionalSelections.map((region) => (
              <div 
                key={region.id} 
                onClick={() => navigate(`/search?q=${encodeURIComponent(region.name)}`)}
                className="snap-start shrink-0 cursor-pointer group"
              >
                <div className="w-40 h-40 rounded-2xl overflow-hidden relative shadow-sm border border-slate-200 dark:border-slate-700">
                  <img src={region.image} alt={region.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                  <span className="absolute bottom-3 left-3 right-3 text-white font-semibold text-center truncate">
                    {region.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Previous Trips */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Previous Trips</h2>
            <Link to="/trips" className="text-blue-600 font-medium text-sm hover:underline flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentTrips.length > 0 ? recentTrips.map((trip, idx) => {
              const fallbackImages = [
                'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
                'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80'
              ];
              return (
              <Link 
                key={trip.id} 
                to={`/trips/${trip.share_slug || trip.id}`}
                className="flex flex-col bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-48 w-full relative overflow-hidden">
                  <img src={trip.image_url || fallbackImages[idx % fallbackImages.length]} alt={trip.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 truncate group-hover:text-blue-600 transition-colors">{trip.name}</h3>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mb-1">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            )}) : (
              <div className="col-span-3 text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-slate-500 dark:text-slate-400">You haven't planned any trips yet.</p>
                <Link to="/trips/new" className="text-blue-600 font-medium hover:underline mt-2 inline-block">Start your first adventure</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link 
        to="/trips/new"
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-semibold rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Plan a Trip
      </Link>
    </div>
  );
}
