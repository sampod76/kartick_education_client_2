'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { Tabs } from 'antd';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import QuizDashList from '@/components/Quiz/QuizDashList';
import CreateQuiz from '@/components/Quiz/create/CreateQuiz';
import { useGetSingleLessonQuery } from '@/redux/api/adminApi/lessoneApi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
export default function LessonMaterialCom({ lessonId }: { lessonId: string }) {
  const router = useRouter();
  const path = usePathname();
  const searchQuery = useSearchParams();
  const mainTab = searchQuery.get('mainTab');
  const secondTab = searchQuery.get('secondTab');
  const { userInfo } = useGlobalContext();
  const { data, isLoading } = useGetSingleLessonQuery(lessonId);
  console.log('🚀 ~ MilestoneMaterialCom ~ data:', data);

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
      label: 'Quizzes',
      children: (
        <div>
          <Tabs
            type="card"
            centered
            items={[
              {
                key: '1',
                label: 'Quizzes List',
                children: (
                  <QuizDashList
                    categoryId={data?.category?._id || data?.category}
                    courseId={data?.course?._id || data?.course}
                    milestoneId={data?.milestone?._id || data?.milestone}
                    moduleId={data?.module?._id || data?.module}
                    lessonId={lessonId || data?._id}
                  />
                ),
              },
              {
                key: '3',
                label: 'Create Quiz',
                children: (
                  <CreateQuiz
                    categoryId={data?.category?._id || data?.category}
                    courseId={data?.course?._id || data?.course}
                    milestoneId={data?.milestone._id || data?.milestone}
                    moduleId={data?.module?._id || data.module}
                    lessonId={lessonId || data?._id}
                  />
                ),
              },
              // {
              //   key: '2',
              //   label: 'Module Position Update',
              //   children: (
              //     <ModuleSerialUpdate
              //       queryObject={{
              //         course: data?.course?._id,
              //         category: data?.category,
              //         milestone: milestoneId,
              //       }}
              //     />
              //   ),
              // },
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
        <h1 className="text-center">Lesson title: {data?.title}</h1>
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
