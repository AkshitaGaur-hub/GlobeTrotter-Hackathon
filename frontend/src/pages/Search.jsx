import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, ListFilter, SlidersHorizontal, MapPin, Star } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  // Update query state if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Placeholder data - Expanded to include different continents/regions
  const allResults = [
    { id: 1, title: 'Eiffel Tower', location: 'Paris, France (Europe)', type: 'Attraction', rating: 4.8, price: '$$', image: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=300&q=80', description: 'Wrought-iron lattice tower on the Champ de Mars.' },
    { id: 2, title: 'Louvre Museum', location: 'Paris, France (Europe)', type: 'Museum', rating: 4.9, price: '$$', image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=300&q=80', description: 'The worlds largest art museum and a historic monument.' },
    { id: 3, title: 'Central Park', location: 'New York City, USA (North America)', type: 'Park', rating: 4.8, price: 'Free', image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=300&q=80', description: 'Urban park in New York City located between the Upper West and Upper East Sides of Manhattan.' },
    { id: 4, title: 'Mount Fuji', location: 'Honshu, Japan (Asia)', type: 'Nature', rating: 4.9, price: 'Free', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=300&q=80', description: 'Japan’s highest mountain and a major cultural and spiritual symbol.' },
    { id: 5, title: 'Taj Mahal', location: 'Agra, India (Asia)', type: 'Historical', rating: 4.9, price: '$', image: 'https://images.unsplash.com/photo-1564507592208-028bb465c14f?auto=format&fit=crop&w=300&q=80', description: 'An immense mausoleum of white marble, built in Agra by Mughal emperor Shah Jahan.' },
    { id: 6, title: 'Machu Picchu', location: 'Cusco Region, Peru (South America)', type: 'Historical', rating: 4.9, price: '$$$', image: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?auto=format&fit=crop&w=300&q=80', description: 'A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.' },
    { id: 7, title: 'Serengeti National Park', location: 'Tanzania (Africa)', type: 'Nature', rating: 4.9, price: '$$$', image: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=300&q=80', description: 'A massive wilderness area known for its huge herds of plains animals.' },
    { id: 8, title: 'Angkor Wat', location: 'Siem Reap, Cambodia (Asia)', type: 'Historical', rating: 4.8, price: '$', image: 'https://images.unsplash.com/photo-1600803730598-a28a3915bc32?auto=format&fit=crop&w=300&q=80', description: 'A temple complex in Cambodia and the largest religious monument in the world.' }
  ];

  // Filter results based on search query
  const filteredResults = allResults.filter(result => {
    if (!searchQuery) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      result.title.toLowerCase().includes(lowerQuery) ||
      result.location.toLowerCase().includes(lowerQuery) ||
      result.description.toLowerCase().includes(lowerQuery) ||
      result.type.toLowerCase().includes(lowerQuery)
    );
  });

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSearchParams(val ? { q: val } : {});
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Explore Destinations & Activities</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-slate-300 rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm"
            placeholder="Search for cities, regions, or activities..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4 mr-2" /> Group by
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <ListFilter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort by
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 mb-2">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Suggestions'} ({filteredResults.length})
        </h2>
        
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
            <SearchIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No results found</h3>
            <p className="mt-1 text-slate-500">We couldn't find anything matching "{searchQuery}". Try a different location!</p>
          </div>
        ) : (
          filteredResults.map(result => (
            <div key={result.id} className="flex flex-col sm:flex-row bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="sm:w-64 h-40 sm:h-auto shrink-0">
                <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-900">{result.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {result.type}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-500 text-sm mt-1 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{result.location}</span>
                  </div>
                  <p className="text-slate-600 text-sm line-clamp-2">{result.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-amber-500 text-sm font-medium">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>{result.rating}</span>
                    </div>
                    <div className="text-slate-700 text-sm font-medium">
                      {result.price}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg hover:bg-blue-100 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
