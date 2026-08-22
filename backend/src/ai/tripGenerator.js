import pool from "../config/db.js";
import { callGeminiJSON, getRequestHash, getCachedAIResponse, saveAIResponse } from "./geminiClient.js";
import { generateFallbackTrip } from "../services/fallbackService.js";

export async function generateAITrip(input) {
  const {
    startingCityName = "Delhi",
    destinationPreference = "",
    startDate,
    endDate,
    durationDays = 5,
    budget = 25000,
    travelersCount = 1,
    travelStyle = "Balanced",
    interests = ["Food", "History"],
    thingsToAvoid = ""
  } = input;

  const requestHash = getRequestHash({
    startingCityName,
    destinationPreference,
    startDate,
    endDate,
    durationDays,
    budget,
    travelersCount,
    travelStyle,
    interests,
    thingsToAvoid
  });

  // 1. Check AI Cache
  const cached = await getCachedAIResponse(requestHash);
  if (cached) {
    return { ...cached, isCached: true };
  }

  // 2. Load candidate cities and activities from Postgres
  const citiesRes = await pool.query("SELECT id, name, region, cost_index FROM cities;");
  const dbCities = citiesRes.rows;
  const dbCityIds = new Set(dbCities.map((c) => c.id));

  const activitiesRes = await pool.query("SELECT id, city_id, name, category, cost FROM activities;");
  const dbActivities = activitiesRes.rows;
  const dbActivityMap = new Map(dbActivities.map((a) => [a.id, a]));

  const systemInstruction = `You are GlobeTrotter AI, an expert travel planner. Create an optimized travel itinerary using ONLY the provided database items.`;

  const prompt = `
Create an itinerary for:
- Starting City: ${startingCityName}
- Destination Preference: ${destinationPreference || "Best matching cities"}
- Dates: ${startDate} to ${endDate} (${durationDays} days)
- Travelers: ${travelersCount}
- Total Target Budget: ₹${budget} INR
- Travel Style: ${travelStyle}
- Preferred Interests: ${interests.join(", ")}
- Things to Avoid: ${thingsToAvoid || "None"}

Candidate Cities (use ONLY these IDs):
${JSON.stringify(dbCities.map((c) => ({ id: c.id, name: c.name, region: c.region, cost_index: c.cost_index })))}

Candidate Activities (use ONLY these IDs):
${JSON.stringify(dbActivities.map((a) => ({ id: a.id, city_id: a.city_id, name: a.name, category: a.category, cost: a.cost })))}

Rules:
1. Return strictly valid JSON.
2. Select 1 to 3 logical cities connected logically.
3. Every activity MUST use a valid activity_id and corresponding city_id from above.
4. Schedule 2-3 activities per day.

JSON Schema:
{
  "trip_title": "String",
  "summary": "String",
  "cities": [
    { "city_id": 1, "days": 2, "reason": "Short explanation" }
  ],
  "activities": [
    { "activity_id": 1, "city_id": 1, "date": "${startDate}", "time": "10:00", "reason": "Short explanation" }
  ],
  "warnings": []
}
`;

  try {
    const aiResult = await callGeminiJSON(prompt, systemInstruction);

    // Validate returned IDs
    const validCities = (aiResult.cities || []).filter((c) => dbCityIds.has(c.city_id));
    const validActivities = (aiResult.activities || []).filter((a) => {
      const act = dbActivityMap.get(a.activity_id);
      return act && (!a.city_id || act.city_id === a.city_id);
    });

    if (validCities.length === 0 || validActivities.length === 0) {
      console.warn("AI returned insufficient valid DB items. Falling back to deterministic planner.");
      return await generateFallbackTrip(input);
    }

    const validatedResult = {
      trip_title: aiResult.trip_title || `${validCities.length}-City Journey`,
      summary: aiResult.summary || "AI-generated personalized travel itinerary.",
      cities: validCities,
      activities: validActivities,
      warnings: aiResult.warnings || [],
      isAI: true
    };

    // Cache the validated result
    await saveAIResponse(null, requestHash, validatedResult);
    return validatedResult;
  } catch (err) {
    console.warn(`[AI Generation Notice] ${err.message}. Using high-quality deterministic fallback.`);
    const fallback = await generateFallbackTrip(input);
    return { ...fallback, isFallback: true, fallbackReason: err.message };
  }
}
