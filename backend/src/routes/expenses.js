const express = require('express');
const pool = require('../db/pool');
const requireAuth = require('../middleware/auth');
const { generateDueRecurringInstances } = require('../utils/recurring');
const { toCsv } = require('../utils/csv');

const router = express.Router();
router.use(requireAuth);

const VALID_INTERVALS = ['weekly', 'monthly'];

// Builds the shared WHERE clause + params for the filters used by both the
// paginated list and the CSV export, so the two can't drift apart.
function buildFilters(userId, { month, category_id, search }) {
  const conditions = ['e.user_id = $1'];
  const params = [userId];

  if (month) {
    params.push(month);
    conditions.push(`TO_CHAR(e.date, 'YYYY-MM') = $${params.length}`);
  }
  if (category_id) {
    params.push(category_id);
    conditions.push(`e.category_id = $${params.length}`);
  }
  if (search) {
    params.push(`%${search}%`);
    conditions.push(`e.description ILIKE $${params.length}`);
  }

  return { whereClause: conditions.join(' AND '), params };
}

async function validateExpenseInput(userId, body) {
  const { category_id, amount, description, date, is_recurring, recurrence_interval } = body;

  if (!category_id || !amount || !date) {
    return { error: 'category_id, amount, and date are required' };
  }
  if (isNaN(amount) || Number(amount) <= 0) {
    return { error: 'Amount must be a positive number' };
  }
  if (isNaN(Date.parse(date))) {
    return { error: 'Date is invalid' };
  }
  if (is_recurring && !VALID_INTERVALS.includes(recurrence_interval)) {
    return { error: "recurrence_interval must be 'weekly' or 'monthly' when is_recurring is true" };
  }

  const category = await pool.query('SELECT id FROM categories WHERE id = $1 AND user_id = $2', [
    category_id,
    userId,
  ]);
  if (category.rows.length === 0) {
    return { error: 'Category not found' };
  }

  return null;
}

router.get('/', async (req, res) => {
  await generateDueRecurringInstances(req.userId);

  const { month, category_id, search, page = 1, limit = 10 } = req.query;
  const { whereClause, params } = buildFilters(req.userId, { month, category_id, search });

  const countResult = await pool.query(`SELECT COUNT(*) FROM expenses e WHERE ${whereClause}`, params);
  const total = parseInt(countResult.rows[0].count, 10);

  const pageNum = Math.max(parseInt(page, 10) || 1, 1);
  const limitNum = Math.max(parseInt(limit, 10) || 10, 1);
  const offset = (pageNum - 1) * limitNum;

  const dataResult = await pool.query(
    `SELECT e.id, e.category_id, c.name AS category_name, e.amount, e.description, e.date,
            e.is_recurring, e.recurrence_interval
     FROM expenses e
     JOIN categories c ON c.id = e.category_id
     WHERE ${whereClause}
     ORDER BY e.date DESC, e.id DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`,
    [...params, limitNum, offset]
  );

  res.json({
    expenses: dataResult.rows,
    total,
    page: pageNum,
    totalPages: Math.max(Math.ceil(total / limitNum), 1),
  });
});

router.get('/export', async (req, res) => {
  const { month, category_id, search } = req.query;
  const { whereClause, params } = buildFilters(req.userId, { month, category_id, search });

  const result = await pool.query(
    `SELECT e.date, c.name AS category_name, e.amount, e.description, e.is_recurring
     FROM expenses e
     JOIN categories c ON c.id = e.category_id
     WHERE ${whereClause}
     ORDER BY e.date DESC, e.id DESC`,
    params
  );

  const csv = toCsv(result.rows, [
    { key: 'date', label: 'Date' },
    { key: 'category_name', label: 'Category' },
    { key: 'amount', label: 'Amount' },
    { key: 'description', label: 'Description' },
    { key: 'is_recurring', label: 'Recurring' },
  ]);

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="expenses.csv"');
  res.send(csv);
});

router.post('/', async (req, res) => {
  const validationError = await validateExpenseInput(req.userId, req.body);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const { category_id, amount, description, date, is_recurring, recurrence_interval } = req.body;

  const result = await pool.query(
    `INSERT INTO expenses (user_id, category_id, amount, description, date, is_recurring, recurrence_interval)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, category_id, amount, description, date, is_recurring, recurrence_interval`,
    [
      req.userId,
      category_id,
      amount,
      description || null,
      date,
      Boolean(is_recurring),
      is_recurring ? recurrence_interval : null,
    ]
  );

  res.status(201).json({ expense: result.rows[0] });
});

router.put('/:id', async (req, res) => {
  const validationError = await validateExpenseInput(req.userId, req.body);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const { category_id, amount, description, date, is_recurring, recurrence_interval } = req.body;

  const result = await pool.query(
    `UPDATE expenses
     SET category_id = $1, amount = $2, description = $3, date = $4,
         is_recurring = $5, recurrence_interval = $6, updated_at = NOW()
     WHERE id = $7 AND user_id = $8
     RETURNING id, category_id, amount, description, date, is_recurring, recurrence_interval`,
    [
      category_id,
      amount,
      description || null,
      date,
      Boolean(is_recurring),
      is_recurring ? recurrence_interval : null,
      req.params.id,
      req.userId,
    ]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  res.json({ expense: result.rows[0] });
});

router.delete('/:id', async (req, res) => {
  const result = await pool.query('DELETE FROM expenses WHERE id = $1 AND user_id = $2 RETURNING id', [
    req.params.id,
    req.userId,
  ]);

  if (result.rows.length === 0) {
    return res.status(404).json({ error: 'Expense not found' });
  }

  res.json({ success: true });
});

module.exports = router;
