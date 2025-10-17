import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGetCourseToAllMilestoneAndQuizzesCountQuery } from '@/redux/api/public/purchaseCourseApi';
import { Button, Progress, Tooltip, Tag } from 'antd';
import { useSearchParams } from 'next/navigation';
import React from 'react';

function toLetter(percentage: number) {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 63) return 'D';
  if (percentage >= 60) return 'D-';
  return 'F';
}

const fmt = (d?: string) => (d ? new Date(d).toLocaleDateString() : '—');

export default function MilestoneListByCourseId({
  course_id,
  user_id,
}: {
  course_id: string;
  user_id: string;
}) {
  const search = useSearchParams();
  const userName = search.get('user_name') || '';
  const { data, isLoading } = useGetCourseToAllMilestoneAndQuizzesCountQuery({
    course: course_id,
    userId: user_id,
    limit: 1,
  });

  if (isLoading) return <LoadingSkeleton />;

  const coursData = data?.data && data?.data[0];

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {coursData ? (
        <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b">
            <h2 className="text-lg sm:text-xl font-semibold truncate">
              {userName} - Gradebook
            </h2>
            <Button type="default" onClick={() => window.print()} className="shrink-0">
              Print
            </Button>
          </div>

          {/* Column labels (desktop only) */}
          <div className="hidden md:grid px-4 sm:px-6 py-3 text-sm text-slate-500 grid-cols-[1fr_120px_120px_120px]">
            <span className="col-start-1"> </span>
            <span className="col-start-2">Grade</span>
            <span className="col-start-3">Start Date</span>
            <span className="col-start-4">End Date</span>
          </div>

          {/* Left colored rail */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-300 rounded-l-2xl" />

            <div className="divide-y">
              {coursData.permissionMilestonesDetails.map((m: any) => {
                const accuracy =
                  m.userTotalSubmits > 0
                    ? Math.round((m.userCorrectSubmits / m.userTotalSubmits) * 100)
                    : 0;

                const progress =
                  m.totalQuizzes > 0
                    ? Math.min(
                        100,
                        Math.round((m.userTotalSubmits / m.totalQuizzes) * 100),
                      )
                    : 0;

                const letter = toLetter(accuracy);
                const gradeText =
                  m.userTotalSubmits > 0 ? `${accuracy}% (${letter})` : '—';
                const start = fmt(m.createdAt);
                const end = fmt(m.createdAt); // replace with real end date when available

                return (
                  <div key={m._id} className="pl-4 sm:pl-6 pr-3 sm:pr-4 py-4">
                    {/* Desktop row */}
                    <div className="hidden md:grid grid-cols-[1fr_120px_120px_120px] gap-4 items-center">
                      <div className="text-slate-800 font-medium truncate">{m.title}</div>
                      <div className="text-slate-700">{gradeText}</div>
                      <div className="text-slate-600">{start}</div>
                      <div className="text-slate-600">{end}</div>
                    </div>

                    {/* Mobile/Tablet card */}
                    <div className="md:hidden space-y-2">
                      <div className="text-slate-800 font-medium line-clamp-2">
                        {m.title}
                      </div>
                      <div className="flex flex-wrap gap-2 text-xs">
                        <Tag bordered={false} className="bg-slate-100 text-slate-700">
                          Grade: <span className="ml-1 font-medium">{gradeText}</span>
                        </Tag>
                        <Tag bordered={false} className="bg-slate-100 text-slate-700">
                          Start: <span className="ml-1 font-medium">{start}</span>
                        </Tag>
                        <Tag bordered={false} className="bg-slate-100 text-slate-700">
                          End: <span className="ml-1 font-medium">{end}</span>
                        </Tag>
                      </div>
                    </div>

                    {/* Progress bar (both views) */}
                    <div className="mt-3 pr-1 sm:pr-2">
                      <Tooltip title={`Current Progress: ${progress}%`}>
                        <Progress
                          percent={progress}
                          showInfo={false}
                          status="active"
                          strokeWidth={12}
                          className="[&_.ant-progress-outer]:!w-full"
                        />
                      </Tooltip>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-3xl text-red-500">
          Don&apos;t find any course content
        </p>
      )}
    </div>
  );
}
