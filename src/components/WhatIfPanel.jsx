import React, { useState } from "react";
import { Sparkles, IndianRupee, Clock, Compass, MapPin, Zap } from "lucide-react";
import Modal from "./Modal";
import BeforeAfterCard from "./BeforeAfterCard";
import AIThinkingLoader from "./AIThinkingLoader";
import api from "../services/api";

export default function WhatIfPanel({
  isOpen,
  onClose,
  currentTrip,
  onOptimizationApplied
}) {
  const [budget, setBudget] = useState(
    currentTrip?.budget ? Math.round(currentTrip.budget * 0.72) : 18000 // default demo drop
  );
  const [duration, setDuration] = useState(currentTrip?.durationDays || 5);
  const [travelStyle, setTravelStyle] = useState(currentTrip?.travel_style || "Balanced");
  const [destinationAdjustment, setDestinationAdjustment] = useState("");

  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleOptimize = async (e) => {
    e.preventDefault();
    setIsOptimizing(true);
    setErrorMessage(null);

    try {
      const res = await api.optimizeTrip({
        trip_id: currentTrip.id,
        newBudget: budget,
        newDuration: duration,
        newTravelStyle: travelStyle,
        destinationChange: destinationAdjustment
      });

      setComparisonResult(res.comparison);
    } catch (err) {
      setErrorMessage(err.message || "Failed to optimize trip constraints.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyOptimization = async () => {
    if (!comparisonResult?.optimized_plan) return;
    setIsApplying(true);
    try {
      const res = await api.applyOptimization(currentTrip.id, {
        optimized_plan: comparisonResult.optimized_plan,
        newBudget: budget,
        newStyle: travelStyle
      });
      if (onOptimizationApplied) {
        onOptimizationApplied(res.trip);
      }
      onClose();
    } catch (err) {
      setErrorMessage(err.message || "Failed to apply optimization changes.");
    } finally {
      setIsApplying(false);
    }
  };

  const resetForm = () => {
    setComparisonResult(null);
    setErrorMessage(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetForm();
        onClose();
      }}
      title={comparisonResult ? "Before & After Optimization Comparison" : "What If? — Adaptive Trip Optimization"}
      maxWidth="max-w-3xl"
    >
      {isOptimizing && (
        <AIThinkingLoader title="Re-optimizing itinerary with new constraints..." />
      )}

      {errorMessage && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
          {errorMessage}
        </div>
      )}

      {comparisonResult ? (
        <BeforeAfterCard
          comparison={comparisonResult}
          onApply={handleApplyOptimization}
          onCancel={() => setComparisonResult(null)}
          isApplying={isApplying}
        />
      ) : (
        <form onSubmit={handleOptimize} className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">The Adaptive AI Hero Engine:</p>
              <p className="mt-0.5">
                Change your budget, duration, or pace. GlobeTrotter doesn't simply wipe your plan—it intelligently re-balances cities, transit, and activities while preserving your core interests.
              </p>
            </div>
          </div>

          {/* Budget Constraint */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                New Target Budget (₹ INR)
              </label>
              <span className="text-base font-extrabold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg">
                ₹{Number(budget).toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="range"
              min="8000"
              max="60000"
              step="1000"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
            />
            <div className="flex justify-between text-[11px] text-slate-400 mt-1">
              <span>Budget: ₹8,000</span>
              <span className="text-slate-600 font-semibold">Current: ₹{currentTrip?.budget?.toLocaleString("en-IN") || "25,000"}</span>
              <span>Luxury: ₹60,000+</span>
            </div>
          </div>

          {/* Duration Constraint */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Duration (Days)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[3, 4, 5, 6].map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setDuration(days)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    duration === days
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          {/* Travel Style */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
              Travel Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Relaxed", "Balanced", "Adventure"].map((style) => (
                <button
                  type="button"
                  key={style}
                  onClick={() => setTravelStyle(style)}
                  className={`py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    travelStyle === style
                      ? "bg-brand-500 text-white border-brand-600 shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* Optional adjustments */}
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1.5">
              Specific Adjustment or Preference (Optional)
            </label>
            <input
              type="text"
              value={destinationAdjustment}
              onChange={(e) => setDestinationAdjustment(e.target.value)}
              placeholder="e.g. Focus only on Jaipur and Udaipur, reduce travel time"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-slate-50/50"
            />
          </div>

          {/* Submit CTA */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white bg-gradient-to-r from-brand-600 to-amber-500 hover:from-brand-500 hover:to-amber-400 font-bold text-sm shadow-md shadow-brand-500/25 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Optimize My Trip</span>
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
