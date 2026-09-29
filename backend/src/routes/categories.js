import { Router } from "express";
import { pool } from "../db/pool.js";

export const categoriesRouter = Router();

// GET /api/categories — all active categories, with a live product count
categoriesRouter.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.id, c.slug, c.name, c.tagline,
              COUNT(p.id)::int AS product_count
       FROM categories c
       LEFT JOIN products p ON p.category_id = c.id
       WHERE c.is_active = true
       GROUP BY c.id
       ORDER BY c.sort_order ASC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load categories." });
  }
});
