const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', require('./routes/auth'));

// Feature routes are mounted here as they're built (categories, expenses, budgets, insights).

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
