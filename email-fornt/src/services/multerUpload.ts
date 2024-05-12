import request from "@/untils/request";

interface MulterUploadParams {
  userId: string;
}

function getMulterUploads(params: MulterUploadParams): Promise<any> {
  return request.get("/api/multerUploads", params);
}

export { getMulterUploads };
