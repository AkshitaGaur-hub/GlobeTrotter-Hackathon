import React, { useState } from "react";
import { Calendar, MapPin } from "lucide-react";
import ActivityCard from "./ActivityCard";

export default function Timeline({ days = [] }) {
  const [activeDayIdx, setActiveDayIdx] = useState(0);

  if (!days || days.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center text-slate-500">
        No itinerary activities scheduled yet.
      </div>
    );
  }

  const activeDay = days[activeDayIdx] || days[0];

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  return (
    <div className="space-y-6">
      {/* Day Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {days.map((day, idx) => {
          const isSelected = idx === activeDayIdx;
          return (
            <button
              key={`day-tab-${day.dayNumber}`}
              onClick={() => setActiveDayIdx(idx)}
              className={`shrink-0 flex flex-col items-center px-4 py-2.5 rounded-xl text-left border transition-all duration-200 ${
                isSelected
                  ? "bg-slate-900 text-white border-slate-900 shadow-md scale-[1.02]"
                  : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <span className={`text-[10px] font-extrabold uppercase tracking-wider ${isSelected ? "text-amber-400" : "text-slate-400"}`}>
                Day {day.dayNumber}
              </span>
              <span className="text-xs font-bold whitespace-nowrap mt-0.5">
                {formatDate(day.date)}
              </span>
              <span className={`text-[11px] truncate max-w-[90px] ${isSelected ? "text-slate-300" : "text-slate-500"}`}>
                {day.city}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Day Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-5 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
              Day {activeDay.dayNumber} of {days.length}
            </span>
            <span className="text-xs text-slate-300 font-medium">
              {formatDate(activeDay.date)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-brand-400" />
            <h3 className="text-xl font-bold tracking-tight text-white">
              {activeDay.city}
            </h3>
          </div>
        </div>

        <div className="text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-xl backdrop-blur-sm self-start sm:self-auto">
          {activeDay.activities?.length || 0} scheduled experiences
        </div>
      </div>

      {/* Activities Vertical Timeline */}
      <div className="space-y-4 relative pl-4 border-l-2 border-slate-200 ml-2">
        {activeDay.activities && activeDay.activities.length > 0 ? (
          activeDay.activities.map((activity, aIdx) => (
            <div key={`act-${activity.id || aIdx}`} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[23px] top-4 w-3.5 h-3.5 rounded-full bg-brand-500 ring-4 ring-white border border-brand-600" />
              <ActivityCard activity={activity} />
            </div>
          ))
        ) : (
          <div className="bg-white rounded-xl p-6 border border-slate-200 text-center text-slate-500 text-sm">
            Free day for relaxation, spontaneous exploration, and local markets.
          </div>
        )}
      </div>
    </div>
  );
}
