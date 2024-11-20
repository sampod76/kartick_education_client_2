'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGetSingleCourseQuery } from '@/redux/api/adminApi/courseApi';
import { Empty, Tabs } from 'antd';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import AdditionalCourseCard from './AdditionalCourse/AdditionalCourseCard';
import Announcement from './Announcement/AnnouncementDistList';
import CourseCardMaterial from './CourseCardMaterial';

export default function CourseMaterialCom({ courseId }: { courseId: string }) {
  const { userInfo } = useGlobalContext();
  const { data, isLoading } = useGetSingleCourseQuery(courseId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const items = [
    {
      key: '1',
      label: 'Announcement',
      children: <Announcement courseId={courseId} />,
    },
    // {
    //   key: '2',
    //   label: 'Additional courses',
    //   children: <AdditionalCourseCard additional_courses={data.additional_courses} />,
    // },
    {
      key: '3',
      label: 'Tab 3',
      children: <Empty />,
    },
    {
      key: '4',
      label: 'Tab 4',
      children: <Empty />,
    },
  ];
  if (userInfo?.role === 'seller') {
    items.splice(1, 0, {
      key: '2',
      label: 'Additional courses',
      children: <AdditionalCourseCard additional_courses={data.additional_courses} />,
    });
  }

  return (
    <div>
      <CourseCardMaterial course={data} />
      <Tabs centered defaultActiveKey="1" items={items} />
    </div>
  );
}
