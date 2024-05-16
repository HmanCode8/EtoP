import xhrRequest from "./xhrRequest";

export default function concurrentRequest(xhrRequestParam: any): Promise<any[]> {
  const { url = '', requestSize = [], maxNum = 0, callback = () => { }, fileName = '', type = 'normal' } = xhrRequestParam;
  return new Promise((resolve) => {
    let index = 0; // 记录当前请求的索引
    let result: any = []; // 记录请求结果
    let count = 0; // 记录请求完成的数量
    async function _request() {
      let i = index; // 记录之前的请求的索引
      let params = requestSize[index]; // 取出当前请求的文件
      params.file = requestSize[index]?.file || requestSize[index]?.blob
      index++; // 取出第一个后需要将索引+1
      try {
        const paramList = type === 'bigUpload' ? {
          index: i,
          total: requestSize.length,
          fileName: fileName,
          file: params.file,
        } : params
        const res = await xhrRequest(url, paramList, (e) => callback(i, e, params));

        result[i] = res;

      } catch (error) {
        result[i] = error;
      } finally {
        count++;
        //首先这里肯定是某个请求完成了，无论成功与否，都要继续请求下一个，但是有边界，就是
        if (index < requestSize.length) {
          _request();
        }
        // 整体的请求什么时候结束
        if (count === requestSize.length) {
          resolve(result);
        }
      }
    }
    for (let i = 0; i < Math.min(maxNum, requestSize.length); i++) {
      _request();
    }
  });
}
