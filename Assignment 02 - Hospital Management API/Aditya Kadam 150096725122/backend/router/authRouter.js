const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/users');
const router = express.Router();


router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'username, email and password are required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = new User({ username, email, password: hash });
    await user.save();

    const out = { id: user._id, username: user.username, email: user.email };
    res.status(201).json(out);
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong. Please try again later.' });
  }
});


router.post('/login', (req, res, next) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(400).json({ message: info && info.message ? info.message : 'Invalid credentials' });


    const out = { id: user._id, username: user.username, email: user.email };
    return res.status(200).json({ message: 'Login successful', user: out });
  })(req, res, next);
});

module.exports = router;
