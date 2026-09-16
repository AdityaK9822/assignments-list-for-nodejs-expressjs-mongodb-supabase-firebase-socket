# 🎮 Assignment 05: Real-Time Multiplayer Tic Tac Toe Game (Socket.io)
> **Track:** Backend & Real-Time Web | **Level:** Intermediate | **Estimated Time:** 6–8 Hours  
> **Tech Stack:** Node.js, Express.js, Socket.io, HTML5/CSS3 (Client UI provided for testing)

---

## 📌 1. Objective & Overview

Build a full-duplex, low-latency **Real-Time Multiplayer Tic-Tac-Toe Game Server** using **Socket.io** and **Express.js**. Students will learn event-driven programming, WebSocket connection lifecycles, real-time room partitioning (`socket.join`), authoritative server-side game logic validation (to prevent cheating), and synchronization of player turns, moves, wins, and disconnections.

### Key Learning Outcomes:
- Understanding WebSocket vs HTTP polling protocols.
- Setting up an HTTP server wrapped with Socket.io (`http.createServer(app)` + `new Server(server)`).
- Managing multi-user rooms and stateful sessions in Node.js memory.
- Designing strict event-driven protocols (`client -> server` and `server -> client/room`).
- Enforcing server-side validation: only the active player can play in an empty cell during their turn.

---

## 🛠️ 2. Tech Stack & Dependencies

```bash
# Initialize project
npm init -y

# Install runtime dependencies
npm install express socket.io cors dotenv

# Install development dependencies
npm install -D nodemon
```

---

## 🎲 3. Game State Machine & Data Models

In-memory room registry structure:
```javascript
const rooms = {
  "ROOM_ABC12": {
    roomId: "ROOM_ABC12",
    board: ["", "", "", "", "", "", "", "", ""], // 9 cells (0-8)
    players: {
      "socket_id_1": { username: "Alice", symbol: "X" },
      "socket_id_2": { username: "Bob", symbol: "O" }
    },
    turn: "socket_id_1", // Whose turn it is
    status: "in_progress", // "waiting", "in_progress", "won", "draw"
    winner: null
  }
};
```

---

## 📡 4. Real-Time Socket Event Protocol

### 🔄 Connection & Room Events

| Event Name | Direction | Payload Schema | Description |
|---|:---:|---|---|
| `room:create` | `Client -> Server` | `{ "username": "Alice" }` | Host creates a new room, receives a unique `roomId` |
| `room:created` | `Server -> Client` | `{ "roomId": "X9Y2Z", "symbol": "X" }` | Emitted to room creator with room code & assigned symbol |
| `room:join` | `Client -> Server` | `{ "roomId": "X9Y2Z", "username": "Bob" }` | Second player joins room with room code |
| `game:start` | `Server -> Room` | `{ "players": [...], "turn": "socket_id", "board": [...] }` | Broadcasted when 2 players are present; game begins |
| `room:error` | `Server -> Client` | `{ "message": "Room full or does not exist" }` | Error message sent to invalid join requests |

### 🕹️ Gameplay & Action Events

| Event Name | Direction | Payload Schema | Description |
|---|:---:|---|---|
| `game:move` | `Client -> Server` | `{ "roomId": "X9Y2Z", "cellIndex": 4 }` | Player attempts to place their mark at board index (0–8) |
| `game:update` | `Server -> Room` | `{ "board": [...], "currentTurn": "socket_id", "lastMove": { "index": 4, "symbol": "X" } }` | Broadcasted to room if move is legal |
| `game:over` | `Server -> Room` | `{ "result": "win"|"draw", "winner": "Alice", "winningLine": [0,1,2] }` | Emitted when 3-in-a-row or tie is detected |
| `game:rematch_request` | `Client -> Server` | `{ "roomId": "X9Y2Z" }` | Player requests a new game round |
| `game:reset` | `Server -> Room` | `{ "board": ["",...], "turn": "socket_id" }` | Board reset for new match round |
| `player:left` | `Server -> Room` | `{ "message": "Opponent disconnected. You win by forfeit." }` | Emitted when a player leaves/disconnects |

---

## 🧠 5. Authoritative Server-Side Win Logic

The server MUST independently check for wins after every valid move:
```javascript
const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

function checkWinner(board) {
  for (const combo of WINNING_COMBINATIONS) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winnerSymbol: board[a], winningLine: combo };
    }
  }
  if (board.every(cell => cell !== "")) {
    return { winnerSymbol: null, isDraw: true };
  }
  return null;
}
```

---

## 🏗️ 6. Architecture & File Structure

```text
assignment-05-tic-tac-toe/
├── public/
│   ├── index.html           # Interactive game frontend for testing
│   ├── style.css            # Modern glassmorphism UI styles
│   └── script.js            # Socket.io client handlers
├── sockets/
│   ├── gameHandler.js       # Game move validation & state logic
│   └── roomHandler.js       # Room creation, joining & disconnection logic
├── utils/
│   └── gameLogic.js         # Win & tie detection algorithms
├── server.js                # Express & Socket.io server bootstrap
├── package.json
└── README.md
```

---

## 🧪 7. Testing Your Socket Server

1. Run `npm run dev` to start the server at `http://localhost:5000`.
2. Open two separate browser tabs (or an incognito window) at `http://localhost:5000`.
3. In Tab 1: Enter username "Alice" and click **Create Room**. Copy the generated Room Code.
4. In Tab 2: Enter username "Bob", paste the Room Code, and click **Join Room**.
5. Play moves sequentially: verify that Tab 1 cannot click during Tab 2's turn, and test winning horizontal, vertical, and diagonal lines.
6. Disconnect Tab 2: verify Tab 1 receives a victory by forfeit notification.

---

## 📊 8. Grading Rubric (100 Marks)

| Evaluation Component | Marks |
|---|:---:|
| **Socket.io Connection & Room Management** (Create room, join code, player pairing) | 25 |
| **Authoritative Turn & Move Validation** (Anti-cheat, out-of-turn check, cell check) | 25 |
| **Win, Loss & Draw Calculation Logic** (Server-side 8-combination check) | 20 |
| **Disconnection & Rematch Handling** (Auto-forfeit, rematch negotiation) | 15 |
| **Code Structure, Cleanliness & Interactive Testing Client** | 15 |
| **Total Marks** | **100** |

---

## 📤 9. Submission Guidelines

- Push your full source code to GitHub: `itm-assignment-05-tictactoe-socket`.
- Include a 1-minute screen recording demonstrating a two-player live game and disconnect handling.
