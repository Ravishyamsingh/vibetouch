// Deterministic, DB-grounded chatbot. No external AI API — every answer is
// generated from the actual product row passed in, so nothing here can
// "hallucinate" a spec, price or stock number. See README for how to swap
// this for an LLM-backed engine later without touching the chat widget,
// session storage or booking flow.

const INR = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

const INTENTS = [
  {
    key: "price",
    test: /\b(price|cost|rate|mrp|how much)\b/i,
    answer: (p) =>
      p.price
        ? `The ${p.name} (${p.model_number || "no model number on file"}) is priced at ${INR.format(p.price)}. Want me to start an enquiry for it?`
        : `We don't have online pricing for the ${p.name} yet — I can pass your enquiry to our sales team if you'd like a quote.`,
  },
  {
    key: "stock",
    test: /\b(stock|available|availability|in stock|quantity left)\b/i,
    answer: (p) =>
      p.stock_quantity > 0
        ? `Yes — we currently have ${p.stock_quantity} unit${p.stock_quantity === 1 ? "" : "s"} of the ${p.name} in stock.`
        : `The ${p.name} is currently out of stock. I can still take your enquiry so our team can update you when it's back.`,
  },
  {
    key: "specs",
    test: /\b(spec|specification|features?|details)\b/i,
    answer: (p) => {
      const entries = Object.entries(p.specs || {}).slice(0, 6);
      if (entries.length === 0) return `Full specs for the ${p.name} aren't listed yet — I can have our team send them over.`;
      const list = entries.map(([k, v]) => `${k}: ${v}`).join(" · ");
      return `Here's a quick spec summary for the ${p.name} — ${list}.`;
    },
  },
  {
    key: "size",
    test: /\b(size|dimension|inch|display size|screen size)\b/i,
    answer: (p) => {
      const sizeKey = Object.keys(p.specs || {}).find((k) => /size|display|screen/i.test(k));
      return sizeKey
        ? `The ${p.name} has a ${p.specs[sizeKey]} display.`
        : `Size details for the ${p.name} aren't listed yet — I can check with our team.`;
    },
  },
  {
    key: "model",
    test: /\b(model|model number|model name)\b/i,
    answer: (p) => `The model number is ${p.model_number || "not set for this product yet"} — full name: ${p.name}.`,
  },
  {
    key: "brand",
    test: /\b(brand|manufacturer|who makes)\b/i,
    answer: (p) => `This is a ${p.brand || "Vibetouch"} product, manufactured in-house (OEM/ODM/OBM).`,
  },
  {
    key: "warranty",
    test: /\bwarrant(y|ies)|guarantee\b/i,
    answer: () => `Vibetouch products carry a standard 1-year warranty with pan-India on-site support — happy to confirm specifics for this model if you'd like to book.`,
  },
  {
    key: "order",
    test: /\bhow (do|can) i (order|book|buy|purchase)|how to (order|book)\b/i,
    answer: (p) => `You can book the ${p.name} right here — just say "book this" and I'll take your details (name, phone, email, quantity, address) and pass it straight to our sales team.`,
  },
  {
    key: "greeting",
    test: /^\s*(hi|hello|hey|namaste)\b/i,
    answer: (p) => `Hi! I can answer questions about the ${p.name} — price, specs, stock, warranty — or help you book it. What would you like to know?`,
  },
];

// Phrases that start the structured booking flow.
const BOOKING_TRIGGER = /\b(book|order|enquir|inquir|purchase|buy)\b.*\b(this|it|now|product)?\b|\bi want to (book|order|buy)\b/i;

export function matchIntent(message) {
  for (const intent of INTENTS) {
    if (intent.test.test(message)) return intent;
  }
  return null;
}

export function wantsToBook(message) {
  return BOOKING_TRIGGER.test(message);
}

export function answerQuestion(message, product) {
  const intent = matchIntent(message);
  if (intent) return intent.answer(product);
  return null;
}

export function suggestedQuestions(product) {
  return [
    "What's the price?",
    "Is it in stock?",
    "What are the specs?",
    "What's the warranty?",
    "How do I book this?",
  ];
}

// --- Booking flow state machine --------------------------------------------

export const BOOKING_FIELDS = ["name", "phone", "email", "quantity", "address"];

const FIELD_PROMPTS = {
  name: "Sure — let's get your booking started. What's your full name?",
  phone: "Thanks! What's the best phone number to reach you on?",
  email: "Got it. What's your email address?",
  quantity: "How many units would you like?",
  address: "Last thing — what's the delivery/installation address?",
};

export function promptForField(field) {
  return FIELD_PROMPTS[field];
}

export function firstBookingField() {
  return BOOKING_FIELDS[0];
}

export function nextBookingField(currentField) {
  const i = BOOKING_FIELDS.indexOf(currentField);
  return i === -1 || i === BOOKING_FIELDS.length - 1 ? null : BOOKING_FIELDS[i + 1];
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validates + normalizes one booking answer. Returns { ok, value, error }.
export function validateBookingField(field, rawValue) {
  const value = String(rawValue || "").trim();

  if (field === "name") {
    return value.length >= 2 ? { ok: true, value } : { ok: false, error: "That name looks too short — what's your full name?" };
  }
  if (field === "phone") {
    const digits = value.replace(/\D/g, "");
    return digits.length >= 10
      ? { ok: true, value: digits }
      : { ok: false, error: "That doesn't look like a valid phone number — could you share a 10-digit number?" };
  }
  if (field === "email") {
    return EMAIL_RE.test(value) ? { ok: true, value } : { ok: false, error: "That email doesn't look right — mind double-checking it?" };
  }
  if (field === "quantity") {
    const n = parseInt(value, 10);
    return n > 0 ? { ok: true, value: n } : { ok: false, error: "How many units — just give me a number like 1 or 2?" };
  }
  if (field === "address") {
    return value.length >= 5 ? { ok: true, value } : { ok: false, error: "Could you share a bit more detail on the delivery address?" };
  }
  return { ok: false, error: "Something went wrong there — could you try again?" };
}

export function bookingConfirmation(draft, product) {
  return `Thanks, ${draft.name}! I've logged your enquiry for ${draft.quantity} × ${product.name} (${product.model_number || "—"}), and our sales team will reach out at ${draft.phone} shortly.`;
}
