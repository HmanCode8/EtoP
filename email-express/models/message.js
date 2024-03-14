const mongoose = require('mongoose');

// 定义 message 数据模式
const messageSchema = new mongoose.Schema({
recipient:String,
timestamp:String,
content:String,
});

// 创建 message 模型
const Message = mongoose.model('Messages', messageSchema);

module.exports = Message;
