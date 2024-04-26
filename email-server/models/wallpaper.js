const mongoose = require("mongoose");

const wallpaperSchema = new mongoose.Schema({
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

const Wallpaper = mongoose.model("Wallpaper", wallpaperSchema);

module.exports = Wallpaper;
