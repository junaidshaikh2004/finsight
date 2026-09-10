-- Finsight database schema.
-- Run with `npm run migrate` (see src/db/migrate.js).

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  -- Display-only preference (no exchange-rate conversion) — kept to a small
  -- supported set, matching backend/src/utils/currencies.js.
  currency VARCHAR(3) NOT NULL DEFAULT 'USD' CHECK (currency IN ('USD', 'EUR', 'GBP', 'INR')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Adds `currency` to a users table that already existed before this column
-- was introduced; a no-op on a fresh database where CREATE TABLE just added it.
ALTER TABLE users ADD COLUMN IF NOT EXISTS currency VARCHAR(3) NOT NULL DEFAULT 'USD'
  CHECK (currency IN ('USD', 'EUR', 'GBP', 'INR'));

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  is_default BOOLEAN NOT NULL DEFAULT FALSE,
  UNIQUE (user_id, name)
);

CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
  description TEXT,
  date DATE NOT NULL,
  is_recurring BOOLEAN NOT NULL DEFAULT FALSE,
  -- Only set when is_recurring is true; drives the "generate this period's
  -- instance on load" logic instead of a cron job.
  recurrence_interval VARCHAR(10) CHECK (recurrence_interval IN ('weekly', 'monthly')),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS budgets (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  -- Stored as 'YYYY-MM' so it sorts and filters as plain text, no date math needed.
  month CHAR(7) NOT NULL,
  amount_limit NUMERIC(10, 2) NOT NULL CHECK (amount_limit > 0),
  UNIQUE (user_id, category_id, month)
);

-- Indexes for the lookups the app actually does: an expense list filtered by
-- user + month, and by user + category.
CREATE INDEX IF NOT EXISTS idx_expenses_user_date ON expenses(user_id, date);
CREATE INDEX IF NOT EXISTS idx_expenses_user_category ON expenses(user_id, category_id);
CREATE INDEX IF NOT EXISTS idx_categories_user ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_budgets_user_month ON budgets(user_id, month);
