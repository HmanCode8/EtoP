import request from "@/untils/request";


interface MulterUploadParams {
  index: Number;
  total: Number;
  fileName: String;
  file: File;
}
/**
 * 大文件分块上传
 * @param params 
 * @returns 
 */
function bigFileUpload(params: MulterUploadParams): Promise<any> {
  return request.post("/api/bigFileUpload", params, { requestType: "form" });
}
/**
 * 大文件合并上传
 * @param params 
 * @returns 
 */
function mergeBigFile(params: {fileName: String}): Promise<any> {
  return request.post("/api/mergeBigFile", params);
}

function getMulterUploads(params: any): Promise<any> {
  return request.get("/api/multerUploads", params);
}

export { bigFileUpload, mergeBigFile, getMulterUploads };
