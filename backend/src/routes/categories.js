const express = require('express');
const pool = require('../db/pool');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await pool.query(
    'SELECT id, name, is_default FROM categories WHERE user_id = $1 ORDER BY is_default DESC, name ASC',
    [req.userId]
  );
  res.json({ categories: result.rows });
});

router.post('/', async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: 'Category name is required' });
  }

  const existing = await pool.query(
    'SELECT id FROM categories WHERE user_id = $1 AND name = $2',
    [req.userId, name.trim()]
  );
  if (existing.rows.length > 0) {
    return res.status(409).json({ error: 'You already have a category with this name' });
  }

  const result = await pool.query(
    'INSERT INTO categories (user_id, name, is_default) VALUES ($1, $2, FALSE) RETURNING id, name, is_default',
    [req.userId, name.trim()]
  );
  res.status(201).json({ category: result.rows[0] });
});

module.exports = router;
