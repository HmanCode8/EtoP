# 技术栈

vite + vue3 + typescript + pinia + antdv + axios + less

# 项目运行

npm install

# 开发模式运行

npm run dev

# 项目打包

npm run build

项目目录详解
├── public // 静态资源
│ ├── favicon.ico // favicon 图标
│ └── index.html // html 模板
├── src // 源代码
│ ├── services // 所有请求
│ ├── assets // 主题 字体等静态资源
│ ├── components // 全局公用组件
│ ├── directive // 全局指令
│ ├── enums // 全局常量、枚举
│ ├── filters // 全局过滤器
│ ├── hooks // 全局 hooks
│ ├── icons // 项目所有 svg icons
│ ├── lang // 国际化 language
│ ├── layout // 全局 layout
│ ├── router // 路由
│ ├── store // 全局 store 管理
│ ├── styles // 全局样式
│ ├── utils // 全局公用方法
│ ├── views // views 所有页面
│ ├── App.vue // 入口页面
│ ├── main.ts // 入口文件 加载组件 初始化等
│ └── shims-tsx.d.ts // tsx 支持
├── .env.development // 开发环境变量
├── .env.production // 生产环境变量
├── .env.test // 测试环境变量
├── .eslintrc.js // eslint 配置项
├── .gitignore // git 忽略项
├── babel.config.js // babel-loader 配置
├── jest.config.js // jest 单元测试配置
├── package.json // package.json
├── README.md // README.md
├── postcss.config.js // postcss 配置
├── vue.config.js // vue-cli 配置
└── yarn.lock // yarn 锁文件

```
## 项目运行
```

# 克隆项目

git clone https://github.com/lin-xin/vue-admin-template.git
