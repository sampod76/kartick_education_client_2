'use client';

import {
  useAddMilestoneMutation,
  useGetSingleMilestoneQuery,
} from '@/redux/api/adminApi/milestoneApi';

import { Button, Col, Form, Input, message, Row, Select, Spin } from 'antd';
import { useState } from 'react';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import ModalComponent from '@/components/Modal/ModalComponents';
import CreateGradeLevel from '@/components/gradeLevel/CreateGradeLevel';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import { useGetAllGradeLevelQuery } from '@/redux/api/adminApi/gradeLevelApi';
//

// courseId -->For update
const CreateMilestone = ({ courseId, categoryId, title, milestoneId }: any) => {
  const [form] = Form.useForm();
  const { data: getAllGrade, isLoading: gradeLoading } = useGetAllGradeLevelQuery({});
  const { data: getMilestone, isLoading } = useGetSingleMilestoneQuery(milestoneId);
  const getAllGradeLevel = getAllGrade?.data?.map((item: any) => {
    return {
      label: item?.title,
      value: item?._id,
    };
  });
  const { userInfo, userInfoLoading } = useGlobalContext();

  const [isReset, setIsReset] = useState(false);

  const [addMilestone, { isLoading: serviceLoading }] = useAddMilestoneMutation();

  const onSubmit = async (values: any) => {
    console.log('🚀 ~ onSubmit ~ values:', values);
    if (!courseId) {
      message.error('Course must be selected');
      return;
    }

    removeNullUndefinedAndFalsey(values);

    const MilestoneData: any = {
      ...values,
      category: categoryId,
      course: courseId,
    };
    if (values.milestone_number) {
      MilestoneData['milestone_number'] = Number(values.milestone_number);
    }

    removeNullUndefinedAndFalsey(MilestoneData);

    try {
      const res = await addMilestone(MilestoneData).unwrap();
      if (res?.success === false) {
        message.error(res?.message);
      } else {
        message.success('Successfully added Milestone');
        setIsReset(true);
        form.resetFields();
      }
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  return (
    <>
      <h1 className="text-base font-normal">Course: {title}</h1>
      <div
        style={{
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          borderRadius: '1rem',
          backgroundColor: 'white',
          padding: '1rem',
        }}
      >
        {courseId ? (
          <div>
            <h1 className="my-2 text-xl font-bold">
              Create Milestone <br />
              <span className="text-base text-red-500">
                (There will now be only one milestone for each Course and that will be Any
                title)
              </span>
            </h1>

            <Form
              form={form}
              layout="vertical"
              onFinish={onSubmit}
              initialValues={getMilestone ? { ...getMilestone } : {}}
            >
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '5px',
                  padding: '15px',
                }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <Col xs={24} md={12} lg={12} style={{}}>
                    <Form.Item label="Select Grade level" name="grade_level_id">
                      <Select
                        size="large"
                        loading={gradeLoading}
                        placeholder="Select your grade level"
                        options={getAllGradeLevel?.length ? getAllGradeLevel : []}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={4} lg={4} style={{}}>
                    <ModalComponent buttonText="Add grade level">
                      <CreateGradeLevel />
                    </ModalComponent>
                  </Col>
                </div>

                <Row gutter={[12, 12]}>
                  <Col xs={24}>
                    <Form.Item
                      name="title"
                      label="Milestone Title"
                      rules={[
                        { required: true, message: 'Please enter a milestone title' },
                      ]}
                    >
                      <Input placeholder="Please enter a milestone title" size="large" />
                    </Form.Item>
                  </Col>

                  <Col xs={4}>
                    <Form.Item name="milestone_number" label="Milestone No">
                      <Input type="number" placeholder="Milestone No" size="large" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div className="mx-auto w-fit mt-4 text-center">
                {serviceLoading ? (
                  <Spin />
                ) : (
                  <Button type="primary" htmlType="submit">
                    Create Milestone
                  </Button>
                )}
              </div>
            </Form>
          </div>
        ) : (
          <div className="flex min-h-64 w-full animate-pulse items-center justify-center">
            <h1 className="text-center text-2xl font-semibold text-red-600">
              First select your Course by filtering
            </h1>
          </div>
        )}
      </div>
    </>
  );
};

export default CreateMilestone;
