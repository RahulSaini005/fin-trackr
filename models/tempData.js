const mongoose = require('mongoose');

const tempDataSchema = new mongoose.Schema({
  sessionId: String,
  data: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600  // 1 hour me data expire ho jaayega
  }
});

module.exports = mongoose.model('TempData', tempDataSchema);
