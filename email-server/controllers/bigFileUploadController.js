const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const { saveType } = require('../config')
const verifyTokenMiddleWare = require('../middlewares/verifyTokenMiddleWare')
const MulterUploadsModel = require('../models/multerUpload') // 假设你的模型文件导出的是Model类

// 配置multer存储引擎
const dirStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { userId } = req.userInfo
    const dir = path.join(__dirname, `../uploads/bigFileUploads/${userId}`)
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        cb(err)
      } else {
        cb(null, dir)
      }
    })
  },

  filename: (req, file, cb) => {
    const fileName = `${req.body.index}_${req.body.fileName}`
    cb(null, fileName)
  },
})

const uploadMulter = multer({ storage: dirStorage })

// 检查分片是否已存在
router.post('/checkChunk', verifyTokenMiddleWare, async (req, res) => {
  try {
    const { userId } = req.userInfo
    const { currentChunk, fileName } = req.body
    const chunkPath = path.join(__dirname, `../uploads/bigFileUploads/${userId}`, `${currentChunk}_${fileName}`)

    if (fs.existsSync(chunkPath)) {
      res.status(200).json({ exists: true })
    } else {
      res.status(200).json({ exists: false })
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 上传大文件的每一个分块
router.post('/bigFileUpload', verifyTokenMiddleWare, uploadMulter.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.error({ message: 'No file uploaded.' })
    }

    res.success({ success: true, message: 'File uploaded successfully.' })
  } catch (err) {
    res.error({ message: err.message })
  }
})

router.post('/mergeBigFile', verifyTokenMiddleWare, async (req, res) => {
  try {
    const { fileName,size, hash } = req.body
    const { userId, username } = req.userInfo
    const uploadPath = path.join(__dirname, `../uploads/bigFileUploads/${userId}`)
    const writePath = path.join(__dirname, `../uploads/${fileName}`)

    let files = fs.readdirSync(uploadPath)
    files = files.sort((a, b) => parseInt(a.split('_')[0]) - parseInt(b.split('_')[0]))

    files.forEach((file) => {
      const filePath = path.join(uploadPath, file)
      fs.appendFileSync(writePath, fs.readFileSync(filePath))
      fs.unlinkSync(filePath) // 删除已经合并的分块文件
    })

    // 保存文件信息到数据库
    const uploadRecord = new MulterUploadsModel({
      userId,
      username,
      hash,
      fileName,
      size,
      uploadPath,
      saveType: saveType === 'oss' ? 'oss' : 'local',
      status: 'uploaded', // 假设文件上传成功后的状态
    })
    await uploadRecord.save();
    res.success(uploadRecord)
  } catch (err) {
    res.error({ message: err.message })
  }
})

module.exports = router
