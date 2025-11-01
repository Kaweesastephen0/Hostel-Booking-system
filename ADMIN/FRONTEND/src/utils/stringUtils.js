/**
 * Capitalizes the first letter of a string.
 * @param {string} s The string to capitalize.
 * @returns {string} The capitalized string.
 */
export const capitalize = (s) => {
  return s && s.charAt(0).toUpperCase() + s.slice(1);
};