import React, { useState, useEffect } from "react";
import { Sparkles, Compass, Route, Wallet, Calendar, CheckCircle2 } from "lucide-react";

export default function AIThinkingLoader({ title = "Generating your personalized trip..." }) {
  const steps = [
    { text: "Understanding your travel style and preferences...", icon: Sparkles },
    { text: "Calculating optimal intercity routes & pacing...", icon: Route },
    { text: "Balancing activities with your target budget...", icon: Wallet },
    { text: "Building your comprehensive daily itinerary...", icon: Calendar }
  ];

  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIdx((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
        {/* Glow background accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-400/20 rounded-full blur-3xl" />

        {/* Animated Compass Icon */}
        <div className="relative mx-auto w-20 h-20 rounded-2xl bg-brand-600 p-0.5 mb-6 flex items-center justify-center">
          <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[14px] flex items-center justify-center">
            <Compass className="w-10 h-10 text-brand-600 animate-[spin_6s_linear_infinite]" />
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
          GlobeTrotter AI is tailoring activities, transit, and budget factors
        </p>

        {/* Steps List */}
        <div className="space-y-3 text-left">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isDone = idx < currentStepIdx;
            const isCurrent = idx === currentStepIdx;

            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? "bg-brand-50/80 border border-brand-200/80 text-brand-900 scale-[1.02]"
                    : isDone
                    ? "text-emerald-700 bg-emerald-50/50"
                    : "text-slate-400"
                }`}
              >
                <div className="shrink-0">
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : isCurrent ? (
                    <div className="w-4 h-4 rounded-full border-2 border-brand-600 border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600" />
                  )}
                </div>
                <span className="text-xs font-semibold leading-snug">{step.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
