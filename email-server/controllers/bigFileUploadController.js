const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const MulterUploadsModel = require('../models/multerUpload') // 假设你的模型文件导出的是Model类
const verifyTokenMiddleWare = require('../middlewares/verifyTokenMiddleWare')

// 配置multer存储引擎，这里我们使用diskStorage
const dirStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const { userId } = req.userInfo
    const dir = `./uploads/bigFileUploads/${userId}`
    fs.mkdir(dir, { recursive: true }, (err) => {
      if (err) {
        cb(err)
      } else {
        cb(null, dir)
      }
    })
  },

  filename: (req, file, cb) => {
    // 生成唯一的文件名
    const extname = path.extname(file.originalname) // 获取文件扩展名
    const fileName = req.body.index + '_' + req.body.fileName // 使用encodeURIComponent编码文件名
    cb(null, fileName)
  },
})

// 配置multer
const uploadMulter = multer({ storage: dirStorage })

// 上传大文件,每一个分块
router.post('/bigFileUpload', verifyTokenMiddleWare, uploadMulter.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.error({ message: 'No file uploaded.' })
    }

    res.success({ message: 'File uploaded successfully.' })
  } catch (err) {
    return res.error({ message: err.message })
  }
})

// 合并分块文件
router.post('/mergeBigFile', verifyTokenMiddleWare, async (req, res) => {
  try {
    const { fileName } = req.body
    const uploadPath = './uploads/bigFileUploads/' + req.userInfo.userId
    let files = fs.readdirSync(path.join(process.cwd(), uploadPath))
    files = files.sort((a, b) => a.split('-')[0] - b.split('-')[0])
    const writePath = path.join(process.cwd(), `uploads`, `${fileName}`)
    files.forEach((item) => {
        fs.appendFileSync(writePath, fs.readFileSync(path.join(process.cwd(), uploadPath, item)))
        fs.unlinkSync(path.join(process.cwd(), uploadPath, item))
    })
    res.success({ message: 'mergeBigFile' })
  } catch (err) {
    return res.error({ message: err.message })
  }
})

module.exports = router
