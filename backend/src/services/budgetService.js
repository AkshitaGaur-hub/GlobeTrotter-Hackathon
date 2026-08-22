/**
 * Deterministic Budget Calculation Service
 * Never calls Gemini for mathematical calculations.
 */

export function calculateTripBudget({
  stops = [],
  activities = [],
  travelersCount = 1,
  travelStyle = "Balanced",
  userBudget = 0,
  startDate,
  endDate
}) {
  const travelers = Math.max(1, parseInt(travelersCount, 10) || 1);
  const styleMultipliers = {
    Relaxed: 1.4,
    Balanced: 1.0,
    Adventure: 0.8
  };
  const multiplier = styleMultipliers[travelStyle] || 1.0;

  // 1. Calculate Days
  let durationDays = 1;
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    durationDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1);
  } else if (stops.length > 0) {
    durationDays = stops.reduce((acc, s) => {
      if (s.start_date && s.end_date) {
        const diff = Math.ceil(Math.abs(new Date(s.end_date) - new Date(s.start_date)) / (1000 * 60 * 60 * 24));
        return acc + Math.max(1, diff);
      }
      return acc + 1;
    }, 0);
  }

  // 2. Activities Cost
  let activitiesTotal = 0;
  const dayActivityCostMap = {};

  activities.forEach((act) => {
    const cost = parseFloat(act.cost_override ?? act.cost ?? 0);
    const actTotal = cost * travelers;
    activitiesTotal += actTotal;

    const dateKey = act.scheduled_date ? new Date(act.scheduled_date).toISOString().split("T")[0] : "General";
    dayActivityCostMap[dateKey] = (dayActivityCostMap[dateKey] || 0) + actTotal;
  });

  // 3. Stay / Lodging Cost
  let stayTotal = 0;
  stops.forEach((stop) => {
    const costIndex = stop.cost_index || 50;
    const baseStayPerNight = (1200 + costIndex * 16) * multiplier; // e.g. 50 -> 2000 INR/night
    let stopNights = 1;
    if (stop.start_date && stop.end_date) {
      stopNights = Math.max(1, Math.ceil(Math.abs(new Date(stop.end_date) - new Date(stop.start_date)) / (1000 * 60 * 60 * 24)));
    }
    // Room scaling: 1 room for 1-2 people, 2 rooms for 3-4, etc.
    const roomsCount = Math.ceil(travelers / 2);
    stayTotal += Math.round(baseStayPerNight * stopNights * roomsCount);
  });

  // Fallback if stops empty
  if (stayTotal === 0 && durationDays > 0) {
    const baseStay = 2000 * multiplier * Math.ceil(travelers / 2);
    stayTotal = Math.round(baseStay * durationDays);
  }

  // 4. Transport Cost
  let transportTotal = 0;
  // Local daily transit + intercity transfers
  const localDailyTransit = 350 * travelers * durationDays * (multiplier > 1 ? 1.2 : 0.9);
  let intercityTransit = 0;
  if (stops.length > 1) {
    // Intercity transit legs between stops
    intercityTransit = (stops.length - 1) * 1100 * travelers * multiplier;
  }
  transportTotal = Math.round(localDailyTransit + intercityTransit);

  // 5. Meals Cost
  let mealsTotal = 0;
  const baseMealPerDayPerPerson = 700 * multiplier;
  mealsTotal = Math.round(baseMealPerDayPerPerson * durationDays * travelers);

  // 6. Overall Total
  const totalEstimatedCost = Math.round(transportTotal + stayTotal + activitiesTotal + mealsTotal);
  const parsedBudget = parseFloat(userBudget) || 0;
  const remaining = Math.round(parsedBudget - totalEstimatedCost);
  const avgPerDay = Math.round(totalEstimatedCost / Math.max(1, durationDays));

  // 7. Day-by-Day Financial Analytics
  const dayBreakdowns = [];
  const dailyBase = Math.round((stayTotal + transportTotal + mealsTotal) / Math.max(1, durationDays));

  for (let i = 0; i < durationDays; i++) {
    const d = new Date(startDate || Date.now());
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const actCostForDay = dayActivityCostMap[dateStr] || 0;
    const dayTotal = dailyBase + actCostForDay;
    dayBreakdowns.push({
      dayNumber: i + 1,
      date: dateStr,
      totalCost: dayTotal,
      activityCost: actCostForDay,
      baseCost: dailyBase
    });
  }

  // Sort to find most expensive and cheapest day
  const sortedDays = [...dayBreakdowns].sort((a, b) => b.totalCost - a.totalCost);
  const mostExpensiveDay = sortedDays[0] || { dayNumber: 1, totalCost: avgPerDay };
  const cheapestDay = sortedDays[sortedDays.length - 1] || { dayNumber: 1, totalCost: avgPerDay };

  return {
    totalEstimatedCost,
    budget: parsedBudget,
    remaining,
    isOverBudget: remaining < 0,
    overBudgetAmount: remaining < 0 ? Math.abs(remaining) : 0,
    averagePerDay: avgPerDay,
    durationDays,
    breakdown: {
      transport: transportTotal,
      stay: stayTotal,
      activities: activitiesTotal,
      meals: mealsTotal
    },
    chartData: [
      { name: "Transport", value: transportTotal, color: "#3B82F6" },
      { name: "Stay", value: stayTotal, color: "#10B981" },
      { name: "Activities", value: activitiesTotal, color: "#F59E0B" },
      { name: "Meals", value: mealsTotal, color: "#EC4899" }
    ],
    analytics: {
      mostExpensiveDay,
      cheapestDay,
      dailyBreakdowns: dayBreakdowns
    }
  };
}
