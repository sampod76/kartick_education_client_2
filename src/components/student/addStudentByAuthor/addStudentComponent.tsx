'use client';

import Form from '@/components/Forms/Form';
import FormDatePicker from '@/components/Forms/FormDatePicker';
import FormInput from '@/components/Forms/FormInput';
import FormSelectField from '@/components/Forms/FormSelectField';
import FormTextArea from '@/components/Forms/FormTextArea';
import UploadImage from '@/components/ui/UploadImage';
import { bloodGroupOptions, genderOptions } from '@/constants/global';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import { useAddStudentWithAuthorDataMutation } from '@/redux/api/adminApi/studentApi';
import type { DatePickerProps } from 'antd';

import { IStudentCreate } from '@/types/userTypes';
import { Error_model_hook, Success_model } from '@/utils/modalHook';

import { Button, Col, Row, message, DatePicker, Space, Typography } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
const CreateStudentComponent = ({
  setOpen,
  author,
}: {
  setOpen?: any;
  author?: string;
}) => {
  const [studentInfo, setStudentInfo] = useState<any>({
    email: '',
    password: '',
  });
  const [otherData, setOtherData] = useState<any>({
    imageLoading: false,
    dateOfBirth: '',
  });
  const [isReset, setIsReset] = useState(false);
  const [addStudentWithAuthorFormData, { isLoading }] =
    useAddStudentWithAuthorDataMutation();

  const onSubmit = async (values: IStudentCreate & { img: any }) => {
    //// console.log(values, "values of student");
    removeNullUndefinedAndFalsey(values);
    const { password, ...otherValue } = values;
    const studentData = {
      password,
      student: { ...otherValue, author, dateOfBirth: otherData?.dateOfBirth },
    };

    //// console.log(studentData);

    try {
      const res = await addStudentWithAuthorFormData({
        ...studentData,
      }).unwrap();
      if (res?.success == false) {
        Error_model_hook(res?.message);
      } else {
        setStudentInfo({ email: res.email, password: password });
        Success_model('Student created successfully');
        setIsReset(true);
        setOpen(false);
      }
      // message.success("Admin created successfully!");
    } catch (err: any) {
      console.error(err);
      Error_model_hook(err?.message || err?.data);
    }
  };
  const selectDate: DatePickerProps['onChange'] = (date, dateString) => {
    // console.log(date, dateString);
    setOtherData((c: any) => ({ ...c, dateOfBirth: dateString }));
  };
  // Function to disable future dates
  const disableFutureDates = (current: any) => {
    // Disable dates after today
    return current && current > dayjs().endOf('day');
  };
  // const defaultValues = {
  //   blood,
  // };

  return (
    <div
      style={{
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: '1rem',
        backgroundColor: 'white',
        padding: '1rem',
      }}
    >
      <h1 className="text-base font-normal text-center">Create student</h1>
      {/* resolver={yupResolver(adminSchema)} */}
      <div>
        <Form
          submitHandler={onSubmit}
          isReset={isReset}
          // resolver={yupResolver(createStudentSchema)}
        >
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
              Student Information
            </p>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: '10px',
                }}
              >
                <FormInput
                  type="text"
                  name="name.firstName"
                  size="large"
                  label="First Name"
                  required={true}
                />
              </Col>

              <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: '10px',
                }}
              >
                <FormInput
                  type="text"
                  name="name.lastName"
                  size="large"
                  label="Last Name"
                  required={true}
                />
              </Col>
              <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: '10px',
                }}
              >
                <FormInput
                  type="email"
                  name="email"
                  size="large"
                  label="Email address"
                  required={true}
                />
              </Col>
              <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: '10px',
                }}
              >
                <FormInput
                  type="password"
                  name="password"
                  size="large"
                  label="Password"
                  required={true}
                />
              </Col>

              {/* <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: "10px",
                }}
              >
                <FormSelectField
                  size="large"
                  name="bloodGroup"
                  options={bloodGroupOptions}
                  defaultValue={bloodGroupOptions[0]}
                  label="bloodGroup"
                  // placeholder="Select"
                  required={true}
                />
              </Col> */}
              <Col
                className="gutter-row"
                xs={24}
                style={{
                  marginBottom: '10px',
                }}
              >
                <UploadImage setState={setOtherData} name="img" />
              </Col>
            </Row>
          </div>

          {/* basic info */}
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
              Basic Information
            </p>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: '10px',
                }}
              >
                <FormSelectField
                  size="large"
                  name="gender"
                  options={genderOptions}
                  label="Gender"
                  placeholder="Select"
                  required={true}
                />
              </Col>

              <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: '10px',
                }}
              >
                <FormInput
                  type="number"
                  name="phoneNumber"
                  size="large"
                  label="Phone Number"
                  required={true}
                />
              </Col>
              <Col
                className="gutter-row"
                xs={24}
                md={12}
                lg={8}
                style={{
                  marginBottom: '10px',
                }}
              >
                {/* <FormDatePicker
                  name="dateOfBirth"
                  label="Date of birth"
                  size="large"
                  disablePrevious={false}
                /> */}
                <Typography.Text style={{ fontSize: '16px' }}>
                  Select date of birth
                </Typography.Text>
                <DatePicker
                  disabledDate={disableFutureDates}
                  allowClear
                  onChange={selectDate}
                  size="large"
                  placeholder="Select date of birth"
                  format="YYYY-MM-DD"
                  style={{ marginBottom: '10px', width: '100%' }}
                />
              </Col>

              <Col span={24} style={{ margin: '10px 0' }}>
                <FormTextArea name="address" label="Address" rows={4} />
              </Col>
            </Row>
          </div>
          <div className="flex justify-center items-center">
            <Button
              loading={isLoading}
              htmlType="submit"
              disabled={otherData?.imageLoading}
              type="default"
            >
              Create
            </Button>
          </div>
          {studentInfo?.email && (
            <div className="border-2 rounded-3xl w-fit p-5 m-5 border-gray-600 mx-auto  text-lg">
              <p>Email: {studentInfo?.email}</p>
              <p>Password: {studentInfo?.email}</p>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
};

export default CreateStudentComponent;
