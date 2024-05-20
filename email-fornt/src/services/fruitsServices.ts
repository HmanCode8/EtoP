
import request from "@/untils/request";

interface Fruit {
  name: string;
  description: string;
  color: string;
}

/**
 * 新增水果
 * @param params 
 * @returns 
 */
function addFruit(params: Fruit): Promise<any> {
  return request.post("/api/addFruit", params);
}

/**
 * 获取水果列表
 * @param params 
 * @returns 
 */
function getFruits(params: { page: number, pageSize: number }): Promise<any> {
  return request.get("/api/getFruits", params);
}

/**
 * 删除水果
 * @param params 
 * @returns 
 */
function deleteFruit(params: { id: string }): Promise<any> {
  return request.post("/api/deleteFruit", params);
}

/**
 * 更新水果
 * @param params 
 * @returns 
 */
function updateFruit(params: Fruit): Promise<any> {
  return request.post("/api/updateFruit", params);
}


export { addFruit, getFruits, deleteFruit, updateFruit };
