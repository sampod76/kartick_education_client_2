'use client';

import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
import { useGetSingleCategoryQuery } from '@/redux/api/adminApi/categoryApi';
import {
  useDeleteCourseMutation,
  useGetAllCourseQuery,
} from '@/redux/api/adminApi/courseApi';
import { useDebounced } from '@/redux/hooks';
import { IDecodedInfo, getUserInfo } from '@/services/auth.service';
import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import { Dropdown, Menu, Space } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import UMTable from '../ui/UMTable';
import HeadingUI from '../ui/dashboardUI/HeadingUI';
import fileObjectToLink from '@/utils/fileObjectToLink';
import CourseList from '../Course/CourseList';
export default function ViewCategory({ categoryId }: { categoryId: string }) {
  const { data: category, isLoading } = useGetSingleCategoryQuery(categoryId, {
    skip: !Boolean(categoryId),
  });

  if (isLoading) {
    return <LoadingForDataFetch />;
  }

  return (
    <>
      <div style={{ marginLeft: 'auto', marginRight: 'auto' }} className="container">
        <div className="container mx-auto p-8">
          <div className="rounded-lg bg-white p-6 shadow-md">
            <h1 className="mb-6 text-3xl font-bold">{category.title}</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {category.img || category.image ? (
                <div
                  className="col-span-full mb-6 h-[18rem] w-full bg-cover"
                  style={{
                    backgroundImage: `url(${fileObjectToLink(category.image || category.img)})`,
                    backgroundAttachment: 'fixed',
                    backgroundSize: 'cover', // Add this line for covering the full height
                  }}
                ></div>
              ) : null}
              {/* Category Details */}
              <div className="col-span-full md:col-span-1">
                {/* <p className="text-gray-600 mb-2">Category ID: {category.id}</p> */}
                <p className="mb-2 text-gray-600">Status: {category.status}</p>
                <p className="mb-2 text-gray-600">Created At: {category.createdAt}</p>
                <p className="mb-2 text-gray-600">Updated At: {category.updatedAt}</p>
                {/* Add more details as needed */}
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-8">
              {/* <h2 className="text-xl font-semibold mb-4">Additional Information</h2> */}
              {/* Add more details or components as needed */}
            </div>
          </div>
        </div>

        <div className="">
          <CourseList categoryId={categoryId} />
        </div>
      </div>
    </>
  );
}
