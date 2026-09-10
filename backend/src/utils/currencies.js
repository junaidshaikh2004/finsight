// The handful of currencies Finsight supports for display formatting — not
// real conversion, just which symbol/code a user's amounts are shown in.
const CURRENCIES = {
  USD: { name: 'US Dollar', symbol: '$' },
  EUR: { name: 'Euro', symbol: '€' },
  GBP: { name: 'British Pound', symbol: '£' },
  INR: { name: 'Indian Rupee', symbol: '₹' },
};

const VALID_CURRENCY_CODES = Object.keys(CURRENCIES);

module.exports = { CURRENCIES, VALID_CURRENCY_CODES };
