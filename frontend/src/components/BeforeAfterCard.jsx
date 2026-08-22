import React from "react";
import { ArrowRight, CheckCircle2, TrendingDown, Award, Sparkles, RefreshCw } from "lucide-react";
import confetti from "canvas-confetti";

export default function BeforeAfterCard({
  comparison,
  onApply,
  onCancel,
  isApplying = false
}) {
  if (!comparison) return null;

  const { before, after, savings_amount = 0, what_changed = [] } = comparison;

  const formatINR = (val) => "₹" + Math.round(val || 0).toLocaleString("en-IN");

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch {}
    if (onApply) onApply();
  };

  return (
    <div className="space-y-6">
      {/* Hero Savings Banner */}
      <div className="bg-emerald-600 rounded-2xl p-6 text-white text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-slate-900/10 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
        <span className="inline-block px-3 py-1 rounded-full bg-white dark:bg-slate-900/20 backdrop-blur-md text-xs font-extrabold uppercase tracking-wider mb-2">
          Optimization Result
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          YOU SAVED {formatINR(savings_amount)}
        </h2>
        <p className="text-emerald-100 text-xs sm:text-sm mt-1">
          Intelligently adapted to fit ₹{after.budget?.toLocaleString("en-IN")} without sacrificing core travel experiences
        </p>
      </div>

      {/* Side-by-Side Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* BEFORE CARD */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700 mb-3">
            <span className="text-xs font-extrabold uppercase text-slate-400 tracking-wider">Before</span>
            <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 dark:text-slate-300 text-xs font-bold">
              Original Plan
            </span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Estimated Cost:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200 line-through text-rose-500">
                {formatINR(before.total_estimated_cost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Budget Target:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{formatINR(before.budget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Duration:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{before.durationDays} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500 dark:text-slate-400">Cities Visited:</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{before.cities_count} Cities</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500 dark:text-slate-400">GlobeScore:</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{before.globe_score}/100</span>
            </div>
          </div>
        </div>

        {/* AFTER CARD */}
        <div className="p-5 rounded-2xl bg-brand-50/50 border-2 border-brand-500 shadow-sm relative overflow-hidden">
          <div className="absolute top-2 right-2">
            <Sparkles className="w-5 h-5 text-brand-500" />
          </div>

          <div className="flex items-center justify-between pb-3 border-b border-brand-200/80 mb-3">
            <span className="text-xs font-extrabold uppercase text-brand-700 tracking-wider">After</span>
            <span className="px-2.5 py-0.5 rounded-full bg-brand-500 text-white text-xs font-bold shadow-sm">
              Adaptive Rebuild ✨
            </span>
          </div>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Estimated Cost:</span>
              <span className="font-extrabold text-emerald-600 text-base">
                {formatINR(after.total_estimated_cost)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">New Target Budget:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(after.budget)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Duration:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{after.durationDays} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600 dark:text-slate-400">Cities Visited:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{after.cities_count} Cities</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-slate-400">GlobeScore:</span>
              <span className="font-extrabold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                {after.globe_score}/100
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* "What Changed?" Rationale Section */}
      <div className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
        <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>What Changed in this Adaptive Rebuild?</span>
        </h4>
        <div className="space-y-2">
          {what_changed.map((change, i) => (
            <div key={`change-${i}`} className="flex items-start gap-2 text-xs font-medium text-slate-700 dark:text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{change}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isApplying}
          className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold hover:bg-slate-100 dark:bg-slate-800 transition-colors"
        >
          Keep Original
        </button>

        <button
          type="button"
          onClick={triggerCelebration}
          disabled={isApplying}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold transition-colors duration-200"
        >
          {isApplying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Updating Trip...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Apply Optimized Plan</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
