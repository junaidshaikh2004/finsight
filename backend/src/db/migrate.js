// One-off script to create the database tables. Run with `npm run migrate`.
// Not a migration framework — for a project this size, a single idempotent
// schema file (CREATE TABLE IF NOT EXISTS) is simpler to read and explain.
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('./pool');

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
  await pool.query(schema);
  console.log('Schema applied successfully.');
  await pool.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
