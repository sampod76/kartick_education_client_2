'use client';

import { useAddQuizMutation } from '@/redux/api/adminApi/quizApi';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import { Error_model_hook, Success_model } from '@/utils/modalHook';
import { Button, Col, Form, Input, InputNumber, Row } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
const TextEditor = dynamic(() => import('@/components/shared/TextEditor/TextEditor'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-32">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-600"></div>
    </div>
  ),
});
const CreateQuiz = ({
  categoryId,
  courseId,
  milestoneId,
  moduleId,
  lessonId,
}: {
  categoryId?: string;
  courseId?: string;
  milestoneId?: string;
  moduleId?: string;
  lessonId?: string;
  lessonTitle?: string;
}) => {
  const [form] = Form.useForm();
  const { userInfo } = useGlobalContext();

  const [isReset, setIsReset] = useState(false);

  const [addQuiz, { isLoading: quizLoading }] = useAddQuizMutation();

  const onSubmit = async (values: any) => {
    removeNullUndefinedAndFalsey(values);
    const createQuizeData: object = {
      ...values,
      category: categoryId,
      course: courseId,
      milestone: milestoneId,
      module: moduleId,
      lesson: lessonId,
    };
    // console.log(LessonData);
    try {
      const res = await addQuiz(createQuizeData).unwrap();
      // console.log(res);
      if (res?.success == false) {
        Error_model_hook(res?.message);
      } else {
        Success_model('Successfully added Quiz');
        setIsReset(true);
        form.resetFields();
      }
      // console.log(res);
    } catch (error: any) {
      Error_model_hook(error?.message);
      console.log(error);
    }
  };

  // if (serviceLoading) {
  //   message.loading("Loading...");
  // }

  return (
    <>
      {lessonId ? (
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
            {/* resolver={yupResolver(adminSchema)} */}
            {/* resolver={yupResolver(IServiceSchema)} */}
            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmit}
              initialValues={{ passingGrade: 80 }}
            >
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '5px',
                  padding: '15px',
                }}
              >
                <h1
                  style={{
                    textAlign: 'center',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                  }}
                >
                  Create Quiz
                </h1>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  {/* Quiz Title */}
                  <Col xs={24} style={{ marginBlock: '10px' }}>
                    <Form.Item
                      name="title"
                      label="Quiz Title"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter the quiz title',
                        },
                      ]}
                    >
                      <Input size="large" placeholder="Enter quiz title" />
                    </Form.Item>
                  </Col>

                  {/* Passing Grade */}
                  <Col xs={24} md={12} lg={4}>
                    <Form.Item
                      name="passingGrade"
                      label="Pass Mark (%)"
                      rules={[
                        {
                          required: true,
                          message: 'Please enter the passing grade',
                        },
                        {
                          validator: (_, value) => {
                            if (value < 0 || value > 100 || !Number.isInteger(value)) {
                              return Promise.reject(
                                new Error('Please enter an integer between 0 and 100'),
                              );
                            }
                            return Promise.resolve();
                          },
                        },
                      ]}
                    >
                      <InputNumber size="large" min={0} max={100} placeholder="80" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Submit Button */}
              <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                <Button
                  loading={quizLoading}
                  type="primary"
                  htmlType="submit"
                  style={{
                    backgroundColor: 'blue',
                    color: 'white',
                  }}
                >
                  Create Quiz
                </Button>
              </div>
            </Form>
          </div>
        </div>
      ) : (
        <div className="flex min-h-64 w-full animate-pulse items-center justify-center">
          <h1 className="text-center text-2xl font-semibold text-red-600">
            First select your Lesson by filtering{' '}
          </h1>
        </div>
      )}
    </>
  );
};

export default CreateQuiz;
