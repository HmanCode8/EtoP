const express = require('express')
const router = express.Router()
const Register = require('../models/register')
const prefix = '@hsh.com'
// 用户名正则表达式
const usernameRegex = /^(?=.*[a-z])(?=.*[A-Z]).{4,10}$/

// 密码正则表达式
// 包含特殊字符、数字和字母的密码正则表达式（长度6到20个字符）

// 注册接口
router.post('/register', async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const { username, password, phone = '' } = req.body
    const email = username + prefix
    // 检查用户名和密码是否为空
    if (!username || !password) {
      return res.error({ message: '用户名或密码,邮箱不能为空' })
    }

    // 正则校验用户名
    if (!usernameRegex.test(username)) {
      return res.error({
        message: '用户名格式不正确：用户名：包括大小写字母、数字，长度在4到10个字符之间。',
      })
    }
    // 检查是否存在相同的邮箱或用户名
    const existingUser = await Register.findOne({
      $or: [{ email }, { username }],
    })
    if (existingUser) {
      return res.error({ message: '邮箱或用户名已存在' })
    }

    // 对密码进行哈希处理
    // const hashedPassword = await bcrypt.hash(password, 10) // 使用哈希算法进行密码加密
    // 创建新用户并存储到数据库中
    const newUser = new Register({ username, email, password, phone })
    await newUser.save()

    res.success(newUser, '注册成功')
  } catch (error) {
    res.error({ message: '注册失败，请稍后重试' })
  }
})


module.exports = router
