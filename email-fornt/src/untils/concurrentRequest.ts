import xhrRequest from "./xhrRequest";
import { bigFileUpload } from '@/services/bigFileUpload'

export default function concurrentRequest(
  urls: any,
  maxNum: number,
  callback: any,
): Promise<any[]> {
  return new Promise((resolve) => {
    let index = 0; // 记录当前请求的索引
    let result: any = []; // 记录请求结果
    let count = 0; // 记录请求完成的数量
    async function _request() {
      let i = index; // 记录之前的请求的索引
      const params = urls[index]; // 取出当前请求的文件
      index++; // 取出第一个后需要将索引+1
      try {
        // callback(i, params, (res: any) => {
        //   result[i] = res;
        //   console.log('result[i]',res)
        // });
        // const res = await xhrRequest(params, (e) => callback(i, e, params));
        const res = await bigFileUpload(
          {
            index: i,
            total: urls.length,
            fileName: callback,
            file: params.blob,
          }
        )
          result[i] = res;

      } catch (error) {
        result[i] = error;
      } finally {
        count++;
        //首先这里肯定是某个请求完成了，无论成功与否，都要继续请求下一个，但是有边界，就是
        if (index < urls.length) {
          _request();
        }
        // 整体的请求什么时候结束
        if (count === urls.length) {
          resolve(result);
        }
      }
    }
    for (let i = 0; i < Math.min(maxNum, urls.length); i++) {
      _request();
    }
  });
}
