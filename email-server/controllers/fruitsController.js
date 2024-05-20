const express = require('express')
const router = express.Router()
const Fruits = require('../models/fruits')
const verifyTokenMiddleWare = require('../middlewares/verifyTokenMiddleWare')

// 新增水果
router.post('/addFruit', verifyTokenMiddleWare, async (req, res) => {
  try {
    // 从请求体中获取发送邮件的数据
    const { username, userId } = req.userInfo

    // 创建新的 message 对象
    const newMessage = new Fruits({
      ...req.body,
      userId,
      username
    })

    // 将新的 message 对象保存到数据库中
    const savedMessage = await newMessage.save()

    // 返回保存的消息给客户端
    res.success(savedMessage)
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message })
  }
})

// 获取所有水果根据分页
router.get('/getFruits', verifyTokenMiddleWare, async (req, res) => {
  try {
    // 从请求体中获取发送邮件的数据
    const { username, userId } = req.userInfo

    // 从数据库中获取所有水果
    const fruits = await Fruits.find({ userId }).sort({ createdAt: -1 }).skip((req.query.page - 1) * req.query.pageSize).limit(req.query.pageSize);


    
    // 返回所有水果给客户端,统计所有的total
    const total = await Fruits.countDocuments({ userId })

    // 返回所有水果给客户端
    res.success({fruits, total })
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message })
  }
})


// 根据id删除水果post请求
router.post('/deleteFruit', verifyTokenMiddleWare, async (req, res) => {
  try {
    // 从请求体中获取发送邮件的数据
    const { id } = req.body

    // 从数据库中根据id删除水果
    const deletedFruit = await Fruits.findByIdAndDelete(id)

    // 返回删除的水果给客户端
    res.success(deletedFruit)
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message })
  }
})

// 根据id更新水果post请求
router.post('/updateFruit', verifyTokenMiddleWare, async (req, res) => {
  try {
    // 从数据库中根据id更新水果
    const updatedFruit = await Fruits.findByIdAndUpdate({_id:req.body._id}, req.body, { new: true })
    // 返回更新的水果给客户端
    res.success(updatedFruit)
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message })
  }
})

module.exports = router
