'use client';

// import TextEditor from "@/components/shared/TextEditor/TextEditor";
import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { courseStatusOptions } from '@/constants/global';
import { ENUM_STATUS, ENUM_YN } from '@/constants/globalEnums';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import {
  useAddModuleMutation,
  useGetAllModuleQuery,
} from '@/redux/api/adminApi/moduleApi';
import { Error_model_hook, Success_model } from '@/utils/modalHook';
import { Button, Col, Form, Input, Row, Select, Spin } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const TextEditorNotSetForm = dynamic(
  () => import('@/components/shared/TextEditor/TextEditorNotSetForm'),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
      </div>
    ),
  },
);
export default function CreateModule({
  courseId,
  milestoneId,
  milestoneTitle,
  courseTitle,
  categoryId,
  categoryTitle,
}: {
  categoryId: string;
  categoryTitle?: string;
  courseId: string;
  courseTitle?: string;
  milestoneId: string;
  milestoneTitle: string;
}) {
  const [form] = Form.useForm();
  const { userInfo } = useGlobalContext();
  //
  const [textEditorValue, setTextEditorValue] = useState('');

  const [isReset, setIsReset] = useState(false);

  // const [textEditorValue, setTextEditorValue] = useState("");
  const [addModule, { isLoading: serviceLoading }] = useAddModuleMutation();
  const { data: existModule, isLoading: ModuleNumLoadingg } = useGetAllModuleQuery({
    status: ENUM_STATUS.ACTIVE,
    isDelete: ENUM_YN.NO,
    sortOrder: 'desc',
    limit: 1,
    course: courseId,
    // details: textEditorValue,
    milestone: milestoneId,
  });

  const onSubmit = async (values: any) => {
    if (!milestoneId && !courseId && !categoryId) {
      Error_model_hook('Please ensure your are selected milestone,course,category');
      return;
    }
    removeNullUndefinedAndFalsey(values);
    const ModuleData: object = {
      ...values,
      category: categoryId,
      course: courseId,
      details: textEditorValue,
      milestone: milestoneId,
    };
    removeNullUndefinedAndFalsey(ModuleData);
    try {
      const res = await addModule(ModuleData).unwrap();
      console.log(res);
      if (res?.success == false) {
        Error_model_hook(res?.message);
      } else {
        Success_model('Successfully added Module');
        setIsReset(true);
        form.resetFields();
      }
      // console.log(res);
    } catch (error: any) {
      Error_model_hook(error?.data);
      console.log(error);
    }
  };

  if (ModuleNumLoadingg) {
    return <LoadingSkeleton />;
  }

  return (
    <>
      {milestoneId ? (
        <div
          style={{
            boxShadow:
              '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            borderRadius: '1rem',
            backgroundColor: 'white',
            padding: '1rem',
          }}
        >
          <div>
            <Form
              form={form}
              onFinish={onSubmit}
              initialValues={{ status: 'active' }}
              layout="vertical"
              style={{
                border: '1px solid #d9d9d9',
                borderRadius: '5px',
                padding: '15px',
              }}
            >
              <p
                style={{ fontSize: '18px', marginBottom: '10px' }}
                className="text-center"
              >
                Create Module
              </p>
              <hr className="border-1.5 mb-2" />
              <Row gutter={[16, 16]}>
                <Col xs={24} md={20}>
                  <Form.Item
                    name="title"
                    label="Module Title"
                    rules={[{ required: true, message: 'Please input module title!' }]}
                  >
                    <Input size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8} lg={4}>
                  <Form.Item
                    label="Select  status"
                    name="status"
                    style={{ width: '100%' }}
                  >
                    <Select
                      size="large"
                      style={{ width: '100%' }}
                      placeholder="Select status"
                    >
                      {courseStatusOptions?.map((data: any) => (
                        <Select.Option
                          style={{ width: '100%' }}
                          value={data.value}
                          key={data.value}
                        >
                          <p className="capitalize"> {data.label}</p>
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                {/* <Col xs={24}>
                  <Form.Item label="Tags">
                    <TagsSelectUI />
                  </Form.Item>
                </Col> */}
                <Col xs={24}>
                  <div
                    style={{
                      borderTopWidth: '2px',
                    }} /* className=" border-t-2" */
                  >
                    <p className="my-3 text-center text-xl font-bold">
                      Description (optional)
                    </p>
                    <TextEditorNotSetForm
                      textEditorValue={textEditorValue}
                      setTextEditorValue={setTextEditorValue}
                    />
                  </div>
                </Col>
              </Row>
              <div className="flex items-center justify-center">
                {serviceLoading ? (
                  <Spin />
                ) : (
                  <Form.Item>
                    <Button type="primary" htmlType="submit">
                      Create Module
                    </Button>
                  </Form.Item>
                )}
              </div>
            </Form>
          </div>
        </div>
      ) : (
        <div className="flex min-h-64 w-full animate-pulse items-center justify-center">
          <h1 className="text-center text-2xl font-semibold text-red-600">
            First select your Milestone by filtering{' '}
          </h1>
        </div>
      )}
    </>
  );
}
