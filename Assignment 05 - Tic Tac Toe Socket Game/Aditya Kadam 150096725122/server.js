/**
 * Real-Time Multiplayer Tic Tac Toe Game
 * Server entry point with Socket.io and Supabase
 */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const { handleConnection, game, playerManager } = require('./controllers/gameController');
const { router: apiRoutes, initialize: initializeApiRoutes } = require('./routes/api');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.static('public'));

initializeApiRoutes(game, playerManager);
app.use('/api', apiRoutes);
handleConnection(io);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Tic Tac Toe game server is ready!');
});
