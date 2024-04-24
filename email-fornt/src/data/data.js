const apis = [
  {
    name: "6.7w",
    hot: "网课题库API接口",
    desc: "超星学习通、知到智慧树、等全网网课答案在线搜索",
  },
  {
    name: "10.7w",
    hot: "摸鱼人日历API接口",
    desc: "有趣的摸鱼人专属日历",
  },
  {
    name: "6.9w",
    hot: "职场人日历API接口",
    desc: "有趣的职场人专属日历",
  },
  {
    name: "29.4w",
    hot: "Bing每日图片API接口",
    desc: "获取必应每日壁纸",
  },
  {
    name: "11.1w",
    hot: "风景图片API接口",
    desc: "随机输出一张超清风景图片",
  },
  {
    name: "13.0w",
    hot: "二次元图片API接口",
    desc: "随机输出一张超清动漫图片",
  },
  {
    name: "9.7w",
    hot: "电脑分辨率美图API接口",
    desc: "随机输出电脑分辨率cosplay或福利姬等美图",
  },
  {
    name: "6.9w",
    hot: "手机分辨率美图API接口",
    desc: "随机输出手机分辨率cosplay或福利姬等美图",
  },
  {
    name: "6.9w",
    hot: "精选头像API接口",
    desc: "随机输出一张精选头像图片",
  },
  {
    name: "7.1w",
    hot: "动漫头像API接口",
    desc: "随机输出一张动漫头像图片",
  },
  {
    name: "6.7w",
    hot: "男生头像API接口",
    desc: "随机输出一张男生头像图片",
  },
  {
    name: "6.8w",
    hot: "女生头像API接口",
    desc: "随机输出一张女生头像图片",
  },
  {
    name: "6.8w",
    hot: "小众头像API接口",
    desc: "随机输出一张小众头像图片",
  },
  {
    name: "8.3w",
    hot: "网易云热歌榜歌曲API接口",
    desc: "网易云音乐 输出最新热歌榜随机歌曲",
  },
  {
    name: "6.7w",
    hot: "网易云新歌榜歌曲API接口",
    desc: "网易云音乐 输出最新新歌榜随机歌曲",
  },
  {
    name: "7.3w",
    hot: "网易云飙升榜歌曲API接口",
    desc: "网易云音乐 输出最新飙升榜随机歌曲",
  },
  {
    name: "6.7w",
    hot: "网易云原创榜歌曲API接口",
    desc: "网易云音乐 输出最新原创榜随机歌曲",
  },
  {
    name: "387.4w",
    hot: "一言句子API接口",
    desc: "随机输出 动漫文学，网络鸡汤，文学诗词等文案",
  },
  {
    name: "8.4w",
    hot: "骚话API接口",
    desc: "随机输出一句骚骚的骚话",
  },
  {
    name: "8.2w",
    hot: "情话API接口",
    desc: "随机输出一句撩人的情话",
  },
  {
    name: "7.3w",
    hot: "笑话API接口",
    desc: "随机输出一段笑话",
  },
  {
    name: "7.0w",
    hot: "满屏雪花下雪API接口",
    desc: "网站、博客满屏雪花下雪API接口",
  },
  {
    name: "6.9w",
    hot: "透明波浪特效API接口",
    desc: "网站、博客添加HTML的svg透明波浪特效API接口",
  },
  {
    name: "7.0w",
    hot: "樱花效果API接口",
    desc: "网站、博客添加樱花效果API接口",
  },
  {
    name: "6.7w",
    hot: "梅花特效API接口",
    desc: "网站、博客添加梅花API接口",
  },
  {
    name: "6.7w",
    hot: "春节灯笼API接口",
    desc: "网站、博客添加春节灯笼API接口",
  },
  {
    name: "9.4w",
    hot: "星座运势API接口",
    desc: "每天更新今日、明日、本周、本月十二星座运势",
  },
  {
    name: "16.8w",
    hot: "每日一句励志英语API接口",
    desc: "输出每日一句励志英语",
  },
  {
    name: "7.2w",
    hot: "每天60秒读懂世界API接口",
    desc: "输出每天60秒读懂世界新闻资讯",
  },
  {
    name: "7.2w",
    hot: "热搜热榜聚合API",
    desc: "微博热搜、今日头条、知乎日报、虎扑步行街、36氪、哔哩哔哩热榜，知乎、IT资讯、虎嗅网、人人都是产品经理热榜百度、抖音热点豆瓣小组精选等聚合API免费接口",
  },
  {
    name: "8.8w",
    hot: "微博实时热搜热榜API",
    desc: "微博实时热搜热榜API免费接口",
  },
  {
    name: "7.3w",
    hot: "今日头条实时热搜热榜API",
    desc: "今日头条实时热搜热榜API免费接口",
  },
  {
    name: "7.3w",
    hot: "虎扑步行街实时热搜热榜API",
    desc: "虎扑步行街实时热搜热榜API免费接口",
  },
  {
    name: "7.6w",
    hot: "知乎实时热搜热榜API",
    desc: "知乎实时热搜热榜API免费接口",
  },
  {
    name: "7.2w",
    hot: "知乎每日日报API",
    desc: "知乎每日日报API免费接口",
  },
  {
    name: "7.3w",
    hot: "36氪24小时热榜API",
    desc: "36氪24小时热榜API免费接口",
  },
  {
    name: "7.3w",
    hot: "哔哩哔哩全站日榜API",
    desc: "哔哩哔哩全站日榜API免费接口",
  },
  {
    name: "8.9w",
    hot: "百度热点热榜API",
    desc: "百度热点热榜API免费接口",
  },
  {
    name: "10.4w",
    hot: "抖音热点热榜API",
    desc: "抖音热点热榜API免费接口",
  },
  {
    name: "7.2w",
    hot: "豆瓣小组精选API",
    desc: "豆瓣小组精选API免费接口",
  },
  {
    name: "7.3w",
    hot: "IT资讯热榜API",
    desc: "IT资讯热榜API免费接口",
  },
  {
    name: "7.2w",
    hot: "虎嗅网24小时热榜API",
    desc: "虎嗅网24小时热榜API免费接口",
  },
  {
    name: "7.3w",
    hot: "人人都是产品经理热文日榜API",
    desc: "人人都是产品经理热文日榜API免费接口",
  },
  {
    name: "7.9w",
    hot: "二维码生成API接口",
    desc: "支持电话 文字 链接的QRAPI",
  },
  {
    name: "6.7w",
    hot: "二维码解析API接口",
    desc: "支持常规二维码图片解析的API",
  },
  {
    name: "46.3w",
    hot: "短网址还原API接口",
    desc: "支持所有缩短的短网址进行还原",
  },
  {
    name: "60.5w",
    hot: "天气情况API接口",
    desc: "可查 城市 县区的天气情况",
  },
  {
    name: "143.6w",
    hot: "获取IP信息",
    desc: "获取IP地址的详细信息",
  },
  {
    name: "11.5w",
    hot: "IP天气签名档API接口",
    desc: "获取系统及浏览器和当地天气信息",
  },
  {
    name: "24.9w",
    hot: "访客相关信息获取API接口",
    desc: "获取操作系统，浏览器，浏览器版本，访客IP地址，访问时间",
  },
];

const url = [
  "https://api.vvhan.com/article/wangke.html",
  "https://api.vvhan.com/article/moyu.html",
  "https://api.vvhan.com/article/zhichang.html",
  "https://api.vvhan.com/article/bing.html",
  "https://api.vvhan.com/article/views.html",
  "https://api.vvhan.com/article/acg.html",
  "https://api.vvhan.com/article/pcGirl.html",
  "https://api.vvhan.com/article/mobileGirl.html",
  "https://api.vvhan.com/article/rand.html",
  "https://api.vvhan.com/article/dm.html",
  "https://api.vvhan.com/article/boy.html",
  "https://api.vvhan.com/article/girl.html",
  "https://api.vvhan.com/article/niche.html",
  "https://api.vvhan.com/article/%E7%83%AD%E6%AD%8C%E6%A6%9C.html",
  "https://api.vvhan.com/article/%E6%96%B0%E6%AD%8C%E6%A6%9C.html",
  "https://api.vvhan.com/article/%E9%A3%99%E5%8D%87%E6%A6%9C.html",
  "https://api.vvhan.com/article/%E5%8E%9F%E5%88%9B%E6%A6%9C.html",
  "https://api.vvhan.com/article/yiyan.html",
  "https://api.vvhan.com/article/sexy.html",
  "https://api.vvhan.com/article/love.html",
  "https://api.vvhan.com/article/joke.html",
  "https://api.vvhan.com/article/snow.html",
  "https://api.vvhan.com/article/bolang.html",
  "https://api.vvhan.com/article/yinghua.html",
  "https://api.vvhan.com/article/meihua.html",
  "https://api.vvhan.com/article/denglong.html",
  "https://api.vvhan.com/article/horoscope.html",
  "https://api.vvhan.com/article/en.html",
  "https://api.vvhan.com/article/60s.html",
  "https://api.vvhan.com/article/hotlist.html",
  "https://api.vvhan.com/article/wbHot.html",
  "https://api.vvhan.com/article/toutiao.html",
  "https://api.vvhan.com/article/huPu.html",
  "https://api.vvhan.com/article/zhihuHot.html",
  "https://api.vvhan.com/article/zhihuDay.html",
  "https://api.vvhan.com/article/36Ke.html",
  "https://api.vvhan.com/article/bili.html",
  "https://api.vvhan.com/article/baiduRD.html",
  "https://api.vvhan.com/article/douyinHot.html",
  "https://api.vvhan.com/article/douban.html",
  "https://api.vvhan.com/article/itNews.html",
  "https://api.vvhan.com/article/huXiu.html",
  "https://api.vvhan.com/article/woShiPm.html",
  "https://api.vvhan.com/article/erweima.html",
  "https://api.vvhan.com/article/erweimapsg.html",
  "https://api.vvhan.com/article/short.html",
  "https://api.vvhan.com/article/tianqi.html",
  "https://api.vvhan.com/article/ipinfo.html",
  "https://api.vvhan.com/article/qianming.html",
  "https://api.vvhan.com/article/fangke.html",
];

const apiUrl = [
  {
    name: "6.7w",
    hot: "网课题库API接口",
    desc: "超星学习通、知到智慧树、等全网网课答案在线搜索",
    url: "https://api.vvhan.com/article/wangke.html",
  },
  {
    name: "10.7w",
    hot: "摸鱼人日历API接口",
    desc: "有趣的摸鱼人专属日历",
    url: "https://api.vvhan.com/article/moyu.html",
  },
  {
    name: "6.9w",
    hot: "职场人日历API接口",
    desc: "有趣的职场人专属日历",
    url: "https://api.vvhan.com/article/zhichang.html",
  },
  {
    name: "29.4w",
    hot: "Bing每日图片API接口",
    desc: "获取必应每日壁纸",
    url: "https://api.vvhan.com/article/bing.html",
  },
  {
    name: "11.1w",
    hot: "风景图片API接口",
    desc: "随机输出一张超清风景图片",
    url: "https://api.vvhan.com/article/views.html",
  },
  {
    name: "13.0w",
    hot: "二次元图片API接口",
    desc: "随机输出一张超清动漫图片",
    url: "https://api.vvhan.com/article/acg.html",
  },
  {
    name: "9.7w",
    hot: "电脑分辨率美图API接口",
    desc: "随机输出电脑分辨率cosplay或福利姬等美图",
    url: "https://api.vvhan.com/article/pcGirl.html",
  },
  {
    name: "6.9w",
    hot: "手机分辨率美图API接口",
    desc: "随机输出手机分辨率cosplay或福利姬等美图",
    url: "https://api.vvhan.com/article/mobileGirl.html",
  },
  {
    name: "6.9w",
    hot: "精选头像API接口",
    desc: "随机输出一张精选头像图片",
    url: "https://api.vvhan.com/article/rand.html",
  },
  {
    name: "7.1w",
    hot: "动漫头像API接口",
    desc: "随机输出一张动漫头像图片",
    url: "https://api.vvhan.com/article/dm.html",
  },
  {
    name: "6.7w",
    hot: "男生头像API接口",
    desc: "随机输出一张男生头像图片",
    url: "https://api.vvhan.com/article/boy.html",
  },
  {
    name: "6.8w",
    hot: "女生头像API接口",
    desc: "随机输出一张女生头像图片",
    url: "https://api.vvhan.com/article/girl.html",
  },
  {
    name: "6.8w",
    hot: "小众头像API接口",
    desc: "随机输出一张小众头像图片",
    url: "https://api.vvhan.com/article/niche.html",
  },
  {
    name: "8.3w",
    hot: "网易云热歌榜歌曲API接口",
    desc: "网易云音乐 输出最新热歌榜随机歌曲",
    url: "https://api.vvhan.com/article/%E7%83%AD%E6%AD%8C%E6%A6%9C.html",
  },
  {
    name: "6.7w",
    hot: "网易云新歌榜歌曲API接口",
    desc: "网易云音乐 输出最新新歌榜随机歌曲",
    url: "https://api.vvhan.com/article/%E6%96%B0%E6%AD%8C%E6%A6%9C.html",
  },
  {
    name: "7.3w",
    hot: "网易云飙升榜歌曲API接口",
    desc: "网易云音乐 输出最新飙升榜随机歌曲",
    url: "https://api.vvhan.com/article/%E9%A3%99%E5%8D%87%E6%A6%9C.html",
  },
  {
    name: "6.7w",
    hot: "网易云原创榜歌曲API接口",
    desc: "网易云音乐 输出最新原创榜随机歌曲",
    url: "https://api.vvhan.com/article/%E5%8E%9F%E5%88%9B%E6%A6%9C.html",
  },
  {
    name: "387.4w",
    hot: "一言句子API接口",
    desc: "随机输出 动漫文学，网络鸡汤，文学诗词等文案",
    url: "https://api.vvhan.com/article/yiyan.html",
  },
  {
    name: "8.4w",
    hot: "骚话API接口",
    desc: "随机输出一句骚骚的骚话",
    url: "https://api.vvhan.com/article/sexy.html",
  },
  {
    name: "8.2w",
    hot: "情话API接口",
    desc: "随机输出一句撩人的情话",
    url: "https://api.vvhan.com/article/love.html",
  },
  {
    name: "7.3w",
    hot: "笑话API接口",
    desc: "随机输出一段笑话",
    url: "https://api.vvhan.com/article/joke.html",
  },
  {
    name: "7.0w",
    hot: "满屏雪花下雪API接口",
    desc: "网站、博客满屏雪花下雪API接口",
    url: "https://api.vvhan.com/article/snow.html",
  },
  {
    name: "6.9w",
    hot: "透明波浪特效API接口",
    desc: "网站、博客添加HTML的svg透明波浪特效API接口",
    url: "https://api.vvhan.com/article/bolang.html",
  },
  {
    name: "7.0w",
    hot: "樱花效果API接口",
    desc: "网站、博客添加樱花效果API接口",
    url: "https://api.vvhan.com/article/yinghua.html",
  },
  {
    name: "6.7w",
    hot: "梅花特效API接口",
    desc: "网站、博客添加梅花API接口",
    url: "https://api.vvhan.com/article/meihua.html",
  },
  {
    name: "6.7w",
    hot: "春节灯笼API接口",
    desc: "网站、博客添加春节灯笼API接口",
    url: "https://api.vvhan.com/article/denglong.html",
  },
  {
    name: "9.4w",
    hot: "星座运势API接口",
    desc: "每天更新今日、明日、本周、本月十二星座运势",
    url: "https://api.vvhan.com/article/horoscope.html",
  },
  {
    name: "16.8w",
    hot: "每日一句励志英语API接口",
    desc: "输出每日一句励志英语",
    url: "https://api.vvhan.com/article/en.html",
  },
  {
    name: "7.2w",
    hot: "每天60秒读懂世界API接口",
    desc: "输出每天60秒读懂世界新闻资讯",
    url: "https://api.vvhan.com/article/60s.html",
  },
  {
    name: "7.2w",
    hot: "热搜热榜聚合API",
    desc: "微博热搜、今日头条、知乎日报、虎扑步行街、36氪、哔哩哔哩热榜，知乎、IT资讯、虎嗅网、人人都是产品经理热榜百度、抖音热点豆瓣小组精选等聚合API免费接口",
    url: "https://api.vvhan.com/article/hotlist.html",
  },
  {
    name: "8.8w",
    hot: "微博实时热搜热榜API",
    desc: "微博实时热搜热榜API免费接口",
    url: "https://api.vvhan.com/article/wbHot.html",
  },
  {
    name: "7.3w",
    hot: "今日头条实时热搜热榜API",
    desc: "今日头条实时热搜热榜API免费接口",
    url: "https://api.vvhan.com/article/toutiao.html",
  },
  {
    name: "7.3w",
    hot: "虎扑步行街实时热搜热榜API",
    desc: "虎扑步行街实时热搜热榜API免费接口",
    url: "https://api.vvhan.com/article/huPu.html",
  },
  {
    name: "7.6w",
    hot: "知乎实时热搜热榜API",
    desc: "知乎实时热搜热榜API免费接口",
    url: "https://api.vvhan.com/article/zhihuHot.html",
  },
  {
    name: "7.2w",
    hot: "知乎每日日报API",
    desc: "知乎每日日报API免费接口",
    url: "https://api.vvhan.com/article/zhihuDay.html",
  },
  {
    name: "7.3w",
    hot: "36氪24小时热榜API",
    desc: "36氪24小时热榜API免费接口",
    url: "https://api.vvhan.com/article/36Ke.html",
  },
  {
    name: "7.3w",
    hot: "哔哩哔哩全站日榜API",
    desc: "哔哩哔哩全站日榜API免费接口",
    url: "https://api.vvhan.com/article/bili.html",
  },
  {
    name: "8.9w",
    hot: "百度热点热榜API",
    desc: "百度热点热榜API免费接口",
    url: "https://api.vvhan.com/article/baiduRD.html",
  },
  {
    name: "10.4w",
    hot: "抖音热点热榜API",
    desc: "抖音热点热榜API免费接口",
    url: "https://api.vvhan.com/article/douyinHot.html",
  },
  {
    name: "7.2w",
    hot: "豆瓣小组精选API",
    desc: "豆瓣小组精选API免费接口",
    url: "https://api.vvhan.com/article/douban.html",
  },
  {
    name: "7.3w",
    hot: "IT资讯热榜API",
    desc: "IT资讯热榜API免费接口",
    url: "https://api.vvhan.com/article/itNews.html",
  },
  {
    name: "7.2w",
    hot: "虎嗅网24小时热榜API",
    desc: "虎嗅网24小时热榜API免费接口",
    url: "https://api.vvhan.com/article/huXiu.html",
  },
  {
    name: "7.3w",
    hot: "人人都是产品经理热文日榜API",
    desc: "人人都是产品经理热文日榜API免费接口",
    url: "https://api.vvhan.com/article/woShiPm.html",
  },
  {
    name: "7.9w",
    hot: "二维码生成API接口",
    desc: "支持电话 文字 链接的QRAPI",
    url: "https://api.vvhan.com/article/erweima.html",
  },
  {
    name: "6.7w",
    hot: "二维码解析API接口",
    desc: "支持常规二维码图片解析的API",
    url: "https://api.vvhan.com/article/erweimapsg.html",
  },
  {
    name: "46.3w",
    hot: "短网址还原API接口",
    desc: "支持所有缩短的短网址进行还原",
    url: "https://api.vvhan.com/article/short.html",
  },
  {
    name: "60.5w",
    hot: "天气情况API接口",
    desc: "可查 城市 县区的天气情况",
    url: "https://api.vvhan.com/article/tianqi.html",
  },
  {
    name: "143.6w",
    hot: "获取IP信息",
    desc: "获取IP地址的详细信息",
    url: "https://api.vvhan.com/article/ipinfo.html",
  },
  {
    name: "11.5w",
    hot: "IP天气签名档API接口",
    desc: "获取系统及浏览器和当地天气信息",
    url: "https://api.vvhan.com/article/qianming.html",
  },
  {
    name: "24.9w",
    hot: "访客相关信息获取API接口",
    desc: "获取操作系统，浏览器，浏览器版本，访客IP地址，访问时间",
    url: "https://api.vvhan.com/article/fangke.html",
  },
];