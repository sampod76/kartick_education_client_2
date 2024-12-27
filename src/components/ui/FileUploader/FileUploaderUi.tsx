import { ENUM_MIMETYPE } from '@/constants/globalEnums';
import { useAddMultipleFileListMutation } from '@/redux/api/AllApi/fileListApi';
import { FilProgressMultipleFilesUploaderS3 } from '@/utils/handleFileUploderFileProgress';
import { ErrorModal, Success_model } from '@/utils/modalHook';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, message, Progress, Upload } from 'antd';
import { useState } from 'react';
import { MdContentCopy } from 'react-icons/md';
interface FileProgress {
  uid: string;
  name: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
  url?: string;
}

export const FileUploaderUi = () => {
  const [addFileList, { isLoading }] = useAddMultipleFileListMutation();
  const [fileProgressList, setFileProgressList] = useState<FileProgress[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const handleUpload = async () => {
    try {
      setLoading(true);
      const data = await FilProgressMultipleFilesUploaderS3(
        fileList,
        setFileProgressList,
      );
      const res = await addFileList({ files: data }).unwrap();
      setLoading(false);
      Success_model('Successful upload');
    } catch (error) {
      console.log('🚀 ~ handleUpload ~ error:', error);
      ErrorModal(error);
    }
  };

  const handleFileChange = (info: any) => {
    const newFiles = info.fileList.map((file: any) => ({
      uid: file.uid,
      name: file.name,
      progress: 0,
      status: 'uploading',
      url: '',
    }));
    setFileList(info.fileList);
    setFileProgressList(newFiles);
  };

  return (
    <div className="flex justify-center items-center">
      <Form layout="vertical" onFinish={handleUpload} className="border !p-5 rounded-lg">
        <Form.Item
          label="Upload"
          name="files"
          valuePropName="fileList"
          getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
        >
          <Upload
            multiple={true}
            listType="picture"
            accept={
              Object.values(ENUM_MIMETYPE).join(',') + ',' + 'image/*' + ',' + 'video/*'
            }
            beforeUpload={() => false}
            onChange={handleFileChange}
          >
            <Button icon={<UploadOutlined />}>Select any file</Button>
          </Upload>
        </Form.Item>
        <div>
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
                {file.url && (
                  <p
                    className="cursor-pointer"
                    onClick={() => {
                      if (file.url) {
                        navigator.clipboard.writeText(file.url);
                      }
                      message.success('Link Copy Success');
                    }}
                  >
                    <MdContentCopy />
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading || loading}
              disabled={fileProgressList.some((file) => file.status === 'done')}
            >
              Upload All
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => setFileProgressList([])}
              htmlType="reset"
            >
              Reset
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  );
};
