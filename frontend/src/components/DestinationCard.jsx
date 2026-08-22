import React, { useState } from "react";
import { Star, IndianRupee, Sparkles, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DestinationCard({ city }) {
  const [imgError, setImgError] = useState(false);
  const navigate = useNavigate();

  const fallbackImage = "https://picsum.photos/seed/globetrotter131/800/600";

  const handlePlanHere = () => {
    navigate(`/trips/new?destination=${encodeURIComponent(city.name)}`);
  };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700/80 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col">
      {/* Cover Image */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={imgError ? fallbackImage : (city.image_url || fallbackImage)}
          alt={city.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        {/* Region Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[11px] font-bold">
          {city.region || "India"}
        </div>

        {/* Popularity */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/90 text-white text-[11px] font-bold">
          <Star className="w-3 h-3 fill-current" />
          <span>{(city.popularity_score / 10).toFixed(1)}</span>
        </div>

        {/* Bottom City Name */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <h3 className="text-xl font-bold tracking-tight">{city.name}</h3>
          <p className="text-xs text-slate-300">{city.country || "India"}</p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-3">
          <span>Cost Index</span>
          <span className="font-semibold text-slate-700 dark:text-slate-300">{city.cost_index}/100</span>
        </div>

        <button
          onClick={handlePlanHere}
          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100/80 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          Plan Trip to {city.name}
        </button>
      </div>
    </div>
  );
}
