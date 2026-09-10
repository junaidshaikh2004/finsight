// Validated categorical palette (8 slots, fixed order — never cycled or
// regenerated). Light/dark pairs per slot, CVD-safe for adjacent comparisons.
export const CATEGORICAL_LIGHT = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
];

export const CATEGORICAL_DARK = [
  '#3987e5',
  '#d95926',
  '#199e70',
  '#c98500',
  '#d55181',
  '#008300',
  '#9085e9',
  '#e66767',
];

// Sequential blue ramp, for single-series magnitude (trend chart).
export const SEQUENTIAL_LIGHT = '#2a78d6';
export const SEQUENTIAL_DARK = '#3987e5';

export function getCategoricalColors(theme) {
  return theme === 'dark' ? CATEGORICAL_DARK : CATEGORICAL_LIGHT;
}

export function getSequentialColor(theme) {
  return theme === 'dark' ? SEQUENTIAL_DARK : SEQUENTIAL_LIGHT;
}

// Chart chrome (gridlines, axis text) as resolved hex — matches the
// --border/--muted/--foreground tokens in globals.css. Recharts renders SVG
// text/line attributes directly, so these need to be real hex, not var().
export const CHART_CHROME = {
  light: { grid: '#e2e8f0', muted: '#64748b', foreground: '#0f172a', surfaceHover: '#f1f5f9' },
  dark: { grid: '#26304a', muted: '#94a3b8', foreground: '#f1f5f9', surfaceHover: '#1a2033' },
};

export function getChartChrome(theme) {
  return theme === 'dark' ? CHART_CHROME.dark : CHART_CHROME.light;
}

// Categories past the 7-8 token ceiling fold into "Other" instead of
// generating a 9th hue (a generated hue is indistinguishable under CVD).
export function foldIntoOther(rows, maxSlots = 8) {
  if (rows.length <= maxSlots) return rows;
  const visible = rows.slice(0, maxSlots - 1);
  const rest = rows.slice(maxSlots - 1);
  const otherTotal = rest.reduce((sum, row) => sum + row.total, 0);
  return [...visible, { category: 'Other', total: otherTotal }];
}
