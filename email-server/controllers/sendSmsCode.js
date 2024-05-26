const express = require("express");
const router = express.Router();
const SMSClient = require("@alicloud/sms-sdk");
const config = require("../../config");
const { redis, aliyun } = require("../config");
const Redis = require("ioredis");

const redis = new Redis(redis);

router.post("/sendSmsCode", (req, res) => {
  const phone = req.body.phone;
  const type = req.body.type || "sms";
  const code = Math.floor(Math.random() * 900000 + 100000).toString();

  // 存储验证码到 Redis 中，设置过期时间为 5 分钟/300min
  redis.setex(`verification_code:${phone}`, 60, code);
  // LTAI4Fq7X6yv5SHKGQH77zk6
  // N2hZShu9WlAKbzxhHwuFOUro6Lz8oY
  // 阿里云的key：地址：https://ram.console.aliyun.com/manage/ak?spm=5176.20180516001.top-nav.dak.14094babFQpLrx
  if (type === "sms") {
    const smsClient = new SMSClient({
      accessKeyId: aliyun.accessKeyId,
      secretAccessKey: aliyun.accessKeySecret,
    });
    console.log("redis", redis);
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
        res.send({
          code: 200,
          message: "验证码发送成功,注意手机查收",
        });
      })
      .catch((err) => {
        console.log("err", err);
        res.status(500).send({
          code: -1,
          message: "验证码发送失败",
          error: err,
        });
      });
  } else {
    // 发送邮件验证码
  }
});

module.exports = router;
