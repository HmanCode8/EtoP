const mongoose = require("mongoose");
const multerUploadSchema = new mongoose.Schema({
  fileName: String,
  originalName: String,
  uploadPath: String,
  status: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const MulterUpload = mongoose.model("MulterUpload", multerUploadSchema);

module.exports = MulterUpload;
