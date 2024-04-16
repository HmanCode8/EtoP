const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // 引入 fs 模块的 promises API
const Upload = require("../models/upload");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 配置 multer 中间件
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // 文件保存的目录
  },
  filename: function (req, file, cb) {
    const userId = req.body.user_id; // 获取用户ID
    const extname = path.extname(file.originalname); // 获取文件扩展名
    const filename = userId + "_" + "avatars" + extname; // 拼接用户ID、文件类型和文件扩展名作为文件名
    cb(null, filename); // 生成文件名
  },
});
const uploadMulter = multer({ storage: storage });

// 用户头像上传路由
router.post("/uploadAvatar", uploadMulter.single("file"), async (req, res) => {
  try {
    const { originalname, path: filePath } = req.file;
    const userId = req.body.user_id || "";

    // 查找数据库中是否已经上传过该用户的头像
    const existingUpload = await Upload.findOne({ user_id: userId });

    if (userId === req.body.user_id) {
      // 如果已经上传过该用户的头像，则删除原有文件并更新数据库中的文件信息
      const oldFilePath = path.join(__dirname, "..", existingUpload.filepath);
      await fs.unlink(oldFilePath); // 删除旧的文件

      existingUpload.filename = originalname;
      existingUpload.filepath = filePath;
      await existingUpload.save();
      // const newData = { filename: req.body.name, filename: req.body.age };

      // const updatedData = await Upload.findByIdAndUpdate(userId, newData, { new: true });
      res.json(existingUpload);
    } else {
      // 如果数据库中没有该用户的头像记录，则创建新的记录
      const upload = new Upload({
        user_id: userId,
        filename: originalname,
        filepath: filePath,
      });
      const savedUpload = await upload.save();
      res.json(savedUpload);
    }
  } catch (error) {
    console.error("文件上传失败：", error);
    res.status(500).json({ error: "文件上传失败" });
  }
});
// 获取用户头像路由
router.get("/getAvatar", verifyTokenMiddleWare, async (req, res) => {
  try {
    const { userId } = req.userInfo;
    // 查找数据库中该用户的头像记录
    const existingUpload = await Upload.findOne({ user_id: userId });
    const { filename, filepath, user_id } = existingUpload;
    if (user_id === userId) {
      // 读取头像文件并以 Base64 编码返回给客户端
      const filePath = path.join(__dirname, "..", filepath);
      const fileData = await fs.readFile(filePath);
      const base64Data = fileData.toString("base64");
      const base64Image = `data:image/${
        path.extname(filename).split(".")[1]
      };base64,${base64Data}`;

      // 返回头像数据给客户端
      res.success({ avatar: base64Image });
    } else {
      res.status(404).json({ error: "未找到用户头像" });
    }
  } catch (error) {
    console.error("获取头像失败：", error);
    res.error({ error: "获取头像失败" });
  }
});

module.exports = router;
