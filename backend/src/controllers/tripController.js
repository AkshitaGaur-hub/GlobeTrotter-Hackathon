import pool from "../config/db.js";
import { calculateTripBudget } from "../services/budgetService.js";
import { calculateGlobeScore } from "../services/globeScoreService.js";

/**
 * Helper to fetch complete trip payload with stops, activities, budget and score
 */
export async function fetchFullTrip(tripId, userId = null) {
  let tripQuery = "SELECT * FROM trips WHERE id = $1";
  const params = [tripId];
  if (userId) {
    tripQuery += " AND user_id = $2";
    params.push(userId);
  }

  const tripRes = await pool.query(tripQuery, params);
  if (tripRes.rows.length === 0) {
    return null;
  }
  const trip = tripRes.rows[0];

  // Fetch stops with city details
  const stopsRes = await pool.query(
    `SELECT s.*, c.name as city_name, c.country, c.region, c.cost_index, c.popularity_score, c.image_url as city_image
     FROM stops s
     JOIN cities c ON s.city_id = c.id
     WHERE s.trip_id = $1
     ORDER BY s.order_index ASC, s.start_date ASC;`,
    [tripId]
  );
  const stops = stopsRes.rows;

  // Fetch activities with stop and activity details
  const activitiesRes = await pool.query(
    `SELECT ta.*, a.name, a.category, a.cost, a.duration_minutes, a.description, a.image_url,
            s.city_id, c.name as city_name
     FROM trip_activities ta
     JOIN activities a ON ta.activity_id = a.id
     JOIN stops s ON ta.stop_id = s.id
     JOIN cities c ON s.city_id = c.id
     WHERE s.trip_id = $1
     ORDER BY ta.scheduled_date ASC, ta.scheduled_time ASC, ta.order_index ASC;`,
    [tripId]
  );
  const activities = activitiesRes.rows;

  // Compute live deterministic budget & GlobeScore
  const budgetData = calculateTripBudget({
    stops,
    activities,
    travelersCount: trip.travelers_count,
    travelStyle: trip.travel_style,
    userBudget: trip.budget,
    startDate: trip.start_date,
    endDate: trip.end_date
  });

  const durationDays = budgetData.durationDays;

  const globeScoreData = calculateGlobeScore({
    budget: trip.budget,
    totalEstimatedCost: budgetData.totalEstimatedCost,
    userInterests: trip.interests || [],
    travelStyle: trip.travel_style,
    stops,
    activities,
    durationDays
  });

  // Group activities by date / day
  const daysMap = new Map();
  const start = new Date(trip.start_date);

  for (let i = 0; i < durationDays; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    
    // Find active stop for this day
    const activeStop = stops.find((s) => {
      const sStart = new Date(s.start_date).toISOString().split("T")[0];
      const sEnd = new Date(s.end_date).toISOString().split("T")[0];
      return dateStr >= sStart && dateStr <= sEnd;
    }) || stops[0] || {};

    daysMap.set(dateStr, {
      dayNumber: i + 1,
      date: dateStr,
      city: activeStop.city_name || "Transit / Exploration",
      cityImage: activeStop.city_image,
      activities: []
    });
  }

  activities.forEach((act) => {
    const dateStr = act.scheduled_date ? new Date(act.scheduled_date).toISOString().split("T")[0] : null;
    if (dateStr && daysMap.has(dateStr)) {
      daysMap.get(dateStr).activities.push(act);
    } else if (daysMap.size > 0) {
      // Put in first day if unassigned
      const firstDay = daysMap.values().next().value;
      firstDay.activities.push(act);
    }
  });

  const itineraryDays = Array.from(daysMap.values());

  return {
    ...trip,
    durationDays,
    total_estimated_cost: budgetData.totalEstimatedCost,
    globe_score: globeScoreData.score,
    stops,
    activities,
    itineraryDays,
    budget_data: budgetData,
    globe_score_data: globeScoreData
  };
}

export async function getTrips(req, res, next) {
  try {
    const tripsRes = await pool.query(
      `SELECT t.*,
              COALESCE(
                json_agg(DISTINCT jsonb_build_object('city_id', c.id, 'name', c.name, 'image_url', c.image_url))
                FILTER (WHERE c.id IS NOT NULL), '[]'
              ) as cities
       FROM trips t
       LEFT JOIN stops s ON t.id = s.trip_id
       LEFT JOIN cities c ON s.city_id = c.id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC;`,
      [req.user.id]
    );

    res.json({ trips: tripsRes.rows });
  } catch (err) {
    next(err);
  }
}

export async function getTripById(req, res, next) {
  try {
    const { id } = req.params;
    const fullTrip = await fetchFullTrip(id, req.user.id);
    if (!fullTrip) {
      return res.status(404).json({ error: "Trip not found or unauthorized access." });
    }
    res.json({ trip: fullTrip });
  } catch (err) {
    next(err);
  }
}

export async function createTrip(req, res, next) {
  const client = await pool.connect();
  try {
    const {
      name,
      start_date,
      end_date,
      description,
      budget = 25000,
      travelers_count = 1,
      travel_style = "Balanced",
      interests = [],
      things_to_avoid = "",
      stops = [],
      activities = []
    } = req.body;

    if (!name || !start_date || !end_date) {
      return res.status(400).json({ error: "Name, start date, and end date are required." });
    }

    await client.query("BEGIN");

    const shareSlug = `${name.toLowerCase().replace(/[^a-z0-9]/g, "-").slice(0, 30)}-${Date.now().toString(36)}`;

    const tripRes = await client.query(
      `INSERT INTO trips (
        user_id, name, start_date, end_date, description, is_public, share_slug,
        budget, travelers_count, travel_style, interests, things_to_avoid
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING id;`,
      [
        req.user.id,
        name,
        start_date,
        end_date,
        description || `Personalized ${travel_style} itinerary`,
        true,
        shareSlug,
        budget,
        travelers_count,
        travel_style,
        interests,
        things_to_avoid
      ]
    );

    const tripId = tripRes.rows[0].id;
    const stopIdMap = new Map();

    if (stops.length === 0) {
      stops.push({
        city_id: null,
        start_date: start_date,
        end_date: end_date
      });
    }

    // Insert stops
    for (let i = 0; i < stops.length; i++) {
      const stop = stops[i];
      const stopRes = await client.query(
        `INSERT INTO stops (trip_id, city_id, start_date, end_date, order_index)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, city_id;`,
        [tripId, stop.city_id, stop.start_date || start_date, stop.end_date || end_date, i]
      );
      stopIdMap.set(stop.city_id, stopRes.rows[0].id);
    }

    // Insert activities
    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      const stopId = stopIdMap.get(act.city_id) || Array.from(stopIdMap.values())[0];
      if (stopId && act.activity_id) {
        await client.query(
          `INSERT INTO trip_activities (stop_id, activity_id, scheduled_date, scheduled_time, cost_override, order_index, notes)
           VALUES ($1, $2, $3, $4, $5, $6, $7);`,
          [
            stopId,
            act.activity_id,
            act.scheduled_date || act.date || start_date,
            act.scheduled_time || act.time || "10:00",
            act.cost_override || null,
            i,
            act.reason || act.notes || ""
          ]
        );
      }
    }

    await client.query("COMMIT");

    const fullTrip = await fetchFullTrip(tripId, req.user.id);
    res.status(201).json({ message: "Trip created successfully.", trip: fullTrip });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

export async function deleteTrip(req, res, next) {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM trips WHERE id = $1 AND user_id = $2 RETURNING id;", [id, req.user.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found or unauthorized." });
    }
    res.json({ message: "Trip deleted successfully." });
  } catch (err) {
    next(err);
  }
}

export async function getTripBudget(req, res, next) {
  try {
    const { id } = req.params;
    const fullTrip = await fetchFullTrip(id, req.user.id);
    if (!fullTrip) {
      return res.status(404).json({ error: "Trip not found." });
    }
    res.json({ budget: fullTrip.budget_data });
  } catch (err) {
    next(err);
  }
}

export async function getTripItinerary(req, res, next) {
  try {
    const { id } = req.params;
    const fullTrip = await fetchFullTrip(id, req.user.id);
    if (!fullTrip) {
      return res.status(404).json({ error: "Trip not found." });
    }
    res.json({
      tripId: fullTrip.id,
      name: fullTrip.name,
      globeScore: fullTrip.globe_score_data,
      days: fullTrip.itineraryDays
    });
  } catch (err) {
    next(err);
  }
}

export async function applyOptimization(req, res, next) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const { optimized_plan, newBudget, newStyle } = req.body;

    if (!optimized_plan || !optimized_plan.stops) {
      return res.status(400).json({ error: "Invalid optimization payload." });
    }

    const check = await client.query("SELECT * FROM trips WHERE id = $1 AND user_id = $2;", [id, req.user.id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found or unauthorized." });
    }

    const currentTrip = check.rows[0];

    await client.query("BEGIN");

    // Update trip details
    await client.query(
      `UPDATE trips
       SET name = COALESCE($1, name),
           budget = COALESCE($2, budget),
           travel_style = COALESCE($3, travel_style),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $4;`,
      [optimized_plan.trip_title || currentTrip.name, newBudget || currentTrip.budget, newStyle || currentTrip.travel_style, id]
    );

    // Delete existing stops & activities (cascading)
    await client.query("DELETE FROM stops WHERE trip_id = $1;", [id]);

    const stopIdMap = new Map();
    const stops = optimized_plan.stops;
    const activities = optimized_plan.activities || [];

    // Re-insert stops
    for (let i = 0; i < stops.length; i++) {
      const s = stops[i];
      const stopRes = await client.query(
        `INSERT INTO stops (trip_id, city_id, start_date, end_date, order_index)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, city_id;`,
        [id, s.city_id, s.start_date || currentTrip.start_date, s.end_date || currentTrip.end_date, i]
      );
      stopIdMap.set(s.city_id, stopRes.rows[0].id);
    }

    // Re-insert activities
    for (let i = 0; i < activities.length; i++) {
      const act = activities[i];
      const stopId = stopIdMap.get(act.city_id) || Array.from(stopIdMap.values())[0];
      if (stopId && act.activity_id) {
        await client.query(
          `INSERT INTO trip_activities (stop_id, activity_id, scheduled_date, scheduled_time, order_index, notes)
           VALUES ($1, $2, $3, $4, $5, $6);`,
          [
            stopId,
            act.activity_id,
            act.scheduled_date || currentTrip.start_date,
            act.scheduled_time || "10:00",
            i,
            act.reason || ""
          ]
        );
      }
    }

    await client.query("COMMIT");

    const updatedTrip = await fetchFullTrip(id, req.user.id);
    res.json({ message: "Itinerary updated with optimized plan.", trip: updatedTrip });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
}

export async function getPublicTrip(req, res, next) {
  try {
    const { share_slug } = req.params;
    const tripRes = await pool.query("SELECT id FROM trips WHERE share_slug = $1 LIMIT 1;", [share_slug]);
    if (tripRes.rows.length === 0) {
      return res.status(404).json({ error: "Trip not found." });
    }
    const fullTrip = await fetchFullTrip(tripRes.rows[0].id);
    res.json({ trip: fullTrip });
  } catch (err) {
    next(err);
  }
}

export async function getCalendarTrips(req, res, next) {
  try {
    const result = await pool.query(
      "SELECT id, name, start_date, end_date, description FROM trips WHERE user_id = $1",
      [req.user.id]
    );
    res.json({ trips: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function addTripActivity(req, res, next) {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    let { stop_id, activity_id, scheduled_date, scheduled_time, cost_override, notes, name, description, cost, category } = req.body;
    
    const tripCheck = await client.query("SELECT id, start_date FROM trips WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (tripCheck.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "Trip not found" });
    }

    if (!stop_id) {
      const stopCheck = await client.query("SELECT id FROM stops WHERE trip_id = $1 ORDER BY order_index ASC LIMIT 1", [id]);
      if (stopCheck.rows.length > 0) stop_id = stopCheck.rows[0].id;
    }

    if (!scheduled_date) {
      scheduled_date = tripCheck.rows[0].start_date;
    }
    
    let finalActivityId = activity_id;
    if (!finalActivityId) {
      const actRes = await client.query(
        "INSERT INTO activities (name, description, cost, category) VALUES ($1, $2, $3, $4) RETURNING id",
        [name, description, cost || 0, category || 'Other']
      );
      finalActivityId = actRes.rows[0].id;
    }
    
    const maxOrderRes = await client.query("SELECT COALESCE(MAX(order_index), 0) + 1 as next_order FROM trip_activities WHERE stop_id = $1", [stop_id]);
    const nextOrder = maxOrderRes.rows[0].next_order;

    const insertRes = await client.query(
      `INSERT INTO trip_activities (stop_id, activity_id, scheduled_date, scheduled_time, cost_override, order_index, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [stop_id, finalActivityId, scheduled_date, scheduled_time, cost_override, nextOrder, notes || '']
    );
    res.status(201).json({ trip_activity: insertRes.rows[0] });
  } catch (err) {
    next(err);
  } finally {
    if (client) client.release();
  }
}

export async function updateTripActivity(req, res, next) {
  try {
    const { id, activityId } = req.params;
    const { scheduled_time, cost_override, order_index, notes } = req.body;

    const tripCheck = await pool.query("SELECT id FROM trips WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (tripCheck.rows.length === 0) return res.status(404).json({ error: "Trip not found" });

    const result = await pool.query(
      `UPDATE trip_activities
       SET scheduled_time = COALESCE($1, scheduled_time),
           cost_override = COALESCE($2, cost_override),
           order_index = COALESCE($3, order_index),
           notes = COALESCE($4, notes)
       WHERE id = $5 RETURNING *`,
      [scheduled_time, cost_override, order_index, notes, activityId]
    );
    res.json({ trip_activity: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function deleteTripActivity(req, res, next) {
  try {
    const { id, activityId } = req.params;
    
    const tripCheck = await pool.query("SELECT id FROM trips WHERE id = $1 AND user_id = $2", [id, req.user.id]);
    if (tripCheck.rows.length === 0) return res.status(404).json({ error: "Trip not found" });

    await pool.query("DELETE FROM trip_activities WHERE id = $1", [activityId]);
    res.json({ message: "Trip activity deleted successfully" });
  } catch (err) {
    next(err);
  }
}
