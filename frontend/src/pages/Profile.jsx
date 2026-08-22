import React from 'react';
import { Link } from 'react-router-dom';
import { Edit2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  
  // Placeholder data
  const preplannedTrips = [
    { id: '1', title: 'Kyoto Escapade', image: 'https://picsum.photos/seed/globetrotter112/800/600' },
    { id: '2', title: 'Swiss Alps', image: 'https://picsum.photos/seed/globetrotter113/800/600' }
  ];
  
  const previousTrips = [
    { id: '3', title: 'New York City', image: 'https://picsum.photos/seed/globetrotter114/800/600' },
    { id: '4', title: 'London Calling', image: 'https://picsum.photos/seed/globetrotter115/800/600' }
  ];

  const SquareCard = ({ trip }) => (
    <div className="flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden w-40 shrink-0">
      <div className="h-32 w-full">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-slate-800 text-sm truncate">{trip.title}</h3>
        <Link to={`/trips/${trip.id}`} className="mt-2 block text-center py-1.5 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors">
          View
        </Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Profile Header section */}
      <div className="flex flex-col md:flex-row gap-8 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 mb-10">
        <div className="flex flex-col items-center justify-center shrink-0">
          <div className="w-32 h-32 rounded-full bg-slate-200 overflow-hidden mb-4 border-4 border-white shadow-md">
            <img 
              src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=0D8ABC&color=fff&size=128`} 
              alt="Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="text-sm font-medium text-slate-600 flex items-center hover:text-blue-600">
            <Edit2 className="w-4 h-4 mr-1" /> Change Avatar
          </button>
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Personal Details</h1>
            <button className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">
              Edit Profile
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Full Name</label>
              <div className="text-slate-900 font-medium">{user?.name || 'Jane Doe'}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
              <div className="text-slate-900 font-medium">{user?.email || 'jane@example.com'}</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Location</label>
              <div className="text-slate-900 font-medium flex items-center">
                <MapPin className="w-4 h-4 mr-1 text-slate-400" /> San Francisco, CA
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Travel Style</label>
              <div className="text-slate-900 font-medium">Adventure, Budget</div>
            </div>
          </div>
        </div>
      </div>

      {/* Trips Sections */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Preplanned Trips</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {preplannedTrips.map(trip => (
            <div key={trip.id} className="snap-start">
               <SquareCard trip={trip} />
            </div>
          ))}
          {/* Add blank slot */}
          <div className="snap-start flex flex-col bg-slate-50 rounded-xl shadow-sm border border-dashed border-slate-300 overflow-hidden w-40 shrink-0 justify-center items-center h-[202px] hover:bg-slate-100 cursor-pointer transition-colors">
             <span className="text-slate-400 font-medium text-sm">+ Add New</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900 mb-4">Previous Trips</h2>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
          {previousTrips.map(trip => (
            <div key={trip.id} className="snap-start">
               <SquareCard trip={trip} />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

