'use client';

import React, { useMemo, useState } from 'react';
import { Card, Progress, Tooltip, Segmented, Select } from 'antd';
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

type ViewMode = 'cards' | 'list';
type Density = 'comfortable' | 'compact' | 'ultra';

const Gradebook: React.FC = () => {
  const search = useSearchParams();
  const userId = search.get('user_id') || '';
  const { data, isLoading } = useMilestoneGradebookQuery({ userId });

  const raw: IquizData[] =
    data?.data?.map((item: any) => item?.permissionMilestonesDetails)?.flat() || [];

  const getPercent = (q: IquizData) =>
    q.totalQuizzes > 0 ? (q.userCorrectSubmits / q.totalQuizzes) * 100 : 0;

  // UI states
  const [view, setView] = useState<ViewMode>('list');
  const [density, setDensity] = useState<Density>('comfortable');
  const [sortKey, setSortKey] = useState<
    'scoreDesc' | 'scoreAsc' | 'attemptsDesc' | 'attemptsAsc'
  >('scoreDesc');

  const sorted = useMemo(() => {
    const arr = [...raw];
    arr.sort((a, b) => {
      const pa = getPercent(a);
      const pb = getPercent(b);
      switch (sortKey) {
        case 'scoreAsc':
          return pa - pb || (a.userTotalSubmits ?? 0) - (b.userTotalSubmits ?? 0);
        case 'attemptsDesc':
          return (b.userTotalSubmits ?? 0) - (a.userTotalSubmits ?? 0);
        case 'attemptsAsc':
          return (a.userTotalSubmits ?? 0) - (b.userTotalSubmits ?? 0);
        case 'scoreDesc':
        default:
          return pb - pa || (b.userTotalSubmits ?? 0) - (a.userTotalSubmits ?? 0);
      }
    });
    return arr;
  }, [raw, sortKey]);

  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton number={12} />
      </div>
    );
  }

  // Density → padding/text size mappings
  const densityClasses: Record<
    Density,
    { cardPad: string; gap: string; title: string; text: string }
  > = {
    comfortable: { cardPad: 'p-4', gap: 'gap-4', title: 'text-base', text: 'text-sm' },
    compact: { cardPad: 'p-3', gap: 'gap-3', title: 'text-sm', text: 'text-xs' },
    ultra: { cardPad: 'p-2', gap: 'gap-2', title: 'text-xs', text: 'text-[11px]' },
  };

  const dc = densityClasses[density];

  return (
    <div className="p-4">
      {/* Controls */}
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <Segmented<ViewMode>
          options={[
            { label: 'Cards', value: 'cards' },
            { label: 'List', value: 'list' },
          ]}
          value={view}
          onChange={(v) => setView(v as ViewMode)}
        />
        <Segmented<Density>
          options={[
            { label: 'Comfort', value: 'comfortable' },
            { label: 'Compact', value: 'compact' },
            { label: 'Ultra', value: 'ultra' },
          ]}
          value={density}
          onChange={(v) => setDensity(v as Density)}
        />
        <Select
          size="small"
          value={sortKey}
          onChange={(v) => setSortKey(v)}
          options={[
            { label: 'Score ⬇', value: 'scoreDesc' },
            { label: 'Score ⬆', value: 'scoreAsc' },
            { label: 'Attempts ⬇', value: 'attemptsDesc' },
            { label: 'Attempts ⬆', value: 'attemptsAsc' },
          ]}
        />
        <div className="ml-auto text-xs text-gray-500">
          Showing {sorted.length} milestones
        </div>
      </div>

      {/* Cards View */}
      {view === 'cards' && (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${dc.gap}`}
        >
          {sorted.map((q) => {
            const p = getPercent(q);
            const pText = p.toFixed(1);
            return (
              <Card
                key={q._id}
                size="small"
                className={`rounded-md shadow-sm hover:shadow-md transition-all ${dc.cardPad}`}
                title={
                  <div
                    className={`flex items-center justify-between ${dc.title} font-medium`}
                  >
                    <span className="truncate max-w-[70%]">
                      {q.title}{' '}
                      {q?.gradeLevelDetails?.title
                        ? `(${q.gradeLevelDetails.title})`
                        : ''}
                    </span>
                    <span className="opacity-70">#{q.milestone_number ?? '-'}</span>
                  </div>
                }
              >
                <div className="space-y-1.5">
                  {/* Score Row */}
                  <div className={`text-center font-semibold ${dc.text}`}>
                    Score: {pText}%
                  </div>

                  {/* Progress (tiny) */}
                  <Tooltip
                    title={`Correct: ${q.userCorrectSubmits}, Incorrect: ${q.userIncorrectSubmits}`}
                  >
                    <Progress
                      percent={Number(pText)}
                      size="small"
                      showInfo={false}
                      success={{
                        percent:
                          q.totalQuizzes > 0
                            ? (q.userCorrectSubmits / q.totalQuizzes) * 100
                            : 0,
                      }}
                      strokeColor={{ '0%': '#10b981', '100%': '#3b82f6' }}
                      status="active"
                    />
                  </Tooltip>

                  {/* Meta compact */}
                  <div className={`flex justify-between ${dc.text} text-gray-600`}>
                    <span>
                      Total: <span className="font-medium">{q.totalQuizzes}</span>
                    </span>
                    <span>
                      Submits: <span className="font-medium">{q.userTotalSubmits}</span>
                    </span>
                  </div>

                  <div className={`flex justify-between ${dc.text}`}>
                    <span className="text-green-600 font-medium">
                      ✓ {q.userCorrectSubmits}
                    </span>
                    <span className="text-red-500 font-medium">
                      ✗ {q.userIncorrectSubmits}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* List View (ultra dense) */}
      {view === 'list' && (
        <div className="rounded-md border border-gray-100 overflow-hidden">
          {sorted.map((q) => {
            const p = getPercent(q);
            const pText = p.toFixed(1);
            return (
              <div
                key={q._id}
                className={`flex items-center ${dc.cardPad} border-b last:border-b-0 hover:bg-gray-50`}
              >
                <div className={`flex-1 min-w-0 ${dc.text}`}>
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">
                      {q.title}
                      {q?.gradeLevelDetails?.title
                        ? ` (${q.gradeLevelDetails.title})`
                        : ''}
                    </span>
                    <span className="text-gray-400">#{q.milestone_number ?? '-'}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <div className="w-40">
                      <Progress
                        percent={Number(pText)}
                        size="small"
                        showInfo={false}
                        success={{
                          percent:
                            q.totalQuizzes > 0
                              ? (q.userCorrectSubmits / q.totalQuizzes) * 100
                              : 0,
                        }}
                      />
                    </div>
                    <div className="text-gray-600">
                      Score <b>{pText}%</b> • Total <b>{q.totalQuizzes}</b> • Submits{' '}
                      <b>{q.userTotalSubmits}</b> • ✓{' '}
                      <b className="text-green-600">{q.userCorrectSubmits}</b> / ✗{' '}
                      <b className="text-red-500">{q.userIncorrectSubmits}</b>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Gradebook;

// 'use client';

// import React from 'react';
// import { Card } from 'antd';
// import { Progress, Tooltip } from 'antd';
// import { useMilestoneGradebookQuery } from '@/redux/api/public/purchaseCourseApi';
// import { useSearchParams } from 'next/navigation';
// import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';

// export interface IquizData {
//   _id: string;
//   title: string;
//   imgs: any[];
//   author: string;
//   course: string;
//   category: string;
//   grade_level_id: string;
//   status: string;
//   isDelete: string;
//   milestone_number: number;
//   favorite: string;
//   tags: any[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   gradeLevelDetails: GradeLevelDetails;
//   totalQuizzes: number;
//   userTotalSubmits: number;
//   userCorrectSubmits: number;
//   userIncorrectSubmits: number;
// }

// export interface GradeLevelDetails {
//   _id: string;
//   title: string;
//   serial_number: number;
//   author: string;
//   status: string;
//   isDelete: string;
//   files: any[];
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
// }

// const Gradebook: React.FC = () => {
//   const search = useSearchParams();
//   const userId = search.get('user_id') || '';
//   //
//   const { data, isLoading } = useMilestoneGradebookQuery({ userId });
//   if (isLoading) {
//     return (
//       <div>
//         <LoadingSkeleton number={10} />
//       </div>
//     );
//   }
//   const quizData: IquizData[] =
//     data?.data?.map((item: any) => item?.permissionMilestonesDetails)?.flat() || [];

//   return (
//     <div className="grid md:grid-cols-2 gap-6 p-6">
//       {quizData.map((quiz) => {
//         const percent = quiz.totalQuizzes
//           ? ((quiz.userCorrectSubmits / quiz.totalQuizzes) * 100).toFixed(1)
//           : 0;

//         return (
//           <Card
//             key={quiz._id}
//             className="rounded-2xl shadow-md hover:shadow-lg transition-all"
//             title={
//               <span className="font-semibold">
//                 {quiz.title}({quiz?.gradeLevelDetails?.title})
//               </span>
//             }
//           >
//             <div className="space-y-3">
//               {/* Percentage */}
//               <div className="text-lg font-bold text-center">Score: {percent}%</div>

//               {/* Progress bar */}
//               <Tooltip
//                 title={`Correct: ${quiz.userCorrectSubmits}, Incorrect: ${quiz.userIncorrectSubmits}`}
//               >
//                 <Progress
//                   percent={Number(percent)}
//                   success={{
//                     percent: (quiz.userCorrectSubmits / quiz.totalQuizzes) * 100,
//                   }}
//                   strokeColor={{
//                     '0%': '#10b981', // green-500
//                     '100%': '#3b82f6', // blue-500
//                   }}
//                   status="active"
//                 />
//               </Tooltip>

//               {/* Details */}
//               <div className="flex justify-between text-sm text-gray-600">
//                 <span>
//                   Total Quizzes: <span className="font-medium">{quiz.totalQuizzes}</span>
//                 </span>
//                 <span>
//                   Submits: <span className="font-medium">{quiz.userTotalSubmits}</span>
//                 </span>
//               </div>

//               <div className="flex justify-between text-sm">
//                 <span className="text-green-600 font-medium">
//                   Correct: {quiz.userCorrectSubmits}
//                 </span>
//                 <span className="text-red-500 font-medium">
//                   Incorrect: {quiz.userIncorrectSubmits}
//                 </span>
//               </div>
//             </div>
//           </Card>
//         );
//       })}
//     </div>
//   );
// };

// export default Gradebook;
