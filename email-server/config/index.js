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
  aliyun: {
    regionId: "127497975",
    accessKeyId: "LTAI4Fq7X6yv5SHKGQH77zk6",
    accessKeySecret: "N2hZShu9WlAKbzxhHwuFOUro6Lz8oY",
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
