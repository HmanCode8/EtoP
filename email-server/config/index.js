const config = {
  tokenSecret: "heshiheng",
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
  //   LTAI5t7T9wPa1dXzqvvAPJw5
  // lQ5cSYZWtPZVKNQHGH52w7hIPQ3Zsm

  aliyun: {
    regionId: "127497975",
    accessKeyId: "LTAI5t7T9wPa1dXzqvvAPJw5",
    accessKeySecret: "lQ5cSYZWtPZVKNQHGH52w7hIPQ3Zsm",
    signName: "潮流女装", //签名名称
    templateCode: "SMS_186945863", //模板CODE
  },
  redis: {
    host: "127.0.0.1",
    port: 6379,
    redis_secretKey: 0,
  },
};

module.exports = config;
