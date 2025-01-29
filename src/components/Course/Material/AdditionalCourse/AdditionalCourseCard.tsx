/* eslint-disable prettier/prettier */
import { Empty } from 'antd';
import Link from 'next/link';

export default function AdditionalCourseCard({
  additional_courses,
}: {
  additional_courses?: any;
}) {
  return (
    <>
      {additional_courses ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {additional_courses?.map((course: any, i: number) => (
            <div
              key={i}
              className="bg-white shadow-md rounded-lg p-6 border border-gray-200 transition-transform hover:scale-105"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {course?.title || 'N/A'}
              </h3>
              <p className="text-sm text-gray-500 mb-4">{course?.platform || 'N/A'}</p>
              <Link
                href={course?.link}
                className="text-blue-500 hover:text-blue-700 font-medium"
              >
                View
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <Empty />
      )}
    </>
  );
}
