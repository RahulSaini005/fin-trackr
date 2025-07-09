const express = require('express');
const router = express.Router();
const PDFDocument = require('pdfkit');
const Transaction = require('../models/transaction');
const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Ensure 'downloads' folder exists
const downloadDir = path.join(__dirname, '../downloads');
if (!fs.existsSync(downloadDir)) {
  fs.mkdirSync(downloadDir);
}

// ✅ 1. Render Report Page
router.get('/', (req, res) => {
  res.render('report');
});

// ✅ 2. Fetch Data for Report Table (Scoped to user)
router.get('/data', async (req, res) => {
  const { from, to } = req.query;

  try {
    const transactions = await Transaction.find({
      user: req.session.userId, // 👈 Scoped to logged-in user
      date: {
        $gte: new Date(from),
        $lte: new Date(to)
      }
    }).sort({ date: -1 });

    const totalIncome = transactions
      .filter(txn => txn.type === 'income')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const totalExpense = transactions
      .filter(txn => txn.type === 'expenses')
      .reduce((sum, txn) => sum + txn.amount, 0);

    res.json({
      transactions,
      totalIncome,
      totalExpense
    });

  } catch (err) {
    console.error("Error fetching report data:", err);
    res.status(500).json({ error: "Server Error" });
  }
});

// ✅ 3. Excel Download (Scoped to user)
router.get('/download-excel', async (req, res) => {
  const { from, to } = req.query;

  try {
    const transactions = await Transaction.find({
      user: req.session.userId, // 👈 Only current user data
      date: { $gte: new Date(from), $lte: new Date(to) }
    });

    const filePath = path.join(downloadDir, 'report.csv');

    const csvWriter = createCsvWriter({
      path: filePath,
      header: [
        { id: 'date', title: 'Date' },
        { id: 'title', title: 'Title' },
        { id: 'category', title: 'Category' },
        { id: 'type', title: 'Type' },
        { id: 'amount', title: 'Amount' }
      ]
    });

    await csvWriter.writeRecords(transactions.map(t => ({
      date: new Date(t.date).toLocaleDateString(),
      title: t.title,
      category: t.category,
      type: t.type,
      amount: t.amount
    })));

    res.download(filePath);
  } catch (err) {
    console.error("Error exporting to Excel:", err);
    res.status(500).send("Failed to generate Excel report");
  }
});

// ✅ 4. Line Chart Page (Scoped to user)
router.get('/line', async (req, res) => {
  const { from, to } = req.query;

  let filter = { user: req.session.userId }; // 👈 Filter by user
  if (from && to) {
    filter.date = {
      $gte: new Date(from),
      $lte: new Date(to)
    };
  }

  try {
    const transactions = await Transaction.find(filter).sort('date');
    res.render('report/line-chart', { transactions, from, to });
  } catch (err) {
    console.error("Error rendering line chart:", err);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
