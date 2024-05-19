const config = {
  port: 3000,
  db: {
    host: "127.0.0.1",
    port: 27017,
    name: "email",
  },
  saveType: "local", //oss or local
  oss: {
    region: "oss-cn-beijing",
    accessKeyId: "LTAI5tJ7jsngknwzpkTn8L6Z",
    accessKeySecret: "JMhCjwKGeCD8uVErFJ2vMVSRvSXEQu",
    bucket: "multerupload",
  },
};

module.exports = config;
