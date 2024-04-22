const express = require("express");
const router = express.Router();
const Register = require("../models/register");
const prefix = "@hehsiheng.com";
// 用户名正则表达式
const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;

// 邮箱正则表达式
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 密码正则表达式
// 包含特殊字符、数字和字母的密码正则表达式（长度6到20个字符）
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W)(?!.*\s).{6,20}$/;

// 注册接口
router.post("/register", async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const { username, password } = req.body;
    const email = username + prefix;
    // 检查用户名和密码是否为空
    if (!username || !password) {
      return res.error({ message: "用户名或密码,邮箱不能为空" });
    }

    // 正则校验用户名
    if (!usernameRegex.test(username)) {
      return res.error({
        message:
          "用户名格式不正确：用户名：包括字母、数字和下划线，长度在4到16个字符之间。",
      });
    }

    // 正则校验密码
    if (passwordRegex.test(password)) {
      return res.error({
        message:
          "密码格式不正确：密码：需要包括数字、字母和特殊字符，长度在6到20个字符之间",
      });
    }

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
