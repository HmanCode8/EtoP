const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  user_id: String,
  filename: String, // 可以根据需要保存文件的信息到数据库
  filepath: String,
});

const Upload = mongoose.model("upload", uploadSchema);

module.exports = Upload;
