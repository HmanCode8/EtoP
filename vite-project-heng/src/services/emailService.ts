import request from "@/untils/request";

interface EmailList {
  userid: string;
}

type MessageId = {
  messageId: string;
};

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
 * 删除邮件
 * @param params
 * @returns
 */
const deleteEmail = (params: MessageId) => {
  return request.post("/api/deleteEmail", params);
};

export { getEmail, getUsers, sendEmail, saveDrafts, getDrafts, deleteEmail };
