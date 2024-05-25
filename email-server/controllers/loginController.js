const express = require("express");
const svgCaptcha = require("svg-captcha");
const router = express.Router();
const Register = require("../models/register");
const LoginCount = require("../models/loginCount");
const jwt = require("jsonwebtoken");
const Redis = require("ioredis");
const {
  tokenSecret,
  redis: { host: redisHost, port: redisPort },
} = require("../config");
// 用户名正则表达式
const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;

// 邮箱正则表达式
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Redis 客户端
const redisClient = new Redis({
  host: redisHost,
  port: redisPort,
});

// 验证码验证函数
function verifyCode(req, res, next) {
  // 从请求中获取验证码
  const { code } = req.body;
  const captchaKey = `captcha_${req.sessionID}`;
  // 从 Redis 中获取保存的验证码
  redisClient.get(captchaKey, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (!data) {
      res.status(401).send({
        code: 401,
        message: "验证码已过期",
      });
    } else if (data.toUpperCase() !== code.toUpperCase()) {
      res.status(401).send({
        code: 401,
        message: "验证码不正确",
      });
    } else {
      // 验证通过，调用 next 函数继续执行后续代码
      next();
    }
  });
}

// 密码正则表达式
// 包含特殊字符、数字和字母的密码正则表达式（长度6到20个字符）
const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*\W)(?!.*\s).{6,20}$/;
router.post("/login", verifyCode, async (req, res) => {
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

    // 用户验证成功，生成 Token
    const token = jwt.sign(
      { username: name, email: em, password: paswod, userId: id },
      tokenSecret,
      { expiresIn: "3h" }
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
    //统计登录次数
    const loginCount = await LoginCount.findOne({ username });
    if (loginCount) {
      loginCount.count++;
      await loginCount.save();
    } else {
      const newLoginCount = new LoginCount({ username, count: 1 });
      await newLoginCount.save();
    }
    res.success(successData, "登录成功");
  } catch (error) {
    res.error({ statusCode: 500, message: "登录失败，请稍后重试" });
  }
});

//获取所有人登录次数
router.get("/loginCount", async (req, res) => {
  try {
    const loginCounts = await LoginCount.find();
    res.success(loginCounts, "获取登录次数成功");
  } catch (error) {
    res.error({ statusCode: 500, message: "获取登录次数失败，请稍后重试" });
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

// 图片验证码路由
router.get("/captcha", (req, res) => {
  const captcha = svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: "0oO1iIlL", // 排除相似字符
    noise: 2, // 干扰线数量
    color: true, // 随机颜色
    background: "#f0f0f0", // 背景颜色
  });

  // 将验证码文本存储在Redis中，并设置过期时间（例如5分钟）
  const captchaText = captcha.text;
  const captchaKey = `captcha_${req.sessionID}`;
  redisClient.setex(captchaKey, 60, captchaText);

  // 返回验证码图片
  res.type("svg");
  res.success(captcha.data);
});

module.exports = router;
