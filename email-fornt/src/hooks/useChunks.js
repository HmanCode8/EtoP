// 1MB
import sparkMd5 from 'spark-md5'

function createChunks(file, index, chunkSize) {
  return new Promise((resolve) => {
    const spark = new sparkMd5.ArrayBuffer()
    const start = index * chunkSize
    const end = start + chunkSize
    const reader = new FileReader()
    const blob = file.slice(start, end)
    // reader.readAsArrayBuffer(blob)
    // reader.onload = () => {
    //   spark.append(reader.result)
    //   const obj = {
    //     index,
    //     start,
    //     end,
    //     blob,
    //     hash: spark.end()
    //   }
      resolve(blob)
    // }
  })
}
export default createChunks
