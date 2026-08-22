import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon, Filter, ListFilter, SlidersHorizontal, MapPin, Star, X } from 'lucide-react';

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedResult, setSelectedResult] = useState(null);

  // Update query state if URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Placeholder data - Expanded to include different continents/regions
  const allResults = [
    { id: 1, title: 'Eiffel Tower', location: 'Paris, France (Europe)', type: 'Attraction', rating: 4.8, price: '$$', image: 'https://picsum.photos/seed/globetrotter116/800/600', description: 'Wrought-iron lattice tower on the Champ de Mars.', fullDetails: 'The Eiffel Tower is a wrought-iron lattice tower on the Champ de Mars in Paris, France. It is named after the engineer Gustave Eiffel, whose company designed and built the tower. Locally nicknamed "La dame de fer" (French for "Iron Lady"), it was constructed from 1887 to 1889 as the centerpiece of the 1889 Worlds Fair. Although initially criticized by some of France\'s leading artists and intellectuals for its design, it has since become a global cultural icon of France and one of the most recognizable structures in the world.' },
    { id: 2, title: 'Louvre Museum', location: 'Paris, France (Europe)', type: 'Museum', rating: 4.9, price: '$$', image: 'https://picsum.photos/seed/globetrotter117/800/600', description: 'The worlds largest art museum and a historic monument.', fullDetails: 'The Louvre, or the Louvre Museum, is a national art museum in Paris, France. It is located on the Right Bank of the Seine in the city\'s 1st arrondissement (district or ward) and home to some of the most canonical works of Western art, including the Mona Lisa and the Venus de Milo.' },
    { id: 3, title: 'Central Park', location: 'New York City, USA (North America)', type: 'Park', rating: 4.8, price: 'Free', image: 'https://picsum.photos/seed/globetrotter118/800/600', description: 'Urban park in New York City located between the Upper West and Upper East Sides of Manhattan.', fullDetails: 'Central Park is an urban park between the Upper West and Upper East Sides of Manhattan in New York City. It is the fifth-largest park in the city, covering 843 acres (341 ha). It is the most visited urban park in the United States, with an estimated 42 million visitors annually as of 2016, and is the most filmed location in the world.' },
    { id: 4, title: 'Mount Fuji', location: 'Honshu, Japan (Asia)', type: 'Nature', rating: 4.9, price: 'Free', image: 'https://picsum.photos/seed/globetrotter119/800/600', description: 'Japan’s highest mountain and a major cultural and spiritual symbol.', fullDetails: 'Mount Fuji, located on the island of Honshu, is the highest mountain in Japan, with an elevation of 3,776.24 m (12,389 ft). It is the second-highest volcano located on an island in Asia (after Mount Kerinci on the Indonesian island of Sumatra), and seventh-highest peak of an island on Earth. Mount Fuji is an active stratovolcano that last erupted from 1707 to 1708.' },
    { id: 5, title: 'Taj Mahal', location: 'Agra, India (Asia)', type: 'Historical', rating: 4.9, price: '$', image: 'https://picsum.photos/seed/globetrotter120/800/600', description: 'An immense mausoleum of white marble, built in Agra by Mughal emperor Shah Jahan.', fullDetails: 'The Taj Mahal is an ivory-white marble mausoleum on the right bank of the river Yamuna in the Indian city of Agra. It was commissioned in 1632 by the Mughal emperor Shah Jahan to house the tomb of his favourite wife, Mumtaz Mahal; it also houses the tomb of Shah Jahan himself. The tomb is the centrepiece of a 17-hectare (42-acre) complex, which includes a mosque and a guest house.' },
    { id: 6, title: 'Machu Picchu', location: 'Cusco Region, Peru (South America)', type: 'Historical', rating: 4.9, price: '$$$', image: 'https://picsum.photos/seed/globetrotter121/800/600', description: 'A 15th-century Inca citadel located in the Eastern Cordillera of southern Peru.', fullDetails: 'Machu Picchu is a 15th-century Inca citadel located in the Eastern Cordillera of southern Peru on a 2,430-meter (7,970 ft) mountain ridge. It is located in the Machupicchu District within Urubamba Province above the Sacred Valley, which is 80 kilometers (50 mi) northwest of Cusco. The Urubamba River flows past it, cutting through the Cordillera and creating a canyon with a tropical mountain climate.' },
    { id: 7, title: 'Serengeti National Park', location: 'Tanzania (Africa)', type: 'Nature', rating: 4.9, price: '$$$', image: 'https://picsum.photos/seed/globetrotter122/800/600', description: 'A massive wilderness area known for its huge herds of plains animals.', fullDetails: 'The Serengeti ecosystem is a geographical region in Africa, spanning northern Tanzania. The protected area within the region includes approximately 30,000 km2 (12,000 sq mi) of land, including the Serengeti National Park and several game reserves. The Serengeti hosts the second largest terrestrial mammal migration in the world, which helps secure it as one of the Seven Natural Wonders of Africa.' },
    { id: 8, title: 'Angkor Wat', location: 'Siem Reap, Cambodia (Asia)', type: 'Historical', rating: 4.8, price: '$', image: 'https://picsum.photos/seed/globetrotter123/800/600', description: 'A temple complex in Cambodia and the largest religious monument in the world.', fullDetails: 'Angkor Wat is a temple complex in Cambodia and the largest religious monument in the world, on a site measuring 162.6 hectares (1,626,000 sq meters). It was originally constructed as a Hindu temple dedicated to the god Vishnu for the Khmer Empire, gradually transforming into a Buddhist temple towards the end of the 12th century.' }
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
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Explore Destinations & Activities</h1>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-4 border border-slate-300 dark:border-slate-600 rounded-xl leading-5 bg-white dark:bg-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-lg shadow-sm"
            placeholder="Search for cities, regions, or activities..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800">
            <Filter className="w-4 h-4 mr-2" /> Group by
          </button>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800">
            <ListFilter className="w-4 h-4 mr-2" /> Filter
          </button>
          <button className="flex items-center px-4 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800">
            <SlidersHorizontal className="w-4 h-4 mr-2" /> Sort by
          </button>
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          {searchQuery ? `Results for "${searchQuery}"` : 'All Suggestions'} ({filteredResults.length})
        </h2>
        
        {filteredResults.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
            <SearchIcon className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">No results found</h3>
            <p className="mt-1 text-slate-500 dark:text-slate-400">We couldn't find anything matching "{searchQuery}". Try a different location!</p>
          </div>
        ) : (
          filteredResults.map(result => (
            <div key={result.id} className="flex flex-col sm:flex-row bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="sm:w-64 h-40 sm:h-auto shrink-0">
                <img src={result.image} alt={result.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{result.title}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {result.type}
                    </span>
                  </div>
                  <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm mt-1 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{result.location}</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">{result.description}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-amber-500 text-sm font-medium">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      <span>{result.rating}</span>
                    </div>
                    <div className="text-slate-700 dark:text-slate-300 text-sm font-medium">
                      {result.price}
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedResult(result)}
                    className="px-4 py-2 bg-blue-50 text-blue-700 font-medium text-sm rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200 my-8">
            <button 
              onClick={() => setSelectedResult(null)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="w-full h-64 sm:h-80 relative">
              <img src={selectedResult.image} alt={selectedResult.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-4 left-6 right-6">
                <div className="flex items-center gap-2 mb-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-600 text-white">
                    {selectedResult.type}
                  </span>
                  <div className="flex items-center text-amber-400 text-sm font-bold bg-black/40 px-2 rounded-full backdrop-blur-sm">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    <span>{selectedResult.rating}</span>
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-white">{selectedResult.title}</h2>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center text-slate-500 dark:text-slate-400 font-medium mb-4">
                <MapPin className="w-5 h-5 mr-1 text-blue-500" />
                <span>{selectedResult.location}</span>
                <span className="mx-3 text-slate-300">|</span>
                <span className="text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 rounded font-semibold">{selectedResult.price}</span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">About</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {selectedResult.fullDetails || selectedResult.description}
              </p>

              <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-6">
                <button 
                  onClick={() => setSelectedResult(null)}
                  className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
                <button className="px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors flex items-center">
                  <MapPin className="w-4 h-4 mr-2" /> Add to Trip
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
