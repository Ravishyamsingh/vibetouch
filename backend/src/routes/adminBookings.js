import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminBookingsRouter = Router();
adminBookingsRouter.use(requireAdmin);

// GET /api/admin/bookings — every enquiry/booking the chatbot has captured
adminBookingsRouter.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT b.*, p.name AS product_name, p.slug AS product_slug
       FROM chatbot_bookings b
       LEFT JOIN products p ON p.id = b.product_id
       ORDER BY b.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load bookings." });
  }
});
