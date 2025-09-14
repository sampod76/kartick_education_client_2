'use client';

import { useState } from 'react';
import { Card, Pagination } from 'antd';
import { useGetAllGradeBookReportQuery } from '@/redux/api/gradeBookApi';
import { useSearchParams } from 'next/navigation';
import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';

export default function Reports() {
  const { userInfo } = useGlobalContext();
  const search = useSearchParams();
  const author_id = search.get('user_id') || '';

  const { data, isLoading } = useGetAllGradeBookReportQuery({
    author_id: author_id || userInfo?.userId,
    limit: 20,
  });
  const [page, setPage] = useState(1);
  const pageSize = 20; // প্রতি পেজে কতগুলো milestone দেখাবে

  if (isLoading) return <LoadingSkeleton />;
  const paginatedData = data?.data || [];
  return (
    <div className="p-6 max-w-5xl mx-auto">
      {paginatedData.map((milestone) => (
        <Card
          key={milestone.milestoneId}
          title={
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">🎯 {milestone.milestoneTitle}</span>
              <span className="text-sm text-gray-500">
                Avg Ratio: {milestone.avgRatio.toFixed(2)} | Total Completed:{' '}
                {milestone.totalCompleted}
              </span>
            </div>
          }
          className="mb-6 shadow-md rounded-2xl"
        >
          <ul className="divide-y divide-gray-200">
            {milestone.lessons.map((lesson) => (
              <li key={lesson._id} className="flex justify-between items-center py-3">
                <div>
                  <p className="text-base font-medium text-gray-900">📘 {lesson.title}</p>
                  <p className="text-xs text-gray-500">
                    Start: {new Date(lesson.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-green-600">
                    ✅ Completed: {lesson.totalCompletedNumber}
                  </p>
                  <p className="text-xs text-blue-500">
                    Ratio: {lesson.totalCompletedContentRatio}%
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ))}

      {/* Ant Design Pagination */}
      {/* <div className="flex justify-center mt-6">
        <Pagination
          current={page}
          pageSize={pageSize}
          total={data.length}
          onChange={(p) => setPage(p)}
          showSizeChanger={false} // ইউজার pageSize পরিবর্তন করতে পারবে না
        />
      </div> */}
    </div>
  );
}
