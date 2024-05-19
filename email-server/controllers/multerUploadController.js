const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const oss = require("../oss");
const { saveType } = require("../config");

const MulterUploadsModel = require("../models/multerUpload"); // 假设你的模型文件导出的是Model类
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 配置multer存储引擎，这里我们使用diskStorage
const dirStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { userId } = req.userInfo;
    const dir = `./uploads/multerUploads/${userId}`;
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null, dir);
      }
    });
  },

  filename: (req, file, cb) => {
    // 生成唯一的文件名
    const extname = path.extname(file.originalname); // 获取文件扩展名
    const fileName = req.header("fileHash") + extname; // 使用encodeURIComponent编码文件名
    cb(null, fileName);
  },
});

// // 使用multer存储引擎创建upload.single中间件
// const uploadMulter = multer({ storage: storage });

// 配置multer
const ossStorage = multer.memoryStorage();
const uploadMulter = multer({
  storage: saveType === "oss" ? ossStorage : dirStorage,
});

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
      const isOsstype = saveType === "oss";

      const uploadPath = isOsstype
        ? "multerUploads/"
        : req.file.destination + "/" + req.file.filename;
      // 保存文件信息到数据库
      const uploadRecord = new MulterUploadsModel({
        userId,
        username,
        hash: fileHash,
        fileName: req.file.originalname,
        size: req.file.size,
        uploadPath,
        saveType: saveType === "oss" ? "oss" : "local",
        status: "uploaded", // 假设文件上传成功后的状态
      });

      // 保存到数据库
      await uploadRecord.save();
      if (isOsstype) {
        const ossres = await oss.uploadFile(req.file);
        res.success({ ...uploadRecord, ossUrl: ossres.url });
        return;
      }
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
    // console.log(oss.listBuckets());
    const { userId } = req.userInfo; // 从请求头中获取用户信息
    const fileRecords = await MulterUploadsModel.find({ userId });
    res.success(fileRecords);
  } catch (err) {
    return res.error({ message: err.message });
  }
});

// 获取oss文件列表
router.get("/ossUploads", verifyTokenMiddleWare, async (req, res) => {
  try {
    const result = await oss.listObjects();
    console.log(result, "result");
    res.success(result);
  } catch (err) {
    return res.error({ message: err.message });
  }
});

module.exports = router;
