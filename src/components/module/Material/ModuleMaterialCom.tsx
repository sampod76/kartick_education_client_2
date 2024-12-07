'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { Tabs } from 'antd';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import LessonDashList from '@/components/lesson/LessonDashList';
import LessonSerialUpdate from '@/components/lesson/LessonSerialUpdate';
import { useGetSingleModuleQuery } from '@/redux/api/adminApi/moduleApi';

export default function ModuleMaterialCom({ moduleId }: { moduleId: string }) {
  const { userInfo } = useGlobalContext();
  const { data, isLoading } = useGetSingleModuleQuery(moduleId);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  const items = [
    // {
    //   key: '2',
    //   label: 'Additional courses',
    //   children: <AdditionalCourseCard additional_courses={data.additional_courses} />,
    // },
    {
      key: '1',
      label: 'Lessons',
      children: (
        <div>
          <Tabs
            type="card"
            centered
            items={[
              {
                key: '1',
                label: 'Lesson List',
                children: (
                  <LessonDashList
                    queryObject={{
                      // course: data?.course,
                      // category: data?.category,
                      // milestone: data?.milestone?._id,
                      module: data?._id,
                      sortBy: 'lesson_number',
                      sortOrder: 'asc',
                    }}
                  />
                ),
              },
              {
                key: '2',
                label: 'Lesson Position Update',
                children: (
                  <LessonSerialUpdate
                    queryObject={{
                      // course: data?.course?._id,
                      // category: data.category,
                      module: moduleId,
                    }}
                  />
                ),
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* <CourseCardMaterial course={data} /> */}
      <div>
        <h1 className="text-center">Module title: {data?.title}</h1>
      </div>
      <Tabs centered defaultActiveKey="1" items={items} />
    </div>
  );
}
