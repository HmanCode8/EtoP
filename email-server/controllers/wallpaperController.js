const express = require("express");
const router = express.Router();
// const Wallpaper = require("../models/wallpaper");
const apiData = require("../data/cate.json"); // 假设 JSON 数据保存在 api.json 文件中
const WallpaperCate = require("../models/wallpaperCate");
const _ = require("lodash");
// 将原先的
// const fetch = require("node-fetch");
// 修改为
let fetch;
try {
  fetch = require("node-fetch");
} catch (err) {
  fetch = require("node-fetch").default;
}

const SOURCE_PREFIX = "pixabay";
const TARGET_PREFIX = "heshiheng";
const API_KEY = "43568381-3e0c7b94d6088eaf4762a1033";
const WALLPAPER_API_URL = `https://pixabay.com/api/`;
const VIDEO_API_URL = `https://pixabay.com/api/videos/`;

// 获取壁纸分类
router.get("/wallpapercategory", async (req, res) => {
  try {
    //查询数据库中的所有api
    const data = await WallpaperCate.find();
    //获取请求IP

    res.success(data);
  } catch (error) {
    res.error({ message: "获取数据失败，请稍后重试" });
  }
});

// 插入全部用户接口
router.post("/insertwallpapercategory", async (req, res) => {
  try {
    // 将 JSON 数据写入数据库
    await WallpaperCate.insertMany(apiData);

    res.success("数据写入成功");
  } catch (error) {
    res.error({ message: "写入数据失败，请稍后重试" });
  }
});

// 获取壁纸列表
router.post("/wallpaper", async (req, res) => {
  try {
    //查询数据库中的所有api
    const {
      page,
      pageSize,
      photoVal,
      imgType = "photo",
      category,
      type,
    } = req.body;
    const params = {
      q: _.isEmpty(photoVal) ? category : photoVal,
      page,
      per_page: pageSize,
      image_type: imgType,
    };
    const isPro = "&pretty=true";
    const queryString = new URLSearchParams(params).toString() + isPro;
    const baseURL = type === "/video" ? VIDEO_API_URL : WALLPAPER_API_URL;
    const url = baseURL + `?key=${API_KEY}&${queryString}`;
    console.log("url", url);
    const result = await fetch(url);
    const data = await result.json();
    const wallpaperList = data.hits.map((item) =>
      _.mapValues(item, (value, key) =>
        _.includes(value, SOURCE_PREFIX)
          ? value.replace(SOURCE_PREFIX, TARGET_PREFIX)
          : value
      )
    );
    const newData = { ...data, hits: wallpaperList };

    res.success(newData);
  } catch (error) {
    console.log(error);
    res.error({ message: "获取数据失败，请稍后重试" });
  }
});

module.exports = router;
