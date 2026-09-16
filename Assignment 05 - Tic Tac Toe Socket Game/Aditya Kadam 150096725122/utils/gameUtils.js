/**
 * Game Utility Functions
 * Helper functions for game operations
 */

/**
 * Validate username
 * @param {string} username - Username to validate
 * @returns {Object} - Validation result { valid: boolean, message: string }
 */
function validateUsername(username) {
  if (!username || username.trim() === '') {
    return { valid: false, message: 'Username is required!' };
  }
  return { valid: true, message: '' };
}

/**
 * Validate move index
 * @param {number} index - Move index
 * @returns {boolean} - True if valid
 */
function validateMoveIndex(index) {
  return index >= 0 && index <= 8;
}

module.exports = {
  validateUsername,
  validateMoveIndex
};
