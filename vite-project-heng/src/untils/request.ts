import { ElLoading,ElNotification } from 'element-plus';

const BASE_URL: string = 'http://localhost:3000'; // 基础 URL

// 加载loading
let loadingInstance: any = null; // 修改为合适的类型

// 定义拦截器对象
interface Interceptors {
  request: Function[];
  response: Function[];
}

const interceptors: Interceptors = {
  request: [],
  response: []
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
  try {
    // 合并URL
    url = `${BASE_URL}${url}`;

    // 执行请求拦截器
    for (const interceptor of interceptors.request) {
      options = await interceptor(options);
    }
    const showLoading = options.showLoading || true;
    // 显示loading
    if (showLoading) {
      loadingInstance = ElLoading.service({
        fullscreen: true, lock: true,
        text: '请求加载中...',
        background: 'rgba(0, 0, 0, 0.7)',
      });
    }

    let response: Response = await fetch(url, options);

    // 隐藏loading
    if (showLoading) {
      loadingInstance.close();
    }

    // 执行响应拦截器
    for (const interceptor of interceptors.response) {
      response = await interceptor(response);
    }
    const data: any = await response.json();

    if (!response.ok) {
      return ElNotification({
        title: 'Error',
        message: data.message || response.statusText + '',
        type: 'warning',
      })
      // throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { status,ok, } = response
    return {
      code:status,
      status:ok,
      data
    };
  } catch (error:any) {
    ElNotification({
      title: 'Error',
      message: error.message,
      type: 'error',
    })
    // throw new Error(`Request failed: ${error.message}`);
  }
}

// 定义GET请求方法
export function get(url: string, params: any = {}): Promise<any> {
  const queryString = new URLSearchParams(params).toString();
  const fullUrl = queryString ? `${url}?${queryString}` : url;
  return request(fullUrl, { method: 'GET' });
}

// 定义POST请求方法
export function post(url: string, data: any = {}): Promise<any> {
  return request(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

// 导出模块
export default { get, post };
