/**
 * Deterministic GlobeScore Service (0 - 100)
 * Evaluates 6 key travel factors without AI calls.
 */

export function calculateGlobeScore({
  budget = 0,
  totalEstimatedCost = 0,
  userInterests = [],
  travelStyle = "Balanced",
  stops = [],
  activities = [],
  durationDays = 1
}) {
  const highlights = [];
  const warnings = [];

  // Factor 1: Budget Efficiency (25%)
  let budgetScore = 25;
  const parsedBudget = parseFloat(budget) || 0;
  const parsedCost = parseFloat(totalEstimatedCost) || 0;

  if (parsedBudget > 0) {
    const ratio = parsedCost / parsedBudget;
    if (ratio > 1.15) {
      budgetScore = Math.max(5, 25 - Math.round((ratio - 1) * 60));
      warnings.push(`Over budget by ₹${Math.round(parsedCost - parsedBudget).toLocaleString("en-IN")}`);
    } else if (ratio > 1.0) {
      budgetScore = 20;
      warnings.push("Slightly exceeds target budget (~" + Math.round((ratio - 1) * 100) + "%)");
    } else if (ratio >= 0.80 && ratio <= 1.0) {
      budgetScore = 25;
      highlights.push("Optimally within target budget");
    } else if (ratio >= 0.60) {
      budgetScore = 22;
      highlights.push("Well under budget with high value");
    } else {
      budgetScore = 18;
      highlights.push("Substantial budget surplus remaining");
    }
  } else {
    budgetScore = 22;
  }

  // Factor 2: Preference Match (25%)
  let preferenceScore = 20;
  const normalizedInterests = (userInterests || []).map((i) => i.toLowerCase().trim());
  if (normalizedInterests.length > 0 && activities.length > 0) {
    let matchCount = 0;
    activities.forEach((act) => {
      const cat = (act.category || "").toLowerCase();
      if (normalizedInterests.some((interest) => cat.includes(interest) || interest.includes(cat))) {
        matchCount++;
      }
    });
    const matchRatio = matchCount / activities.length;
    if (matchRatio >= 0.6) {
      preferenceScore = 25;
      highlights.push("High alignment with your selected interests (" + userInterests.slice(0, 3).join(", ") + ")");
    } else if (matchRatio >= 0.3) {
      preferenceScore = 21;
      highlights.push("Good match with preferred activities");
    } else {
      preferenceScore = 15;
      warnings.push("Fewer matching activities for your specific interests");
    }
  } else {
    preferenceScore = 22;
    highlights.push("Broad cultural & landmark coverage");
  }

  // Factor 3: Route Efficiency (20%)
  let routeScore = 20;
  const numCities = Math.max(1, stops.length);
  const daysPerCity = durationDays / numCities;

  if (daysPerCity >= 1.5 && daysPerCity <= 3.5) {
    routeScore = 20;
    highlights.push("Efficient route with ideal stay duration per city");
  } else if (daysPerCity < 1.2 && numCities > 2) {
    routeScore = 14;
    warnings.push("Fast-paced multi-city route with frequent transfers");
  } else {
    routeScore = 18;
    highlights.push("Relaxed single-hub or dual-city itinerary");
  }

  // Factor 4: Time Efficiency (15%)
  let timeScore = 15;
  const actsPerDay = activities.length / Math.max(1, durationDays);
  if (actsPerDay >= 1.8 && actsPerDay <= 3.2) {
    timeScore = 15;
    highlights.push("Balanced schedule (2-3 curated activities per day)");
  } else if (actsPerDay > 3.5) {
    timeScore = 11;
    warnings.push("Packed itinerary with multiple activities per day");
  } else if (actsPerDay < 1.2) {
    timeScore = 12;
    highlights.push("Leisurely schedule with plenty of free time");
  } else {
    timeScore = 14;
  }

  // Factor 5: Activity Diversity (10%)
  let diversityScore = 10;
  const uniqueCategories = new Set(activities.map((a) => a.category).filter(Boolean));
  if (uniqueCategories.size >= 4) {
    diversityScore = 10;
    highlights.push("Rich diversity across " + uniqueCategories.size + " activity categories");
  } else if (uniqueCategories.size >= 2) {
    diversityScore = 8;
    highlights.push("Good variety of experiences");
  } else {
    diversityScore = 5;
    warnings.push("Low category diversity in scheduled activities");
  }

  // Factor 6: Travel Comfort (5%)
  let comfortScore = 5;
  if (travelStyle === "Relaxed") {
    comfortScore = 5;
    highlights.push("Optimized for low fatigue & leisure");
  } else if (travelStyle === "Adventure") {
    comfortScore = 4;
    highlights.push("High energy adventure pacing");
  } else {
    comfortScore = 5;
    highlights.push("Comfortable travel pace");
  }

  const totalScore = Math.min(100, Math.max(0, budgetScore + preferenceScore + routeScore + timeScore + diversityScore + comfortScore));

  return {
    score: totalScore,
    grade: totalScore >= 90 ? "Excellent" : totalScore >= 80 ? "Very Good" : totalScore >= 70 ? "Good" : "Fair",
    factors: {
      budgetEfficiency: { score: budgetScore, max: 25, label: "Budget Efficiency" },
      preferenceMatch: { score: preferenceScore, max: 25, label: "Preference Match" },
      routeEfficiency: { score: routeScore, max: 20, label: "Route Efficiency" },
      timeEfficiency: { score: timeScore, max: 15, label: "Time Efficiency" },
      activityDiversity: { score: diversityScore, max: 10, label: "Activity Diversity" },
      travelComfort: { score: comfortScore, max: 5, label: "Travel Comfort" }
    },
    highlights: highlights.slice(0, 4),
    warnings: warnings.slice(0, 2)
  };
}
