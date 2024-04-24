const express = require("express");
const router = express.Router();
const WebApi = require("../models/webApis");

const WEB_API_URL = "https://api.oioweb.cn/libraries";

// 获取全部用户接口
router.get("/webApis", async (req, res) => {
  try {
    // const result = await fetch("https://api.oioweb.cn/libraries");
    // const data = await result.json();
    // console.log("spis", data);
    //查询数据库中的所有api
    const data = await WebApi.find();
    res.success(data);
  } catch (error) {
    res.error({ message: "获取用户列表失败，请稍后重试" });
  }
});

module.exports = router;
