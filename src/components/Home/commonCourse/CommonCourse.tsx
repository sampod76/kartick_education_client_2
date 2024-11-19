'use client';
import React, { useState } from 'react';

import { useGetAllCourseQuery } from '@/redux/api/adminApi/courseApi';
import { ENUM_YN } from '@/constants/globalEnums';
import CardLoading from '@/components/ui/Loading/CardLoading';
import SIngleCourse from '../coureses/SIngleCourse';
import type { PaginationProps } from 'antd';
import { Pagination, Spin } from 'antd';
import { useAppSelector } from '@/redux/hooks';
import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
// import style from "@/utils/lo"
const CommonCourse = () => {
  const [current, setCurrent] = useState(1);
  const [pageCount, setPageCount] = useState(10);
  const { searchValue } = useAppSelector((state: any) => state.bannerSearch);
  const query: Record<string, any> = {};
  query['limit'] = pageCount;
  query['page'] = current;
  query['sortBy'] = 'title';
  query['sortOrder'] = 'asc';
  query['status'] = 'active';
  query['favorite'] = ENUM_YN.YES;

  const onShowSizeChange: PaginationProps['onShowSizeChange'] = (current, pageSize) => {
    setCurrent(current);
    setPageCount(pageSize);
  };

  const onChange: PaginationProps['onChange'] = (page) => {
    setCurrent(page);
  };
  const { data, isLoading, error } = useGetAllCourseQuery({ ...query });
  const courseData = data?.data || [];

  if (searchValue?.length > 1) {
    return (
      <div className="mx-auto my-5 w-[50%]">
        <Spin size="large" />
      </div>
    );
  }

  if (isLoading) {
    return <CardLoading />;
  }
  return (
    <div className="bg-[#A2B0F321] pb-1 pt-[2rem] lg:pb-3 lg:pt-[5rem]">
      <div className="container mx-auto">
        <h1 className="sa:text-sm md:text-md px-2 text-center text-base font-medium text-gray-800 xl:text-[2.3rem]">
          BUILD A HEALTHIER FOUNDATION FOR LIFELONG LEARNING
        </h1>
        <div className="mt-4 px-1 lg:mt-[3rem] lg:px-3">
          <div className="w-full">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courseData?.map((item: any, index: number) => {
                return <SIngleCourse course={item} key={index + 1} />;
              })}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-center pb-4">
            <Pagination
              showSizeChanger
              current={current}
              onChange={onChange}
              onShowSizeChange={onShowSizeChange}
              defaultCurrent={1}
              total={data?.meta?.total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonCourse;
