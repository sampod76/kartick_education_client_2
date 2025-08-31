'use client';

import React from 'react';
import { Card } from 'antd';
import { Progress, Tooltip } from 'antd';
import { useMilestoneGradebookQuery } from '@/redux/api/public/purchaseCourseApi';
import { useSearchParams } from 'next/navigation';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';

export interface IquizData {
  _id: string;
  title: string;
  imgs: any[];
  author: string;
  course: string;
  category: string;
  grade_level_id: string;
  status: string;
  isDelete: string;
  milestone_number: number;
  favorite: string;
  tags: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  gradeLevelDetails: GradeLevelDetails;
  totalQuizzes: number;
  userTotalSubmits: number;
  userCorrectSubmits: number;
  userIncorrectSubmits: number;
}

export interface GradeLevelDetails {
  _id: string;
  title: string;
  serial_number: number;
  author: string;
  status: string;
  isDelete: string;
  files: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Gradebook: React.FC = () => {
  const search = useSearchParams();
  const userId = search.get('userId') || '';
  //
  const { data, isLoading } = useMilestoneGradebookQuery({ userId });
  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton number={10} />
      </div>
    );
  }
  const quizData: IquizData[] =
    data?.data?.map((item: any) => item?.permissionMilestonesDetails)?.flat() || [];

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6">
      {quizData.map((quiz) => {
        const percent = quiz.totalQuizzes
          ? ((quiz.userCorrectSubmits / quiz.totalQuizzes) * 100).toFixed(1)
          : 0;

        return (
          <Card
            key={quiz._id}
            className="rounded-2xl shadow-md hover:shadow-lg transition-all"
            title={
              <span className="font-semibold">
                {quiz.title}({quiz?.gradeLevelDetails?.title})
              </span>
            }
          >
            <div className="space-y-3">
              {/* Percentage */}
              <div className="text-lg font-bold text-center">Score: {percent}%</div>

              {/* Progress bar */}
              <Tooltip
                title={`Correct: ${quiz.userCorrectSubmits}, Incorrect: ${quiz.userIncorrectSubmits}`}
              >
                <Progress
                  percent={Number(percent)}
                  success={{
                    percent: (quiz.userCorrectSubmits / quiz.totalQuizzes) * 100,
                  }}
                  strokeColor={{
                    '0%': '#10b981', // green-500
                    '100%': '#3b82f6', // blue-500
                  }}
                  status="active"
                />
              </Tooltip>

              {/* Details */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>
                  Total Quizzes: <span className="font-medium">{quiz.totalQuizzes}</span>
                </span>
                <span>
                  Submits: <span className="font-medium">{quiz.userTotalSubmits}</span>
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">
                  Correct: {quiz.userCorrectSubmits}
                </span>
                <span className="text-red-500 font-medium">
                  Incorrect: {quiz.userIncorrectSubmits}
                </span>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Gradebook;
