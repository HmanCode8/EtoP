import request from "@/untils/request";


interface GetUserParams {
  username: string;
  password: string;
  email: string;
}

/**
 * getUser
 * @param params 请求参数
 * @returns 返回值描述
 */
const getUser = (params: GetUserParams) => {
    return request.post("post", params);
};

interface GetListParams {
  username: string;
  password: string;
  email: string;
}

/**
 * getList
 * @param params 请求参数
 * @returns 返回值描述
 */
const getList = (params: GetListParams) => {
    return request.post("get", params);
};

export {
  getUser,
  getList,
};