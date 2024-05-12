const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const MulterUploadsModel = require("../models/multerUpload"); // 假设你的模型文件导出的是Model类
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 配置multer存储引擎，这里我们使用diskStorage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { userId } = req.userInfo; // 获取用户ID
    const dir = `./uploads/multerUploads/${userId}`; // 根据用户ID创建文件夹
    fs.mkdir(dir, { recursive: true });
    setTimeout(() => {
      cb(null, dir); // 文件保存的目录
    }, 1000); // 异步操作，等待目录创建完成
  },
  filename: (req, file, cb) => {
    // 生成唯一的文件名
    const extname = path.extname(file.originalname); // 获取文件扩展名
    const fileName = req.header("fileHash") + extname; // 使用encodeURIComponent编码文件名
    cb(null, fileName);
  },
});

// 使用multer存储引擎创建upload.single中间件
const uploadMulter = multer({ storage: storage });

router.post(
  "/multerUploads",
  verifyTokenMiddleWare,
  uploadMulter.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.error({ message: "No file uploaded." });
      }
      const { userId, username } = req.userInfo; // 从请求头中获取用户信息
      // 使用文件hash是否已经存在同名文件
      const fileHash = req.header("fileHash");
      const fileRecord = await MulterUploadsModel.findOne({
        hash: fileHash,
        userId,
      });
      if (fileRecord) {
        return res.error({ message: "File already exists.", statusCode: 409 });
      }
      // 保存文件信息到数据库
      const uploadRecord = new MulterUploadsModel({
        userId,
        username,
        hash: fileHash,
        fileName: req.file.originalname,
        size: req.file.size,
        uploadPath: req.file.destination + "/" + req.file.filename,
        status: "completed", // 假设文件上传成功后的状态
      });

      // 保存到数据库
      await uploadRecord.save();

      // 返回文件ID或其他自定义ID供客户端查询状态
      res.success(uploadRecord);
    } catch (err) {
      return res.error({ message: err.message });
    }
  }
);

// 获取文件列表
router.get("/multerUploads", verifyTokenMiddleWare, async (req, res) => {
  try {
    const { userId } = req.userInfo; // 从请求头中获取用户信息
    const fileRecords = await MulterUploadsModel.find({ userId });
    res.success(fileRecords);
  } catch (err) {
    return res.error({ message: err.message });
  }
});

module.exports = router;
