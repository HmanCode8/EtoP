const express = require("express");
const router = express.Router();
const Drafs = require("../models/drafts");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 草稿箱的接口
router.post("/saveDrafts", verifyTokenMiddleWare, async (req, res) => {
  try {
    // 从请求体中获取发送邮件的数据
    const { susername, userId } = req.userInfo;

    // 创建新的 message 对象
    const newMessage = new Drafs({
      ...req.body,
      senderName: susername,
      sender: userId,
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

// 获取草稿箱的接口
router.get("/drafts", verifyTokenMiddleWare, async (req, res) => {
  try {
    const { userId } = req.userInfo; // 获取路由参数中的用户ID
    // 根据用户ID查询数据库中的消息
    const messages = await Drafs.find({ recipient: userId });
    // 将查询结果发送给客户端
    res.success(messages);
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message });
  }
});

module.exports = router;
