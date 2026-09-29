-- Vibetouch schema
-- Run via: npm run db:migrate  (see src/db/migrate.js)
-- Safe to re-run: every statement is IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

CREATE TABLE IF NOT EXISTS categories (
  id            SERIAL PRIMARY KEY,
  slug          VARCHAR(100) UNIQUE NOT NULL,
  name          VARCHAR(150) NOT NULL,
  tagline       VARCHAR(255),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  category_id     INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  slug            VARCHAR(220) UNIQUE NOT NULL,
  model_number    VARCHAR(100),
  name            VARCHAR(255) NOT NULL,
  tagline         VARCHAR(500),
  description     TEXT,
  specs           JSONB NOT NULL DEFAULT '{}'::jsonb,
  features        JSONB NOT NULL DEFAULT '[]'::jsonb,
  price           NUMERIC(10, 2),
  is_featured     BOOLEAN NOT NULL DEFAULT false,
  is_coming_soon  BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Added for the Amazon/Flipkart-style product page + admin inventory management.
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(150) NOT NULL DEFAULT 'Vibetouch';
ALTER TABLE products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);

-- One product can have many images; sort_order controls gallery position
-- (position 0 = main/hero image).
CREATE TABLE IF NOT EXISTS product_images (
  id            SERIAL PRIMARY KEY,
  product_id    INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url           VARCHAR(500) NOT NULL,
  alt_text      VARCHAR(255),
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50),
  subject     VARCHAR(255),
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Admin dashboard login. Seeded via `npm run db:seed-admin` (reads
-- ADMIN_EMAIL / ADMIN_PASSWORD from .env, never stores plaintext).
CREATE TABLE IF NOT EXISTS admin_users (
  id              SERIAL PRIMARY KEY,
  email           VARCHAR(255) UNIQUE NOT NULL,
  password_hash   VARCHAR(255) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- One row per chat-widget conversation. product_id is "which product page
-- was this chat opened from" so the bot can answer without the visitor
-- re-stating which product they mean.
CREATE TABLE IF NOT EXISTS chat_sessions (
  id            SERIAL PRIMARY KEY,
  session_token VARCHAR(64) UNIQUE NOT NULL,
  product_id    INTEGER REFERENCES products(id) ON DELETE SET NULL,
  -- Tracks which field of the booking flow we're currently collecting, if
  -- any: null | 'name' | 'phone' | 'email' | 'quantity' | 'address'.
  pending_field VARCHAR(20),
  -- Partial booking answers collected so far this session, merged in as
  -- the visitor answers each step: {"name": "...", "phone": "...", ...}
  booking_draft JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id            SERIAL PRIMARY KEY,
  session_id    INTEGER NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  sender        VARCHAR(10) NOT NULL, -- 'user' | 'bot'
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session ON chat_messages(session_id);

-- A completed (or in-progress) booking/enquiry captured by the chatbot.
CREATE TABLE IF NOT EXISTS chatbot_bookings (
  id            SERIAL PRIMARY KEY,
  session_id    INTEGER REFERENCES chat_sessions(id) ON DELETE SET NULL,
  product_id    INTEGER REFERENCES products(id) ON DELETE SET NULL,
  model_number  VARCHAR(100),
  name          VARCHAR(255) NOT NULL,
  phone         VARCHAR(50) NOT NULL,
  email         VARCHAR(255),
  quantity      INTEGER NOT NULL DEFAULT 1,
  address       TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
