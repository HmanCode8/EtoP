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
/**
 * 头像上传
 * @param params
 * @returns
 */
const uploadAvatar = (params: Register) => {
  return request.post("/api/uploadAvatar", params, { requestType: "form" });
};
/**
 * 获取头像
 * @param params
 * @returns
 */
const getAvatar = (params: Register) => {
  return request.get("/api/getAvatar", params);
};

export { register, login, uploadAvatar, getAvatar };
