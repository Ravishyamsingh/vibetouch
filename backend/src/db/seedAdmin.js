// Creates (or updates the password of) one admin login.
// Run: npm run db:seed-admin   (reads ADMIN_EMAIL / ADMIN_PASSWORD from .env)

import bcrypt from "bcryptjs";
import { pool } from "./pool.js";
import "dotenv/config";

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.error("Set ADMIN_EMAIL and ADMIN_PASSWORD in backend/.env first.");
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("ADMIN_PASSWORD should be at least 8 characters.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admin_users (email, password_hash)
     VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email.toLowerCase().trim(), passwordHash]
  );

  console.log(`Admin ready: ${email} — log in at /admin/login`);
  await pool.end();
}

seedAdmin().catch((err) => {
  console.error("Admin seed failed:", err.message);
  process.exit(1);
});
