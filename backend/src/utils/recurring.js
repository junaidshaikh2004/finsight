const pool = require('../db/pool');

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

// expenses.date comes back from pg as a plain 'YYYY-MM-DD' string (see
// db/pool.js). All the math below uses Date.UTC so it's not affected by the
// server's local timezone — a date string always means the same calendar day.
function parseDateOnly(dateString) {
  const [year, month, day] = dateString.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
}

function toDateOnlyString(ms) {
  const d = new Date(ms);
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Buckets a date into a "period" — the same month, or the same rolling
// 7-day window since the epoch. Two dates with the same period key belong
// to the same billing period for that recurrence interval.
function periodKey(ms, interval) {
  const d = new Date(ms);
  if (interval === 'monthly') {
    return d.getUTCFullYear() * 12 + d.getUTCMonth();
  }
  return Math.floor(ms / MS_PER_WEEK);
}

// Given the original occurrence's date, returns the date that same
// recurring expense should fall on in `nowMs`'s period.
function nextOccurrenceMs(originalMs, nowMs, interval) {
  if (interval === 'monthly') {
    const original = new Date(originalMs);
    const now = new Date(nowMs);
    const targetIndex = now.getUTCFullYear() * 12 + now.getUTCMonth();
    const year = Math.floor(targetIndex / 12);
    const month = targetIndex % 12;
    const lastDayOfTargetMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const day = Math.min(original.getUTCDate(), lastDayOfTargetMonth);
    return Date.UTC(year, month, day);
  }
  const periodsElapsed = periodKey(nowMs, interval) - periodKey(originalMs, interval);
  return originalMs + periodsElapsed * MS_PER_WEEK;
}

// Called whenever a user's expense list is loaded. Instead of a cron job,
// we lazily "catch up" recurring expenses: for each recurring series, if no
// instance exists yet for the current period, clone the latest instance
// forward to today's period.
async function generateDueRecurringInstances(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM expenses WHERE user_id = $1 AND is_recurring = TRUE ORDER BY date DESC, id DESC`,
    [userId]
  );

  const nowMs = parseDateOnly(toDateOnlyString(Date.now()));
  const seenSeries = new Set();

  for (const expense of rows) {
    // A "series" is identified by what makes a recurring charge recognizable
    // as the same expense recurring (category + description + amount + interval).
    // Rows are sorted newest-first, so the first row we see per series is the latest instance.
    const seriesKey = `${expense.category_id}|${expense.description}|${expense.amount}|${expense.recurrence_interval}`;
    if (seenSeries.has(seriesKey)) continue;
    seenSeries.add(seriesKey);

    const latestMs = parseDateOnly(expense.date);
    const alreadyDueThisPeriod = periodKey(latestMs, expense.recurrence_interval) === periodKey(nowMs, expense.recurrence_interval);
    if (alreadyDueThisPeriod) continue;

    const newDateString = toDateOnlyString(nextOccurrenceMs(latestMs, nowMs, expense.recurrence_interval));
    await pool.query(
      `INSERT INTO expenses (user_id, category_id, amount, description, date, is_recurring, recurrence_interval)
       VALUES ($1, $2, $3, $4, $5, TRUE, $6)`,
      [userId, expense.category_id, expense.amount, expense.description, newDateString, expense.recurrence_interval]
    );
  }
}

module.exports = { generateDueRecurringInstances };
