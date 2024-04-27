import request from "@/untils/request";
interface New {
  new_keys: string[];
}
/**
 * 获取apis
 * @param params
 * @returns
 */
const getApisCateNews = (params: New): any => {
  return request.post("/api/cateNews", params);
};
/**
 * 获取apis
 * @param params
 * @returns
 */
const getApisCateNews1 = (params: New): any => {
  return request.post("/api/cateNews1", params);
};

export { getApisCateNews, getApisCateNews1 };
