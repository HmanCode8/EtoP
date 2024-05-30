const mongoose = require('mongoose')

// 定义 message 数据模式
const registerSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  create_time: {
    type: Date,
    default: Date.now
  }
})

// 创建 message 模型
const Register = mongoose.model('register', registerSchema)

module.exports = Register
