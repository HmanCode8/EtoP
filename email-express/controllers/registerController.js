const express = require("express");
const router = express.Router();
const Register = require("../models/register");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants/config");
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

// 获取全部用户接口
router.get("/users", async (req, res) => {
  try {
    // 查询数据库中的所有用户
    const users = await Register.find();
    res.success(users);
  } catch (error) {
    res.error({ message: "获取用户列表失败，请稍后重试" });
  }
});

module.exports = router;
// 登录接口

router.post("/login", async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const { username, email, password } = req.body;

    // 检查是否存在具有提供的用户名或邮箱的用户
    const existingUser = await Register.findOne({
      $and: [{ email }, { username }],
    });
    const { username: name, email: em, id, password: paswod } = existingUser;

    if (!existingUser) {
      return res.notFound({ statusCode: 401, message: "用户名或邮箱不存在" });
    }
    // 使用 bcryptjs 模块来验证密码是否匹配
    if (!password === paswod) {
      return res.notFound({ statusCode: 401, message: "密码错误" });
    }
    // 用户验证成功，生成 Token
    const token = jwt.sign(
      { username: name, email: em, password: paswod, userId: id },
      SECRET_KEY
    );
    // res.json({ token });
    // 如果用户名/邮箱和密码都匹配，则返回登录成功消息和用户信息
    const successData = {
      message: "登录成功",
      username: name,
      email: em,
      userId: id,
      token,
    };
    res.success(successData, "登录成功");
  } catch (error) {
    res.error({ statusCode: 500, message: "登录失败，请稍后重试" });
  }
});

// 登出路由
router.post("/logout", (req, res) => {
  // 清除客户端存储的 Token，假设 Token 存储在名为 "jwtToken" 的 Cookie 中
  // res.clearCookie("jwtToken");
  // 后端重定向到前端地址，假设前端地址为 "/login"
  // res.redirect("http://localhost:5173/#/login");
  // 返回登出成功的响应
  res.success({ data: {} }, "登出成功");
});

module.exports = router;
