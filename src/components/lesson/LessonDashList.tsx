'use client';
import ActionBar from '@/components/ui/ActionBar';
import UMModal from '@/components/ui/UMModal';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Drawer, DrawerProps, Dropdown, Input, Menu, Space, message } from 'antd';
import dayjs from 'dayjs';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { AllImage } from '@/assets/AllImge';
import FilterModule from '@/components/dashboard/Filter/FilterModule';
import HeadingUI from '@/components/ui/dashboardUI/HeadingUI';
import { USER_ROLE } from '@/constants/role';
import {
  useDeleteLessonMutation,
  useGetAllLessonQuery,
} from '@/redux/api/adminApi/lessoneApi';

import { useGetAllCategoryChildrenQuery } from '@/redux/api/categoryChildrenApi';
import SelectCategoryChildren from '../Forms/GeneralField/SelectCategoryChildren';

import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import ModalComponent from '../Modal/ModalComponents';
import AssignmentUpload from '../assignment/Assignment';

export default function LessonDashList({
  queryObject,
}: {
  queryObject?: { module: string; sortOrder: string; sortBy: string };
}) {
  const { userInfo, userInfoLoading } = useGlobalContext();
  //
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');
  //----------------------------------------------------------------
  const [category, setCategory] = useState<{ _id?: string; title?: string }>({});
  const [course, setCourse] = useState<{ _id?: string; title?: string }>({});
  const [milestone, setmilestone] = useState<{ _id?: string; title?: string }>({});
  const [module, setmodule] = useState<{ _id?: string; title?: string }>({});

  const queryCategory: Record<string, any> = {};
  queryCategory['children'] = 'course-milestone-module';
  if (userInfo?.role !== USER_ROLE.ADMIN) {
    queryCategory['author'] = userInfo?.id;
  }
  //! for Category options selection
  const { data: Category, isLoading: categoryLoading } = useGetAllCategoryChildrenQuery({
    ...queryCategory,
  });
  const categoryData: any = Category?.data;
  //!----------------------------------------------------------------

  const query: Record<string, any> = {};

  // const SUPER_ADMIN=USER_ROLE.ADMIN

  const [deleteLesson] = useDeleteLessonMutation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');

  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = queryObject?.sortBy || sortBy;
  query['sortOrder'] = queryObject?.sortOrder || sortOrder;
  query['status'] = 'active';
  //
  query['category'] = category?._id;
  query['course'] = course?._id;
  query['milestone'] = milestone?._id;
  query['module'] = queryObject?.module || module?._id;
  //
  if (filterValue) {
    query['module'] = filterValue;
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
  const { data, isLoading, isFetching } = useGetAllLessonQuery({ ...query });

  //@ts-ignore
  const LessonData = data?.data;

  //@ts-ignore
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          // console.log(id);

          const res = await deleteLesson(id).unwrap();

          // console.log(res, "response for delete Lesson");
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Lesson Successfully Deleted');
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
        // console.log(data);
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
      title: 'Lesson Number',
      dataIndex: 'lesson_number',
      // ellipsis: true,
      width: 150,
    },
    {
      title: 'Title',
      dataIndex: 'title',
      ellipsis: true,
    },
    // {
    //   title: "Description",
    //   dataIndex: "short_description",
    //   ellipsis: true,
    // },

    {
      title: 'Module',
      // dataIndex: ["module", "title"],
      ellipsis: true,
      render: function (data: any) {
        return <>{data?.module?.title || ''}</>;
      },
    },
    {
      title: 'Total Files',

      render: function (data: any) {
        return <>{data?.files?.length || ''}</>;
      },
      width: 100,
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',

      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
      width: 200,
    },

    {
      title: 'Action',
      // fixed: "right",
      width: 130,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="view">
                    <Link
                      className=""
                      href={`/${userInfo?.role}/module/details/${record?.module?._id}`}
                    >
                      View
                    </Link>
                  </Menu.Item>

                  <Menu.Item key="edit">
                    <Link href={`/${userInfo?.role}/lesson/edit/${record._id}`}>
                      Edit
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="add_milestone">
                    <Link
                      href={`/${userInfo?.role}/lesson/create/quiz/${record?._id}?lessonName=${record?.title}`}
                    >
                      Add Quiz
                    </Link>
                  </Menu.Item> */}

                  <Menu.Item
                    key="delete"
                    onClick={() => {
                      handleDelete(record._id);
                    }}
                  >
                    Delete
                  </Menu.Item>
                  <Menu.Item key="List">
                    <Link
                      href={`/${userInfo?.role}/lesson/assignment?lessonId=${record._id}`}
                    >
                      Assignment List
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="Rec">
                    <ModalComponent buttonText="Add assignment">
                      <AssignmentUpload lessonData={record} />
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
    //  //// console.log("Page:", page, "PageSize:", pageSize);
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    //// console.log(order, field);
    setSortBy(field as string);
    setSortOrder(order === 'ascend' ? 'asc' : 'desc');
  };

  const resetFilters = () => {
    setSortBy('');
    setSortOrder('');
    setSearchTerm('');
  };

  const deleteLessonHandler = async (id: string) => {
    //// console.log(id);
    try {
      const res = await deleteLesson(id);
      if (res) {
        message.success('Lesson Successfully Deleted!');
        setOpen(false);
      }
    } catch (error: any) {
      Error_model_hook(error.message);
    }
  };
  //---------------------------------
  const showDrawer = () => {
    setOpenDrawer(true);
  };
  const onClose = () => {
    setOpenDrawer(false);
  };

  //--------------------------------

  return (
    <div>
      {/* <UMBreadCrumb
        items={[
          {
            label: `${userInfo?.role}`,
            link: `/${userInfo?.role}`,
          },
          {
            label: `Lesson`,
            link: `/${userInfo?.role}/lesson`,
          },
        ]}
      /> */}
      <HeadingUI>Lesson List</HeadingUI>
      <ActionBar>
        <div className="flex gap-2">
          <Input
            size="large"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '250px',
            }}
          />
          {!queryObject?.module && (
            <FilterModule filterValue={filterValue} setFilterValue={setFilterValue} />
          )}
        </div>

        <div>
          {!queryObject?.module && (
            <Button type="default" style={{ marginRight: '5px' }} onClick={showDrawer}>
              Filter
            </Button>
          )}

          <Link href={`/${userInfo?.role}/lesson/create`}>
            <Button type="default">Create Lesson</Button>
          </Link>
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </ActionBar>
      <UMTable
        loading={isLoading || isFetching}
        columns={columns}
        dataSource={LessonData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
      <UMModal
        title="Remove Lesson"
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleOk={() => deleteLessonHandler(adminId)}
      >
        <p className="my-5">Do you want to remove this admin?</p>
      </UMModal>
      <Drawer
        title={
          <div className="flex items-center justify-between">
            <p>Filter</p>{' '}
            <button
              onClick={onClose}
              className="rounded px-5 text-lg text-red-500 hover:bg-red-600 hover:text-white"
            >
              X
            </button>
          </div>
        }
        placement={placement}
        closable={false}
        onClose={onClose}
        open={openDrawer}
        key={placement}
        size="large"
      >
        <SelectCategoryChildren
          lableText="Select category"
          setState={setCategory}
          isLoading={categoryLoading}
          categoryData={categoryData}
        />

        <SelectCategoryChildren
          lableText="Select courses"
          setState={setCourse}
          categoryData={
            //@ts-ignore
            category?.courses || []
          }
        />

        <SelectCategoryChildren
          lableText="Select milestones"
          setState={setmilestone}
          categoryData={
            //@ts-ignore
            course?.milestones || []
          }
        />

        <SelectCategoryChildren
          lableText="Select module"
          setState={setmodule}
          categoryData={
            //@ts-ignore
            milestone?.modules || []
          }
        />
      </Drawer>
      ;
    </div>
  );
}
