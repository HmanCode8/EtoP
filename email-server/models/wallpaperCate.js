const mongoose = require("mongoose");

const wallpaperCateSchema = new mongoose.Schema({
  cate_key: {
    // 图片ID
    type: String,
    required: true,
  },
  name: {
    // 图片名称
    type: String,
    required: true,
  },
});

const WallpaperCate = mongoose.model("WallpaperCate", wallpaperCateSchema);

module.exports = WallpaperCate;
