const { Pool, types } = require('pg');

// By default node-postgres parses DATE columns into JS Date objects at local
// midnight, which then shift to the wrong calendar day once serialized to
// UTC in JSON. We only ever store/compare plain calendar dates, so keep them
// as 'YYYY-MM-DD' strings instead (1082 is the DATE type OID).
types.setTypeParser(1082, (value) => value);

// Neon (and most managed Postgres) require SSL, and disabling cert
// verification is needed since Neon's cert isn't in Node's default trust
// store. A local/CI Postgres (docker, GitHub Actions service container)
// doesn't speak SSL at all, so only turn it on for a non-local host.
const isLocalDb = /localhost|127\.0\.0\.1/.test(process.env.DATABASE_URL || '');
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: isLocalDb ? false : { rejectUnauthorized: false },
});

module.exports = pool;
