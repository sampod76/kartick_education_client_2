'use client';

import { USER_ROLE } from '@/constants/role';
import { useAddSellerWithFormDataMutation } from '@/redux/api/adminApi/sellerApi';
import { useAddStudentWithFormDataMutation } from '@/redux/api/adminApi/studentApi';
import { getUserInfo, storeUserInfo } from '@/services/auth.service';
import { Error_model_hook, Success_model } from '@/utils/modalHook';
import { Button, Col, DatePicker, Form, Input, Row, Select, Upload, message } from 'antd';
import dayjs from 'dayjs';

import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import { useUserLoginMutation } from '@/redux/api/auth/authApi';
import { multipleFilesUploaderS3 } from '@/utils/handelFileUploderS3';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { IDecodedInfo } from '../../../services/auth.service';
const { Option } = Select;
const { TextArea } = Input;
const SignUpTeacherAndStudent = ({ setOpen }: any) => {
  const [form] = Form.useForm();
  const router = useRouter();
  const [isReset, setIsReset] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [userLogin, { error, isLoading: LoginLoading }] = useUserLoginMutation();
  const [addStudentUserWithFormData, { isLoading: StudentLoading }] =
    useAddStudentWithFormDataMutation();
  const [addSellerUserWithFormData, { isLoading: SellerLoading }] =
    useAddSellerWithFormDataMutation();
  const [loading, setLoading] = useState(true);
  const userInfo = getUserInfo() as IDecodedInfo;
  useEffect(() => {
    if (userInfo.id) {
      router.back();
    }
    setLoading(false);
    return () => {};
  }, [router, userInfo]);

  if (loading) {
    return <LoadingForDataFetch />;
  }

  const onSubmit = async (values: any) => {
    console.log('🚀 ~ onSubmit ~ values:', values);
    removeNullUndefinedAndFalsey(values);

    try {
      values.name = {
        firstName: values['name.firstName'],
        lastName: values['name.lastName'],
      };
      setSubmitLoading(true);
      if (values?.img?.length) {
        const imageUrl = await multipleFilesUploaderS3([values.img[0]?.originFileObj]);
        values.img = imageUrl[0]?.url;
        values.image = imageUrl[0];
      }
      let res;
      console.log('🚀 ~ onSubmit ~ values:', values);

      if (values?.role === USER_ROLE.STUDENT) {
        const { password, ...allValue } = values;
        const modifyValue = {
          password: password,
          [USER_ROLE.STUDENT]: { ...allValue },
        };
        res = await addStudentUserWithFormData({ ...modifyValue }).unwrap();
      } else if (values?.role === USER_ROLE.SELLER) {
        const { password, ...allValue } = values;
        const modifyValue = {
          password: password,
          [USER_ROLE.SELLER]: { ...allValue },
        };
        res = await addSellerUserWithFormData({ ...modifyValue }).unwrap();
      } else {
        res = {
          success: false,
          message: 'not found',
        };
      }

      if (res?.success == false) {
        Error_model_hook(res?.message);
      } else {
        Success_model('User created successfully');
        setIsReset(true);
        try {
          const res = await userLogin({
            email: values?.email,
            password: values?.password,
          }).unwrap();
          if (res?.accessToken) {
            // router.push("/profile");
            message.success('User logged in successfully!');
            storeUserInfo({ accessToken: res?.accessToken });
            router.push('/');
            // setOpen(false)
          } else {
            Error_model_hook(res?.message);
          }
        } catch (err: any) {
          Error_model_hook(err?.data || err?.message);
          console.log(err);
        }
        // router.push('/login');
      }
      // message.success("Admin created successfully!");
    } catch (err: any) {
      console.error(err);
      Error_model_hook(err?.message || err?.data);
    } finally {
      setSubmitLoading(false);
    }
  };
  // if (AdminLoading || StudentLoading || SellerLoading) {
  //   message.loading("Loading...");
  //   return
  // }
  const disabledDate = (current: any) => {
    return current && current > dayjs().endOf('day'); // Disable future dates
  };
  return (
    <div className="">
      {/* <div className="-mt-[2rem] mb-4 lg:mb-6 ">
        <div className="w-full min-h-[3.3rem] bg-[#BEDDF9]"></div>
        <BannerSignUp />
      </div> */}
      {/* resolver={yupResolver(adminSchema)} */}
      <div className="container mx-auto rounded-lg bg-white p-5 shadow-2xl">
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          autoComplete="off"
          initialValues={{
            gender: '',
          }}
        >
          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '10px',
            }}
          >
            <p className="text-center text-2xl font-semibold">Registration</p>
            <hr className="my-2 border" />
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="First Name"
                  name="name.firstName"
                  rules={[{ required: true, message: 'Please enter your first name!' }]}
                >
                  <Input placeholder="Please enter your first name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Last Name"
                  name="name.lastName"
                  rules={[{ required: true, message: 'Please enter your last name!' }]}
                >
                  <Input placeholder="Please enter your last name" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Email Address"
                  name="email"
                  rules={[
                    { required: true, message: 'Please enter your email!' },
                    { type: 'email', message: 'Please enter a valid email!' },
                  ]}
                >
                  <Input placeholder="Please enter your email address" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Password"
                  name="password"
                  rules={[{ required: true, message: 'Please enter your password!' }]}
                >
                  <Input.Password placeholder="Please enter your password" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Role"
                  name="role"
                  rules={[{ required: true, message: 'Please select your role!' }]}
                >
                  <Select placeholder="Select role">
                    <Option value="seller">Teacher</Option>
                    <Option value="student">Student</Option>
                  </Select>
                </Form.Item>
              </Col>

              <Col xs={24}>
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
              </Col>
            </Row>
          </div>

          <div
            style={{
              border: '1px solid #d9d9d9',
              borderRadius: '5px',
              padding: '15px',
              marginBottom: '10px',
            }}
          >
            <p style={{ fontSize: '18px', marginBottom: '10px' }}>Basic Information</p>
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Gender"
                  name="gender"
                  rules={[{ required: true, message: 'Please select your gender!' }]}
                >
                  <Select placeholder="Please select gender">
                    <Option value="male">Male</Option>
                    <Option value="female">Female</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Phone Number"
                  name="phoneNumber"
                  rules={[
                    { required: true, message: 'Please enter your phone number!' },
                    { pattern: /^\d+$/, message: 'Please enter a valid phone number!' },
                  ]}
                >
                  <Input placeholder="Please enter a phone number" />
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  label="Date of Birth"
                  name="dateOfBirth"
                  rules={[
                    { required: true, message: 'Please select your date of birth!' },
                  ]}
                >
                  <DatePicker style={{ width: '100%' }} disabledDate={disabledDate} />
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

          <div className="flex items-center justify-center">
            <Button
              loading={SellerLoading || StudentLoading || LoginLoading || submitLoading}
              type="primary"
              htmlType="submit"
            >
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default SignUpTeacherAndStudent;

/* 


 */
