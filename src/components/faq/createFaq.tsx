'use client';

import { useAddFaqMutation } from '@/redux/api/faqApi';
import { Error_model_hook, Success_model } from '@/utils/modalHook';
import { Button, Col, Form, Input, Row } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const TextEditorNotSetValue = dynamic(
  () => import('@/components/shared/TextEditor/TextEditorNotSetForm'),
  {
    ssr: false, // Disable server-side rendering for this component
  },
);
const CreateFaqCom = ({ value }: { value?: any }) => {
  console.log('🚀 ~ CreateFaqCom ~ value:', value);
  const [form] = Form.useForm();
  const [textEditorValue, setTextEditorValue] = useState('');
  const [addFaq, { isLoading: blogLoading }] = useAddFaqMutation();
  const [update, { isLoading: uloading }] = useAddFaqMutation();

  const onSubmit = async (values: any) => {
    if (textEditorValue) {
      values.answer = textEditorValue;
    }
    try {
      if (value && value._id) {
        await update({ ...values, id: value._id });
        Success_model('Successfully updated FAQ');
      } else {
        const res = await addFaq(values).unwrap();
        Success_model('Successfully added FAQ');
        form.resetFields();
        setTextEditorValue('');
      }
    } catch (error: any) {
      Error_model_hook(error?.message);
    }
  };

  return (
    <div>
      <div
        style={{
          border: '1px solid #d9d9d9',
          borderRadius: '5px',
          padding: '15px',
          marginBottom: '10px',
        }}
      >
        <p
          style={{
            fontSize: '18px',
            marginBottom: '10px',
          }}
        >
          FAQ Information
        </p>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          initialValues={{
            ...value,
          }}
        >
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} style={{ marginBottom: '10px' }}>
              <Form.Item
                name="question"
                label="Question"
                rules={[{ required: true, message: 'Please enter a Question!' }]}
              >
                <Input size="large" />
              </Form.Item>
            </Col>

            <Col span={24} style={{ margin: '10px 0' }}>
              <TextEditorNotSetValue
                textEditorValue={textEditorValue}
                defaultTextEditorValue={value?.answer || ''}
                setTextEditorValue={setTextEditorValue}
                height={500}
              />
            </Col>
          </Row>

          <div className="flex justify-center items-center">
            <Button htmlType="submit" type="primary" loading={blogLoading || uloading}>
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateFaqCom;
