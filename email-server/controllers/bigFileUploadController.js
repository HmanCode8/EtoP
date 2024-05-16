const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");

// 配置multer存储引擎
const dirStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId } = req.userInfo;
    const dir = path.join(__dirname, `../uploads/bigFileUploads/${userId}`);
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        cb(err);
      } else {
        cb(null, dir);
      }
    });
  },

  filename: (req, file, cb) => {
    const fileName = `${req.body.index}_${req.body.fileName}`;
    cb(null, fileName);
  },
});

const uploadMulter = multer({ storage: dirStorage });

// 检查分片是否已存在
router.post("/checkChunk", verifyTokenMiddleWare, async (req, res) => {
  try {
    const { userId } = req.userInfo;
    const { currentChunk, fileName } = req.body;
    const chunkPath = path.join(
      __dirname,
      `../uploads/bigFileUploads/${userId}`,
      `${currentChunk}_${fileName}`
    );

    if (fs.existsSync(chunkPath)) {
      res.status(200).json({ exists: true });
    } else {
      res.status(200).json({ exists: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 上传大文件的每一个分块
router.post(
  "/bigFileUpload",
  verifyTokenMiddleWare,
  uploadMulter.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.error({ message: "No file uploaded." });
      }

      res.success({ success: true, message: "File uploaded successfully." });
    } catch (err) {
      res.error({ message: err.message });
    }
  }
);

// 合并分块文件
router.post("/mergeBigFile", verifyTokenMiddleWare, async (req, res) => {
  try {
    const { fileName } = req.body;
    const userId = req.userInfo.userId;
    const uploadPath = path.join(
      __dirname,
      `../uploads/bigFileUploads/${userId}`
    );
    const writePath = path.join(__dirname, `../uploads/${fileName}`);

    let files = fs.readdirSync(uploadPath);
    files = files.sort(
      (a, b) => parseInt(a.split("_")[0]) - parseInt(b.split("_")[0])
    );

    files.forEach((file) => {
      const filePath = path.join(uploadPath, file);
      fs.appendFileSync(writePath, fs.readFileSync(filePath));
      fs.unlinkSync(filePath); // 删除已经合并的分块文件
    });

    res.success({ message: "File merged successfully." });
  } catch (err) {
    res.error({ message: err.message });
  }
});

module.exports = router;
