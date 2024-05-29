import request from "@/untils/request";


interface GetUserParams {
  name313: string;
  email313: string;
  password3131: string;
}

/**
 * getUser
 * @param params 请求参数
 * @returns 返回值描述
 * Create a new user
 */
const getUser = (params: GetUserParams) => {
    return request.post("/api/user", params);
};

interface UpdateUserParams {
  name: string;
  email: string;
  password: string;
}

/**
 * updateUser
 * @param params 请求参数
 * @returns 返回值描述
 * Update an existing user
 */
const updateUser = (params: UpdateUserParams) => {
    return request.put("/api/user", params);
};

interface DeleteUserParams {
  name: string;
  email: string;
  password: string;
}

/**
 * deleteUser
 * @param params 请求参数
 * @returns 返回值描述
 * Delete an existing user
 */
const deleteUser = (params: DeleteUserParams) => {
    return request.delete("/api/user", params);
};

interface GetUsersParams {
  name: string;
  email: string;
  password: string;
}

/**
 * getUsers
 * @param params 请求参数
 * @returns 返回值描述
 * Get all users
 */
const getUsers = (params: GetUsersParams) => {
    return request.get("/api/users", params);
};

interface SendEmailParams {
  name: string;
  email: string;
  password: string;
}

/**
 * sendEmail
 * @param params 请求参数
 * @returns 返回值描述
 * Send an email
 */
const sendEmail = (params: SendEmailParams) => {
    return request.post("/api/email", params);
};

interface GetEmailsParams {
  
}

/**
 * getEmails
 * @param params 请求参数
 * @returns 返回值描述
 * Get all emails
 */
const getEmails = (params: GetEmailsParams) => {
    return request.get("/api/emails11", params);
};

export {
  getUser,
  updateUser,
  deleteUser,
  getUsers,
  sendEmail,
  getEmails,
};
