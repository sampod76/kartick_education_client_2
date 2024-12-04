'use client';
import ActionBar from '@/components/ui/ActionBar';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Drawer, DrawerProps, Dropdown, Input, Menu, Space, message } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import UMModal from '@/components/ui/UMModal';
import dayjs from 'dayjs';

import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import Image from 'next/image';

import { AllImage } from '@/assets/AllImge';
import FilterCourse from '@/components/dashboard/Filter/FilterCourse';
import {
  useDeleteMilestoneMutation,
  useGetAllMilestoneQuery,
} from '@/redux/api/adminApi/milestoneApi';
import { useGetAllCategoryChildrenQuery } from '@/redux/api/categoryChildrenApi';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import SelectCategoryChildren from '../Forms/GeneralField/SelectCategoryChildren';

const MileStoneList = ({
  queryObject,
}: {
  queryObject?: {
    course: string;
    category?: string;
    sortBy?: string;
    setSortOrder?: string;
  };
}) => {
  const { userInfo } = useGlobalContext();
  //
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');
  //
  //----------------------------------------------------------------
  const [category, setCategory] = useState<{ _id?: string; title?: string }>({});
  const [course, setCourse] = useState<{ _id?: string; title?: string }>({});

  const queryCategory: Record<string, any> = {};
  queryCategory['children'] = 'course';
  if (userInfo?.role !== 'admin') {
    queryCategory['author'] = userInfo?.id;
  }
  //! for Category options selection
  const { data: Category, isLoading: categoryLoading } = useGetAllCategoryChildrenQuery(
    {
      ...queryCategory,
    },
    { skip: !!queryObject?.course },
  );
  const categoryData: any = Category?.data;
  //----------------------------------------------------------------

  const query: Record<string, any> = {};

  const [deleteMilestone] = useDeleteMilestoneMutation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>(queryObject?.sortBy || '');
  const [sortOrder, setSortOrder] = useState<string>(queryObject?.setSortOrder || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('');
  const [filterValue, setFilterValue] = useState('');

  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['status'] = 'active';
  //
  query['category'] = queryObject?.category || category?._id;
  query['course'] = queryObject?.course || course?._id;
  //
  if (filterValue) {
    query['course'] = filterValue;
  }
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
  const { data = [], isLoading } = useGetAllMilestoneQuery({ ...query });
  // console.log("🚀 ~ file: page.tsx:68 ~ MileStoneList ~ data:", data);

  //@ts-ignore
  const milestoneData = data?.data || [];

  //@ts-ignore
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deleteMilestone(id).unwrap();

          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Milestone Successfully Deleted');
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
      sorter: true,
    },
    {
      title: 'Description',
      dataIndex: 'short_description',
      ellipsis: true,
    },
    {
      title: 'Milestone Number',
      dataIndex: 'milestone_number',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'course',
      dataIndex: ['course', 'title'],
      ellipsis: true,
      // render: function (data: any) {
      //   return <>{data?.title}</>;
      // },
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      width: 150,
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
    },
    {
      title: 'Action',
      // fixed: "right",
      width: 120,
      render: (record: any) => (
        // console.log(object);
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="view">
                    <Link href={`/${userInfo?.role}/milestone/details/${record._id}`}>
                      View
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="edit">
                    <Link href={`/${userInfo?.role}/milestone/edit/${record._id}`}>
                      Edit
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="Material">
                    <Link href={`/${userInfo?.role}/milestone/material/${record._id}`}>
                      Material
                    </Link>
                  </Menu.Item>
                  {/* <Menu.Item key="add_milestone">
                    <Link
                      href={`/${userInfo?.role}/milestone/create/module/${record?._id}?milestoneName=${record?.title}`}
                    >
                      Add Module
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

  const deleteAdminHandler = async (id: string) => {
    // console.log(id);
    try {
      const res = await deleteMilestone(id);
      if (res) {
        message.success('Milestone Successfully Deleted!');
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
    <div
      style={{
        boxShadow:
          '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: '1rem',
        backgroundColor: 'white',
        padding: '1rem',
      }}
    >
      <h1>Milestone List</h1>
      {!queryObject?.course && (
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
            <FilterCourse filterValue={filterValue} setFilterValue={setFilterValue} />
          </div>
          <div>
            <Button type="default" style={{ marginRight: '5px' }} onClick={showDrawer}>
              Filter
            </Button>

            <Link href={`/${userInfo?.role}/milestone/create`}>
              <Button type="default">Create Milestone</Button>
            </Link>
            {(!!sortBy || !!sortOrder || !!searchTerm) && (
              <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
                <ReloadOutlined />
              </Button>
            )}
          </div>
        </ActionBar>
      )}
      <UMTable
        loading={isLoading}
        columns={columns}
        dataSource={milestoneData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
      <UMModal
        title="Remove Milestone"
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleOk={() => deleteAdminHandler(adminId)}
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
      </Drawer>
      ;
    </div>
  );
};

export default MileStoneList;
