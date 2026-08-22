import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import pool, { query } from "./config/db.js";
import { runSeeds } from "../database/seeds/seed_data.js";
import { authenticateToken } from "./middleware/auth.js";
import { errorHandler } from "./middleware/errorHandler.js";

import * as authController from "./controllers/authController.js";
import * as tripController from "./controllers/tripController.js";
import * as cityController from "./controllers/cityController.js";
import * as activityController from "./controllers/activityController.js";
import * as aiController from "./controllers/aiController.js";
import * as communityController from "./controllers/communityController.js";
import * as adminController from "./controllers/adminController.js";
import { requireAdmin } from "./middleware/adminAuth.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());

// Auto DB setup check
async function initializeDatabase() {
  try {
    const checkTable = await pool.query(
      "SELECT 1 FROM information_schema.tables WHERE table_name = 'cities';"
    );
    if (checkTable.rowCount === 0) {
      console.log("🛠️ Initializing database tables...");
      const migrationSql = fs.readFileSync(
        path.join(__dirname, "../database/migrations/001_init_schema.sql"),
        "utf-8"
      );
      await pool.query(migrationSql);
      console.log("✅ Schema created.");
      await runSeeds();
    } else {
      const cityCountRes = await pool.query("SELECT COUNT(*) FROM cities;");
      if (parseInt(cityCountRes.rows[0].count, 10) === 0) {
        console.log("🌱 Database tables exist but empty. Seeding initial data...");
        await runSeeds();
      } else {
        console.log(`✅ Database ready (${cityCountRes.rows[0].count} cities loaded).`);
      }
    }

    // Run feature enhancement migration (idempotent with IF NOT EXISTS)
    try {
      const migration2 = fs.readFileSync(
        path.join(__dirname, "../database/migrations/002_feature_enhancements.sql"),
        "utf-8"
      );
      await pool.query(migration2);
      console.log("✅ Feature enhancement migration applied.");
    } catch (migErr) {
      console.warn("⚠️ Feature migration notice:", migErr.message);
    }
  } catch (err) {
    console.warn("⚠️ Database initialization notice:", err.message);
    console.warn("Please verify PostgreSQL credentials in backend/.env");
  }
}

// Health Check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    app: "GlobeTrotter Backend API",
    time: new Date().toISOString()
  });
});

// --- Auth Routes ---
app.post("/auth/signup", authController.signup);
app.post("/auth/login", authController.login);
app.get("/auth/me", authenticateToken, authController.getMe);

// --- Auth Profile Routes ---
app.put("/auth/profile", authenticateToken, authController.updateProfile);
app.get("/auth/users/:userId", authenticateToken, authController.getUserProfile);

// --- City & Activity Routes (Public) ---
app.get("/cities", cityController.getCities);
app.get("/cities/:id", cityController.getCityById);
app.get("/activities", activityController.getActivities);
app.get("/activities/by-city/:cityId", activityController.getActivitiesByCity);

// --- Public Share Route ---
app.get("/public/trips/:share_slug", tripController.getPublicTrip);

// --- Protected Trip Routes ---
app.get("/trips", authenticateToken, tripController.getTrips);
app.post("/trips", authenticateToken, tripController.createTrip);
app.get("/trips/calendar", authenticateToken, tripController.getCalendarTrips);
app.get("/trips/:id", authenticateToken, tripController.getTripById);
app.delete("/trips/:id", authenticateToken, tripController.deleteTrip);
app.get("/trips/:id/budget", authenticateToken, tripController.getTripBudget);
app.get("/trips/:id/itinerary", authenticateToken, tripController.getTripItinerary);
app.post("/trips/:id/apply-optimization", authenticateToken, tripController.applyOptimization);

// --- Protected Trip Activity Routes ---
app.post("/trips/:id/activities", authenticateToken, tripController.addTripActivity);
app.put("/trips/:id/activities/:activityId", authenticateToken, tripController.updateTripActivity);
app.delete("/trips/:id/activities/:activityId", authenticateToken, tripController.deleteTripActivity);

// --- Protected AI Routes ---
app.post("/ai/generate-trip", authenticateToken, aiController.generateTrip);
app.post("/ai/optimize-trip", authenticateToken, aiController.optimizeTrip);

// --- Community Routes ---
app.get("/community/posts", authenticateToken, communityController.getPosts);
app.post("/community/posts", authenticateToken, communityController.createPost);
app.put("/community/posts/:id", authenticateToken, communityController.updatePost);
app.delete("/community/posts/:id", authenticateToken, communityController.deletePost);
app.post("/community/posts/:id/like", authenticateToken, communityController.toggleLike);
app.get("/community/posts/:id/comments", authenticateToken, communityController.getComments);
app.post("/community/posts/:id/comments", authenticateToken, communityController.addComment);
app.delete("/community/comments/:id", authenticateToken, communityController.deleteComment);

// --- Admin Routes ---
app.get("/admin/stats", authenticateToken, requireAdmin, adminController.getStats);
app.get("/admin/charts", authenticateToken, requireAdmin, adminController.getCharts);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`🌍 GlobeTrotter Backend running on http://localhost:${PORT}`);
  await initializeDatabase();
});
