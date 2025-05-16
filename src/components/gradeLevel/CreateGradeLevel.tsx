'use client';

import { ENUM_STATUS } from '@/constants/globalEnums';
import { Form, Input, Spin } from 'antd';

import { useAddGradeLevelMutation } from '@/redux/api/adminApi/gradeLevelApi';
import { Error_model_hook, Success_model } from '@/utils/modalHook';

import { Button, Col, Typography } from 'antd';

const CreateGradeLevel = () => {
  const [form] = Form.useForm();
  const [addGradeLevel, { isLoading: isLoading }] = useAddGradeLevelMutation();

  const onFinish = async (values: any) => {
    console.log('🚀 ~ onFinish ~ values:', values);
    try {
      const res = await addGradeLevel({
        ...values,
      }).unwrap();
      console.log('🚀 ~ onFinish ~ res:', res);

      if (res?.success == false) {
        Error_model_hook(res?.message);
      } else {
        Success_model('Created successfully');
      }
    } catch (err: any) {
      console.error(err);
      Error_model_hook(err?.data);
    }
  };

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        style={{ padding: '0.5rem' }}
        initialValues={{ status: ENUM_STATUS.ACTIVE }}
      >
        <Typography.Title
          style={{
            textDecoration: 'underline',
            fontSize: '2rem',
            textAlign: 'center',
          }}
          level={5}
        >
          Create a new Grade
        </Typography.Title>

        <div
          style={{
            padding: '0.5rem',
          }} /* className="border-2 p-2 rounded-2" */
        >
          <Col xs={24} md={24} lg={19} style={{}}>
            <Form.Item
              label="Grade title"
              name="title"
              rules={[
                // {
                //   pattern: /^[\u0980-\u09FF\s]*$/,
                //   message: "বাংলায় শুধুমাত্র অক্ষর ব্যবহার করুন",
                // },
                { required: true, message: 'Title is required' },
              ]}
            >
              <Input size="large" placeholder="Grade title" />
            </Form.Item>
          </Col>

          <div className="mx-auto w-fit">
            {isLoading ? (
              <Spin />
            ) : (
              <Button type="primary" style={{ marginTop: '1rem' }} htmlType="submit">
                Create
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateGradeLevel;
