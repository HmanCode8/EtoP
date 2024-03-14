const express = require('express')
const mongoose = require('mongoose')
const Message = require('./models/message');
const Register = require('./models/register');

const bodyParser = require('body-parser');

const app = express();

// 使用 body-parser 中间件来解析 JSON 格式的请求体
app.use(bodyParser.json());
const cors = require('cors'); // 导入 cors 中间件
// 连接 MongoDB 数据库
mongoose
  .connect('mongodb://127.0.0.1:27017/email', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err)
  })

// 创建 Express 应用
// 使用 cors 中间件，允许来自所有源的跨域请求
app.use(cors());

// 定义路由
// 获取数据表 message 的数据
app.get('/email', async (req, res) => {
  try {
    // 查询数据库中的所有消息
    const messages = await Message.find();
    console.log('messages',messages)
    // 将查询结果发送给客户端
    res.json(messages);
  } catch (err) {
    // 如果发生错误，发送错误消息给客户端
    res.status(500).json({ error: err.message });
  }
});

// 注册接口
app.post('/register', async (req, res) => {
  console.log('req',req.body)
  try {
    // 从请求体中获取用户提供的信息
    const { username, email, password } = req.body;

    // 检查是否存在相同的邮箱或用户名
    const existingUser = await Register.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: '邮箱或用户名已存在' });
    }

    // 创建新用户
    const newUser = new Register({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: '注册成功' });
  } catch (error) {
    console.error('注册失败', error);
    res.status(500).json({ message: '注册失败，请稍后重试' });
  }
});

// 启动服务器
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
