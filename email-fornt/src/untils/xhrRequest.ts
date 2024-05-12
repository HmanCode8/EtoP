import { ElMessage } from "element-plus";

const BASE_URL: string = import.meta.env.VITE_BASE_URL; // 基础 URL
const token = localStorage.getItem("token");
const xrhRequest = (params: any, callback: (e: any) => void) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    // 添加要上传的文件数据
    formData.append("file", params.file); // fileInput 是文件输入框的引用
    xhr.upload.addEventListener("progress", function (e) {
      if (e.lengthComputable) {
        callback(e);
      }
    });
    xhr.open("POST", `${BASE_URL}/api/multerUploads`, true);
    // 添加对 Content-Type 的设置
    // xhr.setRequestHeader("Content-Type", "multipart/form-data");
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    // 文件hash

    xhr.setRequestHeader("fileHash", params.hash);
    // 发送表单数据
    xhr.send(formData);
    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve({ ...JSON.parse(xhr.responseText) });
      } else {
        ElMessage.error(JSON.parse(xhr.responseText).message);
        reject(xhr.statusText);
      }
    };
  });
};

export default xrhRequest;
