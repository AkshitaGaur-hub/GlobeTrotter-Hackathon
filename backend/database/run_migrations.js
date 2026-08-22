import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function ensureDatabaseExists() {
  const targetDb = process.env.PGDATABASE || "globetrotter";
  const clientConfig = {
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: "postgres",
  };

  const client = new pg.Client(clientConfig);
  try {
    await client.connect();
    const checkRes = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1;",
      [targetDb]
    );
    if (checkRes.rowCount === 0) {
      console.log(`Creating database "${targetDb}"...`);
      await client.query(`CREATE DATABASE "${targetDb}";`);
      console.log(`Database "${targetDb}" created successfully.`);
    }
  } catch (err) {
    console.warn("Could not check/create database via root connection:", err.message);
  } finally {
    try {
      await client.end();
    } catch {}
  }
}

async function runMigrations() {
  await ensureDatabaseExists();

  const pool = new pg.Pool(
    process.env.DATABASE_URL
      ? { connectionString: process.env.DATABASE_URL }
      : {
          host: process.env.PGHOST || "localhost",
          port: parseInt(process.env.PGPORT || "5432", 10),
          user: process.env.PGUSER || "postgres",
          password: process.env.PGPASSWORD || "postgres",
          database: process.env.PGDATABASE || "globetrotter",
        }
  );

  try {
    const migrationFile = path.join(__dirname, "migrations", "001_init_schema.sql");
    const sql = fs.readFileSync(migrationFile, "utf-8");
    console.log("Applying migration: 001_init_schema.sql...");
    await pool.query(sql);
    console.log("✅ All migrations applied successfully.");
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

runMigrations();
