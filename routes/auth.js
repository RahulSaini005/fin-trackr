const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// ✅ GET: Show Login Page
router.get('/login', (req, res) => {
  const error = req.query.error;
  res.render('login', { error }); // Send error to EJS
});

// ✅ GET: Show Register Page
router.get('/register', (req, res) => {
   const error = req.query.error; 
  res.render('register', { error });
});

// ✅ POST: Register User
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });

  try {
    await user.save();
    req.session.userId = user._id;
    req.session.userName = user.name;
    res.redirect('/dashboard');
  } catch (err) {
    if (err.code === 11000) {
      // Email already exists (Mongo duplicate key error)
      return res.redirect('/auth/register?error=' + encodeURIComponent('Email already registered'));
    }

    // Handle other unknown errors gracefully
    console.error('Registration error:', err);
    return res.redirect('/auth/register?error=' + encodeURIComponent('Something went wrong. Please try again.'));
  }
});


// ✅ POST: Login User
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.redirect('/auth/login?error=' + encodeURIComponent('User not found'));
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.redirect('/auth/login?error=' + encodeURIComponent('Invalid password'));
  }

  req.session.userName = user.name;
  req.session.userId = user._id;
  res.redirect('/dashboard');
});

// ✅ GET: Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/dashboard');
  });
});

module.exports = router;
