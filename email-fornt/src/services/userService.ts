import request from "@/untils/request";

interface Register {
  username?: string;
  password?: string;
  email?: string;
  code?: string;
  phone?: string;
  phoneCode?: string;
  codeType?: string;
}

/**
 * 注册
 * @param params
 * @returns
 */
const register = (params: Register) => {
  return request.post("/api/register", params);
};
/**
 * 登陆
 * @param params
 * @returns
 */
const login = (params: Register) => {
  return request.post("/api/login", params);
};
/**
 * 获取图片验证码
 * @param params
 * @returns
 */
const captcha = () => {
  return request.get("/api/captcha");
};

/**
 * 发送短信验证码
 * @param params
 * @returns
 */
const sendSmsCode = (params: { phone: string, codeType: string }) => {
  return request.post("/api/sendSmsCode", params);
};
/**
 * 发送短信验证码
 * @param params
 * @returns
 */
const addPhone = (params: { userId: string, phone: string, codeType: string }) => {
  return request.post("/api/addPhone", params);
};

/**
 * 登出
 * @param params
 * @returns
 */
const loginOut = () => {
  return request.post("/api/logout");
};
/**
 * 获取登录次数
 * @param params
 * @returns
 */

const loginsum = () => {
  return request.get("/api/loginCount");
};
/**
 * 头像上传
 * @param params
 * @returns
 */
const uploadAvatar = (params: Register) => {
  return request.post("/api/uploadAvatar", params, {
    requestType: "form",
  });
};
/**
 * 获取头像
 * @param params
 * @returns
 */
const getAvatar = () => {
  return request.get("/api/getAvatar");
};

export {
  register,
  login,
  captcha,
  sendSmsCode,
  addPhone,
  loginsum,
  loginOut,
  uploadAvatar,
  getAvatar,
};
