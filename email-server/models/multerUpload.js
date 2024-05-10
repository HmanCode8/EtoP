
const mongoose = require('mongoose');

const multerUploadSchema = new mongoose.Schema({
  file: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  encoding: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },  
});

const MulterUpload = mongoose.model('MulterUpload', multerUploadSchema);

module.exports = MulterUpload;