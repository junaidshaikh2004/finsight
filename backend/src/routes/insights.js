const express = require('express');
const pool = require('../db/pool');
const requireAuth = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth);

const MONTH_REGEX = /^\d{4}-\d{2}$/;

function buildPrompt(month, categoryTotals, totalSpent) {
  const lines = categoryTotals
    .map((row) => `- ${row.category}: $${row.total}`)
    .join('\n');

  return `You are a personal finance assistant. Here is a user's spending for ${month}, broken down by category (total spent: $${totalSpent}):

${lines}

Write 3 to 5 sentences describing their spending patterns this month, then one clear, actionable suggestion for saving money. Do not invent specific transactions or merchants you weren't given — work only from the category totals above. Keep the tone friendly and direct.`;
}

router.post('/', async (req, res) => {
  const { month } = req.body;
  if (!month || !MONTH_REGEX.test(month)) {
    return res.status(400).json({ error: "A month in 'YYYY-MM' format is required" });
  }

  // Only aggregate totals ever leave the server — never raw expense rows.
  const result = await pool.query(
    `SELECT c.name AS category, SUM(e.amount) AS total
     FROM expenses e
     JOIN categories c ON c.id = e.category_id
     WHERE e.user_id = $1 AND TO_CHAR(e.date, 'YYYY-MM') = $2
     GROUP BY c.name
     ORDER BY total DESC`,
    [req.userId, month]
  );

  if (result.rows.length === 0) {
    return res.json({ insights: `No expenses recorded for ${month} yet, so there's nothing to analyze.`, categoryTotals: [] });
  }

  const categoryTotals = result.rows.map((row) => ({ category: row.category, total: Number(row.total) }));
  const totalSpent = categoryTotals.reduce((sum, row) => sum + row.total, 0);

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${process.env.GEMINI_MODEL}:generateContent?key=${process.env.GEMINI_API_KEY}`;

  const geminiResponse = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: buildPrompt(month, categoryTotals, totalSpent) }] }],
    }),
  });

  if (!geminiResponse.ok) {
    const errorBody = await geminiResponse.text();
    console.error('Gemini API error:', geminiResponse.status, errorBody);
    return res.status(502).json({ error: 'Failed to generate insights right now. Please try again.' });
  }

  const geminiData = await geminiResponse.json();
  const insightsText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!insightsText) {
    console.error('Unexpected Gemini response shape:', JSON.stringify(geminiData));
    return res.status(502).json({ error: 'Failed to generate insights right now. Please try again.' });
  }

  res.json({ insights: insightsText.trim(), categoryTotals });
});

module.exports = router;
