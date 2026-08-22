import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';

export default function MyTrips() {
  // Placeholder data for UI purposes
  const ongoingTrips = [
    { id: '1', title: 'European Summer Tour', destination: 'Paris, France', startDate: '2026-08-20', endDate: '2026-09-05', status: 'Ongoing', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' }
  ];
  
  const upcomingTrips = [
    { id: '2', title: 'Japan Cherry Blossom', destination: 'Tokyo, Japan', startDate: '2027-03-25', endDate: '2027-04-10', status: 'Upcoming', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' }
  ];
  
  const completedTrips = [
    { id: '3', title: 'Weekend Getaway', destination: 'New York, USA', startDate: '2026-05-10', endDate: '2026-05-13', status: 'Completed', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80' }
  ];

  const TripSection = ({ title, trips }) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">{title}</h2>
      {trips.length === 0 ? (
        <p className="text-slate-500 dark:text-slate-400 italic">No trips in this section.</p>
      ) : (
        <div className="flex flex-col space-y-4">
          {trips.map(trip => (
            <Link 
              key={trip.id} 
              to={`/trips/${trip.id}`}
              className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow group"
            >
              <div className="sm:w-48 h-32 sm:h-auto shrink-0">
                <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">{trip.title}</h3>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{trip.destination}</span>
                  </div>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex justify-end">
                  <span className="text-blue-600 text-sm font-medium flex items-center">
                    View Details <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trip Listing</h1>
        <Link to="/trips/new" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + Plan a Trip
        </Link>
      </div>
      
      <TripSection title="Ongoing" trips={ongoingTrips} />
      <TripSection title="Up-coming" trips={upcomingTrips} />
      <TripSection title="Completed" trips={completedTrips} />
    </div>
  );
}

