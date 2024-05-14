const OSS = require('ali-oss')
const { oss } = require('../config')

// 用户key和secret
// region: 'oss-cn-beijing', //区域
// accessKeyId: 'LTAI5tQVgesoXNVKXFo1V1kn', // accessKeyId
// accessKeySecret: 'koLUp7N5lSxRng0w8lrVbjLNSpBkIe', // accessKeySecret
// bucket: 'multerupload' // 存储桶名称

// const ossConfig = {
//   region: 'oss-cn-beijing',
//   accessKeyId: 'LTAI5tJ7jsngknwzpkTn8L6Z',
//   accessKeySecret: 'JMhCjwKGeCD8uVErFJ2vMVSRvSXEQu',
//   bucket: 'multerupload'
// };

const client = new OSS(oss)

//上传文件
function uploadFile(file) {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await client.put(file.originalname, file.buffer)
      // const result = await client.put('exampleobject.txt', path.normalize('D:\\localpath\\examplefile.txt'))
      resolve(result)
    } catch (err) {
      reject(err)
    }
  })
}

// async function listBuckets() {
//   try {
//     // 列举当前账号所有地域下的存储空间。
//     const result = await client.listBuckets();
//     console.log(result);
//   } catch (err) {
//     console.log(err);
//   }
// }

module.exports = {
  uploadFile,
}
