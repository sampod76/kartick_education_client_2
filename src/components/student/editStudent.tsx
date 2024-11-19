'use client';

import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
import { genderOptions } from '@/constants/global';
import {
  useGetSingleStudentQuery,
  useUpdateStudentMutation,
} from '@/redux/api/adminApi/studentApi';
import { multipleFilesUploaderS3 } from '@/utils/handelFileUploderS3';
import { Success_model } from '@/utils/modalHook';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
  Upload,
} from 'antd';
import dayjs from 'dayjs';
import CustomImageTag from '../ui/CustomTag/CustomImageTag';

const { Option } = Select;
const { TextArea } = Input;

const EditStudentComponent = ({ id }: { id: string }) => {
  const [form] = Form.useForm();

  const { data: singleStudent, isLoading } = useGetSingleStudentQuery(id, {
    skip: !Boolean(id),
  });

  const [updateStudent, { isLoading: updateLoading }] = useUpdateStudentMutation();

  const disableFutureDates = (current: any) => {
    return current && current > dayjs().endOf('day');
  };

  const onFinish = async (values: any) => {
    // Format dateOfBirth if selected
    if (values.dateOfBirth) {
      values.dateOfBirth = dayjs(values.dateOfBirth).format('YYYY-MM-DD');
    }
    values.name = {
      firstName: values['name.firstName'],
      lastName: values['name.lastName'],
    };

    try {
      if (Array.isArray(values?.img) && values?.img?.length) {
        const imageUrl = await multipleFilesUploaderS3([values.img[0]?.originFileObj]);
        values.img = imageUrl[0]?.url;
        values.image = imageUrl[0];
      }
      const res = await updateStudent({ id, data: values }).unwrap();
      Success_model('Successfully Updated');
    } catch (err: any) {
      message.error(err?.message || 'Error updating student');
    }
  };

  if (isLoading) {
    return <LoadingForDataFetch />;
  }

  const defaultValues = {
    ...singleStudent,
    'name.firstName': singleStudent?.name.firstName || '',
    'name.lastName': singleStudent?.name.lastName || '',
    gender: singleStudent?.gender || '',
    email: singleStudent?.email || '',
    phoneNumber: singleStudent?.phoneNumber || '',
    address: singleStudent?.address || '',
    dateOfBirth: singleStudent?.dateOfBirth
      ? dayjs(singleStudent?.dateOfBirth)
      : undefined,
  };
  if (defaultValues.img) {
    delete defaultValues.img;
  }
  if (defaultValues.image) {
    delete defaultValues.image;
  }
  return (
    <div>
      <Typography.Title level={3}>Edit Student</Typography.Title>
      <Form
        form={form}
        layout="vertical"
        initialValues={defaultValues}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Student Information */}
        <div
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: '5px',
            padding: '15px',
            marginBottom: '10px',
          }}
        >
          <Typography.Title level={5}>Student Information</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="First Name" name="name.firstName">
                <Input placeholder="Please enter your first name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12} lg={8}>
              <Form.Item label="Last Name" name="name.lastName">
                <Input placeholder="Please enter your last name" />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="email" label="Email Address">
                <Input placeholder="Enter email address" disabled readOnly />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item name="phoneNumber" label="Phone Number">
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <div className="flex justify-start items-center gap-4">
                {
                  <CustomImageTag
                    src={singleStudent?.image || singleStudent?.img}
                    alt=""
                    preview={true}
                    width={150}
                    height={150}
                    className="size-24 rounded-full"
                  />
                }
                <Form.Item
                  name="img"
                  label="Upload Profile"
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
              </div>
            </Col>
          </Row>
        </div>

        {/* Basic Information */}
        <div
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: '5px',
            padding: '15px',
            marginBottom: '10px',
          }}
        >
          <Typography.Title level={5}>Basic Information</Typography.Title>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item name="gender" label="Gender">
                <Select placeholder="Select gender">
                  {genderOptions.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item name="dateOfBirth" label="Date of Birth">
                <DatePicker
                  disabledDate={disableFutureDates}
                  style={{ width: '100%' }}
                  placeholder="Select date of birth"
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Address" name="address">
                <TextArea rows={4} placeholder="Please enter your address" />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
              <Form.Item label="Description" name="description">
                <TextArea rows={4} placeholder="Please enter your description" />
              </Form.Item>
            </Col>
          </Row>
        </div>

        <div className="flex justify-center">
          <Button type="primary" htmlType="submit" loading={updateLoading}>
            Update
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditStudentComponent;
