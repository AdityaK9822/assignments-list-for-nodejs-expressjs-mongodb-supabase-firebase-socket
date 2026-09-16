const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const apiRoutes = require('./routes/api.routes');

dotenv.config();

connectDB();

const app = express();

app.use(express.json());

app.use('/api', apiRoutes);

module.exports = app;
