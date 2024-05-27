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

export { saveArticle, getArticleList };
