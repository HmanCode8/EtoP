const mongoose = require("mongoose");

const avatarSchema = new mongoose.Schema({
  data: Buffer,
  contentType: String,
  user_id: String,
  filename: String, // 可以根据需要保存文件的信息到数据库
  filepath: String,
});

const Avatar = mongoose.model("avatar", avatarSchema);

module.exports = Avatar;
