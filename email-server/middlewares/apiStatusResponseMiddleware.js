const fs = require('fs');  
const path = require('path');  
const { appendFile } = fs.promises; 
// 日志文件与当前文件在logs/api.log
// 日志格式为：时间戳 - 请求方法 - 状态码 - 消息 - 数据
// 日志文件每天自动切割，保留最近30天的日志
const logFilePath = path.join(__dirname, 'api.log');
const {
  SUCCESS_CODE,
  ERROR_CODE,
  NOT_FOUND_CODE,
} = require("../constants/code");

 // 添加日志记录功能  
 const logRequest = async (req, statusCode, message, data='') => {  
  try {  
    const logEntry = `${new Date().toISOString()} - ${req.method}-${req.url} - ${statusCode} - ${message} - ${JSON.stringify(data)}\n`;  
    await appendFile(logFilePath, logEntry);  
  } catch (error) {  
    console.error('Error writing to log file:', error);  
  }  
}; 
function apiStatusResponse(req, res, next) {
  // 成功响应
  res.success = function (data, message = "Success") {
    res
      .status(SUCCESS_CODE)
      .json({ success: true, message, code: SUCCESS_CODE, data });
      logRequest(req, SUCCESS_CODE, message); // 记录日志
  };

  // 错误响应
  res.error = function ({ statusCode = ERROR_CODE, message,data }) {
    res.status(statusCode).json({ success: false, code: statusCode, message });
    logRequest(req, statusCode, message, data || null);  
  };

  
  // 其他状态响应，例如未找到
  res.notFound = function ({
    statusCode = NOT_FOUND_CODE,
    message = "Not Found",
  }) {
    res.status(statusCode).json({ success: false, code: statusCode, message,data });
    logRequest(req, statusCode, message, data || null);  
  };

  next();
}

module.exports = apiStatusResponse;
