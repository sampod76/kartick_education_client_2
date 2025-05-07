/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { Button, Dropdown, Form, Input, Menu, Space, message } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import dayjs from 'dayjs';

import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import Image from 'next/image';

import { AllImage } from '@/assets/AllImge';
import HeadingUI from '@/components/ui/dashboardUI/HeadingUI';
import { USER_ROLE } from '@/constants/role';
import { useDeleteQuizMutation, useGetAllQuizQuery } from '@/redux/api/adminApi/quizApi';
import { useDeleteUpdateSubmitQuizMutation } from '@/redux/api/quizSubmitApi';
import useBreakpoint from 'antd/lib/grid/hooks/useBreakpoint';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import ModalComponent from '../Modal/ModalComponents';

const QuizDashList = ({
  categoryId,
  courseId,
  milestoneId,
  moduleId,
  lessonId,
}: {
  categoryId?: string;
  courseId?: string;
  milestoneId?: string;
  moduleId?: string;
  lessonId?: string;
  lessonTitle?: string;
}) => {
  const { userInfo, userInfoLoading } = useGlobalContext();
  const screens = useBreakpoint();

  const [deleteUpdateSubmitQuiz, { isLoading: deleteSubmitQuiz }] =
    useDeleteUpdateSubmitQuizMutation();

  //---------------------------------------------------------

  const [deleteQuiz] = useDeleteQuizMutation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  const query: Record<string, any> = {};
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['status'] = 'active';
  query['category'] = categoryId;
  query['course'] = courseId;
  query['milestone'] = milestoneId;
  query['module'] = moduleId;
  query['lesson'] = lessonId;

  if (filterValue) {
    query['lesson'] = filterValue;
  }
  if (userInfo?.role !== USER_ROLE.ADMIN) {
    query['author'] = userInfo?.id;
  }
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data = [], isLoading } = useGetAllQuizQuery({ ...query });
  // console.log(data);

  //@ts-ignore
  const QuizData = data?.data;

  //@ts-ignore
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          // console.log(id);

          const res = await deleteQuiz(id).unwrap();

          // console.log(res, "response for delete Quiz");
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Quiz Successfully Deleted');
          }
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };
  const onFinish = async (values: { studentId: string }, id: string) => {
    const data: any = { quizId: id };
    if (!values?.studentId) {
      return message.error('Please enter a student ID or Email');
    } else if (values?.studentId?.includes('@')) {
      data.email = values?.studentId;
    } else {
      data.userUniqueId = values?.studentId;
    }
    try {
      const res = await deleteUpdateSubmitQuiz({
        data,
      }).unwrap();
      console.log(res);
      if (res.deletedCount) {
        message.success(`Successfully reset submitted ${res.deletedCount} quiz`);
      } else if (res.deletedCount === 0) {
        message.error('Not found Any submitted quiz');
      }
    } catch (error: any) {
      Error_model_hook(error?.message);
    }
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
                width={100}
                height={100}
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
      title: 'Passing Grade',
      dataIndex: 'passingGrade',
      width: 150,
    },
    {
      title: 'module',
      dataIndex: ['module', 'title'],
      ellipsis: true,
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
                    <Link href={`/${userInfo?.role}/quiz/details/${record._id}`}>
                      View
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="edit">
                    <Link href={`/${userInfo?.role}/quiz/edit/${record._id}`}>Edit</Link>
                  </Menu.Item>
                  <Menu.Item key="Material">
                    <Link href={`/${userInfo?.role}/quiz/material/${record._id}`}>
                      Material
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
                  <Menu.Item key="deledddte">
                    <ModalComponent width={350} buttonText="Reset for students">
                      <div className="w-[300px] flex justify-center items-center p-2 rounded-xl border mx-auto">
                        <Form
                          layout="vertical"
                          onFinish={(value) => {
                            onFinish(value, record._id);
                          }}
                        >
                          <Form.Item
                            name="studentId"
                            label="StudentID or Email"
                            required={true}
                          >
                            <Input
                              style={{ width: '10rem' }}
                              placeholder="StudentID or Email"
                            />
                          </Form.Item>
                          <div className="flex justify-center items-center gap-2 ">
                            <Form.Item>
                              <Button
                                loading={false}
                                type="primary"
                                htmlType="submit"
                                className="w-full"
                              >
                                Submit
                              </Button>
                            </Form.Item>
                            <Form.Item>
                              <Button
                                loading={false}
                                type="primary"
                                htmlType="reset"
                                className="w-25"
                              >
                                clear
                              </Button>
                            </Form.Item>
                          </div>
                        </Form>
                      </div>
                    </ModalComponent>
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
    // console.log("Page:", page, "PageSize:", pageSize);
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

  const deleteAdminHandler = async (id: string) => {
    // console.log(id);
    try {
      const res = await deleteQuiz(id);
      if (res) {
        message.success('Quiz Successfully Deleted!');
        setOpen(false);
      }
    } catch (error: any) {
      Error_model_hook(error.message);
    }
  };
  //----------------------------------------------------------------
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
      <HeadingUI>Quiz List</HeadingUI>

      <UMTable
        loading={isLoading}
        columns={columns}
        dataSource={QuizData}
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

export default QuizDashList;
