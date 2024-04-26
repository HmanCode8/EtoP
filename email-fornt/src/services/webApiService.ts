import request from "@/untils/request";

/**
 * 获取apis
 * @param params
 * @returns
 */
const getWebApis = () => {
  return request.get("/api/webApis");
};
/**
 * r入库更新apis
 * @param params
 * @returns
 */
const insertWebApis = () => {
  return request.post("/api/insertWebApis");
};

export { getWebApis, insertWebApis };
