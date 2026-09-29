import { Router } from "express";
import { pool } from "../db/pool.js";
import { requireAdmin } from "../middleware/auth.js";

export const adminConversationsRouter = Router();
adminConversationsRouter.use(requireAdmin);

// GET /api/admin/conversations — one row per chat session, most recent first
adminConversationsRouter.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT s.id, s.session_token, s.created_at, p.name AS product_name, p.slug AS product_slug,
              (SELECT COUNT(*) FROM chat_messages m WHERE m.session_id = s.id)::int AS message_count,
              (SELECT content FROM chat_messages m WHERE m.session_id = s.id ORDER BY m.created_at DESC LIMIT 1) AS last_message
       FROM chat_sessions s
       LEFT JOIN products p ON p.id = s.product_id
       ORDER BY s.created_at DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load conversations." });
  }
});

// GET /api/admin/conversations/:id — full message thread for one session
adminConversationsRouter.get("/:id", async (req, res) => {
  try {
    const { rows: sessionRows } = await pool.query(
      `SELECT s.*, p.name AS product_name, p.slug AS product_slug
       FROM chat_sessions s LEFT JOIN products p ON p.id = s.product_id
       WHERE s.id = $1`,
      [req.params.id]
    );
    if (!sessionRows[0]) return res.status(404).json({ error: "Conversation not found." });

    const { rows: messages } = await pool.query(
      "SELECT id, sender, content, created_at FROM chat_messages WHERE session_id = $1 ORDER BY created_at ASC",
      [req.params.id]
    );
    res.json({ ...sessionRows[0], messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Could not load this conversation." });
  }
});
