import { Router } from "express";
import multer from "multer";
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminProductsRouter = Router();
adminProductsRouter.use(requireAdmin);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.join(__dirname, "..", "..", "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const EXTENSION_BY_MIME = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

function safeImageFilename(requestedName, file) {
  const rawName = path.basename(String(requestedName || file.originalname || "image").trim());
  const requestedExt = path.extname(rawName);
  const rawStem = requestedExt ? rawName.slice(0, -requestedExt.length) : rawName;
  const stem = rawStem
    .normalize("NFKC")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
  const extension = EXTENSION_BY_MIME[file.mimetype] || path.extname(file.originalname).toLowerCase() || ".jpg";
  return `${stem || "image"}${extension}`;
}

function uniqueUploadFilename(preferredName) {
  const parsed = path.parse(preferredName);
  let filename = preferredName;
  let suffix = 2;
  while (fs.existsSync(path.join(UPLOADS_DIR, filename))) {
    filename = `${parsed.name}-${suffix++}${parsed.ext}`;
  }
  return filename;
}
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB per image
  fileFilter: (req, file, cb) => {
    if (/^image\/(png|jpe?g|webp|gif)$/.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only image files are allowed."));
  },
});

// GET /api/admin/products — full list for the admin table
adminProductsRouter.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT p.*, c.name AS category_name, c.slug AS category_slug,
              COALESCE(
                (SELECT json_agg(pi.* ORDER BY pi.sort_order)
                 FROM product_images pi WHERE pi.product_id = p.id),
                '[]'
              ) AS images
       FROM products p
       JOIN categories c ON c.id = p.category_id
       ORDER BY c.sort_order, p.sort_order, p.id`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load products." });
  }
});

// GET /api/admin/products/:id
adminProductsRouter.get("/:id", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT p.*, COALESCE(
        (SELECT json_agg(pi.* ORDER BY pi.sort_order) FROM product_images pi WHERE pi.product_id = p.id),
        '[]'
      ) AS images
     FROM products p WHERE p.id = $1`,
    [req.params.id]
  );
  if (!rows[0]) return res.status(404).json({ error: "Product not found." });
  res.json(rows[0]);
});

// POST /api/admin/products — create
adminProductsRouter.post("/", async (req, res) => {
  const b = req.body ?? {};
  if (!b.slug || !b.name || !b.category_id) {
    return res.status(400).json({ error: "slug, name and category_id are required." });
  }
  try {
    const { rows } = await pool.query(
      `INSERT INTO products
         (category_id, slug, model_number, name, brand, tagline, description, specs, features, price, stock_quantity, is_featured, is_coming_soon, sort_order)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
       RETURNING *`,
      [
        b.category_id, b.slug, b.model_number || null, b.name, b.brand || "Vibetouch",
        b.tagline || null, b.description || null,
        JSON.stringify(b.specs || {}), JSON.stringify(b.features || []),
        b.price ?? null, b.stock_quantity ?? 0,
        !!b.is_featured, !!b.is_coming_soon, b.sort_order ?? 0,
      ]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "That slug is already in use." });
    res.status(500).json({ error: "Could not create product." });
  }
});

// PUT /api/admin/products/:id — update
adminProductsRouter.put("/:id", async (req, res) => {
  const b = req.body ?? {};
  try {
    const { rows } = await pool.query(
      `UPDATE products SET
         category_id = $1, slug = $2, model_number = $3, name = $4, brand = $5,
         tagline = $6, description = $7, specs = $8, features = $9,
         price = $10, stock_quantity = $11, is_featured = $12, is_coming_soon = $13, sort_order = $14
       WHERE id = $15
       RETURNING *`,
      [
        b.category_id, b.slug, b.model_number || null, b.name, b.brand || "Vibetouch",
        b.tagline || null, b.description || null,
        JSON.stringify(b.specs || {}), JSON.stringify(b.features || []),
        b.price ?? null, b.stock_quantity ?? 0,
        !!b.is_featured, !!b.is_coming_soon, b.sort_order ?? 0,
        req.params.id,
      ]
    );
    if (!rows[0]) return res.status(404).json({ error: "Product not found." });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    if (err.code === "23505") return res.status(409).json({ error: "That slug is already in use." });
    res.status(500).json({ error: "Could not update product." });
  }
});

// DELETE /api/admin/products/:id
adminProductsRouter.delete("/:id", async (req, res) => {
  const { rowCount } = await pool.query("DELETE FROM products WHERE id = $1", [req.params.id]);
  if (!rowCount) return res.status(404).json({ error: "Product not found." });
  res.json({ ok: true });
});

// POST /api/admin/products/:id/images — upload up to 6 images at once
adminProductsRouter.post("/:id/images", upload.array("images", 6), async (req, res) => {
  const files = req.files || [];
  if (files.length === 0) return res.status(400).json({ error: "No images uploaded." });

  try {
    let requestedNames = [];
    try {
      requestedNames = JSON.parse(req.body.imageNames || "[]");
    } catch {
      requestedNames = [];
    }

    for (const [index, file] of files.entries()) {
      const preferredName = safeImageFilename(requestedNames[index], file);
      const finalName = uniqueUploadFilename(preferredName);
      fs.renameSync(file.path, path.join(UPLOADS_DIR, finalName));
      file.filename = finalName;
    }

    const { rows: existing } = await pool.query(
      "SELECT COALESCE(MAX(sort_order), -1) AS max_order FROM product_images WHERE product_id = $1",
      [req.params.id]
    );
    let nextOrder = existing[0].max_order + 1;

    const inserted = [];
    for (const file of files) {
      const url = `/uploads/${file.filename}`;
      const { rows } = await pool.query(
        `INSERT INTO product_images (product_id, url, alt_text, sort_order)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [req.params.id, url, req.body.alt_text || null, nextOrder++]
      );
      inserted.push(rows[0]);
    }
    res.status(201).json(inserted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not save uploaded images." });
  }
});

// DELETE /api/admin/products/:id/images/:imageId
adminProductsRouter.delete("/:id/images/:imageId", async (req, res) => {
  const { rows } = await pool.query(
    "DELETE FROM product_images WHERE id = $1 AND product_id = $2 RETURNING url",
    [req.params.imageId, req.params.id]
  );
  if (rows[0]) {
    const filePath = path.join(UPLOADS_DIR, path.basename(rows[0].url));
    fs.unlink(filePath, () => {}); // best-effort; ignore if already gone
  }
  res.json({ ok: true });
});
