import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

import { categoriesRouter } from "./routes/categories.js";
import { productsRouter } from "./routes/products.js";
import { contactRouter } from "./routes/contact.js";
import { chatRouter } from "./routes/chat.js";
import { adminAuthRouter } from "./routes/adminAuth.js";
import { adminProductsRouter } from "./routes/adminProducts.js";
import { adminCategoriesRouter } from "./routes/adminCategories.js";
import { adminBookingsRouter } from "./routes/adminBookings.js";
import { adminConversationsRouter } from "./routes/adminConversations.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

// credentials: true is required for the admin httpOnly cookie to be sent
// cross-origin between the Vite dev server and this API.
app.use(cors({ origin: CORS_ORIGIN.split(",").map((o) => o.trim()), credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

// Uploaded product images, served as plain static files at /uploads/<file>.
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.use("/api/categories", categoriesRouter);
app.use("/api/products", productsRouter);
app.use("/api/contact", contactRouter);
app.use("/api/chat", chatRouter);

app.use("/api/admin", adminAuthRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/categories", adminCategoriesRouter);
app.use("/api/admin/bookings", adminBookingsRouter);
app.use("/api/admin/conversations", adminConversationsRouter);

app.use((req, res) => res.status(404).json({ error: "Not found." }));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message || "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`Vibetouch API listening on http://localhost:${PORT}`);
});
