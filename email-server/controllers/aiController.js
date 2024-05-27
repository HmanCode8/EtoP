const express = require("express");
const router = express.Router();
const axios = require("axios");
const Article = require("../models/avrticle");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

const url =
  "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=24.400ad24729abdff2032afbaeaaf0d6ad.2592000.1719282455.282335-74937161";
router.post("/sendMessageToAi", async (req, res) => {
  const { phone, message } = req.body;
  const result = await axios.post(url, {});
  console.log(result.data);
  res.success(result.data);
});

//保存文章接口
router.post("/saveArticle", verifyTokenMiddleWare, async (req, res) => {
  const { title, content, author, category } = req.body;
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
  const { page, pageSize } = req.query;
  const { userId } = req.userInfo;
  const skip = (page - 1) * pageSize;
  const result = await Article.find()
    .sort({ _id: -1 })
    .skip(skip)
    .limit(pageSize)
    .exec();
  res.success(result);
});
module.exports = router;
