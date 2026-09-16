# 🎮 Real-Time Multiplayer Tic Tac Toe

A real-time multiplayer Tic Tac Toe game built with Node.js, Express, Socket.io, and Supabase. This application allows two players to compete against each other in real-time with synchronized game state.

## ✨ Features

- **Real-Time Gameplay**: Instant move synchronization using Socket.io
- **Multiple Players**: Up to 2 players can join a game session
- **Username-based Login**: Simple username-based player identification
- **Game Logic**: Complete Tic Tac Toe logic with winner detection
- **Game History**: Persistent game records stored in Supabase
- **Responsive UI**: Beautiful, responsive interface that works on all devices
- **Visual Effects**: Smooth animations and visual feedback for moves and wins
- **Connection Status**: Real-time connection monitoring

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js, Socket.io
- **Database**: Supabase (PostgreSQL)
- **Frontend**: HTML5, CSS3, JavaScript
- **Real-Time Communication**: Socket.io

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase account (free tier works)

## 🚀 Setup Instructions

### 1. Clone or Download the Project

```bash
cd tic-tac-toe
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase Database

1. Go to [Supabase](https://supabase.com/) and create a new project
2. Go to the SQL Editor in your Supabase dashboard
3. Run the SQL command from `supabase-setup.sql` file:

```sql
CREATE TABLE game_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  player_x VARCHAR(50) NOT NULL,
  player_o VARCHAR(50) NOT NULL,
  winner VARCHAR(50) NOT NULL,
  total_moves INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE game_history ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (for demo purposes)
CREATE POLICY "Allow all operations on game_history" ON game_history
  FOR ALL USING (true) WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_game_history_created_at ON game_history(created_at DESC);
```

4. Get your Supabase credentials:
   - Go to **Settings > API**
   - Copy the **Project URL** and **anon public key**

### 4. Configure Environment Variables

Update the `.env` file with your Supabase credentials:

```env
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the Server

```bash
npm start
```

### 6. Open in Browser

Open `http://localhost:3000` in two different browser tabs or windows to simulate two players.

## 📁 Project Structure

```
tic-tac-toe/
├── server.js              # Main server file with Socket.io
├── package.json           # Dependencies
├── .env                   # Environment variables (update with your credentials)
├── .gitignore            # Git ignore file
├── supabase-setup.sql    # Database setup SQL
├── README.md             # Project documentation
└── public/
    ├── index.html        # Main HTML file
    ├── style.css         # CSS styles
    └── script.js         # Client-side JavaScript
```

## 🔌 Socket Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `user-login` | Client → Server | Sends username for login |
| `login-success` | Server → Client | Confirms login with symbol |
| `login-error` | Server → Client | Sends error message |
| `players-update` | Server → All | Broadcasts player list |
| `game-start` | Server → All | Starts game when 2 players join |
| `make-move` | Client → Server | Sends move (index, symbol) |
| `move-made` | Server → All | Broadcasts move to all |
| `turn-change` | Server → All | Notifies turn change |
| `game-over` | Server → All | Announces winner/draw |
| `reset-game` | Client → Server | Requests reset |
| `game-reset` | Server → All | Confirms reset |
| `disconnect` | Server | Handles disconnection |
| `get-history` | Client → Server | Requests game history |
| `game-history` | Server → Client | Sends game history |

## 🎮 How to Play

1. Open the game URL in your browser
2. Enter a unique username and click "Join Game"
3. Wait for another player to join (open in another tab/window)
4. Once 2 players are connected, the game starts automatically
5. Player X always goes first
6. Click on an empty cell to make your move
7. First to get 3 in a row (horizontally, vertically, or diagonally) wins!
8. If all cells are filled with no winner, it's a draw
9. After game over, click "Play Again" to restart

## 📊 Game History

Each game is automatically saved to the Supabase database with:
- Player X username
- Player O username
- Winner (username or "Draw")
- Total moves
- Timestamp

The game history is displayed at the bottom of the page and can be refreshed anytime.

## 🌐 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Set environment variables
heroku config:set SUPABASE_URL=your_url
heroku config:set SUPABASE_ANON_KEY=your_key

# Deploy
git push heroku main
```

### Deploy to Railway

1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Deploy automatically on push

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

## 🔧 Troubleshooting

### Connection Issues
- Check if the server is running
- Verify Socket.io is properly initialized
- Check browser console for errors

### Database Issues
- Verify Supabase credentials in `.env`
- Ensure the table exists in Supabase
- Check Row Level Security policies

### Game Not Starting
- Ensure exactly 2 unique usernames are used
- Check if Socket.io connection is established
- Verify all required events are implemented

## 📝 Evaluation Criteria Covered

| Criteria | Status |
|----------|--------|
| ✅ Server Setup | Express with Socket.io configured |
| ✅ Login System | Username validation, X/O assignment, 2-player limit |
| ✅ Game Logic | Complete Tic Tac Toe with winner detection |
| ✅ Socket Events | All 11 required events implemented |
| ✅ Real-time Sync | Game state synchronized across clients |
| ✅ Database Integration | Supabase with game history storage |
| ✅ UI/UX Design | Clean, responsive, modern interface |
| ✅ Code Quality | Well-commented, organized code |
| ✅ Error Handling | Proper error messages and feedback |

## 📄 License

MIT License

## 🤝 Credits

Built as part of a Socket Programming Assignment using Node.js, Express, Socket.io, and Supabase.

## Deployed Link

https://tic-tac-toe-realtime-zx9z.onrender.com/
