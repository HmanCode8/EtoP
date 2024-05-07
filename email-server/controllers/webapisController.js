const express = require("express");
const router = express.Router();
const WebApi = require("../models/webApis");
const apiData = require("../data/api.json"); // 假设 JSON 数据保存在 api.json 文件中

const WEB_API_URL = "https://api.oioweb.cn/libraries";

// 获取全部用户接口
router.get("/webApis", async (req, res) => {
  try {
    // const result = await fetch("https://api.oioweb.cn/libraries");
    // const data = await result.json();
    //查询数据库中的所有api
    const data = await WebApi.find();
    res.success(data);
  } catch (error) {
    res.error({ message: "获取用户列表失败，请稍后重试" });
  }
});

// 插入全部用户接口
router.post("/insertWebApis", async (req, res) => {
  try {
    // 将 JSON 数据写入数据库
    await WebApi.insertMany(apiData);
    res.success("数据写入成功");
  } catch (error) {
    res.error({ message: "写入数据失败，请稍后重试" });
  }
});
module.exports = router;
