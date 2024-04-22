const express = require("express");
const router = express.Router();
const Register = require("../models/register");
const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants/config");

// 用户名正则表达式
const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;

// 邮箱正则表达式
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 密码正则表达式
// 包含特殊字符、数字和字母的密码正则表达式（长度6到20个字符）
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W)(?!.*\s).{6,20}$/;
router.post("/login", async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const { username, password } = req.body;

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

    // 检查是否存在具有提供的用户名或邮箱的用户
    const existingUser = await Register.findOne({
      $and: [{ username }, { password }],
    });
    if (!existingUser) {
      return res.notFound({ statusCode: 401, message: "用户名或密码不存在" });
    }
    const { username: name, email: em, id, password: paswod } = existingUser;

    // 使用 bcryptjs 模块来验证密码是否匹配
    // if (!password === paswod) {
    //   return res.notFound({ statusCode: 401, message: "密码错误" });
    // }
    // 用户验证成功，生成 Token
    const token = jwt.sign(
      { username: name, email: em, password: paswod, userId: id },
      SECRET_KEY,
      { expiresIn: "1h" }
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
