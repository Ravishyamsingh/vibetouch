import { Router } from "express";
import { pool } from "../db/pool.js";

export const contactRouter = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// POST /api/contact — { name, email, phone?, subject?, message }
contactRouter.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body ?? {};

  const errors = {};
  if (!name || !name.trim()) errors.name = "Name is required.";
  if (!email || !EMAIL_RE.test(email)) errors.email = "A valid email is required.";
  if (!message || !message.trim()) errors.message = "Message is required.";

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO contact_submissions (name, email, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, created_at`,
      [name.trim(), email.trim(), phone?.trim() || null, subject?.trim() || null, message.trim()]
    );
    res.status(201).json({ ok: true, id: rows[0].id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save your enquiry. Please try again." });
  }
});
