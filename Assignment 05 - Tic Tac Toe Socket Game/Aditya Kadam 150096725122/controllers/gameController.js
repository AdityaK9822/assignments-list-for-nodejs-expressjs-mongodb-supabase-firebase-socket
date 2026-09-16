/**
 * Game Controller
 * Handles socket.io game events
 */

const Game = require('../models/Game');
const { PlayerManager } = require('../models/Player');
const GameHistory = require('../models/GameHistory');
const { validateUsername, validateMoveIndex } = require('../utils/gameUtils');

// Initialize game instances
const game = new Game();
const playerManager = new PlayerManager();

/**
 * Handle socket.io connection
 * @param {Object} io - Socket.io server instance
 */
function handleConnection(io) {
  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send current players count on connection
    io.emit('players-update', {
      count: playerManager.getCount(),
      players: playerManager.getPlayersInfo()
    });

    /**
     * Handle user login
     */
    socket.on('user-login', (data) => {
      const { username } = data;

      // Validate username
      const validation = validateUsername(username);
      if (!validation.valid) {
        socket.emit('login-error', { message: validation.message });
        return;
      }

      // Check if username already exists
      if (playerManager.usernameExists(username)) {
        socket.emit('login-error', { message: 'Username already taken!' });
        return;
      }

      // Check if game is full
      if (playerManager.getCount() >= 2) {
        socket.emit('login-error', { message: 'Game is full! Please wait for players to leave.' });
        return;
      }

      // Add player
      const player = playerManager.addPlayer(socket.id, username.trim());
      
      // Join the game room
      socket.join('tic-tac-toe');

      // Send login success to the player
      socket.emit('login-success', {
        username: player.username,
        symbol: player.symbol,
        message: `Welcome ${player.username}! You are player ${player.symbol}`
      });

      // Broadcast updated player list to all
      io.emit('players-update', {
        count: playerManager.getCount(),
        players: playerManager.getPlayersInfo()
      });

      console.log(`${player.username} joined as ${player.symbol}`);

      // Start game when 2 players have joined
      if (playerManager.getCount() === 2) {
        game.gameActive = true;
        io.emit('game-start', {
          message: 'Game started! X plays first.',
          currentPlayer: game.currentPlayer,
          players: playerManager.getPlayersInfo()
        });
      }
    });

    /**
     * Handle player move
     */
    socket.on('make-move', async (data) => {
      const { index, symbol } = data;

      // Validate game is active
      if (!game.gameActive) {
        socket.emit('login-error', { message: 'Game has not started yet!' });
        return;
      }

      // Check if it's the player's turn
      const player = playerManager.findById(socket.id);
      if (!player || player.symbol !== game.currentPlayer) {
        socket.emit('login-error', { message: 'Not your turn!' });
        return;
      }

      // Validate move
      if (!validateMoveIndex(index) || game.board[index] !== null) {
        socket.emit('login-error', { message: 'Invalid move!' });
        return;
      }

      // Make the move
      game.makeMove(index, symbol);

      // Broadcast move to all players
      io.emit('move-made', {
        index: index,
        symbol: symbol,
        board: game.board,
        currentPlayer: game.currentPlayer
      });

      // Check for winner
      const winner = game.checkWinner();
      if (winner) {
        const winnerPlayer = playerManager.getAll().find(p => p.symbol === winner);
        
        io.emit('game-over', {
          winner: winner,
          winnerUsername: winnerPlayer.username,
          message: `${winnerPlayer.username} (${winner}) wins!`
        });

        // Save game history
        await GameHistory.save({
          player_x: playerManager.getAll().find(p => p.symbol === 'X')?.username,
          player_o: playerManager.getAll().find(p => p.symbol === 'O')?.username,
          winner: winnerPlayer.username,
          total_moves: game.totalMoves,
          created_at: new Date().toISOString()
        });

        game.gameActive = false;
        return;
      }

      // Check for draw
      if (game.checkDraw()) {
        io.emit('game-over', {
          winner: null,
          message: "It's a draw!"
        });

        // Save game history
        await GameHistory.save({
          player_x: playerManager.getAll().find(p => p.symbol === 'X')?.username,
          player_o: playerManager.getAll().find(p => p.symbol === 'O')?.username,
          winner: 'Draw',
          total_moves: game.totalMoves,
          created_at: new Date().toISOString()
        });

        game.gameActive = false;
        return;
      }

      // Switch turns
      game.switchPlayer();
      io.emit('turn-change', { currentPlayer: game.currentPlayer });
    });

    /**
     * Handle game reset request
     */
    socket.on('reset-game', () => {
      // Reset game state
      game.reset();
      
      // Clear players
      playerManager.clear();

      // Broadcast reset to all
      io.emit('game-reset', { message: 'Game has been reset. Please login again.' });
    });

    /**
     * Handle request for game history
     */
    socket.on('get-history', async () => {
      const history = await GameHistory.get();
      socket.emit('game-history', history);
    });

    /**
     * Handle disconnection
     */
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);

      // Find and remove the disconnected player
      const disconnectedPlayer = playerManager.removePlayer(socket.id);
      
      if (disconnectedPlayer) {
        console.log(`${disconnectedPlayer.username} left the game`);

        // Broadcast player left
        io.emit('player-left', {
          username: disconnectedPlayer.username,
          message: `${disconnectedPlayer.username} left the game`
        });

        // Update players list
        io.emit('players-update', {
          count: playerManager.getCount(),
          players: playerManager.getPlayersInfo()
        });

        // If game was active, notify other player and reset
        if (game.gameActive || playerManager.getCount() < 2) {
          game.reset();
          io.emit('game-reset', { 
            message: 'Opponent disconnected. Game has been reset.'
          });
        }
      }
    });
  });
}

module.exports = { handleConnection, game, playerManager };
