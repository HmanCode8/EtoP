const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  Id: Number,
  description: String,
  name: String,
  router: String,
  sum: Number,
});

const WebApis = mongoose.model("webApi", uploadSchema);

module.exports = WebApis;
