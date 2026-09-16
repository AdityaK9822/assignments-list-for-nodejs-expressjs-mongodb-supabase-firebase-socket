/**
 * Tic Tac Toe - Client-Side JavaScript
 * Handles all Socket.io events and game interactions
 */

// Initialize Socket.io connection
const socket = io();

// DOM Elements
const connectionStatus = document.getElementById('connection-status');
const statusIndicator = connectionStatus.querySelector('.status-indicator');
const statusText = connectionStatus.querySelector('.status-text');
const loginSection = document.getElementById('login-section');
const gameSection = document.getElementById('game-section');
const usernameInput = document.getElementById('username');
const loginBtn = document.getElementById('login-btn');
const loginError = document.getElementById('login-error');
const gameBoard = document.getElementById('game-board');
const cells = document.querySelectorAll('.cell');
const turnIndicator = document.getElementById('turn-indicator');
const turnText = turnIndicator.querySelector('.turn-text');
const gameStatus = document.getElementById('game-status');
const statusMessage = document.getElementById('status-message');
const resetBtn = document.getElementById('reset-btn');
const activeCount = document.getElementById('active-count');
const playerXName = document.getElementById('player-x-name');
const playerOName = document.getElementById('player-o-name');
const historyList = document.getElementById('game-history');
const refreshHistory = document.getElementById('refresh-history');
const winnerModal = document.getElementById('winner-modal');
const modalTitle = document.getElementById('modal-title');
const modalMessage = document.getElementById('modal-message');
const modalClose = document.getElementById('modal-close');

// Game State
let currentUser = null;
let mySymbol = null;
let gameActive = false;
let currentBoard = Array(9).fill(null);

/**
 * Update connection status UI
 * @param {string} status - 'connected', 'disconnected', 'connecting'
 */
function updateConnectionStatus(status) {
  statusIndicator.classList.remove('connected', 'disconnected');
  
  if (status === 'connected') {
    statusIndicator.classList.add('connected');
    statusText.textContent = 'Connected';
  } else if (status === 'disconnected') {
    statusIndicator.classList.add('disconnected');
    statusText.textContent = 'Disconnected';
  } else {
    statusText.textContent = 'Connecting...';
  }
}

/**
 * Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  loginError.textContent = message;
  loginError.classList.add('show');
  
  setTimeout(() => {
    loginError.classList.remove('show');
  }, 3000);
}

/**
 * Show login section
 */
function showLoginSection() {
  loginSection.classList.remove('hidden');
  gameSection.classList.add('hidden');
  usernameInput.value = '';
  currentUser = null;
  mySymbol = null;
  gameActive = false;
}

/**
 * Show game section
 */
function showGameSection() {
  loginSection.classList.add('hidden');
  gameSection.classList.remove('hidden');
}

/**
 * Update the game board UI
 * @param {Array} board - Current board state
 */
function updateBoard(board) {
  currentBoard = board;
  cells.forEach((cell, index) => {
    const value = board[index];
    cell.textContent = value || '';
    cell.classList.remove('x', 'o', 'taken', 'winner', 'animate');
    
    if (value) {
      cell.classList.add(value.toLowerCase(), 'taken');
      cell.classList.add('animate');
      setTimeout(() => cell.classList.remove('animate'), 300);
    }
  });
}

/**
 * Update player turn indicator
 * @param {string} currentPlayer - Current player symbol ('X' or 'O')
 */
function updateTurnIndicator(currentPlayer) {
  const isMyTurn = currentPlayer === mySymbol;
  
  turnIndicator.classList.remove('your-turn');
  
  if (gameActive && isMyTurn) {
    turnIndicator.classList.add('your-turn');
    turnText.textContent = `Your turn (${mySymbol})`;
  } else if (gameActive) {
    turnText.textContent = `Opponent's turn (${currentPlayer})`;
  } else {
    turnText.textContent = 'Waiting for opponent...';
  }
}

/**
 * Update game status
 * @param {string} message - Status message
 */
function updateGameStatus(message) {
  statusMessage.textContent = message;
  gameStatus.classList.remove('hidden');
}

/**
 * Show winner modal
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 */
function showWinnerModal(title, message) {
  modalTitle.textContent = title;
  modalMessage.textContent = message;
  winnerModal.classList.remove('hidden');
}

/**
 * Hide winner modal
 */
function hideWinnerModal() {
  winnerModal.classList.add('hidden');
}

/**
 * Update game history UI
 * @param {Array} history - Array of game records
 */
function updateHistoryUI(history) {
  if (!history || history.length === 0) {
    historyList.innerHTML = '<p class="no-data">No games played yet</p>';
    return;
  }
  
  historyList.innerHTML = history.map(game => {
    const date = new Date(game.created_at);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    const isDraw = game.winner === 'Draw';
    
    return `
      <div class="history-item">
        <div>
          <div class="history-players">
            <strong>${game.player_x}</strong> (X) vs <strong>${game.player_o}</strong> (O)
          </div>
          <div class="history-date">${formattedDate}</div>
        </div>
        <div class="${isDraw ? 'history-draw' : 'history-winner'}">
          ${isDraw ? 'Draw' : `🏆 ${game.winner}`}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Highlight winning cells
 * @param {string} winner - Winner symbol
 */
function highlightWinningCells(winner) {
  // All possible winning combinations
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]              // Diagonals
  ];
  
  // Find the winning combination
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
      // Highlight winning cells
      cells[a].classList.add('winner');
      cells[b].classList.add('winner');
      cells[c].classList.add('winner');
      break;
    }
  }
}

// ===================
// Socket Event Handlers
// ===================

/**
 * Connection established
 */
socket.on('connect', () => {
  console.log('Connected to server');
  updateConnectionStatus('connected');
});

/**
 * Connection lost
 */
socket.on('disconnect', () => {
  console.log('Disconnected from server');
  updateConnectionStatus('disconnected');
  showLoginSection();
  showError('Connection lost. Please refresh the page.');
  gameActive = false;
});

/**
 * Connection error
 */
socket.on('connect_error', (error) => {
  console.error('Connection error:', error);
  updateConnectionStatus('connecting');
});

/**
 * Login success
 */
socket.on('login-success', (data) => {
  console.log('Login successful:', data);
  currentUser = data.username;
  mySymbol = data.symbol;
  showGameSection();
  updateGameStatus(data.message);
  
  // Update player name display
  if (mySymbol === 'X') {
    playerXName.textContent = currentUser;
    playerOName.textContent = 'Waiting...';
  } else {
    playerXName.textContent = 'Waiting...';
    playerOName.textContent = currentUser;
  }
});

/**
 * Login error
 */
socket.on('login-error', (data) => {
  console.error('Login error:', data);
  showError(data.message);
  loginBtn.disabled = false;
});

/**
 * Players update
 */
socket.on('players-update', (data) => {
  console.log('Players update:', data);
  activeCount.textContent = data.count;
  
  // Update player names display
  const xPlayer = data.players.find(p => p.symbol === 'X');
  const oPlayer = data.players.find(p => p.symbol === 'O');
  
  playerXName.textContent = xPlayer ? xPlayer.username : 'Waiting...';
  playerOName.textContent = oPlayer ? oPlayer.username : 'Waiting...';
});

/**
 * Game started
 */
socket.on('game-start', (data) => {
  console.log('Game started:', data);
  gameActive = true;
  updateBoard(Array(9).fill(null));
  updateTurnIndicator(data.currentPlayer);
  updateGameStatus('Game started! ' + data.message);
  
  // Add game-active class to game section
  gameSection.classList.add('game-active');
});

/**
 * Move made
 */
socket.on('move-made', (data) => {
  console.log('Move made:', data);
  updateBoard(data.board);
});

/**
 * Turn change
 */
socket.on('turn-change', (data) => {
  console.log('Turn change:', data);
  updateTurnIndicator(data.currentPlayer);
});

/**
 * Game over
 */
socket.on('game-over', (data) => {
  console.log('Game over:', data);
  gameActive = false;
  
  updateBoard([...currentBoard]);
  
  if (data.winner) {
    highlightWinningCells(data.winner);
    showWinnerModal('🏆 Winner!', data.message);
  } else {
    showWinnerModal("It's a Draw!", 'Great game!');
  }
  
  gameSection.classList.remove('game-active');
  
  // Request updated history
  socket.emit('get-history');
});

/**
 * Game reset
 */
socket.on('game-reset', (data) => {
  console.log('Game reset:', data);
  showLoginSection();
  showError(data.message);
  gameActive = false;
  updateBoard(Array(9).fill(null));
  gameSection.classList.remove('game-active');
});

/**
 * Player left
 */
socket.on('player-left', (data) => {
  console.log('Player left:', data);
  updateGameStatus(data.message);
  gameActive = false;
  gameSection.classList.remove('game-active');
});

/**
 * Game history received
 */
socket.on('game-history', (history) => {
  console.log('Game history received:', history);
  updateHistoryUI(history);
});

// ===================
// Event Listeners
// ===================

/**
 * Login button click
 */
loginBtn.addEventListener('click', () => {
  const username = usernameInput.value.trim();
  
  if (!username) {
    showError('Please enter a username');
    return;
  }
  
  if (username.length < 2) {
    showError('Username must be at least 2 characters');
    return;
  }
  
  loginBtn.disabled = true;
  socket.emit('user-login', { username });
});

/**
 * Username input enter key
 */
usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    loginBtn.click();
  }
});

/**
 * Board cell click
 */
cells.forEach((cell) => {
  cell.addEventListener('click', () => {
    const index = parseInt(cell.dataset.index);
    
    // Check if move is valid
    if (!gameActive) {
      showError('Game has not started!');
      return;
    }
    
    if (currentBoard[index] !== null) {
      showError('Cell already taken!');
      return;
    }
    
    // Send move to server
    socket.emit('make-move', { index, symbol: mySymbol });
  });
});

/**
 * Reset button click
 */
resetBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to reset the game? This will disconnect both players.')) {
    socket.emit('reset-game');
  }
});

/**
 * Refresh history button click
 */
refreshHistory.addEventListener('click', () => {
  socket.emit('get-history');
});

/**
 * Modal close button click
 */
modalClose.addEventListener('click', () => {
  hideWinnerModal();
  // Refresh page to restart
  window.location.reload();
});

// ===================
// Initialize
// ===================

// Request game history on load
socket.emit('get-history');

// Focus on username input
usernameInput.focus();
