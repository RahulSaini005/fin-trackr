const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');

// GET route to render categories page with chart data
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ type: 'expenses' , user: req.session.userId});

    const categoryMap = {};

    for (let txn of transactions) {
      const cat = txn.category;
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += txn.amount;
    }

    const chartData = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));
console.log("Chart Data:", chartData);
   res.render('categories', { chartData: JSON.stringify(chartData) });


  } catch (err) {
    console.log("Category Error:", err);
    res.status(500).send("Error loading categories");
  }
});



// ✅ NEW: API route to get category data within date range
router.get('/data', async (req, res) => {
  const { from, to } = req.query;

  try {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    toDate.setHours(23, 59, 59, 999); // include end of the day

    const transactions = await Transaction.find({
      type: 'expenses',
        user: req.session.userId,
      date: { $gte: fromDate, $lte: toDate }
    });

    const categoryMap = {};

    for (let txn of transactions) {
      const cat = txn.category;
      if (!categoryMap[cat]) categoryMap[cat] = 0;
      categoryMap[cat] += txn.amount;
    }

    const chartData = Object.entries(categoryMap).map(([category, amount]) => ({
      category,
      amount,
    }));

    res.json(chartData); // ✅ Return filtered data as JSON
  } catch (err) {
    console.error("Error in /categories/data:", err);
    res.status(500).json({ error: "Failed to filter data" });
  }
});



module.exports = router;
