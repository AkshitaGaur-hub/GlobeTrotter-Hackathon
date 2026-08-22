import React from "react";
import { CheckCircle2, AlertCircle, Award, Compass } from "lucide-react";

export default function GlobeScore({ globeScoreData, compact = false }) {
  if (!globeScoreData) return null;

  const score = globeScoreData.score ?? 85;
  const grade = globeScoreData.grade ?? "Excellent";
  const factors = globeScoreData.factors || {};
  const highlights = globeScoreData.highlights || [];
  const warnings = globeScoreData.warnings || [];

  // Color coding based on score
  const getScoreColor = (val) => {
    if (val >= 90) return { text: "text-emerald-600", stroke: "#10b981", bg: "bg-emerald-50", border: "border-emerald-200" };
    if (val >= 80) return { text: "text-blue-600", stroke: "#3b82f6", bg: "bg-blue-50", border: "border-blue-200" };
    if (val >= 70) return { text: "text-amber-600", stroke: "#f59e0b", bg: "bg-amber-50", border: "border-amber-200" };
    return { text: "text-rose-600", stroke: "#ef4444", bg: "bg-rose-50", border: "border-rose-200" };
  };

  const colors = getScoreColor(score);
  const strokeDashoffset = 283 - (283 * score) / 100; // 2 * PI * 45 ≈ 283

  if (compact) {
    return (
      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} ${colors.border} border`}>
        <Award className="w-3.5 h-3.5" />
        <span>GlobeScore: {score}/100</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-brand-50 text-brand-600">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">GlobeScore</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Trip efficiency & balance index</p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} ${colors.border} border`}>
          {grade}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Circular Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-2">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke="#f1f5f9"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                stroke={colors.stroke}
                strokeWidth="10"
                fill="transparent"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * score) / 100}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className={`text-3xl font-extrabold tracking-tight ${colors.text}`}>
                {score}
              </span>
              <span className="text-[10px] font-semibold uppercase text-slate-400">out of 100</span>
            </div>
          </div>
        </div>

        {/* 6-Factor Progress Breakdown */}
        <div className="md:col-span-8 space-y-2.5">
          {Object.entries(factors).map(([key, f]) => {
            const pct = Math.round((f.score / f.max) * 100);
            return (
              <div key={key}>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  <span>{f.label}</span>
                  <span className="text-slate-500 dark:text-slate-400 font-semibold">{f.score}/{f.max} pts</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-brand-500 to-amber-500 transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Highlights & Warnings Checklist */}
      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        {highlights.map((h, i) => (
          <div key={`h-${i}`} className="flex items-center gap-2 text-xs font-medium text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{h}</span>
          </div>
        ))}
        {warnings.map((w, i) => (
          <div key={`w-${i}`} className="flex items-center gap-2 text-xs font-medium text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{w}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
