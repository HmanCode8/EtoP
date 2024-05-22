import { ElMessage } from "element-plus";

const BASE_URL: string = import.meta.env.VITE_BASE_URL; // 基础 URL
const token = localStorage.getItem("token");
const xrhRequest = (url: string, params: any, callback: (e: any) => void, reqType: string) => {
  return new Promise((resolve, reject) => {
    try {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      // 遍历对象，将对象中的数据添加到 formData 中 params 为对象
      const keys = reqType === 'bigUpload'? params : {file: params.file}
      for (const key in keys) {
        if (params.hasOwnProperty(key)) {
          formData.append(key, params[key]);
        }
      }
      // 添加要上传的文件数据
      // formData.append("file", params.file); // fileInput 是文件输入框的引用
      xhr.upload.addEventListener("progress", function (e) {
        if (e.lengthComputable) {
          callback(e);
        }
      });
      xhr.open("POST", `${BASE_URL}${url}`, true);
      // 添加对 Content-Type 的设置
      // xhr.setRequestHeader("Content-Type", "multipart/form-data");
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      // 文件hash

      xhr.setRequestHeader("fileHash", params.hash);
      // 发送表单数据
      try {
        xhr.send(formData);
      } catch (error) {
        reject(error);
      }

      xhr.onload = function () {
        if (xhr.status === 200) {
          resolve({ ...JSON.parse(xhr.responseText) });
        } else {
          ElMessage.error(JSON.parse(xhr.responseText).message);
          reject(xhr.statusText);
        }
      };
    } catch (error) {
      reject(error);
    }
  });
};

export default xrhRequest;
