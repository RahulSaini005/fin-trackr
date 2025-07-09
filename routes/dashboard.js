const express = require('express');
const Transaction = require('../models/transaction');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.session.userId }).sort({ date: -1 });

    const userName = req.session.userName || "User";

    res.render('dashboard', {
      userName,
      transactions  // ✅ Pass to EJS
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;
