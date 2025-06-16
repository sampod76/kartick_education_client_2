'use client';

import { ENUM_STATUS } from '@/constants/globalEnums';
import { Form, Input, Spin, Upload } from 'antd';

import {
  useAddGradeLevelMutation,
  useGetSingleGradeLevelQuery,
  useUpdateGradeLevelMutation,
} from '@/redux/api/adminApi/gradeLevelApi';
import { Error_model_hook, Success_model } from '@/utils/modalHook';

import fileObjectToLink from '@/utils/fileObjectToLink';
import { multipleFilesUploaderS3 } from '@/utils/handelFileUploderS3';
import { Button, Col, Typography } from 'antd';
import { useState } from 'react';
import ModalComponent from '../Modal/ModalComponents';
import PDFViewer from '../ui/PdfViewer';

const CreateUpdateGradeLevel = ({ id }: { id?: string }) => {
  const [globalLoading, setGlobalLoading] = useState(false);
  const [form] = Form.useForm();
  const { data, isLoading: isLoading2 } = useGetSingleGradeLevelQuery(id, {
    skip: !Boolean(id),
  });

  const [addGradeLevel, { isLoading: isLoading }] = useAddGradeLevelMutation();
  const [updateGradeLevel, { isLoading: uisLoading }] = useUpdateGradeLevelMutation();

  const onFinish = async (values: any) => {
    // console.log('🚀 ~ onFinish ~ values:', values);
    setGlobalLoading(true);
    const [files] = await Promise.all([
      values?.files?.length
        ? multipleFilesUploaderS3(values.files.map((re: any) => re.originFileObj))
        : Promise.resolve(null), // If no images, return null to prevent blocking
    ]);

    if (files) {
      values.files = files;
    }
    try {
      if (data) {
        await updateGradeLevel({
          id: id,
          data: values,
        });
        Success_model('Successfully update');
      } else {
        const res = await addGradeLevel({
          ...values,
        }).unwrap();

        Success_model('Created successfully');
        form.resetFields();
      }
    } catch (err: any) {
      console.error(err);
      Error_model_hook(err?.data);
    } finally {
      setGlobalLoading(false);
    }
  };

  if (isLoading2) {
    return <Spin size="large" />;
  }
  let greadLavelData: any = {};
  if (data) {
    const { files, ...rest } = data;

    greadLavelData = rest;
  }

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={onFinish}
        form={form}
        style={{ padding: '0.5rem' }}
        initialValues={data ? { ...greadLavelData } : { status: ENUM_STATUS.ACTIVE }}
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
                { required: data._id ? false : true, message: 'Title is required' },
              ]}
            >
              <Input size="large" placeholder="Grade title" />
            </Form.Item>
          </Col>
          <Form.Item
            // label="Image"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              // action="/upload"
              multiple={false}
              listType="text"
              maxCount={20}
              showUploadList={true}
              accept="application/pdf"
              beforeUpload={(file) => {
                return false; // Stop automatic upload
              }}
              customRequest={() => {}}
            >
              <Button className="!font-sm !overflow-hidden">Upload pdf</Button>
            </Upload>
          </Form.Item>

          {data?.files?.length && (
            <ModalComponent
              button={
                <p className="text-blue-700 underline-offset-0 cursor-pointer">
                  {' '}
                  View Grade Vocabulary : {data?.files[0]?.filename}
                </p>
              }
            >
              <PDFViewer file={fileObjectToLink(data?.files[0])} />
            </ModalComponent>
          )}

          <div className="mx-auto w-fit">
            {isLoading || uisLoading || globalLoading ? (
              <Spin />
            ) : (
              <Button type="primary" style={{ marginTop: '1rem' }} htmlType="submit">
                {id ? 'Update' : 'Create'}
              </Button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};

export default CreateUpdateGradeLevel;
