const express = require("express");
const router = express.Router();
const axios = require("axios");

const url =
  "https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions_pro?access_token=24.400ad24729abdff2032afbaeaaf0d6ad.2592000.1719282455.282335-74937161";
router.post("/sendMessageToAi", async (req, res) => {
  const { phone, message } = req.body;
  const result = await axios.post(url, {});
  console.log(result.data);
  res.success(result.data);
});

module.exports = router;
