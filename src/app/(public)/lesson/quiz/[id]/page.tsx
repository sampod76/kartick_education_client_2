'use client';

import QuizeSinglePage from '@/components/Quiz/Quizes';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGetSingleQuizQuery } from '@/redux/api/adminApi/quizApi';
import { Spin } from 'antd';
import React from 'react';

export default function LessonQUizPage({ params }: { params: { id: string } }) {
  const { data: quizData, isLoading } = useGetSingleQuizQuery(params?.id);

  if (isLoading) {
    return <LoadingSkeleton number={10} />;
  }
  return (
    <div>
      <QuizeSinglePage quiz_title={quizData?.title} quizeId={quizData?._id} />
    </div>
  );
}
