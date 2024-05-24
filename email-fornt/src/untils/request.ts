import { ElLoading, ElNotification } from "element-plus";

const BASE_URL: string = import.meta.env.VITE_BASE_URL; // 基础 URL
// 加载loading
let loadingInstance: any = null; // 修改为合适的类型

// 定义拦截器对象
interface Interceptors {
  request: Function[];
  response: Function[];
}

const interceptors: Interceptors = {
  request: [],
  response: [],
};

/**
 * 添加请求拦截器
 * @param {function} callback 拦截器回调函数
 */
export function addRequestInterceptor(callback: Function): void {
  interceptors.request.push(callback);
}

/**
 * 添加响应拦截器
 * @param {function} callback 拦截器回调函数
 */
export function addResponseInterceptor(callback: Function): void {
  interceptors.response.push(callback);
}

/**
 * 发送HTTP请求
 * @param {string} url 请求的URL
 * @param {object} options 请求选项，包括method（方法）、headers（头部）、body（数据）
 * @returns {Promise} 返回一个Promise对象，用于处理请求的结果
 */
async function request(url: string, options: any = {}): Promise<any> {
  const showLoading = options.showLoading || true;

  try {
    // 合并URL,如果是一个完整的url直接使用就可以
    const newUrl = url.startsWith("http") ? url : `${BASE_URL}${url}`;
    // 添加 Authorization 头部
    const token = localStorage.getItem("token"); // 从 localStorage 中获取 Token，你可以根据实际情况获取
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    // 执行请求拦截器
    for (const interceptor of interceptors.request) {
      options = await interceptor(options);
    }
    // 显示loading
    if (showLoading) {
      loadingInstance = ElLoading.service({
        fullscreen: true,
        lock: true,
        text: "请求加载中...",
        background: "rgba(0, 0, 0, 0.7)",
      });
    }
    let response: Response = await fetch(newUrl, options);
    //总的数据量
    // let total: any = response.headers.get("Content-Length") ?? 0;
    let loaded = 0;
    const decoder = new TextDecoder();
    let streamData = "";
    // 监听下载进度
    // 监听下载进度
    const reader = (response.body as any).getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      loaded += value.length;
      streamData += decoder.decode(value);
      // const progress = (loaded / total) * 100;
      // console.log("progress===", progress);
    }
    // 打印响应数据
    // 隐藏loading
    if (showLoading) {
      loadingInstance.close();
    }

    // 执行响应拦截器
    for (const interceptor of interceptors.response) {
      response = await interceptor(response);
    }
    const data: any = JSON.parse(streamData);

    if (!response.ok) {
      ElNotification({
        title: "Error",
        message: "" + data.message || response.statusText + "",
        type: "warning",
      });
      setTimeout(() => {
        if (response.status === 302) {
          location.href = "/";
          localStorage.removeItem("token");
        }
      }, 1000);
      return;
      // throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { status, ok } = response;
    return (
      data || {
        code: status,
        status: ok,
        data,
      }
    );
  } catch (error: any) {
    ElNotification({
      title: "Error",
      message: error.message,
      type: "error",
    });
    // 隐藏loading
    if (showLoading) {
      loadingInstance.close();
    }

    // throw new Error(`Request failed: ${error.message}`);
  }
}

// 定义GET请求方法
export function get(url: string, params: any = {}): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request(fullUrl, { method: "GET" });
}

// 定义POST请求方法
export function post(
  url: string,
  data: any = {},
  config: any = {}
): Promise<any> {
  const { requestType = "" } = config;
  // const headersFrom = {
  //   "Content-Type": "multipart/form-data",
  //   a: "b", // 随便自己带个什么请求头
  // };
  // 执行文件上传
  let formData = new FormData();
  for (let key in data) {
    formData.append(key, data[key]);
  }
  const isUpload = requestType === "form";
  const ops: any = {
    method: "POST",
    body: isUpload ? formData : JSON.stringify(data),
  };
  if (!isUpload) {
    ops.headers = {
      "Content-Type": "application/json",
    };
  }
  return request(url, ops);
}
// 导出模块
export default { get, post };
