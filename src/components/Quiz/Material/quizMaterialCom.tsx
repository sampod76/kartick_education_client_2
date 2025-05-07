'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { Tabs } from 'antd';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import SingleQuizList from '@/components/single-auiz/SingleQuizList';
import CreateSingleQuiz from '@/components/single-auiz/create/CreateSingleQuiz';
import { useGetSingleQuizQuery } from '@/redux/api/adminApi/quizApi';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
export default function QuizMaterialCom({ quizId }: { quizId: string }) {
  const router = useRouter();
  const path = usePathname();
  const searchQuery = useSearchParams();
  const mainTab = searchQuery.get('mainTab');
  const secondTab = searchQuery.get('secondTab');
  const { userInfo } = useGlobalContext();
  const { data, isLoading } = useGetSingleQuizQuery(quizId);
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
      label: 'Single Quiz',
      children: (
        <div>
          <Tabs
            type="card"
            centered
            items={[
              {
                key: '1',
                label: 'Single Quizzes List',
                children: (
                  <SingleQuizList
                    categoryId={data?.category?._id || data?.category}
                    courseId={data?.course?._id || data?.course}
                    milestoneId={data?.milestone?._id || data?.milestone}
                    moduleId={data?.module?._id || data?.module}
                    lessonId={data.lesson?._id || data.lesson}
                    quizId={quizId}
                  />
                ),
              },
              {
                key: '3',
                label: 'Create Single Quiz',
                children: (
                  <CreateSingleQuiz
                    categoryId={data?.category?._id || data?.category}
                    courseId={data?.course?._id || data?.course}
                    milestoneId={data?.milestone._id || data?.milestone}
                    moduleId={data?.module?._id || data.module}
                    lessonId={data.lesson?._id || data.lesson}
                    quizId={quizId}
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
        <h1 className="text-center">Quiz title: {data?.title}</h1>
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
