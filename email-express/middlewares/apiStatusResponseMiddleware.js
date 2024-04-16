const {
  SUCCESS_CODE,
  ERROR_CODE,
  NOT_FOUND_CODE,
} = require("../constants/code");

function apiStatusResponse(req, res, next) {
  // 成功响应
  res.success = function (data, message = "Success") {
    res
      .status(SUCCESS_CODE)
      .json({ success: true, message, code: SUCCESS_CODE, data });
  };

  // 错误响应
  res.error = function ({ statusCode = ERROR_CODE, message }) {
    res.status(statusCode).json({ success: false, code: statusCode, message });
  };

  // 其他状态响应，例如未找到
  res.notFound = function ({
    statusCode = NOT_FOUND_CODE,
    message = "Not Found",
  }) {
    res.status(statusCode).json({ success: false, code: statusCode, message });
  };

  next();
}

module.exports = apiStatusResponse;
