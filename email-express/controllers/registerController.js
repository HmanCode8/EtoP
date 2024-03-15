const express = require('express')
const router = express.Router()
const Register = require('../models/register')
const bcrypt = require('bcryptjs')

// 注册接口
router.post('/register', async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const { username, email, password } = req.body

    // 检查是否存在相同的邮箱或用户名
    const existingUser = await Register.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      return res.status(400).json({ message: '邮箱或用户名已存在' })
    }

    // 对密码进行哈希处理
    const hashedPassword = await bcrypt.hash(password, 10) // 使用哈希算法进行密码加密
    // 创建新用户并存储到数据库中
    const newUser = new Register({ username, email, password: hashedPassword })
    await newUser.save()

    res.status(200).json({ message: '注册成功' })
  } catch (error) {
    console.error('Error during registration:', error)
    res.status(500).json({ message: '注册失败，请稍后重试' })
  }
})

// 获取全部用户接口
router.get('/users', async (req, res) => {
  try {
    // 查询数据库中的所有用户
    const users = await Register.find()
    res.status(200).json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    res.status(500).json({ message: '获取用户列表失败，请稍后重试' })
  }
})

module.exports = router
// 登录接口

router.post('/login', async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const { username, email, password } = req.body

    // 检查是否存在具有提供的用户名或邮箱的用户
    const existingUser = await Register.findOne({ $and: [{ email }, { username }] })
    if (!existingUser) {
      return res.status(400).json({ message: '邮箱或用户名不存在' })
    }
    // 使用 bcryptjs 模块来验证密码是否匹配
    const isPasswordValid = await bcrypt.compare(password, existingUser.password)
    if (!isPasswordValid) {
      return res.status(400).json({ message: '密码不正确' })
    }

    // 如果用户名/邮箱和密码都匹配，则返回登录成功消息和用户信息
    res.status(200).send({ message: '登录成功', existingUser })
  } catch (error) {
    console.error('Error during login:', error)
    res.status(500).json({ message: '登录失败，请稍后重试' })
  }
})

module.exports = router
