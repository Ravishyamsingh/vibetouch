import { Router } from "express";
import { pool } from "../db/pool.js";

export const productsRouter = Router();

// GET /api/products?category=smart-tv&featured=true
productsRouter.get("/", async (req, res) => {
  const { category, featured } = req.query;
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
  }
  if (featured === "true") {
    conditions.push("p.is_featured = true");
  }

  const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const { rows } = await pool.query(
      `SELECT p.id, p.slug, p.model_number, p.name, p.tagline, p.features, p.brand,
              p.price, p.stock_quantity, p.is_featured, p.is_coming_soon,
              c.slug AS category_slug, c.name AS category_name,
              hero.url AS image_url, hero.alt_text AS image_alt
       FROM products p
       JOIN categories c ON c.id = p.category_id
       LEFT JOIN LATERAL (
         SELECT pi.url, pi.alt_text
         FROM product_images pi
         WHERE pi.product_id = p.id
         ORDER BY pi.sort_order ASC, pi.id ASC
         LIMIT 1
       ) hero ON true
       ${where}
       ORDER BY p.sort_order ASC, p.id ASC`,
      values
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load products." });
  }
});

// GET /api/products/:slug — full detail for one product
productsRouter.get("/:slug", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.slug AS category_slug, c.name AS category_name
       FROM products p
       JOIN categories c ON c.id = p.category_id
       WHERE p.slug = $1`,
      [req.params.slug]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "Product not found." });
    }

    const product = rows[0];

    const { rows: images } = await pool.query(
      `SELECT id, url, alt_text, sort_order
       FROM product_images
       WHERE product_id = $1
       ORDER BY sort_order ASC, id ASC`,
      [product.id]
    );

    const { rows: related } = await pool.query(
      `SELECT p.slug, p.name, p.model_number, p.tagline, p.price,
              hero.url AS image_url, hero.alt_text AS image_alt
       FROM products p
       LEFT JOIN LATERAL (
         SELECT pi.url, pi.alt_text
         FROM product_images pi
         WHERE pi.product_id = p.id
         ORDER BY pi.sort_order ASC, pi.id ASC
         LIMIT 1
       ) hero ON true
       WHERE p.category_id = $1 AND p.id != $2
       ORDER BY p.sort_order ASC
       LIMIT 4`,
      [product.category_id, product.id]
    );

    res.json({ ...product, images, related });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load this product." });
  }
});
