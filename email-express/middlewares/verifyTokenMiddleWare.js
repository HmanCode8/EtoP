const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../constants/config");

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  // var decoded1 = jwt.verify(token, SECRET_KEY);
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  // 匹配 JWT Token 的正则表达式
  // const jwtRegex = /Bearer\s(.+)\./;
  const jwtToken = token.split(" ")[1];
  jwt.verify(jwtToken, SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(302)
        .json({ message: "Invalid token，please login again" });
      // return res.redirect("http://localhost:5173/#/login");
    }

    req.userInfo = decoded; // 将解码后的用户信息保存在请求对象中
    next();
  });
}

module.exports = verifyToken;
