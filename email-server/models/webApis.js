const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  description: String,
  name: String,
  router: String,
  sum: String,
});

const WebApis = mongoose.model("webApi", uploadSchema);

module.exports = WebApis;
