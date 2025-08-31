'use client';

import React from 'react';
import { Card } from 'antd';
import { Progress, Tooltip } from 'antd';

interface QuizData {
  _id: string;
  title: string;
  totalQuizzes: number;
  userTotalSubmits: number;
  userCorrectSubmits: number;
  userIncorrectSubmits: number;
}

const quizData: QuizData[] = [
  {
    _id: '687617437f178c590bd0533b',
    title: 'Beginning German Vocabulary Practice',
    totalQuizzes: 320,
    userTotalSubmits: 35,
    userCorrectSubmits: 10,
    userIncorrectSubmits: 25,
  },
  {
    _id: '68761c95f8470828574b0448',
    title: 'Classical Languages Vocabulary Practice',
    totalQuizzes: 495,
    userTotalSubmits: 30,
    userCorrectSubmits: 20,
    userIncorrectSubmits: 10,
  },
];

const Gradebook: React.FC = () => {
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
            title={<span className="font-semibold">{quiz.title}</span>}
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
