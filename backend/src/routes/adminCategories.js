import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminCategoriesRouter = Router();
adminCategoriesRouter.use(requireAdmin);

// GET /api/admin/categories — for the product form's category dropdown
adminCategoriesRouter.get("/", async (req, res) => {
  const { rows } = await pool.query("SELECT id, slug, name FROM categories ORDER BY sort_order");
  res.json(rows);
});
