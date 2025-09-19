'use client';
import { ENUM_STATUS, ENUM_YN } from '@/constants/globalEnums';
import { useGetAllSellingReadyCourseQuery } from '@/redux/api/adminApi/selling_ready_courses';
import React, { useState } from 'react';
import LoadingSkeleton from '../ui/Loading/LoadingSkeleton';
import { useDebounced } from '@/redux/hooks';
import { useSearchParams } from 'next/navigation';
import { Button, Input, Pagination, PaginationProps } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import NotFoundCourse from '../ui/NotFound/NotFoundCourse';
import CourseSellingCard from './courseInMilestoneView';

export default function SellingCourseInMilestone() {
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [current, setCurrent] = useState(1);
  const [pageCount, setPageCount] = useState(12);
  const query: Record<string, any> = {
    status: ENUM_STATUS.ACTIVE,
    limit: pageCount,
    page: current,
    isDelete: ENUM_YN.NO,
    fields: 'course',
  };
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  } else if (searchTerm === '') {
    query['searchTerm'] = '';
  }
  const { data, isLoading, isFetching } = useGetAllSellingReadyCourseQuery(query);
  if (isLoading) {
    return <LoadingSkeleton number={10} />;
  }
  const courseData = data?.data;

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setCurrent(current);
    setPageCount(pageSize);
  };

  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page);
  };
  const resetFilters = () => {
    setSearchTerm('');
  };
  console.log('🚀 ~ SellingCourseInMilestone ~ courseData:', courseData);
  return (
    <div>
      <div
        style={{
          backgroundImage:
            'url(https://img.freepik.com/free-vector/back-school-essentials_1308-174766.jpg?t=st=1731186122~exp=1731189722~hmac=38c8584247843e9bc6f6ef1a208b85e84897da1731e4390b78989bfa1102e6fa&w=1380)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
        className="min-h-screen py-[30px]"
      >
        <div
          className={`container mx-auto flex flex-col items-center justify-center `}
          title="blog List"
        >
          <h2 className="my-6 text-center text-2xl font-bold leading-normal lg:text-4xl">
            Enroll Now To Access Iblossom Courses
          </h2>
          <br />
          <Input
            size="middle"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              // width: '250px',
              marginTop: '8px',
            }}
            className="!bg-opacity-45 !w-[70%] ring-2 ring-cyan-800 "
          />
          <div>
            {!!searchTerm && (
              <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
                <ReloadOutlined />
              </Button>
            )}
          </div>
          <div>
            {isLoading || isFetching ? (
              <LoadingSkeleton sectionNumber={5} />
            ) : courseData?.length === 0 ? (
              <NotFoundCourse />
            ) : (
              <div className={`mt-1 w-full mx-auto p-2 backdrop-blur-xl`}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {courseData?.map((course) => (
                    <CourseSellingCard key={course._id} data={course} />
                  ))}
                </div>
                <div
                  className={`mb-2 mt-10 flex items-center justify-center rounded-md bg-gray-200 p-2`}
                >
                  <div className="flex items-end justify-end bg-slate-200 p-1 text-2xl">
                    <Pagination
                      showSizeChanger
                      current={current}
                      onChange={onChange}
                      showQuickJumper
                      onShowSizeChange={onShowSizeChange}
                      defaultCurrent={1}
                      total={data?.meta?.total}
                      pageSizeOptions={[10, 20, 50]}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
