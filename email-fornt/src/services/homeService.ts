import request from "@/untils/request";

/**
 * 获取apis
 * @param params
 * @returns
 */
const getNews = () => {
  return request.get("https://api.vvhan.com/api/60s");
};

export { getNews };
