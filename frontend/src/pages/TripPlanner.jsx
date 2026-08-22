import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Sparkles, Navigation, ArrowRight } from "lucide-react";
import { api } from "../services/api";

export default function TripPlanner() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Placeholder suggestions
  const suggestions = [
    { id: 1, title: 'Mount Fuji', type: 'Attraction', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
    { id: 2, title: 'Colosseum', type: 'Historical', image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80' },
    { id: 3, title: 'Santorini', type: 'City', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80' },
    { id: 4, title: 'Grand Canyon', type: 'Nature', image: 'https://images.unsplash.com/photo-1474044159687-1ee9f3a51722?auto=format&fit=crop&w=800&q=80' },
    { id: 5, title: 'Taj Mahal', type: 'Attraction', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80' },
    { id: 6, title: 'Northern Lights', type: 'Experience', image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?auto=format&fit=crop&w=800&q=80' },
  ];

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    if (!formData.destination || !formData.startDate || !formData.endDate) return;
    
    setIsSubmitting(true);
    try {
      const res = await api.createTrip({
        name: formData.destination,
        start_date: formData.startDate,
        end_date: formData.endDate,
        description: `My trip to ${formData.destination}`,
        budget: 5000,
        travelers_count: 1
      });
      navigate(`/trips/${res.trip.id || res.trip.share_slug}`);
    } catch (err) {
      console.error("Failed to create trip:", err);
      alert("Failed to create trip. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleSuggestionClick = (title) => {
    setFormData(prev => ({ ...prev, destination: title }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-3">Plan a New Trip</h1>
        <p className="text-slate-600 dark:text-slate-400">Enter your destination and dates to get started.</p>
      </div>

      {/* Main Form */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 sm:p-8 mb-12">
        <form onSubmit={handleCreateTrip} className="space-y-6">
          
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
              Where do you want to go?
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                required
                placeholder="e.g., Tokyo, Japan or Multiple Cities"
                className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white bg-transparent"
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                Start Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white bg-transparent"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">
                End Date
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="date"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 dark:text-white bg-transparent"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  min={formData.startDate}
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex items-center gap-2 px-8 py-3 bg-blue-600 text-white font-semibold rounded-xl transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
            >
              {isSubmitting ? 'Creating Trip...' : 'Start Planning'} {!isSubmitting && <ArrowRight className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>

      {/* AI Suggestions Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Suggestions for Places to Visit / Activities</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {suggestions.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleSuggestionClick(item.title)}
              className="group cursor-pointer bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all hover:border-blue-300"
            >
              <div className="h-40 w-full overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <div className="text-xs font-semibold text-blue-600 mb-1 tracking-wider uppercase">{item.type}</div>
                <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-700 transition-colors">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
