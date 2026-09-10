const express = require('express');
const cors = require('cors');

const app = express();

// No `credentials: true` needed here — auth is a Bearer token the client
// attaches itself, not a cookie the browser sends automatically.
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/budgets', require('./routes/budgets'));
app.use('/api/insights', require('./routes/insights'));

// 404 handler for unmatched API routes
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Central error handler — keeps error response shape consistent across all routes
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
