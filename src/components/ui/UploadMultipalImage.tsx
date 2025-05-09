import { FilProgressMultipleFilesUploaderS3 } from '@/utils/handleFileUploderFileProgress';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Image, Progress, Upload } from 'antd';
import type { UploadChangeParam } from 'antd/es/upload';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { FileProgress } from './FileUploader/FileUploaderUi';

type ImageUploadProps = {
  name: string;
  defaultImage?: string[];
  customChange?: any;
  isReset?: boolean;
  isImageloading?: any;
  multiple?: boolean;
};

const UploadMultipalImage = ({
  name,
  defaultImage = [],
  customChange,
  isReset = false,
  isImageloading = false,
  multiple = false,
}: ImageUploadProps) => {
  const [fileProgressList, setFileProgressList] = useState<FileProgress[]>([]);

  const [loading, setLoading] = useState(false);

  const [imagesUrl, setImagesUrl] = useState<string[]>(defaultImage);

  const { setValue } = useFormContext();
  useEffect(() => {
    setValue(name, imagesUrl);
  }, [imagesUrl, name, setValue]);

  const handleImageProcessing = useCallback(
    async (file: any) => {
      try {
        setLoading(true);
        if (Array.isArray(file) && file.length === 0) {
          return;
        }

        // Get the compressed image URL
        const result = await FilProgressMultipleFilesUploaderS3(
          Array.isArray(file) ? file : [file],
          setFileProgressList,
        );

        // setImagesUrl((prevImages) => [...prevImages, imgUrl]);
        setImagesUrl(result.map((item) => item.url));
        setLoading(false);
        if (isImageloading) {
          isImageloading(true);
        }
      } catch (error) {
        console.error('Error processing image:', error);
        setLoading(false);
        if (isImageloading) {
          isImageloading(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [isImageloading],
  );

  const handleChange: UploadProps['onChange'] = async (
    info: UploadChangeParam<UploadFile>,
  ) => {
    // console.log('🚀 ~ info:', info);
    // if (info.file.status === 'uploading') {
    //   setLoading(true);
    //   if (isImageloading) {
    //     isImageloading(true);
    //   }
    //   return;
    // }
    // if (info.file.status === 'done') {
    //   // Get this url from response in real world.
    // }
    if (info.fileList.length === 0) {
      setImagesUrl([]);
    } else {
      await handleImageProcessing(info.fileList);
    }
  };

  const uploadButton = (
    <div className="">
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useEffect(() => {
    if (isReset) {
      setImagesUrl([]);
    }
  }, [isReset]);

  return (
    <div className="flex justify-center items-center border p-5 rounded-lg my-2 gap-3">
      {defaultImage.length
        ? defaultImage?.map((image, i) => (
            <Image
              key={i}
              className=" rounded "
              src={image}
              width={300}
              height={120}
              alt=""
            />
          ))
        : null}
      <Upload
        name={name}
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={true}
        multiple={multiple}
        maxCount={5}
        // action="/api/file"
        accept="image/*"
        beforeUpload={() => false}
        onChange={handleChange}
      >
        {uploadButton}
      </Upload>
      <div>
        {loading && <LoadingOutlined />}
        {fileProgressList.map((file) => (
          <div key={file.uid} style={{ marginBottom: 16 }}>
            <div>{file.name}</div>
            <div className="flex justify-between items-center gap-1">
              <Progress
                percent={file.progress}
                status={
                  file.status === 'uploading'
                    ? 'active'
                    : file.status === 'done'
                      ? 'success'
                      : 'exception'
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UploadMultipalImage;
