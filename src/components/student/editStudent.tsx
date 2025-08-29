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
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import { useEffect, useMemo } from 'react';

const { Option } = Select;
const { TextArea } = Input;

// ------- util: parse userId (IBL25GR8UI0000003) -------
function parseUserId(userId?: string) {
  if (!userId) return { year: '25', gradeNum: '0', serial: '0000000' };

  const clean = userId.trim().toUpperCase();

  // ধরুন সবসময় format: IBL<YY>GR<grade><PREFIX><serial>
  const year = clean.substring(3, 5); // IBL**25**

  const afterGR = clean.split('GR')[1] || ''; // e.g. "0SI000001"

  // এখানে SI বা UI যা-ই থাকুক, prefix detect করব
  const match = afterGR.match(/^(\d+)([A-Z]+)(\d+)$/);

  if (!match) {
    return { year, gradeNum: '0', serial: '0000000' };
  }

  const gradeNum = match[1]; // "0"
  const prefix = match[2]; // "SI" / "UI"
  const serial = match[3]; // "000001"

  return { year, gradeNum, serial, prefix };
}

const EditStudentComponent = ({ id }: { id: string }) => {
  const { userInfo } = useGlobalContext();
  const [form] = Form.useForm();

  const { data: singleStudent, isLoading } = useGetSingleStudentQuery(id, {
    skip: !Boolean(id),
  });

  const [updateStudent, { isLoading: updateLoading }] = useUpdateStudentMutation();

  const disableFutureDates = (current: any) => current && current > dayjs().endOf('day');

  const isAdmin = userInfo?.role === 'admin';

  useEffect(() => {
    if (!singleStudent?._id) return;
    const parsed = parseUserId(singleStudent?.userId);
    console.log('🚀 ~ EditStudentComponent ~ parsed:', parsed);
    form.setFieldsValue(
      singleStudent && {
        ...singleStudent,
        img: [],
        'name.firstName': singleStudent?.name?.firstName ?? '',
        'name.lastName': singleStudent?.name?.lastName ?? '',
        gender: singleStudent?.gender ?? '',
        email: singleStudent?.email ?? '',
        phoneNumber: singleStudent?.phoneNumber ?? '',
        address: singleStudent?.address ?? '',
        dateOfBirth: singleStudent?.dateOfBirth
          ? dayjs(singleStudent.dateOfBirth)
          : undefined,
        userId: parsed,
      },
    );
  }, [singleStudent?._id, form]);

  const onFinish = async (values: any) => {
    try {
      // format date
      if (values.dateOfBirth) {
        values.dateOfBirth = dayjs(values.dateOfBirth).format('YYYY-MM-DD');
      }

      // flatten name
      values.name = {
        firstName: values['name.firstName'],
        lastName: values['name.lastName'],
      };

      // merge userId parts back → IBL<yy>GR<g>UI<serial>
      if (values.userId) {
        const { year = '25', gradeNum = '0', serial = '0000000' } = values.userId;
        values.userId = `IBL${year}GR${gradeNum}UI${serial}`;
      }

      // handle image upload (optional)
      if (Array.isArray(values?.img) && values.img.length > 0) {
        const file = values.img[0]?.originFileObj;
        if (file) {
          const uploaded = await multipleFilesUploaderS3([file]);
          values.img = uploaded[0]?.url;
          values.image = uploaded[0];
        }
      }
      if (values?.img?.length === 0) {
        delete values.img;
      }
      // clean temp fields so backend না ভরে
      delete values['name.firstName'];
      delete values['name.lastName'];
      delete values.image;

      await updateStudent({ id, data: values }).unwrap();
      Success_model('Successfully Updated');
    } catch (err: any) {
      message.error(err?.message || 'Error updating student');
    }
  };

  if (isLoading) return <LoadingForDataFetch />;

  return (
    <div>
      <Typography.Title level={3}>Edit Student</Typography.Title>

      <Form
        form={form}
        layout="vertical"
        // initialValues={baseDefaults /* first paint only */}
        onFinish={onFinish}
        autoComplete="off"
      >
        {/* Student Information */}
        <div
          style={{
            border: '1px solid #d9d9d9',
            borderRadius: 5,
            padding: 15,
            marginBottom: 10,
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
                <Input readOnly title="This field is read-only" />
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="parentsEmail" label="Parent Email Address">
                <Input
                  title="This field is read-only, please contact admin to change"
                  placeholder="Enter parent email"
                  readOnly={!!singleStudent?.parentsEmail && !isAdmin}
                />
              </Form.Item>
            </Col>

            {/* OTP-style UserId field */}
            <Col xs={24} md={12} lg={10}>
              <Form.Item label="User ID" required>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Input
                    value="IBL"
                    disabled
                    style={{ width: 60, textAlign: 'center' }}
                  />

                  <Form.Item
                    name={['userId', 'year']}
                    noStyle
                    rules={[
                      { required: true, message: 'Year required' },
                      { pattern: /^\d{2}$/, message: '2-digit year' },
                    ]}
                  >
                    <Input
                      maxLength={2}
                      inputMode="numeric"
                      onChange={(e) =>
                        form.setFieldValue(
                          ['userId', 'year'],
                          e.target.value.replace(/\D/g, ''),
                        )
                      }
                      disabled={!isAdmin}
                      style={{ width: 50, textAlign: 'center' }}
                    />
                  </Form.Item>

                  <Input value="GR" disabled style={{ width: 45, textAlign: 'center' }} />

                  <Form.Item
                    name={['userId', 'gradeNum']}
                    noStyle
                    rules={[
                      { required: true, message: 'Grade required' },
                      { pattern: /^\d{1,2}$/, message: '1–2 digit grade' },
                    ]}
                  >
                    <Input
                      maxLength={2}
                      inputMode="numeric"
                      onChange={(e) =>
                        form.setFieldValue(
                          ['userId', 'gradeNum'],
                          e.target.value.replace(/\D/g, ''),
                        )
                      }
                      disabled={!isAdmin}
                      style={{ width: 40, textAlign: 'center' }}
                    />
                  </Form.Item>

                  <Input value="UI" disabled style={{ width: 50, textAlign: 'center' }} />

                  <Form.Item name={['userId', 'serial']} noStyle>
                    <Input disabled style={{ width: 110, textAlign: 'center' }} />
                  </Form.Item>
                </div>
              </Form.Item>
            </Col>

            <Col xs={24} md={8}>
              <Form.Item name="phoneNumber" label="Phone Number">
                <Input placeholder="Enter phone number" />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <div className="flex justify-start items-center gap-4">
                <CustomImageTag
                  src={singleStudent?.image || singleStudent?.img}
                  alt=""
                  preview
                  width={150}
                  height={150}
                  className="size-24 rounded-full"
                />
                <Form.Item
                  name="img"
                  label="Upload Profile"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    // e কখনো array, কখনো event object
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e?.fileList || [];
                  }}
                >
                  <Upload
                    multiple={false}
                    maxCount={1}
                    accept="image/*"
                    listType="picture-circle"
                    beforeUpload={() => false} // disable auto upload
                    customRequest={() => {}} // disable default request
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
            borderRadius: 5,
            padding: 15,
            marginBottom: 10,
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
