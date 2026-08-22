import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

function getPoolConfig() {
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }
  return {
    host: process.env.PGHOST || "localhost",
    port: parseInt(process.env.PGPORT || "5432", 10),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "postgres",
    database: process.env.PGDATABASE || "globetrotter",
  };
}

export const pool = new Pool(getPoolConfig());

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL client error:", err.message);
});

export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log(`[DB] query (${duration}ms): ${text.slice(0, 60)}...`);
    }
    return res;
  } catch (error) {
    console.error(`[DB Error] query "${text.slice(0, 80)}":`, error.message);
    throw error;
  }
};

export default pool;
