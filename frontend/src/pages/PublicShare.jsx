import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Compass, Sparkles, Calendar, MapPin, Copy, Check, ArrowRight } from "lucide-react";
import api from "../services/api";
import GlobeScore from "../components/GlobeScore";
import BudgetCard from "../components/BudgetCard";
import BudgetChart from "../components/BudgetChart";
import Timeline from "../components/Timeline";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";

export default function PublicShare() {
  const { share_slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    async function loadPublicTrip() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await api.getPublicTrip(share_slug);
        setTrip(res.trip);
      } catch (err) {
        setError(err.message || "Public trip could not be loaded.");
      } finally {
        setIsLoading(false);
      }
    }
    loadPublicTrip();
  }, [share_slug]);

  const handleCopyTrip = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    setIsCopying(true);
    try {
      // Re-create trip for current user
      const res = await api.createTrip({
        name: `Copy of ${trip.name}`,
        start_date: trip.start_date,
        end_date: trip.end_date,
        description: trip.description,
        budget: trip.budget,
        travelers_count: trip.travelers_count,
        travel_style: trip.travel_style,
        interests: trip.interests,
        things_to_avoid: trip.things_to_avoid,
        stops: trip.stops?.map((s) => ({ city_id: s.city_id, start_date: s.start_date, end_date: s.end_date })),
        activities: trip.activities?.map((a) => ({
          city_id: a.city_id,
          activity_id: a.activity_id,
          scheduled_date: a.scheduled_date,
          scheduled_time: a.scheduled_time,
          cost_override: a.cost_override,
          notes: a.notes
        }))
      });

      navigate(`/trips/${res.trip.id}`);
    } catch (err) {
      alert("Failed to clone trip: " + err.message);
    } finally {
      setIsCopying(false);
    }
  };

  if (isLoading) return <LoadingState message="Loading shared itinerary..." />;
  if (error || !trip) return <ErrorState message={error || "Shared trip not found."} />;

  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const dateRange = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;
  const formatINR = (val) => "₹" + Math.round(val || 0).toLocaleString("en-IN");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Public Share Banner */}
      <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-amber-900">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-amber-800">Public Shared Itinerary</p>
            <p className="text-xs text-amber-700 mt-0.5">Created with GlobeTrotter Adaptive AI Planner</p>
          </div>
        </div>

        <button
          onClick={handleCopyTrip}
          disabled={isCopying}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all active:scale-95 shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>{isCopying ? "Cloning Trip..." : "Copy This Trip to My Account"}</span>
        </button>
      </div>

      {/* Hero Trip Header */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-6 sm:p-10 shadow-xl">
        <div className="max-w-3xl">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {dateRange}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-900/10 text-slate-200 text-xs font-semibold">
              {trip.durationDays} Days • {trip.travel_style}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            {trip.name}
          </h1>

          <div className="flex items-center gap-4 mt-4 text-sm font-semibold">
            <span>Estimated Cost: <strong className="text-amber-300 font-extrabold text-base">{formatINR(trip.total_estimated_cost)}</strong></span>
            <span>•</span>
            <span>GlobeScore: <strong className="text-emerald-400 font-extrabold text-base">{trip.globe_score}/100</strong></span>
          </div>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Daily Itinerary
          </h2>
          <Timeline days={trip.itineraryDays} />
        </div>

        <div className="lg:col-span-5 space-y-6">
          <GlobeScore globeScoreData={trip.globe_score_data} />
          <BudgetCard budgetData={trip.budget_data} />
          <BudgetChart budgetData={trip.budget_data} />
        </div>
      </div>
    </div>
  );
}
