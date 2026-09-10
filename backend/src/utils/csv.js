// Quotes a field only if it needs it (contains a comma, quote, or newline),
// escaping any inner quotes by doubling them — standard CSV rules.
function escapeCsvField(value) {
  const stringValue = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function toCsv(rows, columns) {
  const header = columns.map((col) => escapeCsvField(col.label)).join(',');
  const lines = rows.map((row) => columns.map((col) => escapeCsvField(row[col.key])).join(','));
  return [header, ...lines].join('\n');
}

module.exports = { toCsv };
