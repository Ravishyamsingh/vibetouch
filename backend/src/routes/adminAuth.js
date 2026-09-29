import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool.js";
import { signAdminToken, setAdminCookie, clearAdminCookie, requireAdmin } from "../middleware/auth.js";

export const adminAuthRouter = Router();

// POST /api/admin/login
adminAuthRouter.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const { rows } = await pool.query(
      "SELECT id, email, password_hash FROM admin_users WHERE email = $1",
      [String(email).toLowerCase().trim()]
    );
    const admin = rows[0];
    // Same generic error whether the email doesn't exist or the password is
    // wrong — don't leak which one it was.
    if (!admin || !(await bcrypt.compare(password, admin.password_hash))) {
      return res.status(401).json({ error: "Invalid email or password." });
    }

    const token = signAdminToken(admin);
    setAdminCookie(res, token);
    res.json({ ok: true, email: admin.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed. Please try again." });
  }
});

// POST /api/admin/logout
adminAuthRouter.post("/logout", (req, res) => {
  clearAdminCookie(res);
  res.json({ ok: true });
});

// GET /api/admin/me — used by the dashboard to check "am I still logged in?"
adminAuthRouter.get("/me", requireAdmin, (req, res) => {
  res.json({ email: req.admin.email });
});
