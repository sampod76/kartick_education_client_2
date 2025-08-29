import { useUploadVimeoVideoMutation } from '@/redux/api/fileUpload';
import { ErrorModal, Success_model } from '@/utils/modalHook';
import vimeoUrlChack from '@/utils/vimeoUrlChecker';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row } from 'antd';

export default function VimeoFileUpload() {
  const [uploadVimeoFileUpload, { isLoading }] = useUploadVimeoVideoMutation();
  const [form] = Form.useForm();
  const validateVimeoUrl = (_: any, value: string) => {
    const vimeoRegex = /^(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/(video\/)?\d+$/;

    if (!value || vimeoRegex.test(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Please enter a valid Vimeo video URL'));
  };
  const onFinish = async (values: any) => {
    try {
      values.videos.map((video: any) => {
        if (!video.fileName) {
          video.fileName = vimeoUrlChack(video.link)?.toString() || 'Vimeo Video';
        }
        return video;
      });
      console.log('Received values of form: ', values);
      const res = await uploadVimeoFileUpload(values.videos).unwrap();
      console.log('🚀 ~ onFinish ~ res:', res);
      form.resetFields();
      Success_model('Vimeo video uploaded successfully please check your file list');
    } catch (error) {
      console.error('Error submitting form:', error);
      // Handle error (e.g., show a message to the user)
      ErrorModal(error);
    }
  };
  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        style={{ padding: '0.5rem' }}
      >
        <Form.List name="videos">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row gutter={16} key={key} align="middle">
                  <Col xs={24} md={10}>
                    <Form.Item
                      {...restField}
                      name={[name, 'fileName']}
                      label="Filename (Optional)"
                      //   rules={[{ required: true, message: 'Please enter a filename' }]}
                    >
                      <Input placeholder="Enter filename" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      name={[name, 'link']}
                      label="Vimeo Video URL"
                      rules={[{ required: true, validator: validateVimeoUrl }]}
                    >
                      <Input placeholder="Enter Vimeo video URL" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={2}>
                    <MinusCircleOutlined
                      onClick={() => remove(name)}
                      style={{ fontSize: '1.2rem', color: 'red', marginTop: '2.3rem' }}
                    />
                  </Col>
                </Row>
              ))}
              {fields.length < 5 && (
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Video
                  </Button>
                </Form.Item>
              )}
            </>
          )}
        </Form.List>

        <Form.Item className="!flex !justify-center">
          <Button loading={isLoading} type="primary" htmlType="submit">
            Submit Videos
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
