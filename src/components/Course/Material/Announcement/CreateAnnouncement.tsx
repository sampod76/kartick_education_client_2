import { Button, DatePicker, Form, Input } from 'antd';
import React from 'react';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import {
  useAddAnnouncementMutation,
  useUpdateAnnouncementMutation,
} from '@/redux/api/adminApi/announcementApi';
import { getLastIdFromZohoMeeting } from '@/utils/getZohoId';
import { Error_model_hook, Success_model } from '@/utils/modalHook';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface AnnouncementFormProps {
  initialValues?: any;
  courseId?: string;
}

const AnnouncementForm: React.FC<AnnouncementFormProps> = ({
  initialValues,
  courseId,
}) => {
  const [form] = Form.useForm();
  const { userInfo, userInfoLoading } = useGlobalContext();

  const [addAnnounceMent, { isLoading }] = useAddAnnouncementMutation();
  const [updateAnnouncement, { isLoading: uLoading }] = useUpdateAnnouncementMutation();

  const handleFinish = async (values: any) => {
    try {
      if (values?.zoho?.link) {
        values.zoho = {
          link: values?.zoho?.link.trim(),
          meetId: getLastIdFromZohoMeeting(values?.zoho?.link),
        };
      }
      const formattedValues = {
        ...values,
        courseId,
        [`${userInfo?.role}UserId`]: userInfo?.id,
        [`${userInfo?.role}RoleBaseUserId`]: userInfo?.roleBaseUserId,
        startDate: values.dateRange ? values.dateRange[0].toISOString() : undefined,
        endDate: values.dateRange ? values.dateRange[1].toISOString() : undefined,
      };
      delete formattedValues.dateRange;
      if (initialValues?._id) {
        await updateAnnouncement({
          data: { ...formattedValues },
          id: initialValues._id,
        }).unwrap();
        Success_model('Successfully Updated Announcement');
      } else {
        await addAnnounceMent(formattedValues).unwrap();
        Success_model('Successfully Published Announcement');
        form.resetFields();
      }
    } catch (error) {
      console.log('🚀 ~ handleFinish ~ error:', error);
      Error_model_hook(error);
    }
  };

  // Disable past dates
  const disabledDate = (current: any) => {
    return current && current < dayjs().startOf('day');
  };

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        ...initialValues,
        'zoho.link': initialValues?.zoho?.link,
        dateRange:
          initialValues?.startDate && initialValues?.endDate
            ? [dayjs(initialValues.startDate), dayjs(initialValues.endDate)]
            : undefined,
      }}
      onFinish={handleFinish}
    >
      <Form.Item
        label="Title"
        name="title"
        rules={[{ required: true, message: 'Please enter the title' }]}
      >
        <Input placeholder="Enter Title" />
      </Form.Item>

      <Form.Item
        label="Zoho Link"
        name={['zoho', 'link']}
        rules={[
          // { required: true, message: 'Zoho Link is required' },
          {
            pattern: /^https?:\/\/meet\.zoho\.com\/[a-zA-Z0-9]+$/,
            message: 'Invalid Zoho Link format. Use https://meet.zoho.com/{id}',
          },
        ]}
      >
        <Input placeholder="Enter Zoho Link" />
      </Form.Item>
      {/* <Form.Item label="Zoho Number" name={['zoho', 'number']}>
        <Input placeholder="Enter Zoho Number" />
      </Form.Item> */}

      <Form.Item label="Another Link" name="link">
        <Input placeholder="Enter Link" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input.TextArea placeholder="Enter Description" rows={4} />
      </Form.Item>

      <Form.Item label="Date Range" name="dateRange">
        <RangePicker showTime disabledDate={disabledDate} />
      </Form.Item>

      <div className="flex items-center gap-3">
        <Form.Item>
          <Button loading={isLoading || uLoading} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="default" htmlType="reset">
            Reset
          </Button>
        </Form.Item>
      </div>
    </Form>
  );
};

export default AnnouncementForm;
