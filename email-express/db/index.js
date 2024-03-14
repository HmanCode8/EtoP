const mongoose = require('mongoose');

// 连接数据库
mongoose.connect('mongodb://127.0.0.1:27017/email', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// 监听连接状态
const db = mongoose.connection;
db.on('error', console.error.bind(console, '数据库连接失败:'));
db.once('open', function() {
  console.log('数据库已连接');
});

module.exports = mongoose;
