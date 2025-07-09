const express = require('express');
const router = express.Router();
const TempData = require('../models/tempData');
const User = require('../models/user');

// Add data
router.post('/add', async (req, res) => {
  const { data } = req.body;

  // Agar login hai
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    if (!user.dataList) user.dataList = [];
    user.dataList.push(data);
    await user.save();
    return res.json({ message: 'Data saved permanently' });
  }

  // Agar login nahi hai
  const temp = new TempData({ sessionId: req.sessionID, data });
  await temp.save();
  res.json({ message: 'Data saved temporarily' });
});

// Get data
router.get('/get', async (req, res) => {
  if (req.session.userId) {
    const user = await User.findById(req.session.userId);
    return res.json({ data: user.dataList || [] });
  }

  const tempData = await TempData.find({ sessionId: req.sessionID });
  res.json({ data: tempData });
});

module.exports = router;
