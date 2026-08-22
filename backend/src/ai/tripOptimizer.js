import pool from "../config/db.js";
import { callGeminiJSON, getRequestHash, getCachedAIResponse, saveAIResponse } from "./geminiClient.js";
import { optimizeFallbackTrip } from "../services/fallbackService.js";
import { calculateTripBudget } from "../services/budgetService.js";
import { calculateGlobeScore } from "../services/globeScoreService.js";

export async function optimizeAITrip({
  currentTrip,
  newBudget,
  newDuration,
  newTravelStyle,
  destinationChange
}) {
  const targetBudget = parseFloat(newBudget) || currentTrip.budget;
  const targetDays = parseInt(newDuration, 10) || currentTrip.durationDays || 5;
  const targetStyle = newTravelStyle || currentTrip.travel_style || "Balanced";

  const requestHash = getRequestHash({
    tripId: currentTrip.id,
    currentCost: currentTrip.total_estimated_cost,
    targetBudget,
    targetDays,
    targetStyle,
    destinationChange
  });

  const cached = await getCachedAIResponse(requestHash);
  if (cached) {
    return cached;
  }

  // Load candidate cities and activities
  const citiesRes = await pool.query("SELECT id, name, region, cost_index FROM cities;");
  const dbCities = citiesRes.rows;
  const dbCityIds = new Set(dbCities.map((c) => c.id));

  const activitiesRes = await pool.query("SELECT id, city_id, name, category, cost FROM activities;");
  const dbActivities = activitiesRes.rows;
  const dbActivityMap = new Map(dbActivities.map((a) => [a.id, a]));

  const systemInstruction = `You are GlobeTrotter AI, an adaptive travel optimization engine. Your job is to intelligently rebuild and optimize an existing travel itinerary to meet new constraints while preserving user interests and maximizing travel quality.`;

  const prompt = `
Current Itinerary:
- Title: ${currentTrip.name}
- Current Estimated Cost: ₹${currentTrip.total_estimated_cost} INR
- Current Budget: ₹${currentTrip.budget} INR
- Current Cities: ${JSON.stringify(currentTrip.stops?.map((s) => ({ city_id: s.city_id, name: s.city_name, days: s.days || 2 })))}
- Current Activities: ${JSON.stringify(currentTrip.activities?.map((a) => ({ activity_id: a.activity_id, name: a.name, cost: a.cost, category: a.category })))}
- User Interests: ${JSON.stringify(currentTrip.interests || ["Food", "History", "Adventure"])}

NEW CONSTRAINTS:
- New Target Budget: ₹${targetBudget} INR (MUST fit within or very close to this budget)
- New Duration: ${targetDays} days
- Travel Style: ${targetStyle}
${destinationChange ? `- Preferred Destination Adjustment: ${destinationChange}` : ""}

Available Cities (use ONLY these IDs):
${JSON.stringify(dbCities.map((c) => ({ id: c.id, name: c.name, region: c.region, cost_index: c.cost_index })))}

Available Activities (use ONLY these IDs):
${JSON.stringify(dbActivities.map((a) => ({ id: a.id, city_id: a.city_id, name: a.name, category: a.category, cost: a.cost })))}

Task:
Rebuild the trip to fit the new constraints.
If budget is reduced:
- Streamline cities if needed (e.g. drop 1 distant city to remove expensive intercity transit)
- Replace high-cost activities with high-value cultural/free/low-cost activities matching the same interest categories
- Retain high-priority interest experiences
- Provide 3-4 concise "what_changed" bullet points explaining the intelligent trade-offs made.

JSON Schema:
{
  "trip_title": "String",
  "summary": "String",
  "what_changed": [
    "Removed expensive intercity transit leg...",
    "Replaced high-cost activity with...",
    "Preserved core food & history preferences...",
    "Reduced overall travel fatigue..."
  ],
  "cities": [
    { "city_id": 1, "days": 2, "reason": "Reason" }
  ],
  "activities": [
    { "activity_id": 1, "city_id": 1, "date": "YYYY-MM-DD", "time": "10:00", "reason": "Reason" }
  ]
}
`;

  let optimizedPlan;
  try {
    const aiResult = await callGeminiJSON(prompt, systemInstruction);

    // Validate returned IDs
    const validCities = (aiResult.cities || []).filter((c) => dbCityIds.has(c.city_id));
    const validActivities = (aiResult.activities || []).filter((a) => {
      const act = dbActivityMap.get(a.activity_id);
      return act && (!a.city_id || act.city_id === a.city_id);
    });

    if (validCities.length === 0 || validActivities.length === 0) {
      optimizedPlan = await optimizeFallbackTrip({ currentTrip, newBudget: targetBudget, newDuration: targetDays, newTravelStyle: targetStyle });
    } else {
      optimizedPlan = {
        trip_title: aiResult.trip_title || currentTrip.name,
        summary: aiResult.summary || "Optimized itinerary based on new constraints.",
        what_changed: aiResult.what_changed || [
          "Optimized route to minimize transport expenses",
          "Selected high-value activities matching core interests",
          "Preserved travel comfort and leisure time"
        ],
        cities: validCities,
        activities: validActivities
      };
    }
  } catch (err) {
    console.warn(`[AI Optimization Notice] ${err.message}. Using deterministic fallback optimizer.`);
    optimizedPlan = await optimizeFallbackTrip({ currentTrip, newBudget: targetBudget, newDuration: targetDays, newTravelStyle: targetStyle });
  }

  // Calculate detailed stops & activities with city/activity DB metadata
  const populatedStops = optimizedPlan.cities.map((c, idx) => {
    const city = dbCities.find((dbC) => dbC.id === c.city_id) || {};
    return {
      city_id: c.city_id,
      name: city.name,
      city_name: city.name,
      country: city.country,
      region: city.region,
      cost_index: city.cost_index,
      days: c.days || 2,
      order_index: idx
    };
  });

  const populatedActivities = optimizedPlan.activities.map((a, idx) => {
    const act = dbActivityMap.get(a.activity_id) || {};
    const city = dbCities.find((c) => c.id === (a.city_id || act.city_id)) || {};
    return {
      activity_id: a.activity_id,
      name: act.name,
      category: act.category,
      cost: act.cost,
      duration_minutes: act.duration_minutes || 120,
      scheduled_date: a.date,
      scheduled_time: a.time || "10:00",
      reason: a.reason,
      city_id: a.city_id || act.city_id,
      city_name: city.name,
      order_index: idx
    };
  });

  // Calculate deterministic budget & GlobeScore for the optimized plan
  const optimizedBudget = calculateTripBudget({
    stops: populatedStops,
    activities: populatedActivities,
    travelersCount: currentTrip.travelers_count || 1,
    travelStyle: targetStyle,
    userBudget: targetBudget,
    startDate: currentTrip.start_date,
    endDate: currentTrip.end_date
  });

  const optimizedScore = calculateGlobeScore({
    budget: targetBudget,
    totalEstimatedCost: optimizedBudget.totalEstimatedCost,
    userInterests: currentTrip.interests || [],
    travelStyle: targetStyle,
    stops: populatedStops,
    activities: populatedActivities,
    durationDays: targetDays
  });

  // Before & After comparison payload
  const beforeCost = parseFloat(currentTrip.total_estimated_cost) || parseFloat(currentTrip.budget) || 25000;
  const afterCost = optimizedBudget.totalEstimatedCost;
  const savings = Math.max(0, beforeCost - afterCost);

  const result = {
    before: {
      budget: parseFloat(currentTrip.budget) || 25000,
      total_estimated_cost: beforeCost,
      durationDays: currentTrip.durationDays || (currentTrip.stops ? currentTrip.stops.length * 2 : 6),
      cities_count: currentTrip.stops?.length || 3,
      activities_count: currentTrip.activities?.length || 7,
      globe_score: currentTrip.globe_score || 87,
      travel_style: currentTrip.travel_style || "Balanced"
    },
    after: {
      budget: targetBudget,
      total_estimated_cost: afterCost,
      durationDays: targetDays,
      cities_count: populatedStops.length,
      activities_count: populatedActivities.length,
      globe_score: optimizedScore.score,
      travel_style: targetStyle
    },
    savings_amount: savings,
    what_changed: optimizedPlan.what_changed,
    optimized_plan: {
      trip_title: optimizedPlan.trip_title,
      summary: optimizedPlan.summary,
      stops: populatedStops,
      activities: populatedActivities,
      budget_data: optimizedBudget,
      globe_score_data: optimizedScore
    }
  };

  // Cache result
  await saveAIResponse(currentTrip.id, requestHash, result);
  return result;
}
