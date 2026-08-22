import React from "react";
import { Link } from "react-router-dom";
import { Calendar, MapPin, ArrowRight, Award, Trash2 } from "lucide-react";
import GlobeScore from "./GlobeScore";

export default function TripCard({ trip, onDelete }) {
  const cities = trip.cities || [];
  const start = new Date(trip.start_date);
  const end = new Date(trip.end_date);
  const dateRange = `${start.toLocaleDateString("en-US", { month: "short", day: "numeric" })} - ${end.toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const formatINR = (val) => "₹" + Math.round(val || 0).toLocaleString("en-IN");

  const fallbackImage = "https://picsum.photos/seed/globetrotter132/800/600";
  const coverImage = cities[0]?.image_url || fallbackImage;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between group">
      {/* Cover Image Header */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={coverImage}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

        {/* GlobeScore Badge Top Right */}
        <div className="absolute top-3 right-3">
          <div className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            <span>Score {trip.globe_score || 90}</span>
          </div>
        </div>

        {/* Title & Dates */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <p className="text-[11px] font-semibold text-amber-300 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dateRange}
          </p>
          <h3 className="text-base font-bold tracking-tight text-white truncate mt-0.5">
            {trip.name}
          </h3>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* City Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-3">
            {cities.map((c, i) => (
              <span
                key={`c-${i}`}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold flex items-center gap-1"
              >
                <MapPin className="w-2.5 h-2.5 text-slate-400" />
                {c.name}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs py-2 border-t border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400">
            <span>Estimated Total</span>
            <span className="text-sm font-extrabold text-slate-900 dark:text-white">{formatINR(trip.total_estimated_cost || trip.budget)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-3 mt-1 border-t border-slate-100 dark:border-slate-800">
          <Link
            to={`/trips/${trip.id}`}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            <span>View Itinerary</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {onDelete && (
            <button
              onClick={() => onDelete(trip.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Delete Trip"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
