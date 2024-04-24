import request from "@/untils/request";

const WEB_API_URL = "https://api.oioweb.cn/libraries";
/**
 * 获取apis
 * @param params
 * @returns
 */
const getWebApis = () => {
  return request.get("/api/webApis");
};

export { getWebApis };
