const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  message: { type: String, required: true },
  time: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
   userId: { type: String, default: null }  
});

module.exports = mongoose.model('Reminder', reminderSchema);
