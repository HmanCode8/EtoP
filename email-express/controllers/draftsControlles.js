const express = require("express");
const router = express.Router();
const Drafs = require("../models/message");

// 草稿箱的接口
router.post("/sendDrafts", async (req, res) => {
  try {
    // 从请求体中获取发送邮件的数据
    // const { sender, subject, recipient, content, contentBlock } = req.body

    // 创建新的 message 对象
    const newMessage = new Drafs({
      ...req.body,
      status: "pending", // 默认状态为待发送

      timestamp: new Date(),
    });

    // 将新的 message 对象保存到数据库中
    const savedMessage = await newMessage.save();

    // 返回保存的消息给客户端
    res.json(savedMessage);
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.status(500).json({ error: err.message });
  }
});
