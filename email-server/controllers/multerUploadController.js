const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid"); // 使用uuid生成唯一ID
const MulterUploadsModel = require("../models/multerUpload"); // 假设你的模型文件导出的是Model类
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 配置multer存储引擎，这里我们使用diskStorage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/multerUploads"); // 指定上传文件存放的目录
  },
  filename: (req, file, cb) => {
    // 生成唯一的文件名
    const fileName = encodeURIComponent(file.originalname); // 使用encodeURIComponent编码文件名
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
        return res.status(400).send("No file uploaded.");
      }

      // 保存文件信息到数据库
      const uploadRecord = new MulterUploadsModel({
        fileName: req.file.filename,
        originalName: req.file.originalname,
        uploadPath: req.file.destination + "/" + req.file.filename,
        status: "completed", // 假设文件上传成功后的状态
      });

      // 保存到数据库
      await uploadRecord.save();

      // 返回文件ID或其他自定义ID供客户端查询状态
      res.success(uploadRecord);
    } catch (err) {
      return res.error("Error uploading file.");
    }
  }
);

module.exports = router;
