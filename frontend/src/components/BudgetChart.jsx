import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { PieChart as ChartIcon } from "lucide-react";

export default function BudgetChart({ budgetData }) {
  if (!budgetData) return null;

  const { breakdown = {}, chartData = [], totalEstimatedCost = 0 } = budgetData;

  const formatINR = (val) => "₹" + Math.round(val || 0).toLocaleString("en-IN");

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const pct = totalEstimatedCost > 0 ? Math.round((data.value / totalEstimatedCost) * 100) : 0;
      return (
        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-lg">
          <p className="font-bold">{data.name}</p>
          <p className="text-amber-300 font-semibold">{formatINR(data.value)} ({pct}%)</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
          <ChartIcon className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Cost Breakdown</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Distribution by expense category</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        {/* Donut Chart */}
        <div className="sm:col-span-5 h-44 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={65}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend / Category Breakdown */}
        <div className="sm:col-span-7 space-y-2">
          {chartData.map((item) => {
            const pct = totalEstimatedCost > 0 ? Math.round((item.value / totalEstimatedCost) * 100) : 0;
            return (
              <div key={item.name} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-none">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{formatINR(item.value)}</span>
                  <span className="text-slate-400 text-[11px] ml-1.5">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
