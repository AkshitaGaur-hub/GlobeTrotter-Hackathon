import pool from "../config/db.js";

export async function getCities(req, res, next) {
  try {
    const { search, region } = req.query;
    let queryText = "SELECT * FROM cities";
    const params = [];

    if (search) {
      params.push(`%${search}%`);
      queryText += ` WHERE name ILIKE $${params.length} OR country ILIKE $${params.length} OR region ILIKE $${params.length}`;
    }

    queryText += " ORDER BY popularity_score DESC, name ASC;";
    const result = await pool.query(queryText, params);
    res.json({ cities: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function getCityById(req, res, next) {
  try {
    const { id } = req.params;
    const cityRes = await pool.query("SELECT * FROM cities WHERE id = $1;", [id]);
    if (cityRes.rows.length === 0) {
      return res.status(404).json({ error: "City not found." });
    }

    const activitiesRes = await pool.query(
      "SELECT * FROM activities WHERE city_id = $1 ORDER BY cost ASC;",
      [id]
    );

    res.json({
      city: cityRes.rows[0],
      activities: activitiesRes.rows
    });
  } catch (err) {
    next(err);
  }
}
