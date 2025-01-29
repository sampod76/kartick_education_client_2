'use client';
import { useAddEmailMarketingMutation } from '@/redux/api/public/emailMarketingApi';
import { Error_model_hook, Success_model } from '@/utils/modalHook';
import { Button, Form, Input } from 'antd';

const EmailCollect = () => {
  const [addEmailMarketing, { isLoading }] = useAddEmailMarketingMutation();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    console.log('Form Values:', values);
    try {
      const res = await addEmailMarketing({ ...values }).unwrap();
      Success_model('Successfully submitted');
      form.resetFields();
    } catch (error) {
      console.log('🚀 ~ onFinish ~ error:', error);
      Error_model_hook(error);
    }
  };

  return (
    <Form
      form={form}
      onFinish={onFinish}
      className="mx-auto p-6 rounded-lg text-left"
      layout="vertical"
    >
      <Form.Item
        label={<p className="text-white">Name</p>}
        name="name"
        rules={[{ required: true, message: 'Please enter your name!' }]}
      >
        <Input placeholder="Please enter your name" className="w-full p-3 rounded-lg" />
      </Form.Item>
      <Form.Item
        label={<p className="text-white">Email</p>}
        name="email"
        rules={[
          { required: true, message: 'Please enter your email!' },
          { type: 'email', message: 'Please enter a valid email!' },
        ]}
      >
        <Input
          placeholder="Please enter your email"
          type="email"
          className="w-full p-3 rounded-lg"
        />
      </Form.Item>
      <Form.Item name="description" label={<p className="text-white">Comments</p>}>
        <Input.TextArea
          placeholder="Comments"
          rows={8}
          className="w-full p-3 rounded-lg"
        />
      </Form.Item>
      <div className="flex justify-center items-center my-7">
        <Button
          type="default"
          loading={isLoading}
          htmlType="submit"
          className="rounded-2xl px-3 text-[12px] lg:text-base font-semibold w-8/12"
        >
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default EmailCollect;
