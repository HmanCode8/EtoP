const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 获取数据表 message 的数据
router.get("/email", verifyTokenMiddleWare, async (req, res) => {
  try {
    const { userId } = req.userInfo; // 获取路由参数中的用户ID
    // 根据用户ID查询数据库中的消息
    const messages = await Message.find({ recipient: userId });
    // 将查询结果发送给客户端
    res.success(messages);
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message });
  }
});

// 发送邮件的接口
router.post("/sendEmail", verifyTokenMiddleWare, async (req, res) => {
  try {
    // 从请求体中获取发送邮件的数据
    // const { sender, subject, recipient, content, contentBlock } = req.body

    // 创建新的 message 对象
    const newMessage = new Message({
      ...req.body,
      status: "pending", // 默认状态为待发送

      timestamp: new Date(),
    });

    // 将新的 message 对象保存到数据库中
    const savedMessage = await newMessage.save();

    // 返回保存的消息给客户端
    res.success(savedMessage);
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message });
  }
});

// 删除邮件的接口
router.post("/deleteEmail", verifyTokenMiddleWare, async (req, res) => {
  try {
    // 从请求体中获取待删除邮件的 ID
    const { userId } = req.userInfo;

    // 根据 ID 查找并删除邮件
    const deletedMessage = await Message.findByIdAndDelete({
      messageId: userId,
    });
    console.log("deletedMessage", deletedMessage);
    // 如果找到并成功删除邮件，则返回删除成功的消息给客户端
    if (deletedMessage) {
      res.json({ message: "邮件删除成功" });
    } else {
      // 如果未找到指定 ID 的邮件，则返回未找到邮件的消息给客户端
      res.status(404).json({ error: "未找到指定邮件" });
    }
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
