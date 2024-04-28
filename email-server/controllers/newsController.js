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

const SISTENTRY_NEWS = "https://api.vvhan.com/api/60s";
const HOT_ALL_API_URL = "https://api.vvhan.com/api/hotlist/all";
//头条新闻
const SISTENTRY_NEWS_API_URL = "https://api.vvhan.com/api/hotlist/toutiao";
// 微博热搜
const WEIBO_HOT_API_URL = "https://api.vvhan.com/api/hotlist/wbHot";
// 虎扑热榜
const HUPU_HOT_API_URL = "https://api.vvhan.com/api/hotlist/huPu";
// 知乎热榜
const ZHIHU_HOT_API_URL = "https://api.vvhan.com/api/hotlist/zhihuHot";
// 百度热搜
const BAIDU_HOT_API_URL = "https://api.vvhan.com/api/hotlist/baiduRD";

const REQUEST_LIST = [
  {
    key: "sixNews",
    url: SISTENTRY_NEWS,
  },
  {
    key: "hotAll",
    url: HOT_ALL_API_URL,
  },
  {
    key: "sistentryNews",
    url: SISTENTRY_NEWS_API_URL,
  },
  {
    key: "weiboHot",
    url: WEIBO_HOT_API_URL,
  },
  {
    key: "hupuHot",
    url: HUPU_HOT_API_URL,
  },
  {
    key: "zhihuHot",
    url: ZHIHU_HOT_API_URL,
  },
  {
    key: "baiduHot",
    url: BAIDU_HOT_API_URL,
  },
];

function conCurequest(urls, maxnumber) {
  if (urls.length === 0) return Promise.resolve([]);
  return new Promise((resolve) => {
    let index = 0; //下一次的请求。每次的请求数为maxnumber
    let result = [];
    let finishCount = 0; //已完成的请求数

    async function _requeset() {
      const i = index; //记录每次的请求是谁
      const url = urls[index];
      index++;
      try {
        const res = await fetch(url);
        result[i] = await res.json();
      } catch (error) {
        result[i] = [];
      } finally {
        finishCount++; //已完成的请求数
        if (index < urls.length) {
          _requeset();
        }
        if (finishCount === urls.length) {
          resolve(result);
        }
      }
    }
    for (let i = 0; i < Math.min(urls.length, maxnumber); i++) {
      _requeset();
    }
  });
}

// 获取壁纸列表
router.post("/cateNews", async (req, res) => {
  try {
    //查询数据库中的所有api
    const { new_keys } = req.body;
    const urls = _.map(
      _.filter(REQUEST_LIST, (item) => _.includes(new_keys, item.key)),
      "url"
    );
    let news = {};
    const result = await conCurequest(urls, 3);

    for (let i = 0; i < result.length; i++) {
      news[new_keys[i]] = result[i];
    }
    //设置缓存
    res.set("Cache-Control", "public, max-age=300");
    res.success(news);
  } catch (error) {
    console.log(error);
    res.error({ message: "获取数据失败，请稍后重试" });
  }
});

module.exports = router;
