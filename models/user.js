const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String, 
  email: { type: String, unique: true },
  password: String,
  dataList: [String], // For permanent user data
});

module.exports = mongoose.model('User', userSchema);
