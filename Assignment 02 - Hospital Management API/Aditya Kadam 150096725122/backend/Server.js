const express = require('express');
let cors;
try {
    cors = require('cors');
} catch (e) {
    cors = null;
    console.warn('Optional dependency `cors` is not installed. CORS middleware will be skipped.');
}
const db = require('./config/db');
const hospitalRouter = require('./router/hospitalRouter');
const passport = require('passport');
const configurePassport = require('./config/passport');
const authRouter = require('./router/authRouter');

const app = express();

if (cors) app.use(cors());
app.use(express.json());


configurePassport(passport);
app.use(passport.initialize());


app.use('/', authRouter);
app.use('/', hospitalRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});