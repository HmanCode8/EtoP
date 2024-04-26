const express = require("express");
const connectToDatabase = require("./db");
const controllers = require("./srevices");
const bodyParser = require("body-parser");
const apiStatusResponseMiddleware = require("./middlewares/apiStatusResponseMiddleware");

const app = express();
// 连接 MongoDB 数据库
connectToDatabase();

// 使用 body-parser 中间件来解析 JSON 格式的请求体
app.use(bodyParser.json());
app.use(apiStatusResponseMiddleware);
const cors = require("cors"); // 导入 cors 中间件

//静态资源目录
app.use(express.static(__dirname + "/dist"));

// 使用 cors 中间件，允许来自所有源的跨域请求
app.use(cors());
// 设置请求体大小限制为 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// 注册路由
for (let key in controllers) {
  const controller = controllers[key];
  app.use("/api", controller);
}

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
