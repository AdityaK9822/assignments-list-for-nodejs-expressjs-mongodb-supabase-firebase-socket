/**
 * Game Model
 * Manages game state and game logic
 */

class Game {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameActive = false;
    this.totalMoves = 0;
  }

  /**
   * Winning combinations
   */
  static get WINNING_COMBINATIONS() {
    return [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]              // Diagonals
    ];
  }

  /**
   * Check if there's a winner
   * @returns {string|null} - Winner symbol or null
   */
  checkWinner() {
    for (const combo of Game.WINNING_COMBINATIONS) {
      const [a, b, c] = combo;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return this.board[a];
      }
    }
    return null;
  }

  /**
   * Check if the game is a draw
   * @returns {boolean} - True if draw
   */
  checkDraw() {
    return this.board.every(cell => cell !== null);
  }

  /**
   * Make a move
   * @param {number} index - Position on board
   * @param {string} symbol - Player symbol (X or O)
   * @returns {boolean} - True if move was valid
   */
  makeMove(index, symbol) {
    if (index < 0 || index > 8 || this.board[index] !== null) {
      return false;
    }
    this.board[index] = symbol;
    this.totalMoves++;
    return true;
  }

  /**
   * Switch to next player
   */
  switchPlayer() {
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
  }

  /**
   * Reset game state
   */
  reset() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameActive = false;
    this.totalMoves = 0;
  }

  /**
   * Get current game state
   * @returns {Object} - Game state object
   */
  getState() {
    return {
      board: this.board,
      currentPlayer: this.currentPlayer,
      gameActive: this.gameActive,
      totalMoves: this.totalMoves
    };
  }
}

module.exports = Game;
