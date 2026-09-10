const { Pool } = require('pg');

// Neon (and most managed Postgres) require SSL; disable cert verification
// since Neon uses a cert not in Node's default trust store.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
