'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { Tabs } from 'antd';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import CreateLesson from '@/components/lesson/CreateLesson';
import LessonDashList from '@/components/lesson/LessonDashList';
import LessonSerialUpdate from '@/components/lesson/LessonSerialUpdate';
import { useGetSingleModuleQuery } from '@/redux/api/adminApi/moduleApi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function ModuleMaterialCom({ moduleId }: { moduleId: string }) {
  const router = useRouter();
  const path = usePathname();
  const searchQuery = useSearchParams();
  const mainTab = searchQuery.get('mainTab');
  const secondTab = searchQuery.get('secondTab');
  const { userInfo } = useGlobalContext();
  const { data, isLoading } = useGetSingleModuleQuery(moduleId);
  console.log('🚀 ~ ModuleMaterialCom ~ data:', data);

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
                key: '3',
                label: 'Lesson Create',
                children: (
                  <CreateLesson
                    categoryId={data?.category?._id || data?.category}
                    categoryTitle={' dd'}
                    courseId={data?.course?._id || data.course}
                    courseTitle={data?.course?.title}
                    milestoneId={data?.milestone?._id || data.milestone}
                    milestoneTitle={data?.milestone?.title}
                    moduleId={moduleId || data?._id}
                    moduleTitle={data?.title}
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
                      // category: data?.category,
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
  const handleMainTabChange = (activeKey: string) => {
    const currentParams = new URLSearchParams(searchQuery.toString());
    currentParams.set('mainTab', activeKey);
    router.replace(`${path}?${currentParams.toString()}`);
  };
  return (
    <div>
      {/* <CourseCardMaterial course={data} /> */}
      <div>
        <h1 className="text-center">Module title: {data?.title}</h1>
      </div>
      <Tabs
        onChange={handleMainTabChange}
        centered
        activeKey={mainTab || '1'}
        defaultActiveKey="1"
        items={items}
      />
    </div>
  );
}
