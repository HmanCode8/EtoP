const express = require("express");
const mongoose = require("mongoose");
const emailController = require("./controllers/emailController");
const registerController = require("./controllers/registerController");
const draftsController = require("./controllers/draftsController");
const uploadController = require("./controllers/uploadController");

const bodyParser = require("body-parser");

const app = express();

// 使用 body-parser 中间件来解析 JSON 格式的请求体
app.use(bodyParser.json());
const cors = require("cors"); // 导入 cors 中间件
// 连接 MongoDB 数据库
mongoose
  .connect("mongodb://127.0.0.1:27017/email", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB is success");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// 使用 cors 中间件，允许来自所有源的跨域请求
app.use(cors());
// 设置请求体大小限制为 50MB
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/api", emailController);
app.use("/api", registerController);
app.use("/api", draftsController);
app.use("/api", uploadController);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
