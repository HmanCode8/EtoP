import request from "@/untils/request";

interface Register {
  username: string;
  password: string;
  email: string;
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
const captcha = () => {
  return request.get("/api/captcha");
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
/**
 * 获取头像
 * @param params
 * @returns
 */
const sendMessageToAi = () => {
  return request.post("/api/sendMessageToAi");
};

export {
  register,
  login,
  captcha,
  loginsum,
  loginOut,
  uploadAvatar,
  getAvatar,
  sendMessageToAi,
};
