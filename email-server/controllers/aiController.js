const express = require("express");
const router = express.Router();
const Article = require("../models/avrticle");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");
// const WebSocket = require('ws')
// const moment = require('moment')
// const crypto = require('crypto')
// const host = 'spark-api.xf-yun.com/'

// const apiKey = '18cfb88ba62c8fa308569221f1e2de6f'
// const apiSecret = 'ZGJkZWYxMGUyYjQ3YmE1Zjk2NWRlN2Rh'

// function formatRfc1123DateTime() {
//   const currentDateTime = moment.utc() // 获取当前 UTC 时间
//   const rfc1123DateTime = currentDateTime.format('ddd, DD MMM YYYY HH:mm:ss [GMT]') // 格式化为 RFC 1123 格式
//   return rfc1123DateTime
// }

// let tmp = host + '\n'
// tmp += 'date: ' + formatRfc1123DateTime() + '\n'
// tmp += 'GET ' + '/v3.5/chat' + ' HTTP/1.1'
// 使用HMAC-SHA256计算签名
// function calculateHmacSha256(secret, data) {
//   const hmac = crypto.createHmac('sha256', secret)
//   hmac.update(data)
//   return hmac.digest('hex') // 返回hex格式的签名
// }

// // 计算签名
// const tmp_sha = calculateHmacSha256(apiSecret, tmp)
// // 计算签名并进行Base64编码
// function base64Encode(data) {
//   return Buffer.from(data).toString('base64')
// }

// // Base64编码
// const signature = base64Encode(tmp_sha)

// // 拼接authorization_origin字符串
// const authorization_origin = `api_key='${apiKey}', algorithm='hmac-sha256', headers='host date request-line', signature='${signature}'`

// // 进行Base64编码
// authorization =  Buffer.from(authorization_origin).toString('base64')

// const params = new URLSearchParams();
// params.append('authorization', authorization); // 假设authorization是之前生成的
// params.append('date', formatRfc1123DateTime()); // 假设date是之前生成的
// params.append('host', 'spark-api.xf-yun.com'); // 通常host不会作为查询参数传递，但这里假设需要

// const url = 'wss://spark-api.xf-yun.com/v3.5/chat?authorization=YXBpX2tleT0iMThjZmI4OGJhNjJjOGZhMzA4NTY5MjIxZjFlMmRlNmYiLCBhbGdvcml0aG09ImhtYWMtc2hhMjU2IiwgaGVhZGVycz0iaG9zdCBkYXRlIHJlcXVlc3QtbGluZSIsIHNpZ25hdHVyZT0iQkZNNHVMTUk1MXVpdmQ0d1M1K1ZsTnVXZWJOVnc4ZDUzQk1aNFVTcEUwcz0i&date=Tue%2C%2028%20May%202024%2003%3A35%3A57%20%2B0000&host=spark-api.xf-yun.com'

router.post("/sendMessageToAi", async (req, res) => {
  const { appId, message } = req.body;
  res.success({ url: url });
});

//保存文章接口
router.post("/saveArticle", verifyTokenMiddleWare, async (req, res) => {
  const { userId, userName } = req.userInfo;
  const article = new Article({
    ...req.body,
    author: userName,
  });
  await article.save();
  res.success(article);
});

//获取文章列表接口
router.get("/getArticleList", verifyTokenMiddleWare, async (req, res) => {
  const result = await Article.find();
  res.success(result);
});
module.exports = router;
