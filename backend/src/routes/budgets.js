const express = require('express');
const pool = require('../db/pool');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const MONTH_REGEX = /^\d{4}-\d{2}$/;

router.get('/', async (req, res) => {
  const { month } = req.query;
  if (!month || !MONTH_REGEX.test(month)) {
    return res.status(400).json({ error: "A month query param in 'YYYY-MM' format is required" });
  }

  // Spent is computed here (not stored) so it's always in sync with the
  // expenses that actually exist for the month.
  const result = await pool.query(
    `SELECT b.id, b.category_id, c.name AS category_name, b.month, b.amount_limit,
            COALESCE(SUM(e.amount), 0) AS spent
     FROM budgets b
     JOIN categories c ON c.id = b.category_id
     LEFT JOIN expenses e
       ON e.category_id = b.category_id
       AND e.user_id = b.user_id
       AND TO_CHAR(e.date, 'YYYY-MM') = b.month
     WHERE b.user_id = $1 AND b.month = $2
     GROUP BY b.id, b.category_id, c.name, b.month, b.amount_limit
     ORDER BY c.name`,
    [req.userId, month]
  );

  res.json({ budgets: result.rows });
});

router.post('/', async (req, res) => {
  const { category_id, month, amount_limit } = req.body;

  if (!category_id || !month || !amount_limit) {
    return res.status(400).json({ error: 'category_id, month, and amount_limit are required' });
  }
  if (!MONTH_REGEX.test(month)) {
    return res.status(400).json({ error: "month must be in 'YYYY-MM' format" });
  }
  if (isNaN(amount_limit) || Number(amount_limit) <= 0) {
    return res.status(400).json({ error: 'amount_limit must be a positive number' });
  }

  const category = await pool.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [
    category_id,
    req.userId,
  ]);
  if (category.rows.length === 0) {
    return res.status(400).json({ error: 'Category not found' });
  }

  // Setting a budget for a category/month that already has one just updates it.
  const result = await pool.query(
    `INSERT INTO budgets (user_id, category_id, month, amount_limit)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (user_id, category_id, month)
     DO UPDATE SET amount_limit = EXCLUDED.amount_limit
     RETURNING id, category_id, month, amount_limit`,
    [req.userId, category_id, month, amount_limit]
  );

  res.status(201).json({ budget: result.rows[0] });
});

router.delete('/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id', [
    req.params.id,
    req.userId,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Budget not found' });
  }

  res.json({ success: true });
});

module.exports = router;
