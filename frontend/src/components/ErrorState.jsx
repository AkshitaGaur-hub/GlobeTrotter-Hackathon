import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorState({ message = "An unexpected error occurred.", onRetry }) {
  return (
    <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mb-4 shadow-sm">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-slate-900 mb-1">Something went wrong</h3>
      <p className="text-xs text-slate-600 mb-6 leading-relaxed">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
}
