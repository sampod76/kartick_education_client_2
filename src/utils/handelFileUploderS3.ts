import { instance as axiosInstance } from '@/helpers/axios/axiosInstance';
import { getBaseUrl } from '@/helpers/config/envConfig';
import axios from 'axios';
import { IFileAfterUpload } from '../types/globalType';
const url = `${getBaseUrl()}/aws/create-aws-upload-files-token`;
const singleFileUploaderInS3 = async (fileData: { pre_url: any }, uploadFile: any) => {
  try {
    const response = await axios({
      url: fileData.pre_url,
      method: 'PUT',
      data: uploadFile,
    });
    // const response = await axiosInstance({
    //   url: fileData.pre_url,
    //   method: "PUT",
    //   data: uploadFile,
    //   withCredentials: true,
    // });

    return fileData;
  } catch (error: any) {
    throw new Error(error?.message || 'Error');
  }
};
type IPreUrlParams = {
  filename: string;
  mimetype: string;
  uid?: string;
};

export const getS3PreUrlToken = async (data: Record<string, IPreUrlParams[]>) => {
  try {
    const response = await axiosInstance.post(
      url,
      data, //example {files:[{ filename: string; mimetype: string; uid?: string; }]}
      {
        withCredentials: true,
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || error.message || 'Error');
  }
};
export const multipleFilesUploaderS3 = async (
  files: any[],
): Promise<IFileAfterUpload[]> => {
  if (!files.length) {
    return [];
  }
  try {
    const filesModifyServerFormate = files.map((file, index) => {
      let uid = file?.uid;
      if (!uid) {
        uid = crypto.randomUUID();
        files[index].uid = uid;
      }
      return {
        filename: file.name,
        mimetype: file.type,
        uid: uid, //!when use ant-d uploader then file.originFileObj in have --> default (uid) . when use custom uploader then add uid custom
      };
    });

    //-----------------------get pre-url-----------------------------
    const promises: any[] = [];
    const getFilesToken = await getS3PreUrlToken({
      documents: filesModifyServerFormate,
    });
    const serverResponseObjects = getFilesToken?.documents || [];
    //----------------------------------------------------------------
    files?.forEach((file) => {
      const serverObject = serverResponseObjects?.find(
        (serverFile: { uid: any }) => serverFile?.uid === file?.uid,
      );
      const mainUploadFile = file.originFileObj ? file.originFileObj : file;
      const fileUpload = singleFileUploaderInS3(serverObject, mainUploadFile);
      promises.push(fileUpload);
    });
    const result = await Promise.all(promises);
    return result;
  } catch (error: any) {
    throw new Error(error?.message || 'Error');
  }
};
