import pool from "../config/db.js";

export async function getActivities(req, res, next) {
  try {
    const { category, cityId } = req.query;
    let queryText = `
      SELECT a.*, c.name as city_name, c.region as city_region
      FROM activities a
      JOIN cities c ON a.city_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (category) {
      params.push(category);
      conditions.push(`a.category = $${params.length}`);
    }
    if (cityId) {
      params.push(cityId);
      conditions.push(`a.city_id = $${params.length}`);
    }

    if (conditions.length > 0) {
      queryText += " WHERE " + conditions.join(" AND ");
    }

    queryText += " ORDER BY c.name ASC, a.name ASC;";
    const result = await pool.query(queryText, params);
    res.json({ activities: result.rows });
  } catch (err) {
    next(err);
  }
}

export async function getActivitiesByCity(req, res, next) {
  try {
    const { cityId } = req.params;
    const result = await pool.query(
      "SELECT * FROM activities WHERE city_id = $1 ORDER BY cost ASC;",
      [cityId]
    );
    res.json({ activities: result.rows });
  } catch (err) {
    next(err);
  }
}
