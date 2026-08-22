import React from "react";
import { Compass } from "lucide-react";

export default function LoadingState({ message = "Loading GlobeTrotter..." }) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
      <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-200 flex items-center justify-center text-brand-600 mb-4 shadow-sm">
        <Compass className="w-6 h-6 animate-[spin_4s_linear_infinite]" />
      </div>
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{message}</p>
    </div>
  );
}
