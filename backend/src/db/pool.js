const { Pool, types } = require('pg');

// By default node-postgres parses DATE columns into JS Date objects at local
// midnight, which then shift to the wrong calendar day once serialized to
// UTC in JSON. We only ever store/compare plain calendar dates, so keep them
// as 'YYYY-MM-DD' strings instead (1082 is the DATE type OID).
types.setTypeParser(1082, (value) => value);

// Neon (and most managed Postgres) require SSL; disable cert verification
// since Neon uses a cert not in Node's default trust store.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

module.exports = pool;
