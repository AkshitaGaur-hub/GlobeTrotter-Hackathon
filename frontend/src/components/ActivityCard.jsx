import React, { useState } from "react";
import { Clock, IndianRupee, MapPin, Sparkles, Tag } from "lucide-react";

export default function ActivityCard({ activity }) {
  const [imgError, setImgError] = useState(false);

  const categoryColors = {
    Food: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
    History: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
    Culture: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
    Adventure: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    Nature: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
    Photography: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
    Nightlife: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" }
  };

  const catStyle = categoryColors[activity.category] || {
    bg: "bg-slate-100",
    text: "text-slate-700",
    border: "border-slate-200"
  };

  const formatCost = (val) => {
    const num = parseFloat(val);
    if (!num || num === 0) return "Free / Included";
    return `₹${Math.round(num).toLocaleString("en-IN")}`;
  };

  const formatDuration = (mins) => {
    if (!mins) return "1.5h";
    const hours = mins / 60;
    return hours % 1 === 0 ? `${hours}h` : `${hours.toFixed(1)}h`;
  };

  const fallbackImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row gap-4">
      {/* Thumbnail */}
      <div className="relative w-full sm:w-32 h-28 shrink-0 rounded-lg overflow-hidden bg-slate-100">
        <img
          src={imgError ? fallbackImage : (activity.image_url || fallbackImage)}
          alt={activity.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold">
          {activity.scheduled_time || "10:00"}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
              {activity.category}
            </span>
            {activity.city_name && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                <MapPin className="w-3 h-3" />
                {activity.city_name}
              </span>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
            {activity.name}
          </h4>

          {activity.description && (
            <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
              {activity.description}
            </p>
          )}

          {activity.notes && (
            <div className="mt-2 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50/80 px-2 py-1 rounded-md border border-amber-200/60">
              <Sparkles className="w-3 h-3 text-amber-600 shrink-0 mt-0.5" />
              <span>{activity.notes}</span>
            </div>
          )}
        </div>

        {/* Footer info: Duration & Cost */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 text-xs font-semibold text-slate-600">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDuration(activity.duration_minutes)}</span>
          </div>
          <div className="text-brand-700 font-bold bg-brand-50 px-2 py-0.5 rounded-md">
            {formatCost(activity.cost_override ?? activity.cost)}
          </div>
        </div>
      </div>
    </div>
  );
}
