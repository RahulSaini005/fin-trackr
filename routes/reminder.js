const express = require('express');
const router = express.Router();
const Reminder = require('../models/reminder');

// GET reminders page
router.get('/', async (req, res) => {
  try {
    let filter = {};
    if (req.session.userId) {
      filter.userId = req.session.userId;  // Show only user's reminders
    } else {
      filter.userId = null;  // Show only anonymous reminders
    }

    const reminders = await Reminder.find(filter).sort({ time: 1 });
    res.render('reminders', { reminders });
  } catch (err) {
    console.error("Error fetching reminders:", err);
    res.status(500).send("Server error");
  }
});

// POST: Create Reminder
router.post('/add', async (req, res) => {
  const { message, time } = req.body;
  const reminder = new Reminder({
    message,
    time,
    userId: req.session.userId || null  // Save userId if logged in
  });
  await reminder.save();
  res.redirect('/reminders');
});

// POST: Update Reminder
router.post('/update/:id', async (req, res) => {
  const { message, time } = req.body;

  const filter = { _id: req.params.id };
  if (req.session.userId) filter.userId = req.session.userId;
  else filter.userId = null;

  await Reminder.findOneAndUpdate(filter, { message, time });
  res.redirect('/reminders');
});

// POST: Delete Reminder
router.post('/delete/:id', async (req, res) => {
  const filter = { _id: req.params.id };
  if (req.session.userId) filter.userId = req.session.userId;
  else filter.userId = null;

  await Reminder.findOneAndDelete(filter);
  res.redirect('/reminders');
});

// GET: Check reminders within 1 minute
router.get('/check', async (req, res) => {
  const now = new Date();
  const oneMinBefore = new Date(now.getTime() - 60000);
  const oneMinAfter = new Date(now.getTime() + 60000);

  let filter = {
    time: { $gte: oneMinBefore, $lte: oneMinAfter }
  };

  if (req.session.userId) {
    filter.userId = req.session.userId;
  } else {
    filter.userId = null;
  }

  try {
    const upcomingReminders = await Reminder.find(filter);
    res.json(upcomingReminders);
  } catch (err) {
    console.error("Error checking reminders:", err);
    res.status(500).json({ error: 'Error fetching reminders' });
  }
});

module.exports = router;
