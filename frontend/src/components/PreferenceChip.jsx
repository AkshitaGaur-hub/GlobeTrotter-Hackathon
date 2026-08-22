import React from "react";

export default function PreferenceChip({
  label,
  icon: Icon,
  isSelected = false,
  onClick,
  sublabel
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200 active:scale-95 ${
        isSelected
          ? "bg-brand-500 text-white border-brand-600"
          : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:bg-slate-800/80"
      }`}
    >
      {Icon && <Icon className={`w-4 h-4 ${isSelected ? "text-white" : "text-brand-600"}`} />}
      <div className="text-left">
        <p className="leading-tight">{label}</p>
        {sublabel && (
          <p className={`text-[10px] font-normal leading-tight mt-0.5 ${isSelected ? "text-brand-100" : "text-slate-400"}`}>
            {sublabel}
          </p>
        )}
      </div>
    </button>
  );
}
