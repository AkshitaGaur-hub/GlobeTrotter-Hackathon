import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search as SearchIcon, Filter, ListFilter, SlidersHorizontal, Plus, MapPin, Calendar, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const regionalSelections = [
    { id: 1, name: "Europe", image: "https://picsum.photos/seed/globetrotter100/800/600" },
    { id: 2, name: "Asia", image: "https://picsum.photos/seed/globetrotter101/800/600" },
    { id: 3, name: "North America", image: "https://picsum.photos/seed/globetrotter102/800/600" },
    { id: 4, name: "South America", image: "https://picsum.photos/seed/globetrotter103/800/600" },
    { id: 5, name: "Africa", image: "https://picsum.photos/seed/globetrotter104/800/600" }
  ];

  const previousTrips = [
    { id: '1', title: 'Weekend Getaway', destination: 'New York, USA', startDate: '2026-05-10', endDate: '2026-05-13', image: 'https://picsum.photos/seed/globetrotter105/800/600' },
    { id: '2', title: 'Summer in Paris', destination: 'Paris, France', startDate: '2025-07-01', endDate: '2025-07-15', image: 'https://picsum.photos/seed/globetrotter106/800/600' },
    { id: '3', title: 'Tokyo Adventure', destination: 'Tokyo, Japan', startDate: '2024-10-10', endDate: '2024-10-24', image: 'https://picsum.photos/seed/globetrotter107/800/600' }
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
      <div className="relative h-[40vh] min-h-[300px] w-full bg-slate-900 overflow-hidden">
        <img 
          src="https://picsum.photos/seed/globetrotter108/800/600" 
          alt="Travel Hero" 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/30"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Welcome back, {user?.name?.split(' ')[0] || 'Traveler'}
          </h1>
          <p className="text-lg md:text-xl text-slate-200 max-w-2xl drop-shadow">
            Where will your next adventure take you?
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 -mt-8 relative z-10">
        {/* Search Bar + Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-4 md:p-6 border border-slate-100">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all sm:text-lg"
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
          
          <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4">
            <button className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <Filter className="w-4 h-4 mr-2" /> Group by
            </button>
            <button className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <ListFilter className="w-4 h-4 mr-2" /> Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors">
              <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort by
            </button>
          </div>
        </div>

        {/* Top Regional Selections */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Top Regional Selections</h2>
          </div>
          <div className="flex overflow-x-auto gap-4 pb-6 snap-x hide-scrollbar">
            {regionalSelections.map((region) => (
              <div 
                key={region.id} 
                onClick={() => navigate(`/search?q=${encodeURIComponent(region.name)}`)}
                className="snap-start shrink-0 cursor-pointer group"
              >
                <div className="w-40 h-40 rounded-2xl overflow-hidden relative shadow-sm border border-slate-200">
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
            <h2 className="text-2xl font-bold text-slate-900">Previous Trips</h2>
            <Link to="/trips" className="text-blue-600 font-medium text-sm hover:underline flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {previousTrips.map(trip => (
              <Link 
                key={trip.id} 
                to={`/trips/${trip.id}`}
                className="flex flex-col bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group"
              >
                <div className="h-48 w-full relative overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">{trip.title}</h3>
                  <div className="flex items-center text-slate-500 text-sm mb-1">
                    <MapPin className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span className="truncate">{trip.destination}</span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <Link 
        to="/trips/new"
        className="fixed bottom-8 right-8 z-50 flex items-center justify-center gap-2 px-6 py-4 bg-brand-600 text-white font-semibold rounded-full shadow-lg hover:bg-brand-700 transition-colors"
      >
        <Plus className="w-5 h-5" />
        Plan a Trip
      </Link>
    </div>
  );
}
