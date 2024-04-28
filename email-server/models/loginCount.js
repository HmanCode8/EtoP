const mongoose = require("mongoose");

const loginCountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  count: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});

const loginCountModel = mongoose.model("loginCount", loginCountSchema);

module.exports = loginCountModel;
