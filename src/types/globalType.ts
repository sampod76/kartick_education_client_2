export type IUploadFile = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};
export type IImagePlatform = 'imgbb' | 'cloudinary' | 'server' | 'aws' | string;
export const I_IMAGE_PLATFORM_ARRAY = ['imgbb', 'cloudinary', 'server', 'aws'];
export type IFileAfterUpload = {
  mimetype: string;
  server_url?: string;
  filename?: string;
  path?: string;
  url: string;
  durl?: string;
  uid?: string;
  platform: IImagePlatform;
  fileType: string;
  cdn?: string; //https://www.youtube.com/watch?v=kbI7kRWAU-w
  // fileId: Types.ObjectId | string | IFileUploade;
};
/* 
  {
  fieldname: 'image',
  originalname: 'download.png',
  encoding: '7bit',
  mimetype: 'image/png',
  destination: 'C:\\Users\\Sampod\\Desktop\\choutamar-UAA\\uploadFile\\images\\',
  filename: 'download-1711100541497.png',
  path: 'C:\\Users\\Sampod\\Desktop\\choutamar-UAA\\uploadFile\\images\\download-1711100541497.png',
  size: 349777
}
  
  */

export type I_YN = 'yes' | 'no';
export type I_STATUS = 'active' | 'inactive' | 'disable' | 'block';
