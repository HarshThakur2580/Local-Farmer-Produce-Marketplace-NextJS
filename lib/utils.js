// Utility helper functions for the marketplace
// Add shared utility functions here as the project grows.

/**
 * Formats a price value to a locale currency string.
 * @param {number} price
 * @param {string} currency
 * @returns {string}
 */
export function formatPrice(price, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(price);
}

/**
 * Truncates a string to a maximum length.
 * @param {string} str
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(str, maxLength = 100) {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trimEnd() + '…';
}

