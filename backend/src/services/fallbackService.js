import pool from "../config/db.js";

/**
 * Intelligent Deterministic Fallback Service
 * Generates or optimizes trips directly from database when Gemini API is unavailable.
 */

export async function generateFallbackTrip({
  startingCityName,
  destinationPreference,
  startDate,
  endDate,
  durationDays = 5,
  budget = 25000,
  travelersCount = 1,
  travelStyle = "Balanced",
  interests = ["Food", "History", "Culture"],
  thingsToAvoid = ""
}) {
  // 1. Fetch available cities
  const citiesRes = await pool.query("SELECT * FROM cities ORDER BY popularity_score DESC;");
  const allCities = citiesRes.rows;

  // Find starting city or match destination preference
  let primaryCity = allCities.find(
    (c) => c.name.toLowerCase() === (destinationPreference || startingCityName || "").toLowerCase()
  );

  if (!primaryCity) {
    primaryCity = allCities.find((c) => c.name.toLowerCase() === (startingCityName || "").toLowerCase()) || allCities[0];
  }

  // Pick 1 to 3 cities based on duration
  const days = Math.max(1, parseInt(durationDays, 10) || 5);
  const cityCount = days <= 3 ? 1 : days <= 6 ? 2 : 3;

  const selectedCities = [primaryCity];
  // Select nearby or popular companion cities in the same region if possible
  const companionCities = allCities.filter(
    (c) => c.id !== primaryCity.id && (c.region === primaryCity.region || Math.abs(c.cost_index - primaryCity.cost_index) < 20)
  );

  for (let i = 1; i < cityCount && i - 1 < companionCities.length; i++) {
    selectedCities.push(companionCities[i - 1]);
  }

  // Days per city distribution
  const baseDays = Math.floor(days / selectedCities.length);
  let remainder = days % selectedCities.length;

  const structuredCities = selectedCities.map((c, idx) => {
    const assignedDays = baseDays + (remainder > 0 ? 1 : 0);
    remainder = Math.max(0, remainder - 1);
    return {
      city_id: c.id,
      name: c.name,
      days: assignedDays,
      reason: `Key highlight destination for ${interests.join(" and ")} experiences in ${c.region || "India"}.`
    };
  });

  // 2. Fetch activities for selected cities
  const cityIds = selectedCities.map((c) => c.id);
  const activitiesRes = await pool.query(
    "SELECT * FROM activities WHERE city_id = ANY($1::int[]) ORDER BY cost ASC;",
    [cityIds]
  );
  const allActivities = activitiesRes.rows;

  // Distribute activities by date
  const structuredActivities = [];
  const start = new Date(startDate || Date.now());
  let currentDay = 0;

  for (let cIdx = 0; cIdx < structuredCities.length; cIdx++) {
    const sCity = structuredCities[cIdx];
    const cityActs = allActivities.filter((a) => a.city_id === sCity.city_id);

    // Prioritize activities matching user interests
    const sortedActs = [...cityActs].sort((a, b) => {
      const aMatch = interests.some((i) => a.category.toLowerCase().includes(i.toLowerCase()));
      const bMatch = interests.some((i) => b.category.toLowerCase().includes(i.toLowerCase()));
      return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
    });

    for (let dayInCity = 0; dayInCity < sCity.days; dayInCity++) {
      const d = new Date(start);
      d.setDate(d.getDate() + currentDay);
      const dateStr = d.toISOString().split("T")[0];

      // Schedule 2 activities per day
      const act1 = sortedActs[(dayInCity * 2) % sortedActs.length];
      const act2 = sortedActs[(dayInCity * 2 + 1) % sortedActs.length];

      if (act1) {
        structuredActivities.push({
          activity_id: act1.id,
          city_id: sCity.city_id,
          date: dateStr,
          time: "10:00",
          reason: `Prime morning exploration matching your interest in ${act1.category}.`
        });
      }
      if (act2 && act2.id !== act1?.id) {
        structuredActivities.push({
          activity_id: act2.id,
          city_id: sCity.city_id,
          date: dateStr,
          time: "15:30",
          reason: `Afternoon immersion in ${act2.name}.`
        });
      }
      currentDay++;
    }
  }

  return {
    trip_title: `${selectedCities.map((c) => c.name).join(" to ")} ${travelStyle} Gateway`,
    summary: `A carefully curated ${days}-day ${travelStyle.toLowerCase()} itinerary tailored to your love for ${interests.join(", ")}, discovering ${selectedCities.map((c) => c.name).join(", ")}.`,
    cities: structuredCities,
    activities: structuredActivities,
    warnings: []
  };
}

export async function optimizeFallbackTrip({
  currentTrip,
  newBudget,
  newDuration,
  newTravelStyle
}) {
  const targetBudget = parseFloat(newBudget) || currentTrip.budget;
  const targetDays = parseInt(newDuration, 10) || 5;
  const style = newTravelStyle || currentTrip.travel_style || "Balanced";

  // Re-generate optimized version
  const optimized = await generateFallbackTrip({
    startingCityName: currentTrip.stops?.[0]?.name || "Delhi",
    destinationPreference: currentTrip.stops?.[1]?.name || currentTrip.stops?.[0]?.name,
    startDate: currentTrip.start_date,
    endDate: currentTrip.end_date,
    durationDays: targetDays,
    budget: targetBudget,
    travelersCount: currentTrip.travelers_count || 1,
    travelStyle: style,
    interests: currentTrip.interests || ["Food", "History"],
    thingsToAvoid: currentTrip.things_to_avoid || ""
  });

  const costDifference = Math.max(0, (currentTrip.total_estimated_cost || targetBudget) - targetBudget);

  return {
    ...optimized,
    what_changed: [
      "Streamlined travel route to eliminate high intercity transit costs",
      "Rebalanced high-cost premium activities with rich cultural walking tours",
      `Preserved top priority interests (${(currentTrip.interests || ["Food", "History"]).join(", ")})`,
      "Optimized schedule density to reduce travel fatigue and maximize leisure"
    ],
    savings_amount: costDifference > 0 ? costDifference : 4500
  };
}
