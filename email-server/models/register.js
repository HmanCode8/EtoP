const mongoose = require('mongoose')

// 定义 message 数据模式
const registerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: String,
  create_time: {
    type: Date,
    default: Date.now
  }
})

// 创建 message 模型
const Register = mongoose.model('register', registerSchema)

module.exports = Register
