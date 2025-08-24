'use client';
import React from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import { ErrorModal } from '@/utils/modalHook';
import { useAddCerfymeMutation } from '@/redux/api/adminApi/certifymeApi';

const { Title } = Typography;

const CertifyForm: React.FC = () => {
  const [form] = Form.useForm();
  const [sendCerfyme, { isLoading }] = useAddCerfymeMutation();

  const onFinish = async (values: any) => {
    console.log('✅ Form Submitted:', values);
    try {
      const response = await sendCerfyme(values).unwrap();
      console.log('🚀 ~ onFinish ~ response:', response);
      message.success('Certificate data submitted successfully!');
      form.resetFields();
    } catch (error) {
      console.log('🚀 ~ onFinish ~ error:', error);
      ErrorModal(error);
    }

    // API call or next steps here...
  };

  const onFinishFailed = (errorInfo: any) => {
    console.error('❌ Form submission failed:', errorInfo);
    message.error('Please correct the errors and try again.');
  };

  return (
    <div
      style={{ maxWidth: 600, margin: 'auto', padding: 24 }}
      className="bg-white shadow-2xl p-5 rounded-xl shadow-pink-400"
    >
      <Title level={3}>Certificate Issue Form</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          label="Template ID"
          name="template_ID"
          rules={[{ required: true, message: 'Template ID is required' }]}
        >
          <Input placeholder="Enter Template ID" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input placeholder="Enter recipient's email" />
        </Form.Item>

        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter recipient's name" />
        </Form.Item>

        <Form.Item label="Custom Text" name="text">
          <Input placeholder="Optional custom text" />
        </Form.Item>

        <Form.Item label="Verify Mode" name="verify_mode">
          <Input placeholder="e.g., QR, code" />
        </Form.Item>

        <Form.Item label="Verify Code" name="verify_code">
          <Input placeholder="Verification code" />
        </Form.Item>

        <Form.Item label="License Number" name="license_number">
          <Input placeholder="Optional license number" />
        </Form.Item>

        <Form.Item>
          <Button loading={isLoading} type="primary" htmlType="submit">
            Issue Certificate
          </Button>
        </Form.Item>
      </Form>
      <div>
        <p className="text-red-500 text-end text-3xl">Error Api call certifyme</p>
      </div>
    </div>
  );
};

export default CertifyForm;
