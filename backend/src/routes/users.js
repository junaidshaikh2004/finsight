const express = require('express');
const pool = require('../db/pool');
const requireAuth = require('../middleware/auth');
const { VALID_CURRENCY_CODES } = require('../utils/currencies');

const router = express.Router();
router.use(requireAuth);

router.patch('/me', async (req, res) => {
  const { currency } = req.body;

  if (!currency || !VALID_CURRENCY_CODES.includes(currency)) {
    return res.status(400).json({ error: `currency must be one of: ${VALID_CURRENCY_CODES.join(', ')}` });
  }

  const result = await pool.query(
    'UPDATE users SET currency = $1 WHERE id = $2 RETURNING id, name, email, currency, created_at',
    [currency, req.userId]
  );

  res.json({ user: result.rows[0] });
});

module.exports = router;
