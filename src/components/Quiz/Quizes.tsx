// only modula in single quiz
'use client';

import { useGetAllSingleQuizQuery } from '@/redux/api/adminApi/singleQuizApi';
import { Select } from 'antd';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
// import QuizTestPage from "./QuizTestPage";
import { singleQuizTypes } from '@/constants/global';
import { ArrowLeftOutlined } from '@ant-design/icons';
const QuizTestPage = React.lazy(() => import('./QuizTestPage'));

const { Option } = Select;

export default function QuizeSinglePage({
  quizeId,
  quiz_title,
}: {
  quizeId: string;
  quiz_title: string;
}) {
  const router = useRouter();
  // console.log("🚀 ~ quizeId:", quizeId)
  const searchParams = useSearchParams();
  const quiz_query: Record<string, any> = {};
  //! for a quiz data
  quiz_query['limit'] = 999999;
  quiz_query['sortBy'] = 'serialNumber';
  quiz_query['sortOrder'] = 'asc';
  quiz_query['quiz'] = quizeId;
  const { data: allSingleQuizeData, isLoading } = useGetAllSingleQuizQuery({
    ...quiz_query,
    quiz: quizeId,
  });

  const handleFinishQuiz = () => {
    // Handle quiz submission logic here
  };

  if (isLoading) {
    return <LoadingSkeleton number={10} />;
  }

  const filteredByTypesQuizData = allSingleQuizeData?.data?.filter((item) => {
    return singleQuizTypes.includes(item?.type);
  });

  // href = {`/lesson/module/${moduleInfo?._id}?module=${moduleInfo?.title}`
  // }
  const moduleInfo = allSingleQuizeData?.data[0]?.module;
  // console.log(allSingleQuizeData, 'allSingleQuizeData', moduleInfo)

  const rediretBack = () => {
    if (moduleInfo?._id) {
      router.push(`/lesson/module/${moduleInfo?._id}?module=${moduleInfo?.title}`);
    } else {
      router.back();
    }
  };

  return (
    <div className="container mx-auto rounded-xl mt-3 shadow-2xl">
      <button
        onClick={rediretBack}
        // href={
        //   moduleInfo?._id
        //     ? (`` as Url)
        //     : (router?.back() as Url)
        // }
        className="p-3 my-3"
      >
        <ArrowLeftOutlined /> Back to Module
      </button>
      {/* <h1 className="text-sm  lg:text-2xl  font-bold p-5">
        <TextToSpeech text={quiz_title} />
        {quiz_title}
      </h1> */}
      <div className=" py-2 m2-2 px-3">
        {/*
         <UMBreadCrumb
          items={[
            {
              label: "lesson",
              link: "/lesson",
            },
            {
              label: "quize",
              link: "/lesson/quize",
            },
            {
              label: "Be Smart Lesson Quiz",
              link: "/course/module",
            },
          ]}
        /> 
        */}
      </div>

      <div className="w-full  mx-auto my-5 lg:my-0 ">
        <QuizTestPage quizData={filteredByTypesQuizData || []} quizId={quizeId} />

        {/* <div className="flex flex-col gap-3">
            {filteredByTypesQuizData?.map((quiz: any, index: number) => (
              
              <Card key={quiz?._id} className="mb-4">
                <p className="text-lg font-[550] mb-2">
                  Question {index + 1} : {quiz?.title}
                </p>
                {quiz?.type === "select" && (
                  <Radio.Group
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "1rem",
                    }}
                  >
                    {quiz?.answers.map((option: any) => (
                      <Radio key={option?.title} value={option?.title}>
                        {option?.title}
                       
                      </Radio>
                    ))}
             
                  </Radio.Group>
                )}
                {quiz?.type === "multiple_select" && (
                  <Select placeholder="Select an option" className="w-full">
                    {quiz?.answers?.map((option: any) => (
                      <Option key={option?.title} value={option?.title}>
                        {option?.title}
                      </Option>
                    ))}
                  </Select>
                )}
                {quiz?.type === "input" && (
                  <div>
                    <p className="text-lg font-[550] mb-2">
                      Question {index + 1} : {quiz?.title} 
                    </p>
                    <Input
                      style={{ minHeight: "1rem", width: "12rem" }}
                      placeholder="Type your answer"
                    />
                  </div>
                )}
                {quiz?.type === "text" && (
                  <Input.TextArea
                    style={{ minHeight: "6rem" }}
                    placeholder="Type your answer"
                  />
                )}
              </Card>
            ))}
            <div className="mt-4">
              <Button
                  type="default"
                style={{ padding: "8px", height: "3rem", fontWeight: "600" }}
                onClick={handleFinishQuiz}
              >
                Finish Quiz
              </Button>
            </div>
          </div> */}
      </div>
    </div>
  );
}
