const express = require("express");
const router = express.Router();
const Register = require("../models/register");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 获取全部用户接口
router.get("/users", verifyTokenMiddleWare, async (req, res) => {
  try {
    // 查询数据库中的所有用户
    const users = await Register.find();
    res.success(
      users.map((u) => ({ email: u.email, username: u.username, _id: u._id }))
    );
  } catch (error) {
    res.error({ message: "获取用户列表失败，请稍后重试" });
  }
});

module.exports = router;
