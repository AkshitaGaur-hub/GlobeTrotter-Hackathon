import React from "react";
import { Wallet, IndianRupee, TrendingUp, Calendar, Zap, AlertTriangle } from "lucide-react";

export default function BudgetCard({ budgetData }) {
  if (!budgetData) return null;

  const {
    totalEstimatedCost = 0,
    budget = 0,
    remaining = 0,
    isOverBudget = false,
    overBudgetAmount = 0,
    averagePerDay = 0,
    durationDays = 1,
    analytics = {}
  } = budgetData;

  const formatINR = (val) => "₹" + Math.round(val || 0).toLocaleString("en-IN");
  const budgetRatio = budget > 0 ? Math.min(100, Math.round((totalEstimatedCost / budget) * 100)) : 0;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Budget & Financials</h3>
            <p className="text-xs text-slate-500">Deterministic cost calculations</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 uppercase font-semibold">Duration</span>
          <p className="text-sm font-bold text-slate-800">{durationDays} Days</p>
        </div>
      </div>

      {/* Main Totals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500">Total Estimated Cost</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatINR(totalEstimatedCost)}
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
          <p className="text-xs font-semibold text-slate-500">Target Budget</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">
            {formatINR(budget)}
          </p>
        </div>

        <div className={`p-3.5 rounded-xl border ${isOverBudget ? "bg-rose-50 border-rose-200" : "bg-emerald-50 border-emerald-200"}`}>
          <p className={`text-xs font-semibold ${isOverBudget ? "text-rose-600" : "text-emerald-700"}`}>
            {isOverBudget ? "Over Target Budget" : "Surplus Remaining"}
          </p>
          <p className={`text-2xl font-extrabold mt-1 ${isOverBudget ? "text-rose-700" : "text-emerald-800"}`}>
            {isOverBudget ? `+${formatINR(overBudgetAmount)}` : formatINR(remaining)}
          </p>
        </div>
      </div>

      {/* Progress to Budget */}
      {budget > 0 && (
        <div className="mb-5">
          <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Budget Utilization</span>
            <span>{budgetRatio}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                isOverBudget ? "bg-rose-500" : budgetRatio > 85 ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${Math.min(100, budgetRatio)}%` }}
            />
          </div>
        </div>
      )}

      {/* Daily Analytics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Daily Average</p>
            <p className="text-sm font-bold text-slate-800">{formatINR(averagePerDay)}/day</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
            <Zap className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Peak Day (Day {analytics.mostExpensiveDay?.dayNumber || 1})</p>
            <p className="text-sm font-bold text-slate-800">{formatINR(analytics.mostExpensiveDay?.totalCost || averagePerDay)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] text-slate-500 font-medium">Cheapest Day (Day {analytics.cheapestDay?.dayNumber || 1})</p>
            <p className="text-sm font-bold text-slate-800">{formatINR(analytics.cheapestDay?.totalCost || averagePerDay)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
