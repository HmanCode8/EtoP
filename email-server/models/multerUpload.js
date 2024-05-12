const mongoose = require("mongoose");
const multerUploadSchema = new mongoose.Schema({
  userId: String,
  username: String,
  hash: String,
  fileName: String,
  size: String,
  uploadPath: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MulterUpload = mongoose.model("MulterUpload", multerUploadSchema);

module.exports = MulterUpload;
