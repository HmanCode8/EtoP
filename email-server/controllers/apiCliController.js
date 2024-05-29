const express = require("express");
const router = express.Router();
const Cli = require("../models/cli");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 草稿箱的接口
router.post("/cliApis", verifyTokenMiddleWare, async (req, res) => {
  try {

    const data = new Cli.find();
    res.success(data);
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.error({ error: err.message });
  }
});

module.exports = router;
