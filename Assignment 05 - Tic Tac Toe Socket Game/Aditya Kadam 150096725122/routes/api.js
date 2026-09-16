/**
 * API Routes
 * REST API endpoints
 */

const express = require('express');
const router = express.Router();
const GameHistory = require('../models/GameHistory');
const Game = require('../models/Game');
const { PlayerManager } = require('../models/Player');

// Import shared instances (these would typically be passed via dependency injection)
let game, playerManager;

/**
 * Initialize route with game instances
 * @param {Game} gameInstance - Game instance
 * @param {PlayerManager} playerManagerInstance - PlayerManager instance
 */
function initialize(gameInstance, playerManagerInstance) {
  game = gameInstance;
  playerManager = playerManagerInstance;
}

/**
 * GET /api/status
 * Check server status
 */
router.get('/status', (req, res) => {
  res.json({
    status: 'running',
    players: playerManager ? playerManager.getCount() : 0,
    gameActive: game ? game.gameActive : false
  });
});

/**
 * GET /api/history
 * Get game history
 */
router.get('/history', async (req, res) => {
  try {
    const history = await GameHistory.get(20);
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch game history' });
  }
});

module.exports = { router, initialize };
