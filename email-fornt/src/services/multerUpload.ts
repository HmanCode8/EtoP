import request from '@/untils/request';

interface MulterUploadParams {
  name: string;
  type: string;
  size: number;
  status: string;
  action: string;
  file: File;
  url: string;
}

function postMulterUploads(params: MulterUploadParams): Promise<any> {
  return request.post('/api/multerUploads', params, { requestType: 'form' })
}

export {
  postMulterUploads
}