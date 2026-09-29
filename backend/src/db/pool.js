import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

// Lazy, on-demand connection: importing this module never blocks server
// startup. Every route awaits pool.query(...) itself, so a missing/incorrect
// DATABASE_URL only ever surfaces as a 500 on the request that needed the DB,
// not as a crash on boot.
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  // Catches errors on idle clients (e.g. the DB restarting) so a stray
  // connection failure never takes the whole Node process down.
  console.error("Unexpected error on idle Postgres client", err);
});
