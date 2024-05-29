const express = require("express");
const svgCaptcha = require("svg-captcha");
const router = express.Router();
const Register = require("../models/register");
const LoginCount = require("../models/loginCount");
const jwt = require("jsonwebtoken");
const SMSClient = require("@alicloud/sms-sdk");
const Redis = require("ioredis");
const { tokenSecret, redis, aliyun } = require("../config");
// 用户名正则表达式
const usernameRegex = /^[a-zA-Z0-9_]{4,16}$/;

// 邮箱正则表达式
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// 手机号正则表达式
const phoneRegex = /^1[3-9]\d{9}$/;
// Redis 客户端
const redisClient = new Redis(redis);

// 验证码验证函数
function verifyCode(req, res, next) {
  // 从请求中获取验证码
  const { code = "", codeType = "captcha", phone = "" } = req.body;

  if (codeType === "sms" && phone === "") {
    return res.error({ message: "手机号不能为空" });
  }
  if (codeType === "sms" && phoneRegex.test(phone) === false) {
    return res.error({ message: "手机号格式不正确" });
  }
  if (code === "") {
    return res.error({ message: "验证码不能为空" });
  }
  const key =
    codeType === "captcha"
      ? `captcha_${req.sessionID}`
      : `verification_code:${phone}`;
  // const captchaKey = `captcha_${req.sessionID}`;
  // 从 Redis 中获取保存的验证码
  redisClient.get(key, (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
    } else if (!data) {
      res.status(401).send({
        code: 401,
        message: "验证码错误或已过期",
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

router.post("/login", verifyCode, async (req, res) => {
  try {
    // 从请求体中获取用户提供的信息
    const {
      username = "",
      password = "",
      phone = "",
      codeType = "captcha",
    } = req.body;
    let dataBaseConfig = {};
    if (codeType === "sms") {
      dataBaseConfig = {
        $and: [{ phone }],
      };
    } else {
      // 检查用户名和密码是否为空
      if (!username || !password) {
        return res.error({ message: "用户名或密码,邮箱不能为空" });
      }

      dataBaseConfig = {
        $and: [{ username }, { password }],
      };
    }

    // 检查是否存在具有提供的用户名或邮箱的用户
    const existingUser = await Register.findOne(dataBaseConfig);
    if (!existingUser) {
      if (codeType === "sms") {
        return res.error({ message: "手机号还没绑定" });
      }
      const message = "用户名或密码错误";
      return res.error({ statusCode: 401, message });
    }
    const {
      username: name = "",
      email: em = "",
      id = "",
      password: paswod = "",
      phone: ph = "",
    } = existingUser;

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
      isPhone: !(ph === ""),
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
    res.error({ statusCode: 500, message: error + "登录失败，请稍后重试" });
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

// 手机验证码
router.post("/sendSmsCode", (req, res) => {
  const { phone, codeType = "sms" } = req.body;

  if (phoneRegex.test(phone) === false) {
    return res.error({ message: "手机号格式不正确" });
  }
  const code = Math.floor(Math.random() * 900000 + 100000).toString();

  // 存储验证码到 Redis 中，设置过期时间为 5 分钟/300min
  redisClient.setex(`verification_code:${phone}`, 600, code);
  // LTAI4Fq7X6yv5SHKGQH77zk6
  // N2hZShu9WlAKbzxhHwuFOUro6Lz8oY
  // 阿里云的key：地址：https://ram.console.aliyun.com/manage/ak?spm=5176.20180516001.top-nav.dak.14094babFQpLrx
  if (codeType === "sms") {
    const smsClient = new SMSClient({
      accessKeyId: aliyun.accessKeyId,
      secretAccessKey: aliyun.accessKeySecret,
    });
    const params = {
      RegionId: aliyun.regionId,
      PhoneNumbers: phone,
      SignName: aliyun.signName,
      TemplateCode: aliyun.templateCode,
      TemplateParam: JSON.stringify({
        code,
      }),
    };
    smsClient
      .sendSMS(params)
      .then(() => {
        res.success({
          code: 200,
          message: "验证码发送成功,注意手机查收",
        });
      })
      .catch((err) => {
        res.error({
          message: err + "验证码发送失败",
        });
      });
  } else {
    // 发送邮件验证码
  }
});

// 更新用户信息，绑定手机号
router.post("/addPhone", verifyCode, async (req, res) => {
  try {
    let { username, phone, userId } = req.body;
    // 检查用户名和密码是否为空
    if (!phone) {
      return res.error({ message: "用户名或手机号不能为空" });
    }
    // 检查是否存在相同的用户名
    // const existingUser = await Register.findOne({ username })
    // if (existingUser && existingUser._id.toString()!== req.user._id.toString()) {
    //   return res.error({ message: '用户名已存在' })
    // }

    if (userId === "") {
      const existingUser = await Register.findOne({
        $and: [{ username }],
      });
      console.log(existingUser);
      userId = existingUser._id.toString();
    }
    // 更新用户信息
    const updatedUser = await Register.findByIdAndUpdate(
      userId,
      { $set: { phone } },
      { new: true }
    );
    res.success(updatedUser, "更新成功");
  } catch (error) {
    res.error({ message: error + "更新失败，请稍后重试" });
  }
});

module.exports = router;
