import { Router } from "express";
import { randomUUID } from "node:crypto";
import { pool } from "../db/pool.js";
import {
  answerQuestion,
  wantsToBook,
  suggestedQuestions,
  firstBookingField,
  nextBookingField,
  promptForField,
  validateBookingField,
  bookingConfirmation,
} from "../lib/chatbotEngine.js";

export const chatRouter = Router();

async function getOrCreateSession(sessionToken, productSlug) {
  if (sessionToken) {
    const { rows } = await pool.query("SELECT * FROM chat_sessions WHERE session_token = $1", [sessionToken]);
    if (rows[0]) return rows[0];
  }

  const { rows: productRows } = await pool.query("SELECT id FROM products WHERE slug = $1", [productSlug]);
  const productId = productRows[0]?.id || null;
  const token = randomUUID();
  const { rows } = await pool.query(
    "INSERT INTO chat_sessions (session_token, product_id) VALUES ($1, $2) RETURNING *",
    [token, productId]
  );
  return rows[0];
}

async function saveMessage(sessionId, sender, content) {
  await pool.query("INSERT INTO chat_messages (session_id, sender, content) VALUES ($1, $2, $3)", [
    sessionId,
    sender,
    content,
  ]);
}

// POST /api/chat/message — { sessionToken?, productSlug, message }
chatRouter.post("/message", async (req, res) => {
  const { sessionToken, productSlug, message } = req.body ?? {};
  if (!message || !String(message).trim()) {
    return res.status(400).json({ error: "Message is required." });
  }

  try {
    const session = await getOrCreateSession(sessionToken, productSlug);
    await saveMessage(session.id, "user", message);

    const { rows: productRows } = await pool.query("SELECT * FROM products WHERE id = $1", [session.product_id]);
    const product = productRows[0];

    if (!product) {
      const reply = "I couldn't find which product we're talking about — try opening the chat from a product page.";
      await saveMessage(session.id, "bot", reply);
      return res.json({ sessionToken: session.session_token, reply, suggestedQuestions: [] });
    }

    let reply;
    let newPendingField = session.pending_field;
    let newDraft = { ...session.booking_draft };

    if (session.pending_field) {
      // Mid-booking flow: validate this answer against the field we asked for.
      const check = validateBookingField(session.pending_field, message);
      if (!check.ok) {
        reply = check.error;
      } else {
        newDraft[session.pending_field] = check.value;
        const next = nextBookingField(session.pending_field);
        if (next) {
          newPendingField = next;
          reply = promptForField(next);
        } else {
          // All fields collected — save the booking and reset the session.
          await pool.query(
            `INSERT INTO chatbot_bookings (session_id, product_id, model_number, name, phone, email, quantity, address)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
            [session.id, product.id, product.model_number, newDraft.name, newDraft.phone, newDraft.email, newDraft.quantity, newDraft.address]
          );
          reply = bookingConfirmation(newDraft, product);
          newPendingField = null;
          newDraft = {};
        }
      }
    } else if (wantsToBook(message)) {
      newPendingField = firstBookingField();
      reply = promptForField(newPendingField);
    } else {
      reply =
        answerQuestion(message, product) ||
        `I can help with the price, specs, stock, warranty, model info, or booking this ${product.name}. What would you like to know?`;
    }

    await pool.query(
      "UPDATE chat_sessions SET pending_field = $1, booking_draft = $2 WHERE id = $3",
      [newPendingField, JSON.stringify(newDraft), session.id]
    );
    await saveMessage(session.id, "bot", reply);

    res.json({
      sessionToken: session.session_token,
      reply,
      suggestedQuestions: newPendingField ? [] : suggestedQuestions(product),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "The chatbot hit a snag. Please try again." });
  }
});

// GET /api/chat/greeting?productSlug=... — opening message + quick replies
// shown the moment the widget is opened, before the visitor types anything.
chatRouter.get("/greeting", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM products WHERE slug = $1", [req.query.productSlug]);
  const product = rows[0];
  if (!product) return res.json({ reply: "Hi! Open this chat from a product page and I'll answer questions about it.", suggestedQuestions: [] });
  res.json({
    reply: `Hi! I'm the Vibetouch assistant. Ask me anything about the ${product.name} — price, specs, stock, warranty — or say "book this" to get a quote.`,
    suggestedQuestions: suggestedQuestions(product),
  });
});
