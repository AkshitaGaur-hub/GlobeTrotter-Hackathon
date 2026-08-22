import pool from "../config/db.js";
import { generateAITrip } from "../ai/tripGenerator.js";
import { optimizeAITrip } from "../ai/tripOptimizer.js";
import { fetchFullTrip } from "./tripController.js";

export async function generateTrip(req, res, next) {
  const client = await pool.connect();
  try {
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
    } = req.body;

    // Calculate dates if not provided
    const start = startDate ? new Date(startDate) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const days = Math.max(1, parseInt(durationDays, 10) || 5);
    const end = endDate ? new Date(endDate) : new Date(start.getTime() + (days - 1) * 24 * 60 * 60 * 1000);

    const startStr = start.toISOString().split("T")[0];
    const endStr = end.toISOString().split("T")[0];

    // Call AI generator
    const aiPlan = await generateAITrip({
      startingCityName,
      destinationPreference,
      startDate: startStr,
      endDate: endStr,
      durationDays: days,
      budget: parseFloat(budget) || 25000,
      travelersCount: parseInt(travelersCount, 10) || 1,
      travelStyle,
      interests: Array.isArray(interests) ? interests : [interests],
      thingsToAvoid
    });

    await client.query("BEGIN");

    const shareSlug = `${(aiPlan.trip_title || "trip").toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}-${Date.now().toString(36)}`;

    // Insert Trip
    const tripRes = await client.query(
      `INSERT INTO trips (
        user_id, name, start_date, end_date, description, is_public, share_slug,
        budget, travelers_count, travel_style, interests, things_to_avoid
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id;`,
      [
        req.user.id,
        aiPlan.trip_title,
        startStr,
        endStr,
        aiPlan.summary,
        true,
        shareSlug,
        parseFloat(budget) || 25000,
        parseInt(travelersCount, 10) || 1,
        travelStyle,
        Array.isArray(interests) ? interests : [interests],
        thingsToAvoid
      ]
    );

    const tripId = tripRes.rows[0].id;
    const stopIdMap = new Map();

    // Calculate dates per stop
    let currentDayOffset = 0;
    for (let i = 0; i < aiPlan.cities.length; i++) {
      const city = aiPlan.cities[i];
      const stopStart = new Date(start);
      stopStart.setDate(stopStart.getDate() + currentDayOffset);
      const stopDays = Math.max(1, parseInt(city.days, 10) || 2);
      const stopEnd = new Date(stopStart);
      stopEnd.setDate(stopEnd.getDate() + stopDays - 1);

      currentDayOffset += stopDays;

      const stopRes = await client.query(
        `INSERT INTO stops (trip_id, city_id, start_date, end_date, order_index)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, city_id;`,
        [tripId, city.city_id, stopStart.toISOString().split("T")[0], stopEnd.toISOString().split("T")[0], i]
      );
      stopIdMap.set(city.city_id, stopRes.rows[0].id);
    }

    // Insert Activities
    for (let i = 0; i < aiPlan.activities.length; i++) {
      const act = aiPlan.activities[i];
      const stopId = stopIdMap.get(act.city_id) || Array.from(stopIdMap.values())[0];
      if (stopId && act.activity_id) {
        await client.query(
          `INSERT INTO trip_activities (stop_id, activity_id, scheduled_date, scheduled_time, order_index, notes)
           VALUES ($1, $2, $3, $4, $5, $6);`,
          [
            stopId,
            act.activity_id,
            act.date || startStr,
            act.time || "10:00",
            i,
            act.reason || ""
          ]
        );
      }
    }

    await client.query("COMMIT");

    const fullTrip = await fetchFullTrip(tripId, req.user.id);
    res.status(201).json({
      message: "Trip generated successfully.",
      trip: fullTrip,
      isAI: aiPlan.isAI,
      isFallback: aiPlan.isFallback
    });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

export async function optimizeTrip(req, res, next) {
  try {
    const { trip_id, newBudget, newDuration, newTravelStyle, destinationChange } = req.body;

    if (!trip_id) {
      return res.status(400).json({ error: "trip_id is required for optimization." });
    }

    const currentTrip = await fetchFullTrip(trip_id, req.user.id);
    if (!currentTrip) {
      return res.status(404).json({ error: "Trip not found or unauthorized." });
    }

    const comparison = await optimizeAITrip({
      currentTrip,
      newBudget: parseFloat(newBudget) || currentTrip.budget,
      newDuration: parseInt(newDuration, 10) || currentTrip.durationDays,
      newTravelStyle: newTravelStyle || currentTrip.travel_style,
      destinationChange
    });

    res.json({ comparison });
  } catch (err) {
    next(err);
  }
}
