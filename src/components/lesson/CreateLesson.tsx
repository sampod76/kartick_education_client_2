/* eslint-disable react/jsx-no-undef */
'use client';

import { useAddLessonMutation } from '@/redux/api/adminApi/lessoneApi';

import { Error_model_hook, Success_model } from '@/utils/modalHook';

import { ENUM_MIMETYPE } from '@/constants/globalEnums';
import { removeNullUndefinedAndFalsey } from '@/hooks/removeNullUndefinedAndFalsey';
import { IFileAfterUpload } from '@/types/globalType';
import { multipleFilesUploaderS3 } from '@/utils/handelFileUploderS3';
import { isValidJson } from '@/utils/jsonUtls';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Select, Upload } from 'antd';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import FileContainShow from '../Course/FileContaintShow';
import ModalComponent from '../Modal/ModalComponents';
import ImageListInServer from '../ui/ImageListModal/ImageListCom';
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
interface Video {
  platform: 'youtube' | 'vimeo';
  link: string;
}
const { Option } = Select;
const CreateLesson = ({
  categoryId,
  categoryTitle,
  courseId,
  courseTitle,
  milestoneId,
  milestoneTitle,
  moduleId,
  moduleTitle,
}: {
  categoryId: string;
  courseId: string;
  milestoneId: string;
  moduleId: string;
  moduleTitle: string;
  courseTitle: string;
  milestoneTitle: string;
  categoryTitle: string;
}) => {
  const [customVideo, setCustomVideo] = useState<any>('');
  const [textEditorValue, setTextEditorValue] = useState('');
  const [form] = Form.useForm();
  const { userInfo, userInfoLoading } = useGlobalContext();
  const [videos, setVideos] = useState<Video[]>([{ platform: 'vimeo', link: '' }]);
  //----------------------------------------------------------------
  const [loading, setLoading] = useState(false);

  const [addLesson, { isLoading: addLoading }] = useAddLessonMutation();

  const onSubmit = async (values: any) => {
    if (!moduleId || !milestoneId || !courseId || !categoryId) {
      Error_model_hook(
        'Please ensure your are selected Lesson/milestone/course/category',
      );
      return;
    }
    setLoading(true);
    if (textEditorValue) {
      values.details = textEditorValue;
    }
    let files: IFileAfterUpload[] = [];
    if (values?.files?.length) {
      // const res = await multipleFilesUploaderS3(images);
      files = await multipleFilesUploaderS3(
        values?.files?.map((re: any) => re.originFileObj),
      );
      delete values?.files; // !after all error req to large
    }

    const LessonData: any = {
      ...values,
      category: categoryId,
      course: courseId,
      milestone: milestoneId,
      module: moduleId,
      files: files,
      videos: videos.length ? videos.filter((v) => v.link) : [],
    };
    if (customVideo && isValidJson(customVideo)) {
      LessonData['videos'].push(JSON.parse(customVideo));
      delete LessonData['customVideos'];
    }

    removeNullUndefinedAndFalsey(LessonData);

    try {
      const res = await addLesson(LessonData).unwrap();

      Success_model('Successfully added Lesson s');
      form.resetFields();
      setVideos([]);
      setCustomVideo('');
    } catch (error: any) {
      Error_model_hook(error?.message);
      // console.log(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const addVideo = () => {
    setVideos([...videos, { platform: 'vimeo', link: '' }]);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
  };

  const handleVideoChange = (index: number, key: keyof Video, value: string) => {
    const newVideos = [...videos];
    newVideos[index][key] = value as any;
    setVideos(newVideos);
  };

  return (
    <div>
      {moduleId ? (
        <div className="rounded-lg bg-white p-5 shadow-xl">
          {/* resolver={yupResolver(adminSchema)} */}
          {/* resolver={yupResolver(IServiceSchema)} */}

          <Form
            initialValues={{ status: 'active' }}
            className="p-5"
            layout="vertical"
            onFinish={onSubmit}
            form={form}
          >
            <h2 className="text-center">Create Lesson</h2>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-12">
              <Form.Item
                label="Lesson Title"
                name="title"
                rules={[{ required: true, message: 'Please enter the lesson title' }]}
                className="col-span-12"
              >
                <Input placeholder="Please enter.." />
              </Form.Item>
            </div>
            <fieldset
              style={{
                border: '2px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
              }}
              // className="col-span-10"
            >
              <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>
                Video Upload Section
              </legend>
              <div className="flex justify-between items-center">
                <p className="mb-2 text-sm text-gray-500">Custom Video JSON Format</p>
                <ModalComponent button={<Button type="primary">Upload Video </Button>}>
                  <ImageListInServer
                    addedImages={[]}
                    selectMultiple
                    setAddedImages={() => {}}
                  />
                </ModalComponent>
              </div>
              <Form.Item
                // label="Custom Video JSON Format"
                name="customVideos"
                className=""
              >
                <Input.TextArea
                  // width={750}
                  rows={5}
                  value={customVideo}
                  onChange={(e) => setCustomVideo(e.target.value)}
                  // className="!w-96"
                  placeholder="Please enter video JSON copy"
                />
                {isValidJson(customVideo) && (
                  <div className="mt-2 text-sm text-gray-500">
                    <FileContainShow files={[JSON.parse(customVideo)]} />
                  </div>
                )}
              </Form.Item>
              <div>
                {videos.map((video, index) => (
                  <div key={index} style={{ display: 'flex', marginBottom: '10px' }}>
                    <Select
                      value={video.platform}
                      onChange={(value) => handleVideoChange(index, 'platform', value)}
                      style={{ width: '20%', marginRight: '10px' }}
                    >
                      <Option value="vimeo">Vimeo</Option>
                      <Option value="youtube">Youtube</Option>
                    </Select>
                    <Input
                      placeholder="Enter Video URL"
                      value={video.link}
                      onChange={(e) => handleVideoChange(index, 'link', e.target.value)}
                      style={{ width: '70%', marginRight: '10px' }}
                    />
                    <MinusCircleOutlined
                      onClick={() => removeVideo(index)}
                      style={{ fontSize: '20px', color: 'red' }}
                    />
                  </div>
                ))}
                <div className="flex items-center justify-center">
                  <Button type="dashed" onClick={addVideo} className="">
                    <PlusOutlined /> Add Video
                  </Button>
                </div>
              </div>
            </fieldset>
            <fieldset
              style={{
                border: '2px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
              }}
              className="mt-5"
            >
              <legend style={{ fontWeight: 'bold', padding: '0 10px' }}>
                Add File (pdf/ppt/doc) Section
              </legend>

              <Form.Item
                // label="Image"
                name="files"
                valuePropName="fileList"
                getValueFromEvent={(e) => (Array.isArray(e) ? e : e && e.fileList)}
                className="flex items-center justify-center"
              >
                <Upload
                  // action="/upload"
                  multiple={true}
                  // listType=""
                  maxCount={20}
                  showUploadList={true}
                  accept={Object.values(ENUM_MIMETYPE).join(',')}
                  beforeUpload={(file) => {
                    return false; // Stop automatic upload
                  }}
                  customRequest={() => {}}
                >
                  <Button className="!font-sm !overflow-hidden">Add File</Button>
                </Upload>
              </Form.Item>
            </fieldset>
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
            <div className="flex justify-center items-center my-2">
              <Button
                // disabled={isLoading}
                type="primary"
                style={{ marginTop: '1rem' }}
                htmlType="submit"
                loading={addLoading || loading}
              >
                Create Lesson
              </Button>
            </div>
          </Form>
        </div>
      ) : (
        <div className="flex min-h-64 w-full animate-pulse items-center justify-center">
          <h1 className="text-center text-2xl font-semibold text-red-600">
            First select your Module by filtering{' '}
          </h1>
        </div>
      )}
    </div>
  );
};

export default CreateLesson;
