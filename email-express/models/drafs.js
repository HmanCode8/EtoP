const mongoose = require("mongoose");

// 定义 message 数据模式
const drafsSchema = new mongoose.Schema({
  // 发送者
  senderName: String,
  // 发送者id
  sender: String,
  // 主题
  subject: String,
  // 状态
  status: String,
  // 收件人
  recipientName: String,
  // 收件人id
  recipient: String,
  // 时间戳
  timestamp: String,
  // 内容
  content: String,
  // 内容块
  contentBlock: String,
});

// 创建 message 模型
const Drafs = mongoose.model("drafs", drafsSchema);

module.exports = Drafs;
