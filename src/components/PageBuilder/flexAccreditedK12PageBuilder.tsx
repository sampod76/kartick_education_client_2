'use client';

import {
  useGetSinglePageBuilderQuery,
  useUpdatePageBuilderMutation,
} from '@/redux/api/adminApi/pageBuilderApi';
import { FilProgressMultipleFilesUploaderS3 } from '@/utils/handleFileUploderFileProgress';
import { Error_model_hook } from '@/utils/modalHook';
import {
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Progress, Row, Upload } from 'antd';
import { useState } from 'react';
import CustomImageTag from '../ui/CustomTag/CustomImageTag';
import { FileProgress } from '../ui/FileUploader/FileUploaderUi';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
const { confirm } = Modal;
const FlexAccreditedK12 = ({
  readOnly = false,
  id,
}: {
  readOnly?: boolean;
  id: string;
}) => {
  const [fileProgressList, setFileProgressList] = useState<FileProgress[]>([]);

  const { data, isLoading } = useGetSinglePageBuilderQuery(id);
  let iniValue = { ...data?.data };

  //   console.log('🚀 ~ iniValue:', iniValue);
  const [form] = Form.useForm();

  const [updatePageBuilder, { isLoading: uloading }] = useUpdatePageBuilderMutation();

  const handleFinish = async (values: any) => {
    try {
      if (values.bannerImage && values.bannerImage[0].originFileObj) {
        const data = await FilProgressMultipleFilesUploaderS3(
          values.bannerImage,
          setFileProgressList,
        );

        values.bannerImage = data[0];
        // delete values.image;
      }

      if (iniValue._id) {
        const res = await updatePageBuilder({
          id: iniValue._id,
          data: values,
        }).unwrap();
        message.success('Successfully Updated');
      } else {
        // const res = await addMember(formData).unwrap();
        message.success('Successfully added');
        // form.resetFields();
      }
    } catch (error: any) {
      // message.error(error?.data?.message || error?.message || 'Somthing is wrong');
      Error_model_hook(error?.message);
    }
    form.resetFields(['bannerImage']);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (iniValue) {
    const { bannerImage, ...valueCopy } = iniValue;
    iniValue = valueCopy;
  }
  const handleFileChange = (info: any) => {
    const newFiles = info.fileList.map((file: any) => ({
      uid: file.uid,
      name: file.name,
      progress: 0,
      status: 'uploading',
      url: '',
    }));
    setFileProgressList(newFiles);
  };
  const showConfirm = (name: any, remove: any, type = 'Category') => {
    confirm({
      title: `Are you sure you want to remove this ${type}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes, Remove',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        remove(name);
      },
    });
  };
  return (
    <Form
      form={form}
      disabled={readOnly}
      onFinish={handleFinish}
      initialValues={iniValue._id ? { ...iniValue } : {}}
      layout="vertical"
      className="space-y-4"
    >
      <h1 className="text-center text-3xl py-1 underline">{iniValue.heading}</h1>
      <fieldset className="border-2 border-gray-300 rounded-md p-3">
        <legend className="font-bold px-2 whitespace-nowrap inline-block">
          Banner section
        </legend>

        <Form.Item label="Title" name="heading">
          <Input />
        </Form.Item>

        <div className="flex items-center gap-2">
          <Form.Item
            label="Profile"
            name="bannerImage"
            valuePropName="fileList"
            getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
          >
            <Upload
              multiple={false}
              listType="picture-card"
              showUploadList={true}
              maxCount={1}
              accept="image/*"
              beforeUpload={(file) => false} // Stop automatic upload
              customRequest={() => {}}
              onChange={handleFileChange}
            >
              Upload Image +
            </Upload>
          </Form.Item>
          {data?.data?.bannerImage && (
            <CustomImageTag
              src={data?.data?.bannerImage}
              height={900}
              width={900}
              className="w-32 cursor-pointer rounded-lg border border-purple-400"
              preview={true}
            />
          )}
        </div>
        <div className="lg:pr-10">
          {fileProgressList.map((file) => (
            <div key={file.uid} style={{ marginBottom: 16 }}>
              <div>{file.name}</div>
              <div className="flex justify-between items-center gap-1">
                <Progress
                  percent={file.progress}
                  status={
                    file.status === 'uploading'
                      ? 'active'
                      : file.status === 'done'
                        ? 'success'
                        : 'exception'
                  }
                />
              </div>
            </div>
          ))}
        </div>
      </fieldset>
      <Form.List name="allBottomLinks">
        {(fields, { add, remove }) => (
          <fieldset
            style={{
              border: '2px solid #ddd',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '20px',
            }}
          >
            <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>
              All Test Button
            </legend>

            {fields.map(({ key, name, ...restField }) => (
              <div
                key={key}
                style={{
                  marginBottom: 12,
                  padding: 12,
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  background: '#fafafa',
                  position: 'relative',
                }}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item {...restField} label="Button Title" name={[name, 'title']}>
                      <Input placeholder="Enter action button title" />
                    </Form.Item>
                  </Col>

                  <Col xs={24} md={12}>
                    <Form.Item
                      {...restField}
                      label="Button URL"
                      name={[name, 'link']}
                      rules={[
                        {
                          type: 'url',
                          message: 'Please enter a valid URL',
                        },
                      ]}
                    >
                      <Input placeholder="Enter action button URL" />
                    </Form.Item>
                  </Col>
                </Row>

                <button
                  type="button"
                  onClick={() => remove(name)}
                  style={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    background: '#ff4d4f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '3px',
                    padding: '2px 8px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            <Form.Item>
              <button
                type="button"
                onClick={() => add()}
                style={{
                  marginTop: 10,
                  background: '#1890ff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '3px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                }}
              >
                + Add Action Button
              </button>
            </Form.Item>
          </fieldset>
        )}
      </Form.List>

      <fieldset
        style={{
          border: '2px solid #ddd',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>
          First Paragraphs
        </legend>
        <Form.List name={`firstParagraphs`}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={24} md={20}>
                    <Form.Item
                      {...restField}
                      name={[name, 'h1']}
                      //@ts-ignore
                      fieldKey={[fieldKey, 'h1']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter a text',
                        },
                      ]}
                    >
                      <Input.TextArea
                        placeholder="Enter text"
                        className="w-full"
                        rows={6}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={2}>
                    <Button
                      type="link"
                      onClick={() => showConfirm(name, remove, 'item')}
                      icon={<MinusCircleOutlined />}
                      danger
                      className="!pb-10"
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </fieldset>
      <fieldset
        style={{
          border: '2px solid #ddd',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>Action Button</legend>
        <Form.Item label="Action Button Title" name={['actionButton', 'title']}>
          <Input placeholder="Enter action button title" />
        </Form.Item>
        <Form.Item
          label="Action Button Url"
          name={['actionButton', 'link']}
          rules={[
            {
              type: 'url',
              message: 'Please enter a valid URL',
            },
          ]}
        >
          <Input placeholder="Enter action button URL" />
        </Form.Item>
      </fieldset>
      <fieldset
        style={{
          border: '2px solid #ddd',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>Option section</legend>
        <Form.Item label="Option Title" name="firstItemTitle">
          <Input placeholder="Enter item title " />
        </Form.Item>
        <fieldset
          style={{
            border: '2px solid #ddd',
            padding: '10px',
            borderRadius: '5px',
          }}
        >
          <legend
            className="text-center"
            style={{ fontWeight: 'bold', padding: '0 10px' }}
          >
            Option add
          </legend>
          <Form.List name={`firstItems`}>
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, fieldKey, ...restField }) => (
                  <Row gutter={[16, 16]} key={key} align="middle">
                    <Col xs={24} sm={24} md={20}>
                      <Form.Item
                        {...restField}
                        name={[name, 'h1']}
                        //@ts-ignore
                        fieldKey={[fieldKey, 'h1']}
                        rules={[
                          {
                            required: true,
                            message: 'Please enter a text',
                          },
                        ]}
                      >
                        <Input placeholder="Enter text" className="w-full" />
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12} md={2}>
                      <Button
                        type="link"
                        onClick={() => showConfirm(name, remove, 'item')}
                        icon={<MinusCircleOutlined />}
                        danger
                        className="!pb-10"
                      >
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </fieldset>
      </fieldset>
      <fieldset
        style={{
          border: '2px solid #ddd',
          padding: '10px',
          borderRadius: '5px',
        }}
      >
        <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>Last Paragraphs</legend>
        <Form.List name={`secondParagraphs`}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }) => (
                <Row gutter={[16, 16]} key={key} align="middle">
                  <Col xs={24} sm={24} md={20}>
                    <Form.Item
                      {...restField}
                      name={[name, 'h1']}
                      //@ts-ignore
                      fieldKey={[fieldKey, 'h1']}
                      rules={[
                        {
                          required: true,
                          message: 'Please enter a text',
                        },
                      ]}
                    >
                      <Input.TextArea
                        placeholder="Enter text"
                        className="w-full"
                        rows={6}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={2}>
                    <Button
                      type="link"
                      onClick={() => showConfirm(name, remove, 'item')}
                      icon={<MinusCircleOutlined />}
                      danger
                      className="!pb-10"
                    >
                      Remove
                    </Button>
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  Add
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </fieldset>
      <div className="my-2 flex items-center justify-center gap-2 rounded-md border">
        <Form.Item>
          <Button loading={uloading} type="primary" className="mt-4" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        {!iniValue && (
          <Form.Item>
            <Button
              // loading={isLoading}
              type="dashed"
              className="mt-4"
              htmlType="reset"
            >
              Reset
            </Button>
          </Form.Item>
        )}
      </div>
    </Form>
  );
};

export default FlexAccreditedK12;
