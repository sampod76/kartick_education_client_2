'use client';

import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
import { useGetSingleCategoryQuery } from '@/redux/api/adminApi/categoryApi';
import Image from 'next/image';
import React, { useState } from 'react';
import UMTable from '../ui/UMTable';
import HeadingUI from '../ui/dashboardUI/HeadingUI';
import {
  useDeleteCourseMutation,
  useGetAllCourseQuery,
} from '@/redux/api/adminApi/courseApi';
import { useDebounced } from '@/redux/hooks';
import { Dropdown, Menu, Space } from 'antd';
import Link from 'next/link';
import dayjs from 'dayjs';
import { IDecodedInfo, getUserInfo } from '@/services/auth.service';
import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
export default function ViewCategory({ categoryId }: { categoryId: string }) {
  const { data: category, isLoading } = useGetSingleCategoryQuery(categoryId, {
    skip: !Boolean(categoryId),
  });
  // ! for course

  const [deleteCourse, { isLoading: deleteLoading }] = useDeleteCourseMutation();
  const userInfo = getUserInfo() as IDecodedInfo;
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  // const [courseId, setCourseId] = useState<string>("");

  const [filterValue, setFilterValue] = useState('');
  const query: Record<string, any> = {};
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['status'] = 'active';
  query['category'] = categoryId;
  // if (filterValue) {
  //   query["category"] = filterValue;
  // }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }

  //
  const { data, isLoading: courseLoading } = useGetAllCourseQuery({ ...query });
  const courseData = data?.data || [];
  const meta = data?.meta;
  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deleteCourse(id).unwrap();
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Course Successfully Deleted');
          }
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };

  // const category = data
  if (isLoading || courseLoading) {
    return <LoadingForDataFetch />;
  }

  const columns = [
    {
      title: 'Image',
      render: function (data: any) {
        return (
          <>
            {
              <Image
                src={data?.img}
                style={{ height: '50px', width: '80px' }}
                width={150}
                height={150}
                alt="dd"
              />
            }
          </>
        );
      },
      width: 100,
    },
    {
      title: 'Name',
      // fixed:"left",
      dataIndex: 'title',
      // ellipsis: true,
      // responsive: ['md','sm']
    },
    {
      title: 'price',
      dataIndex: 'price',
      ellipsis: true,
      width: 100,
    },
    // {
    //   title: "duration",
    //   dataIndex: "duration",
    //   render: function (data: any) {
    //     //
    //     return data?.length && `${dayjs(data[0]).format("MMM D, YYYY hh:mm A")} - ${dayjs(data[2]).format("MMM D, YYYY hh:mm A")}`;
    //   },
    //   // ellipsis: true,
    // },
    {
      title: 'label',
      dataIndex: ['labelDetails', 'title'],
      ellipsis: true,
      width: 150,
    },
    {
      title: 'Price Type',
      dataIndex: 'price_type',
      // ellipsis: true,
      width: 100,
    },
    {
      title: 'author',
      dataIndex: 'author',
      render: function (data: any) {
        //
        return data.email;
      },
      // ellipsis: true,
    },
    {
      title: 'category',
      dataIndex: 'category',
      render: function (data: any) {
        return data.title;
      },
      ellipsis: true,
      // width: 120,
    },

    {
      title: 'Created at',
      dataIndex: 'createdAt',
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
    },

    {
      title: 'Status',
      dataIndex: 'status',
      width: 80,
      // render:function(data:any){
      //
      // }
    },
    {
      title: 'Action',
      // fixed: "right",
      width: 110,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="details">
                    <Link href={`/${userInfo?.role}/course/details/${record._id}`}>
                      View
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="edit">
                    <Link href={`/${userInfo?.role}/course/edit/${record._id}`}>
                      Edit
                    </Link>
                  </Menu.Item>

                  <Menu.Item
                    key="delete"
                    onClick={() => {
                      handleDelete(record._id);
                    }}
                  >
                    Delete
                  </Menu.Item>

                  {/* <Menu.Item key="add_milestone">
                    <Link
                      href={`/${userInfo?.role}/course/create/milestone/${record?._id}?courseName=${record?.title}`}
                    >
                      Add Milestone
                    </Link>
                  </Menu.Item> */}
                </Menu>
              }
            >
              <button className="text-blue-700">Action</button>
            </Dropdown>
          </Space>
        </>
      ),
    },
  ];

  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    //
    setSortBy(field as string);
    setSortOrder(order === 'ascend' ? 'asc' : 'desc');
  };

  return (
    <>
      <div style={{ marginLeft: 'auto', marginRight: 'auto' }} className="container ">
        <div className="container mx-auto p-8">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6">{category.title}</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                className="col-span-full mb-6 bg-cover w-full h-[18rem]"
                style={{
                  backgroundImage: `url(${category.img})`,
                  backgroundAttachment: 'fixed',
                  backgroundSize: 'cover', // Add this line for covering the full height
                }}
              ></div>
              {/* Category Details */}
              <div className="col-span-full md:col-span-1">
                {/* <p className="text-gray-600 mb-2">Category ID: {category.id}</p> */}
                <p className="text-gray-600 mb-2">Status: {category.status}</p>
                <p className="text-gray-600 mb-2">Created At: {category.createdAt}</p>
                <p className="text-gray-600 mb-2">Updated At: {category.updatedAt}</p>
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
          <HeadingUI>Courses of {category?.title}</HeadingUI>

          <UMTable
            loading={courseLoading}
            columns={columns}
            dataSource={courseData}
            pageSize={size}
            totalPages={meta?.total}
            showSizeChanger={true}
            onPaginationChange={onPaginationChange}
            onTableChange={onTableChange}
            showPagination={true}
          />
        </div>
      </div>
    </>
  );
}
