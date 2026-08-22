import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required. Please log in." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "globetrotter_hackathon_super_secret_jwt_key_2026");
    const userRes = await pool.query("SELECT id, name, email FROM users WHERE id = $1;", [decoded.userId]);
    
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "User session is invalid. Please log in again." });
    }

    req.user = userRes.rows[0];
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid or expired token. Please log in again." });
  }
}
