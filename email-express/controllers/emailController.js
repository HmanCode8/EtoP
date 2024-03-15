const express = require('express')
const router = express.Router()
const Message = require('../models/message')

// 获取数据表 message 的数据
router.get('/email', async (req, res) => {
  try {
    const { userid } = req.query // 获取路由参数中的用户ID
    // 根据用户ID查询数据库中的消息
    const messages = await Message.find({ recipient: userid })
    // 将查询结果发送给客户端
    res.json(messages)
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.status(500).json({ error: err.message })
  }
})
// 发送邮件的接口
router.post('/sendEmail', async (req, res) => {
  try {
    // 从请求体中获取发送邮件的数据
    // const { sender, subject, recipient, content, contentBlock } = req.body

    // 创建新的 message 对象
    const newMessage = new Message({
      ...req.body,
      status: 'pending', // 默认状态为待发送

      timestamp: new Date().toISOString(),
    })

    // 将新的 message 对象保存到数据库中
    const savedMessage = await newMessage.save()

    // 返回保存的消息给客户端
    res.json(savedMessage)
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
