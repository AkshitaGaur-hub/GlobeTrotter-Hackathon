import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Compass, MapPin, Calendar, Award, ArrowRight, PlaneTakeoff, PlusCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import TripCard from "../components/TripCard";
import DestinationCard from "../components/DestinationCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trips, setTrips] = useState([]);
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [tripsRes, citiesRes] = await Promise.all([
        api.getTrips(),
        api.getCities()
      ]);
      setTrips(tripsRes.trips || []);
      setCities(citiesRes.cities || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await api.deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      alert("Failed to delete trip: " + err.message);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading your personalized dashboard..." />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={loadData} />;
  }

  const latestTrip = trips[0];
  const recommendedCities = cities.slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 animate-fade-in">
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-8 sm:p-12 shadow-xl">
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl transform translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 border border-white/15 text-xs font-bold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Generation Adaptive Travel Planner</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Plan a trip you'll remember.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Tell GlobeTrotter your budget, style, and dream destinations. Our adaptive AI builds complete itineraries and recalculates the best trade-offs when your plans shift.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/trips/new"
              className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>Plan with AI</span>
            </Link>

            <a
              href="#destinations"
              className="px-5 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-semibold text-sm backdrop-blur-md transition-colors"
            >
              Explore Destinations
            </a>
          </div>
        </div>
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
            <PlaneTakeoff className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Planned Itineraries</p>
            <p className="text-2xl font-extrabold text-slate-900">{trips.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Available Destinations</p>
            <p className="text-2xl font-extrabold text-slate-900">{cities.length}+ Cities</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Avg. GlobeScore</p>
            <p className="text-2xl font-extrabold text-slate-900">
              {trips.length > 0 ? Math.round(trips.reduce((a, b) => a + (b.globe_score || 90), 0) / trips.length) : 92}/100
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming Trips Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">Your Trips</h2>
            <p className="text-xs text-slate-500">Adaptive itineraries customized to your constraints</p>
          </div>

          <Link
            to="/trips/new"
            className="flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Trip</span>
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} onDelete={handleDeleteTrip} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-10 border border-slate-200 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No trips planned yet</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Create your first adaptive AI journey in 30 seconds with custom budget, destinations, and interests.
            </p>
            <Link
              to="/trips/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Create Your First Trip</span>
            </Link>
          </div>
        )}
      </section>

      {/* Recommended Destinations Gallery */}
      <section id="destinations" className="space-y-4 pt-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Recommended Destinations</h2>
          <p className="text-xs text-slate-500">Curated Indian cities with realistic costs, activities, and rich culture</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedCities.map((city) => (
            <DestinationCard key={city.id} city={city} />
          ))}
        </div>
      </section>
    </div>
  );
}
