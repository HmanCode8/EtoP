const express = require("express");
const router = express.Router();
const Register = require("../models/register");
// 注册接口
router.post("/register", async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const { username, email, password } = req.body;

    // 检查是否存在相同的邮箱或用户名
    const existingUser = await Register.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.error({ message: "邮箱或用户名已存在" });
    }

    // 对密码进行哈希处理
    // const hashedPassword = await bcrypt.hash(password, 10) // 使用哈希算法进行密码加密
    // 创建新用户并存储到数据库中
    const newUser = new Register({ username, email, password });
    await newUser.save();

    res.success(newUser, "注册成功");
  } catch (error) {
    res.error({ message: "注册失败，请稍后重试" });
  }
});

module.exports = router;
