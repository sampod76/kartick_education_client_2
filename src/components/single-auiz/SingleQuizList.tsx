/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { Dropdown, Menu, message, Space } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import dayjs from 'dayjs';

import { confirm_modal, Error_model_hook, Success_model } from '@/utils/modalHook';
import Image from 'next/image';

import HeadingUI from '@/components/ui/dashboardUI/HeadingUI';

import { AllImage } from '@/assets/AllImge';
import { ENUM_STATUS } from '@/constants/globalEnums';
import {
  useDeleteSingleQuizMutation,
  useGetAllSingleQuizQuery,
} from '@/redux/api/adminApi/singleQuizApi';
import { CopyOutlined } from '@ant-design/icons';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
const SingleQuizList = ({
  categoryId,
  courseId,
  milestoneId,
  moduleId,
  lessonId,
  quizId,
}: {
  categoryId?: string;
  courseId?: string;
  milestoneId?: string;
  moduleId?: string;
  lessonId?: string;
  lessonTitle?: string;
  quizId?: string;
}) => {
  const { userInfo } = useGlobalContext();

  const [deleteSingleQuiz, { isLoading: deleteSingleLoading }] =
    useDeleteSingleQuizMutation();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('');

  const query: Record<string, any> = {};
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['status'] = ENUM_STATUS.ACTIVE;
  //
  query['category'] = categoryId;
  query['course'] = courseId;
  query['milestone'] = milestoneId;
  query['module'] = moduleId;
  query['lesson'] = lessonId;
  query['quiz'] = quizId;
  //
  if (userInfo?.role !== 'admin') {
    query['author'] = userInfo?.id;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data = [], isLoading } = useGetAllSingleQuizQuery({ ...query });

  //@ts-ignore
  const singleQuizData = data?.data;
  //@ts-ignore
  const meta = data?.meta;
  const handleDelete = (id: string) => {
    console.log('🚀 ~ file: page.tsx:79 ~ handleDelete ~ id:', id);

    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          // console.log(id);

          const res = await deleteSingleQuiz(id).unwrap();

          console.log(res, 'response for delete SIngle QUiz');
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('SIngle QUiz Successfully Deleted');
          }
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };
  const columns = [
    {
      title: 'Image',
      render: function (data: any) {
        return (
          <>
            {
              <Image
                src={data?.imgs?.length ? data?.imgs[0] : AllImage.notFoundImage}
                style={{ height: '50px', width: '80px' }}
                width={50}
                height={50}
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
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: 'Serial',
      dataIndex: 'serialNumber',
      // ellipsis: true,
      width: 100,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      // ellipsis: true,
      width: 120,
    },
    {
      title: 'Time',
      dataIndex: 'time_duration',
      render: function (data: any) {
        return <>{Math.floor(data / 1000 / 60)} minutes</>;
      },
      // ellipsis: true,
      width: 120,
    },

    {
      title: 'Quiz Name',
      dataIndex: ['quiz', 'title'],
      ellipsis: true,
      // width: 120
    },
    {
      title: 'Hints',
      dataIndex: 'hints',
      ellipsis: true,
      // width: 120
    },
    {
      title: 'Module',
      dataIndex: ['module', 'title'],
      ellipsis: true,
      sorter: true,
      // width: 120
    },

    // {
    //   title: "course",
    //   dataIndex: ["course", "title"],
    //   ellipsis: true,
    // },

    {
      title: 'Created at',
      dataIndex: 'createdAt',
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
    },
    {
      title: 'Action',
      // fixed: "right",
      width: 100,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="view">
                    <Link href={`/${userInfo?.role}/single-quiz/details/${record._id}`}>
                      View
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="edit">
                    <Link href={`/${userInfo?.role}/single-quiz/edit/${record._id}`}>
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
    //  // console.log("Page:", page, "PageSize:", pageSize);
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    // console.log(order, field);
    setSortBy(field as string);
    setSortOrder(order === 'ascend' ? 'asc' : 'desc');
  };
  const resetFilters = () => {
    setSortBy('');
    setSortOrder('');
    setSearchTerm('');
  };

  return (
    <div
      style={{
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: '1rem',
        backgroundColor: 'white',
        padding: '1rem',
      }}
    >
      {/* <UMBreadCrumb
        items={[
          {
            label: "admin",
            link: "/admin",
          },
          {
            label: "Single Quiz",
            link: "/admin/single-quiz",
          },
        ]}
      /> */}
      <div className="flex items-center justify-between">
        <HeadingUI>Single Quiz List</HeadingUI>
        <p
          style={{
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
          }}
          onClick={async () => {
            if (quizId) {
              await navigator.clipboard.writeText(quizId);

              message.success('Quiz ID copied!');
            }
          }}
          title="Copy Quiz ID"
        >
          {quizId}
          <CopyOutlined />
        </p>
      </div>

      <UMTable
        loading={isLoading}
        columns={columns}
        dataSource={singleQuizData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
    </div>
  );
};

export default SingleQuizList;
