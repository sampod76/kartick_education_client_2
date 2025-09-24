'use client';

import {
  useAddMilestoneMutation,
  useGetSingleMilestoneQuery,
  useUpdateMilestoneMutation,
} from '@/redux/api/adminApi/milestoneApi';

import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Spin,
  Upload,
} from 'antd';

import ModalComponent from '@/components/Modal/ModalComponents';
import CreateGradeLevel from '@/components/gradeLevel/CreateUpdateGradeLevel';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import { useGetAllGradeLevelQuery } from '@/redux/api/adminApi/gradeLevelApi';
import {
  useAddSellingReadyCourseMutation,
  useGetAllSellingReadyCourseQuery,
  useUpdateSellingReadyCourseMutation,
} from '@/redux/api/adminApi/selling_ready_courses';
import { multipleFilesUploaderS3 } from '@/utils/handelFileUploderS3';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
//
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
// courseId -->For update
const CreateMilestone = ({ courseId, categoryId, title, milestoneId }: any) => {
  const [textEditorValue, setTextEditorValue] = useState('');
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [form] = Form.useForm();
  const { data: getAllGrade, isLoading: gradeLoading } = useGetAllGradeLevelQuery({
    limit: 100,
    status: 'active',
    sortBy: 'serial_number',
    sortOrder: 'asc',
  });
  const { data: getMilestone, isLoading } = useGetSingleMilestoneQuery(milestoneId, {
    skip: !Boolean(milestoneId),
  });
  const getAllGradeLevel = getAllGrade?.data?.map((item: any) => {
    return {
      label: item?.title,
      value: item?._id,
    };
  });

  const [addMilestone, { isLoading: serviceLoading }] = useAddMilestoneMutation();
  const [updateMilestone, { isLoading: uLoading }] = useUpdateMilestoneMutation();
  const [publishMilestone, { isLoading: pLoading }] = useAddSellingReadyCourseMutation();
  const [updatePublishMilestone, { isLoading: upLoading }] =
    useUpdateSellingReadyCourseMutation();
  const { data, isLoading: courseLoading } = useGetAllSellingReadyCourseQuery(
    { milestone_id: milestoneId, limit: 1, status: 'active' },
    {
      skip: !Boolean(milestoneId),
    },
  );

  const sellingCourse = data?.data[0];
  useEffect(() => {
    if (getMilestone?.details) {
      setTextEditorValue(getMilestone?.details);
    }
  }, [getMilestone?._id]);
  if (isLoading || courseLoading) {
    return <LoadingSkeleton />;
  }
  const onSubmit = async (formValue: any) => {
    const { img, is_published, price, ...values } = formValue;

    try {
      if (getMilestone?._id) {
        const MilestoneData: any = {
          ...values,
          details: textEditorValue,
        };
        console.log('🚀 ~ onSubmit ~ MilestoneData:', MilestoneData);
        if (values.milestone_number) {
          MilestoneData['milestone_number'] = Number(values.milestone_number);
        }
        const publishCourseData: any = {
          milestone_id: getMilestone?._id,
          ...(is_published === false &&
            data?.data[0]?._id && {
              isStart: false,
              status: 'deactivate',
            }),
          ...(is_published === true && {
            isStart: true,
            status: 'active',
          }),
          price: Number(price),
        };
        setIsGlobalLoading(true);
        if (img?.length) {
          const imageUrl = await multipleFilesUploaderS3([img[0]?.originFileObj]);
          // values.imgs = imageUrl[0];
          publishCourseData['bannerImage'] = imageUrl[0];
        }

        // console.log('🚀 ~ onSubmit ~ sellingCourse:', sellingCourse);
        if (!sellingCourse?._id && is_published === true) {
          const res = await publishMilestone(publishCourseData).unwrap();
          message.success('Publish is successfully');
          return;
        } else if (sellingCourse?._id) {
          const res = await updatePublishMilestone({
            id: sellingCourse?._id,
            data: publishCourseData,
          }).unwrap();
          message.success('Successfully Update Publish');
          return;
        }

        removeNullUndefinedAndFalsey(MilestoneData);
        const resUpdate = await updateMilestone({
          id: getMilestone._id,
          data: MilestoneData,
        }).unwrap();
        message.success('Successfully Update Milestone');
      }
      //------------ create milestone --------------
      else {
        if (!courseId) {
          message.error('Course must be selected');
          return;
        }
        const MilestoneData: any = {
          ...values,
          category: categoryId,
          course: courseId,
          details: textEditorValue,
        };
        if (values.milestone_number) {
          MilestoneData['milestone_number'] = Number(values.milestone_number);
        }

        removeNullUndefinedAndFalsey(MilestoneData);
        const res = await addMilestone(MilestoneData).unwrap();
        message.success('Successfully added Milestone');
        form.resetFields();
      }
    } catch (error: any) {
      message.error(error?.message);
    } finally {
      setIsGlobalLoading(false);
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
        {courseId || milestoneId ? (
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
              initialValues={
                getMilestone
                  ? {
                      ...getMilestone,
                      is_published: sellingCourse?._id && true,
                      price: sellingCourse?.price,
                    }
                  : {}
              }
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
                    <Form.Item required label="Select Grade level" name="grade_level_id">
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
                  <Col xs={18}>
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
                {getMilestone?._id && (
                  <div>
                    <Col xs={8}>
                      <Form.Item name="is_published" valuePropName="checked">
                        <Checkbox>Publish Milestone</Checkbox>
                      </Form.Item>
                    </Col>
                    <Col xs={8}>
                      <Form.Item
                        name={['price']}
                        label="Price"
                        rules={[
                          {
                            required: false,
                            type: 'number',
                            min: 0,
                            message: 'Please enter a valid price',
                            transform: (value) => (value ? Number(value) : undefined),
                          },
                        ]}
                      >
                        <Input
                          type="number"
                          placeholder="Enter price"
                          size="large"
                          min={0}
                          step="0.01"
                        />
                      </Form.Item>
                    </Col>
                  </div>
                )}
                <Col xs={24}>
                  <Form.Item
                    name="img"
                    label="Banner (optional)"
                    valuePropName="fileList"
                    getValueFromEvent={(e) => (Array.isArray(e) ? e : e?.fileList)}
                  >
                    <Upload
                      multiple={false}
                      maxCount={1}
                      showUploadList={true}
                      accept={'image/*'}
                      listType="picture-circle"
                      beforeUpload={(file) => {
                        return false; // Stop automatic upload
                      }}
                      customRequest={() => {}} // Disable default upload behavior
                    >
                      <Button className="!font-sm !overflow-hidden">+</Button>
                    </Upload>
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item
                    name="short_description"
                    label="Short description (optional)"
                  >
                    <Input.TextArea placeholder="Short description" size="large" />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <div style={{ borderTopWidth: '2px' }} /* className=" border-t-2" */>
                    <p className="my-3 text-center text-xl font-bold">
                      Description (optional)
                    </p>
                    <TextEditorNotSetForm
                      textEditorValue={textEditorValue}
                      setTextEditorValue={setTextEditorValue}
                      height={300}
                    />
                  </div>
                </Col>
              </div>

              <div className="mx-auto w-fit mt-4 text-center">
                {serviceLoading || uLoading || isGlobalLoading ? (
                  <Spin />
                ) : (
                  <Button type="primary" htmlType="submit">
                    {getMilestone?._id ? 'Update' : 'Add'} Milestone
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
