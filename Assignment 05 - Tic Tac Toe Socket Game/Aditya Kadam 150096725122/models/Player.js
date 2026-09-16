/**
 * Player Model
 * Manages player data and operations
 */

class Player {
  constructor(id, username, symbol) {
    this.id = id;
    this.username = username;
    this.symbol = symbol;
  }

  /**
   * Get player info
   * @returns {Object} - Player information
   */
  getInfo() {
    return {
      id: this.id,
      username: this.username,
      symbol: this.symbol
    };
  }
}

/**
 * PlayerManager class to manage multiple players
 */
class PlayerManager {
  constructor() {
    this.players = [];
  }

  /**
   * Add a new player
   * @param {string} id - Socket ID
   * @param {string} username - Player username
   * @returns {Player|null} - Created player or null if failed
   */
  addPlayer(id, username) {
    if (this.players.length >= 2) {
      return null;
    }

    const symbol = this.players.length === 0 ? 'X' : 'O';
    const player = new Player(id, username, symbol);
    this.players.push(player);
    return player;
  }

  /**
   * Remove a player by ID
   * @param {string} id - Socket ID
   * @returns {Player|null} - Removed player or null if not found
   */
  removePlayer(id) {
    const index = this.players.findIndex(p => p.id === id);
    if (index !== -1) {
      return this.players.splice(index, 1)[0];
    }
    return null;
  }

  /**
   * Find player by ID
   * @param {string} id - Socket ID
   * @returns {Player|undefined} - Player or undefined
   */
  findById(id) {
    return this.players.find(p => p.id === id);
  }

  /**
   * Find player by username
   * @param {string} username - Player username
   * @returns {Player|undefined} - Player or undefined
   */
  findByUsername(username) {
    return this.players.find(p => p.username.toLowerCase() === username.toLowerCase());
  }

  /**
   * Check if username exists
   * @param {string} username - Username to check
   * @returns {boolean} - True if exists
   */
  usernameExists(username) {
    return this.players.some(p => p.username.toLowerCase() === username.toLowerCase());
  }

  /**
   * Get player count
   * @returns {number} - Number of players
   */
  getCount() {
    return this.players.length;
  }

  /**
   * Get all players
   * @returns {Array} - Array of players
   */
  getAll() {
    return this.players;
  }

  /**
   * Get players info (without sensitive data)
   * @returns {Array} - Array of player info objects
   */
  getPlayersInfo() {
    return this.players.map(p => ({ username: p.username, symbol: p.symbol }));
  }

  /**
   * Clear all players
   */
  clear() {
    this.players = [];
  }
}

module.exports = { Player, PlayerManager };
