import request from "@/untils/request";

interface EmailList {
  userid: string;
}

type Ids = string[];

interface Status {
  messageId: string;
  status: boolean;
}
interface EmailArrray {
  senderName: string;
  sender: string;
  subject: string;
  recipient: string;
  recipientName: string;
  content: string;
  contentBlock: string;
}
/**
 * 获取邮件列表
 * @param params
 * @returns
 */
const getEmail = (params: EmailList) => {
  return request.get("/api/email", params);
};

/**
 * 获取用户列表
 * @returns
 */
const getUsers = () => {
  return request.get("/api/users");
};

/**
 * 发送邮件
 * @param params
 * @returns
 */
const sendEmail = (params: EmailArrray) => {
  return request.post("/api/sendEmail", params);
};
/**
 * 保存为草稿
 * @param params
 * @returns
 */
const saveDrafts = (params: EmailArrray) => {
  return request.post("/api/saveDrafts", params);
};
/**
 * 保存为草稿
 * @param params
 * @returns
 */
const getDrafts = () => {
  return request.get("/api/drafts");
};
/**
 * 删除草稿
 * @param params
 * @returns
 */
const deleteDrafts = (params: Ids) => {
  return request.post("/api/deleteDrafts", params);
};
/**
 * 根据id更新邮件是否已经阅读的接口
 * @param params
 * @returns
 */
const updateReadStatus = (params: Status) => {
  return request.post("/api/updateReadStatus", params);
};
/**
 * 根据id更新邮件是否已经阅读的接口
 * @param params
 * @returns
 */
const getEmailCount = () => {
  return request.get("/api/getEmailCount");
};
/**
 * 删除邮件
 * @param params
 * @returns
 */
const deleteEmail = () => {
  return request.post("/api/deleteEmail");
};

export {
  getEmail,
  getUsers,
  sendEmail,
  saveDrafts,
  getDrafts,
  deleteEmail,
  deleteDrafts,
  updateReadStatus,
  getEmailCount,
};
