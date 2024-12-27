import { FilProgressMultipleFilesUploaderS3 } from '@/utils/handleFileUploderFileProgress';
import { ErrorModal } from '@/utils/modalHook';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Form, Progress, Upload } from 'antd';
import { useState } from 'react';
interface FileProgress {
  uid: string;
  name: string;
  progress: number;
  status: 'uploading' | 'done' | 'error';
}

export const FileUploaderUi = () => {
  const [fileProgressList, setFileProgressList] = useState<FileProgress[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const handleUpload = async () => {
    try {
      const data = await FilProgressMultipleFilesUploaderS3(
        fileList,
        setFileProgressList,
      );
      console.log(data);
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
    }));
    setFileList(info.fileList);
    setFileProgressList(newFiles);
  };

  return (
    <Form layout="vertical" onFinish={handleUpload}>
      <Form.Item
        label="Upload Videos"
        name="files"
        valuePropName="fileList"
        getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
      >
        <Upload
          multiple={true}
          listType="picture"
          beforeUpload={() => false}
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />}>Select Videos</Button>
        </Upload>
      </Form.Item>
      <div>
        {fileProgressList.map((file) => (
          <div key={file.uid} style={{ marginBottom: 16 }}>
            <div>{file.name}</div>
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
        ))}
      </div>
      <div className="flex items-center gap-2">
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            disabled={fileProgressList.some((file) => file.status === 'done')}
          >
            Upload All
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="dashed" onClick={() => setFileProgressList([])} htmlType="reset">
            Reset
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};
