const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises; // 引入 fs 模块的 promises API
const MulterUploads = require("../models/multerUpload");
const verifyTokenMiddleWare = require("../middlewares/verifyTokenMiddleWare");


const upload = multer({ dest: 'multerUploads/' }); // 设置文件上传的目录 
router.post('/multerUploads', upload.array('files', 6), (req, res) => { // 假设客户端使用'files'作为字段名，并限制为12个文件  
  try {  
    // req.files 是一个包含所有上传文件的数组  
    const {files} = req.body
    if (!files) {  
      return res.status(400).send('No files were uploaded.');  
    }  
  
    // 你可以在这里对每个文件进行处理，例如重命名、保存到数据库等  
    const filesInfo = files.map(file => {  
      const { originalname, path } = file;  
      return { originalname, path };  
    });  
  
    // 将文件信息保存到数据库  
    const multerUpload = new MulterUploads({ filesInfo });  
    multerUpload.save((err, data) => {  
      if (err) {  
        console.error(err);  
        return res.status(500).send('An error occurred while saving the files.');  
      }  
      console.log('Files saved successfully.');  
      res.send(data);  
    });  
  
  } catch (err) {  
    console.error(err);  
    res.status(500).send('An error occurred while uploading the files.');  
  }  
});  
  



module.exports = router;
