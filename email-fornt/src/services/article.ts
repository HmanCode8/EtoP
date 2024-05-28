import request from "@/untils/request";

interface Aticle {
  title: string;
  content: string;
}

const saveArticle = (params: Aticle) => {
  return request.post("/api/saveArticle", params);
};

const getArticleList = () => {
  return request.get("/api/getArticleList");
};

/**
 * eidtor 发送消息给ai
 * @param params
 * @returns
 */
const sendMessageToAi = (params:any) => {
  return request.post("/api/sendMessageToAi",params);
};

export { saveArticle, getArticleList,sendMessageToAi };
