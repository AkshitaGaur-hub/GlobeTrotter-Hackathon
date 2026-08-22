import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Calendar, MapPin, Share2, Sparkles, ArrowLeft,
  Award, Wallet, RefreshCw, Check, Copy, ExternalLink, Trash2
} from "lucide-react";
import api from "../services/api";
import GlobeScore from "../components/GlobeScore";
import BudgetCard from "../components/BudgetCard";
import BudgetChart from "../components/BudgetChart";
import Timeline from "../components/Timeline";
import WhatIfPanel from "../components/WhatIfPanel";
import Modal from "../components/Modal";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";

export default function ItineraryDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trip, setTrip] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isWhatIfOpen, setIsWhatIfOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const loadTrip = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getTripById(id);
      setTrip(res.trip);
    } catch (err) {
      setError(err.message || "Failed to load itinerary.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrip();
  }, [id]);

  const handleOptimizationApplied = (updatedTrip) => {
    setTrip(updatedTrip);
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}/share/${trip.share_slug || trip.id}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this trip?")) return;
    try {
      await api.deleteTrip(trip.id);
      navigate("/dashboard");
    } catch (err) {
      alert("Failed to delete trip: " + err.message);
    }
  };

  if (isLoading) {
    return <LoadingState message="Loading your customized itinerary..." />;
  }

  if (error || !trip) {
    return <ErrorState message={error || "Trip not found"} onRetry={loadTrip} />;
  }

  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const dateRange = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} — ${end.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`;

  const formatINR = (val) => "₹" + Math.round(val || 0).toLocaleString("en-IN");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fade-in">
      {/* Top Back & Action Bar */}
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trips</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Share Button */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Share Trip</span>
          </button>

          {/* Delete */}
          <button
            onClick={handleDelete}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-rose-600 hover:bg-rose-50 shadow-sm transition-colors"
            title="Delete Trip"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hero Trip Title Card */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-6 sm:p-10 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-500/15 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                {dateRange}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold">
                {trip.durationDays} Days • {trip.travelers_count || 1} Travelers
              </span>
              <span className="px-2.5 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-semibold">
                {trip.travel_style} Pace
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {trip.name}
            </h1>

            {trip.description && (
              <p className="text-xs sm:text-sm text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {trip.description}
              </p>
            )}

            {/* Route Stops Pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4">
              {trip.stops?.map((stop, sIdx) => (
                <span
                  key={`stop-pill-${sIdx}`}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white/15 backdrop-blur-md text-white text-xs font-bold"
                >
                  <MapPin className="w-3 h-3 text-brand-400" />
                  {stop.city_name || stop.name}
                </span>
              ))}
            </div>
          </div>

          {/* Right Hero Actions & GlobeScore Highlight */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 shrink-0">
            {/* Quick Metrics */}
            <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 text-right w-full sm:w-auto">
              <p className="text-[11px] uppercase font-semibold text-slate-300">Total Estimated Cost</p>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-300">
                {formatINR(trip.total_estimated_cost)}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Target Budget: {formatINR(trip.budget)}</p>
            </div>

            {/* HERO WHAT-IF BUTTON */}
            <button
              onClick={() => setIsWhatIfOpen(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-brand-500 to-amber-500 hover:from-brand-400 hover:to-amber-400 text-white font-extrabold text-sm shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-95 transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 text-amber-100" />
              <span>What If? (Optimize Trip)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 7 Cols: Vertical Itinerary Timeline */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Daily Itinerary Timeline
            </h2>
            <span className="text-xs text-slate-500">
              {trip.activities?.length || 0} scheduled experiences
            </span>
          </div>

          <Timeline days={trip.itineraryDays} />
        </div>

        {/* Right 5 Cols: GlobeScore & Budget Analytics */}
        <div className="lg:col-span-5 space-y-6">
          {/* GlobeScore Gauge */}
          <GlobeScore globeScoreData={trip.globe_score_data} />

          {/* Budget Financials */}
          <BudgetCard budgetData={trip.budget_data} />

          {/* Cost Category Donut Chart */}
          <BudgetChart budgetData={trip.budget_data} />
        </div>
      </div>

      {/* What-If Optimization Modal */}
      <WhatIfPanel
        isOpen={isWhatIfOpen}
        onClose={() => setIsWhatIfOpen(false)}
        currentTrip={trip}
        onOptimizationApplied={handleOptimizationApplied}
      />

      {/* Public Share Modal */}
      <Modal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title="Share Your GlobeTrotter Itinerary"
        maxWidth="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            Anyone with this link can view the read-only itinerary, budget breakdown, and GlobeScore.
          </p>

          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200">
            <input
              type="text"
              readOnly
              value={`${window.location.origin}/share/${trip.share_slug || trip.id}`}
              className="bg-transparent text-xs text-slate-700 font-mono flex-1 outline-none px-2 select-all"
            />
            <button
              onClick={handleCopyShareLink}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors flex items-center gap-1 shrink-0"
            >
              {copiedShare ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-2 flex justify-end">
            <Link
              to={`/share/${trip.share_slug || trip.id}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700"
            >
              <span>Preview Public View</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Modal>
    </div>
  );
}
