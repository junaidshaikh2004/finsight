// Mirrors backend/src/utils/currencies.js — the small set of currencies
// Finsight supports for display formatting (no exchange-rate conversion).
export const CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

export function getCurrencySymbol(code) {
  return CURRENCIES.find((c) => c.code === code)?.symbol || '$';
}
