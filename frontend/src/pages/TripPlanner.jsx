import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Sparkles, Compass, MapPin, Calendar, Users, IndianRupee,
  Utensils, Landmark, TreePine, Mountain, Palette, Camera, Moon,
  ShieldAlert, ArrowRight, AlertCircle, RefreshCw
} from "lucide-react";
import api from "../services/api";
import PreferenceChip from "../components/PreferenceChip";
import AIThinkingLoader from "../components/AIThinkingLoader";

export default function TripPlanner() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledDestination = searchParams.get("destination") || "";

  // State
  const [startingCity, setStartingCity] = useState("Delhi");
  const [destinationPreference, setDestinationPreference] = useState(prefilledDestination);
  const [durationDays, setDurationDays] = useState(6);
  const [startDate, setStartDate] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [travelersCount, setTravelersCount] = useState(2);
  const [budget, setBudget] = useState(25000);
  const [travelStyle, setTravelStyle] = useState("Balanced");
  const [selectedInterests, setSelectedInterests] = useState(["Food", "History", "Adventure"]);
  const [thingsToAvoid, setThingsToAvoid] = useState("Long travel days, expensive activities");

  const [availableCities, setAvailableCities] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCities() {
      try {
        const res = await api.getCities();
        setAvailableCities(res.cities || []);
      } catch (err) {
        console.warn("Could not fetch cities:", err.message);
      }
    }
    fetchCities();
  }, []);

  const interestOptions = [
    { label: "Food & Cuisine", val: "Food", icon: Utensils },
    { label: "History & Forts", val: "History", icon: Landmark },
    { label: "Nature & Parks", val: "Nature", icon: TreePine },
    { label: "Adventure & Thrills", val: "Adventure", icon: Mountain },
    { label: "Culture & Arts", val: "Culture", icon: Palette },
    { label: "Photography", val: "Photography", icon: Camera },
    { label: "Nightlife & Cafes", val: "Nightlife", icon: Moon }
  ];

  const travelStyles = [
    { label: "Relaxed", sub: "Leisure pace, minimal transit" },
    { label: "Balanced", sub: "Optimal mix of sights & comfort" },
    { label: "Adventure", sub: "High energy, immersive thrill" }
  ];

  const avoidPresets = [
    "Long travel days",
    "Expensive activities",
    "Overcrowded spots",
    "Early morning starts"
  ];

  const toggleInterest = (val) => {
    setSelectedInterests((prev) =>
      prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]
    );
  };

  const toggleAvoidTag = (tag) => {
    setThingsToAvoid((prev) => {
      const parts = prev.split(",").map((p) => p.trim()).filter(Boolean);
      if (parts.includes(tag)) {
        return parts.filter((p) => p !== tag).join(", ");
      } else {
        return [...parts, tag].join(", ");
      }
    });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (selectedInterests.length === 0) {
      setError("Please select at least one interest to personalize your itinerary.");
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Calculate end date
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + durationDays - 1);

    try {
      const res = await api.generateTrip({
        startingCityName: startingCity,
        destinationPreference,
        startDate,
        endDate: end.toISOString().split("T")[0],
        durationDays,
        budget: parseFloat(budget),
        travelersCount: parseInt(travelersCount, 10),
        travelStyle,
        interests: selectedInterests,
        thingsToAvoid
      });

      if (res.trip?.id) {
        navigate(`/trips/${res.trip.id}`);
      } else {
        throw new Error("Trip generation completed but no ID returned.");
      }
    } catch (err) {
      setError(err.message || "AI planning failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {isGenerating && (
        <AIThinkingLoader title="GlobeTrotter AI is tailoring your trip..." />
      )}

      {/* Screen Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-700 border border-brand-200 text-xs font-bold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Itinerary Architect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Where will you go next?
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Tell GlobeTrotter what matters to you. We'll build a complete, constraint-aware travel plan.
        </p>
      </div>

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-50 text-rose-800 text-xs font-semibold flex items-center justify-between border border-rose-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            onClick={handleGenerate}
            className="px-3 py-1 rounded-lg bg-rose-200 text-rose-900 text-xs font-bold hover:bg-rose-300"
          >
            Retry
          </button>
        </div>
      )}

      {/* Hero Form */}
      <form onSubmit={handleGenerate} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-8">
        {/* Row 1: Starting City & Destination Preference */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              <span>Starting Point</span>
            </label>
            <select
              value={startingCity}
              onChange={(e) => setStartingCity(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {availableCities.map((c) => (
                <option key={`start-${c.id}`} value={c.name}>
                  {c.name} ({c.region || "India"})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Preferred Region / City (Optional)</span>
            </label>
            <input
              type="text"
              value={destinationPreference}
              onChange={(e) => setDestinationPreference(e.target.value)}
              placeholder="e.g. Rajasthan, Goa beaches, Himachal"
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Row 2: Dates, Duration & Travelers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-600" />
              <span>Start Date</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Duration
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[3, 4, 6, 8].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setDurationDays(days)}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    durationDays === days
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {days}d
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-brand-600" />
              <span>Travelers</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((count) => (
                <button
                  type="button"
                  key={count}
                  onClick={() => setTravelersCount(count)}
                  className={`py-3 rounded-xl text-xs font-bold border transition-all ${
                    travelersCount === count
                      ? "bg-brand-500 text-white border-brand-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {count} {count === 1 ? "Solo" : count === 2 ? "Duo" : `${count}`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Row 3: Target Budget */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-brand-600" />
              <span>Target Total Budget</span>
            </label>
            <span className="text-xl font-extrabold text-brand-700 bg-brand-50 px-3 py-1 rounded-xl border border-brand-200/60">
              ₹{Number(budget).toLocaleString("en-IN")}
            </span>
          </div>
          <input
            type="range"
            min="10000"
            max="60000"
            step="1000"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5">
            <span>Budget Saver: ₹10,000</span>
            <span>Standard: ₹25,000</span>
            <span>Premium: ₹60,000+</span>
          </div>
        </div>

        {/* Row 4: Travel Style Chips */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
            Travel Style
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {travelStyles.map((style) => (
              <PreferenceChip
                key={style.label}
                label={style.label}
                sublabel={style.sub}
                isSelected={travelStyle === style.label}
                onClick={() => setTravelStyle(style.label)}
              />
            ))}
          </div>
        </div>

        {/* Row 5: Interest Chips */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Travel Interests & Vibes
            </label>
            <span className="text-xs text-slate-400 font-medium">
              {selectedInterests.length} selected
            </span>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {interestOptions.map((item) => (
              <PreferenceChip
                key={item.val}
                label={item.label}
                icon={item.icon}
                isSelected={selectedInterests.includes(item.val)}
                onClick={() => toggleInterest(item.val)}
              />
            ))}
          </div>
        </div>

        {/* Row 6: Things to Avoid */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-600" />
            <span>Things to Avoid</span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {avoidPresets.map((tag) => {
              const isIncluded = thingsToAvoid.toLowerCase().includes(tag.toLowerCase());
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleAvoidTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    isIncluded
                      ? "bg-amber-100/80 text-amber-900 border-amber-300"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {isIncluded ? `✕ ${tag}` : `+ ${tag}`}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={thingsToAvoid}
            onChange={(e) => setThingsToAvoid(e.target.value)}
            placeholder="e.g. Long overnight bus journeys, tourist traps"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/40"
          />
        </div>

        {/* Submit Primary CTA */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400 text-center sm:text-left">
            GlobeTrotter will automatically score your route with GlobeScore & balance your expenses.
          </p>

          <button
            type="submit"
            disabled={isGenerating}
            className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-amber-500 hover:from-brand-500 hover:to-amber-400 text-white font-extrabold text-base shadow-xl shadow-brand-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
          >
            <Sparkles className="w-5 h-5 text-amber-200" />
            <span>Generate My Trip</span>
          </button>
        </div>
      </form>
    </div>
  );
}
