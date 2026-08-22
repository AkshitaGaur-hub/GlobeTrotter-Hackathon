import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "globetrotter_hackathon_super_secret_jwt_key_2026";

export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: "Name, email, and password are required." });
    }

    const existing = await pool.query("SELECT id FROM users WHERE email = $1;", [email.toLowerCase().trim()]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: "An account with this email already exists." });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userRes = await pool.query(
      `INSERT INTO users (name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, name, email, created_at;`,
      [name.trim(), email.toLowerCase().trim(), passwordHash]
    );

    const user = userRes.rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      message: "Account created successfully.",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required." });
    }

    const userRes = await pool.query("SELECT * FROM users WHERE email = $1;", [email.toLowerCase().trim()]);
    if (userRes.rows.length === 0) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const user = userRes.rows[0];
    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Login successful.",
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const userRes = await pool.query(
      "SELECT id, name, email, is_admin, avatar_url, bio, location, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    res.json({ user: userRes.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const { name, bio, location, avatar_url } = req.body;
    const result = await pool.query(
      `UPDATE users SET name = COALESCE($1, name), bio = COALESCE($2, bio), location = COALESCE($3, location), avatar_url = COALESCE($4, avatar_url)
       WHERE id = $5 RETURNING id, name, email, bio, location, avatar_url, is_admin`,
      [name, bio, location, avatar_url, req.user.id]
    );
    res.json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

export async function getUserProfile(req, res, next) {
  try {
    const { userId } = req.params;
    const userRes = await pool.query(
      `SELECT id, name, email, avatar_url, bio, location, created_at,
        (SELECT COUNT(*) FROM trips WHERE user_id = $1) as trip_count,
        (SELECT COUNT(*) FROM community_posts WHERE author_id = $1) as post_count
       FROM users WHERE id = $1`,
      [userId]
    );
    if (userRes.rows.length === 0) return res.status(404).json({ error: "User not found" });
    res.json({ user: userRes.rows[0] });
  } catch (err) {
    next(err);
  }
}
