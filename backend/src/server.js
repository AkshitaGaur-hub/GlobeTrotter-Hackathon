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
app.get("/trips/:id", authenticateToken, tripController.getTripById);
app.delete("/trips/:id", authenticateToken, tripController.deleteTrip);
app.get("/trips/:id/budget", authenticateToken, tripController.getTripBudget);
app.get("/trips/:id/itinerary", authenticateToken, tripController.getTripItinerary);
app.post("/trips/:id/apply-optimization", authenticateToken, tripController.applyOptimization);

// --- Protected AI Routes ---
app.post("/ai/generate-trip", authenticateToken, aiController.generateTrip);
app.post("/ai/optimize-trip", authenticateToken, aiController.optimizeTrip);

// Error Handling Middleware
app.use(errorHandler);

// Start Server
app.listen(PORT, async () => {
  console.log(`🌍 GlobeTrotter Backend running on http://localhost:${PORT}`);
  await initializeDatabase();
});
