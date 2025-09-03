'use client';

import React, { useMemo, useState } from 'react';
import { Card, Progress, Tooltip, Segmented, Select, Tag, Avatar } from 'antd';
import { useMilestoneGradebookQuery } from '@/redux/api/public/purchaseCourseApi';
import { useSearchParams } from 'next/navigation';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';

export interface IquizData {
  _id: string;
  title: string;
  imgs: any[];
  author: string;
  course: string; // course id
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
type GradeInfo = { letter: string; gpa: number; color: string };

// US-style লেটার গ্রেড ম্যাপিং
const gradeFromPercent = (p: number): GradeInfo => {
  if (p >= 97) return { letter: 'A+', gpa: 4.0, color: 'green' };
  if (p >= 93) return { letter: 'A', gpa: 4.0, color: 'green' };
  if (p >= 90) return { letter: 'A-', gpa: 3.7, color: 'green' };
  if (p >= 87) return { letter: 'B+', gpa: 3.3, color: 'blue' };
  if (p >= 83) return { letter: 'B', gpa: 3.0, color: 'blue' };
  if (p >= 80) return { letter: 'B-', gpa: 2.7, color: 'blue' };
  if (p >= 77) return { letter: 'C+', gpa: 2.3, color: 'geekblue' };
  if (p >= 73) return { letter: 'C', gpa: 2.0, color: 'geekblue' };
  if (p >= 70) return { letter: 'C-', gpa: 1.7, color: 'geekblue' };
  if (p >= 67) return { letter: 'D+', gpa: 1.3, color: 'gold' };
  if (p >= 63) return { letter: 'D', gpa: 1.0, color: 'gold' };
  if (p >= 60) return { letter: 'D-', gpa: 0.7, color: 'gold' };
  return { letter: 'F', gpa: 0.0, color: 'red' };
};

const Gradebook: React.FC = () => {
  const search = useSearchParams();
  const userId = search.get('user_id') || '';
  const { data, isLoading } = useMilestoneGradebookQuery({ userId });

  // ⬇ API থেকে কোর্স-লেভেল অ্যারে (প্রতিটি আইটেমে course + permissionMilestonesDetails থাকে)
  type CourseBlock = {
    _id: string;
    course: {
      _id: string;
      title: string;
      img?: string;
      image?: { url?: string };
      price?: number;
      status?: string;
    };
    permissionMilestonesDetails: IquizData[];
  };

  const courses: CourseBlock[] = (data?.data as CourseBlock[]) ?? [];

  const getPercent = (q: IquizData) =>
    q.totalQuizzes > 0 ? (q.userCorrectSubmits / q.totalQuizzes) * 100 : 0;

  // ===== UI States =====
  const [view, setView] = useState<ViewMode>('cards');
  const [density, setDensity] = useState<Density>('comfortable'); // একটু বড় ডিফল্ট
  const [sortKey, setSortKey] = useState<
    'scoreDesc' | 'scoreAsc' | 'attemptsDesc' | 'attemptsAsc'
  >('scoreDesc');

  // ===== Density classes =====
  const densityClasses: Record<
    Density,
    { cardPad: string; gap: string; title: string; text: string }
  > = {
    comfortable: { cardPad: 'p-5', gap: 'gap-5', title: 'text-base', text: 'text-sm' },
    compact: { cardPad: 'p-3', gap: 'gap-3', title: 'text-sm', text: 'text-xs' },
    ultra: { cardPad: 'p-2', gap: 'gap-2', title: 'text-xs', text: 'text-[11px]' },
  };
  const dc = densityClasses[density];

  // প্রতিটি কোর্সের ভিতরে মাইলস্টোন sort
  const sortedByCourse = useMemo(() => {
    return courses.map((c) => {
      const arr = [...(c.permissionMilestonesDetails || [])];
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
      return { ...c, permissionMilestonesDetails: arr };
    });
  }, [courses, sortKey]);
  if (isLoading) {
    return (
      <div>
        <LoadingSkeleton number={12} />
      </div>
    );
  }
  // কোর্স হেডার (টাইটেল + ছবি + সামান্য মেটা)
  const CourseHeader: React.FC<{ course: CourseBlock['course'] }> = ({ course }) => {
    const cover =
      course?.image?.url ||
      course?.img ||
      'https://dummyimage.com/200x200/eee/aaa.png&text=Course';
    return (
      <div className="flex items-center gap-3 p-2">
        <Avatar shape="square" size={48} src={cover} />
        <div className="min-w-0">
          <div className="font-semibold text-base truncate">
            {course?.title || 'Untitled Course'}
          </div>
          <div className="text-xs text-gray-500">
            {course?.status ? course.status.toUpperCase() : 'ACTIVE'}
            {course?.price ? ` • $${course.price}` : ''}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 space-y-6">
      {/* Global Controls */}
      <div className="mb-1 flex flex-wrap items-center gap-3">
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
          Courses: {sortedByCourse.length}
        </div>
      </div>

      {/* ==== Course-wise Sections ==== */}
      {sortedByCourse.map((block) => {
        const courseId = block.course?._id || block._id;

        // (ঐচ্ছিক) কোর্স-লেভেল কিছু Aggregate দেখাতে চাইলে:
        const totalMilestones = block.permissionMilestonesDetails.length;
        const totalQuizzes = block.permissionMilestonesDetails.reduce(
          (s, x) => s + (x.totalQuizzes || 0),
          0,
        );
        const totalCorrect = block.permissionMilestonesDetails.reduce(
          (s, x) => s + (x.userCorrectSubmits || 0),
          0,
        );
        const coursePercent = totalQuizzes > 0 ? (totalCorrect / totalQuizzes) * 100 : 0;
        const courseGrade = gradeFromPercent(coursePercent);

        return (
          <div key={courseId} className="space-y-3">
            {/* Course Header Card */}
            <Card
              className="rounded-xl shadow-sm"
              bodyStyle={{ padding: 0 }}
              title={<CourseHeader course={block.course} />}
              extra={
                <div className="flex items-center gap-2 text-xs">
                  <Tag color={courseGrade.color} className="m-0">
                    {courseGrade.letter}
                  </Tag>
                  <span className="opacity-70">GPA {courseGrade.gpa.toFixed(1)}</span>
                  <span className="opacity-70">• {totalMilestones} milestones</span>
                  <span className="opacity-70">• {totalQuizzes} quizzes</span>
                </div>
              }
            />

            {/* Milestones under this course */}
            {view === 'cards' ? (
              <div
                className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 ${dc.gap}`}
              >
                {block.permissionMilestonesDetails.map((q) => {
                  const p = getPercent(q);
                  const pText = p.toFixed(1);
                  const gi = gradeFromPercent(p);

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
                            {q.title}
                            {q?.gradeLevelDetails?.title
                              ? ` (${q.gradeLevelDetails.title})`
                              : ''}
                          </span>
                          <span className="opacity-70">#{q.milestone_number ?? '-'}</span>
                        </div>
                      }
                    >
                      <div className="space-y-2">
                        <div
                          className={`flex items-center justify-center gap-2 font-semibold ${dc.text}`}
                        >
                          <span>Score: {pText}%</span>
                          <Tag color={gi.color} className="m-0">
                            {gi.letter}
                          </Tag>
                          <span className="opacity-60">GPA {gi.gpa.toFixed(1)}</span>
                        </div>

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

                        <div className={`flex justify-between ${dc.text} text-gray-600`}>
                          <span>
                            Total: <span className="font-medium">{q.totalQuizzes}</span>
                          </span>
                          <span>
                            Submits:{' '}
                            <span className="font-medium">{q.userTotalSubmits}</span>
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
            ) : (
              // List view (dense)
              <div className="rounded-md border border-gray-100 overflow-hidden">
                {block.permissionMilestonesDetails.map((q) => {
                  const p = getPercent(q);
                  const pText = p.toFixed(1);
                  const gi = gradeFromPercent(p);

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
                          <span className="text-gray-400">
                            #{q.milestone_number ?? '-'}
                          </span>
                          <Tag color={gi.color} className="m-0">
                            {gi.letter}
                          </Tag>
                          <span className="opacity-60">GPA {gi.gpa.toFixed(1)}</span>
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
                            Score <b>{pText}%</b> • Total <b>{q.totalQuizzes}</b> •
                            Submits <b>{q.userTotalSubmits}</b> • ✓{' '}
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
      })}
    </div>
  );
};

export default Gradebook;
