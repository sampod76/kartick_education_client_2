'use client';
import ActionBar from '@/components/ui/ActionBar';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Drawer, DrawerProps, Dropdown, Input, Menu, Space, message } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import UMModal from '@/components/ui/UMModal';

import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import Image from 'next/image';

import { AllImage } from '@/assets/AllImge';
import FilterMilestone from '@/components/dashboard/Filter/FilterMilestone';
import ModalComponent from '@/components/Modal/ModalComponents';
import {
  useDeleteModuleMutation,
  useGetAllModuleQuery,
} from '@/redux/api/adminApi/moduleApi';

import GlossaryCreate from '@/components/Glossary/GlossaryCreate';
import ResourceCreate from '@/components/Resource/Resource';
import { useGetAllCategoryChildrenQuery } from '@/redux/api/categoryChildrenApi';
import { IDecodedInfo, getUserInfo } from '@/services/auth.service';
import SelectCategoryChildren from '../Forms/GeneralField/SelectCategoryChildren';

export default function ModuleDashList({
  queryObject,
}: {
  queryObject?: {
    category?: string;
    course?: string;
    milestone: string;
    sortBy?: string;
    setSortOrder?: string;
  };
}) {
  console.log(queryObject, 'queryObject');
  const userInfo = getUserInfo() as IDecodedInfo;
  //
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');
  //
  //----------------------------------------------------------------
  const [category, setCategory] = useState<{ _id?: string; title?: string }>({});
  const [course, setCourse] = useState<{ _id?: string; title?: string }>({});
  const [milestone, setmilestone] = useState<{ _id?: string; title?: string }>({});
  const queryCategory: Record<string, any> = {};
  queryCategory['children'] = 'course-milestone';
  //! for Category options selection
  if (userInfo?.role !== 'admin') {
    queryCategory['author'] = userInfo?.id;
  }
  const { data: Category, isLoading: categoryLoading } = useGetAllCategoryChildrenQuery(
    {
      ...queryCategory,
    },
    { skip: !!queryObject?.milestone },
  );
  const categoryData: any = Category?.data;
  //----------------------------------------------------------------

  const query: Record<string, any> = {};

  // const SUPER_ADMIN=USER_ROLE.ADMIN

  const [deleteModule] = useDeleteModuleMutation();

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
  // query['category'] = queryObject?.category || category?._id;
  query['course'] = queryObject?.course || course?._id;
  query['milestone'] = queryObject?.milestone || milestone?._id;
  if (filterValue) {
    query['milestone'] = filterValue;
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
  const { data, isLoading, isFetching } = useGetAllModuleQuery({ ...query });

  //@ts-ignore
  const MilestoneData = data?.data;

  //@ts-ignore
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deleteModule(id).unwrap();

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
      // ellipsis: true,
      render: function (data: any) {
        return <p className="line-clamp-2">{data}</p>;
      },
    },
    // {
    //   title: 'Description',
    //   dataIndex: 'short_description',
    //   ellipsis: true,
    // },
    {
      title: 'S/N',
      dataIndex: 'module_number',
      ellipsis: true,
      width: 100,
    },

    {
      title: 'Milestone',
      dataIndex: 'milestone',
      // ellipsis: true,
      render: function (data: any) {
        return <p className="line-clamp-2">{data?.title}</p>;
      },
    },
    // {
    //   title: 'Created at',
    //   dataIndex: 'createdAt',
    //   render: function (data: any) {
    //     return data && dayjs(data).format('MMM D, YYYY hh:mm A');
    //   },
    //   sorter: true,
    // },
    {
      title: 'Total Lessons',
      dataIndex: 'totalLessons',
      width: 150,
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
                    <Link href={`/${userInfo?.role}/module/details/${record._id}`}>
                      View
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="edit">
                    <Link href={`/${userInfo?.role}/module/edit/${record._id}`}>
                      Edit
                    </Link>
                  </Menu.Item>
                  <Menu.Item key="Material">
                    <Link href={`/${userInfo?.role}/module/material/${record._id}`}>
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
                  <div className="flex flex-col items-center justify-center gap-1">
                    <ModalComponent buttonText="Add/edit Resource">
                      <ResourceCreate moduleId={record._id} />
                    </ModalComponent>

                    <ModalComponent buttonText="Add/edit Glossary">
                      <GlossaryCreate moduleId={record._id} />
                    </ModalComponent>
                  </div>
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

  const deleteModuleHandler = async (id: string) => {
    // console.log(id);
    try {
      const res = await deleteModule(id);
      if (res) {
        message.success('Module Successfully Deleted!');
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
      <h1>Module List</h1>
      {!queryObject?.milestone && (
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
            <FilterMilestone filterValue={filterValue} setFilterValue={setFilterValue} />
          </div>
          <div>
            <Button type="default" style={{ marginRight: '5px' }} onClick={showDrawer}>
              Filter
            </Button>

            <Link href={`/${userInfo?.role}/module/create`}>
              <Button type="default">Create Module</Button>
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
        loading={isLoading || isFetching}
        columns={columns}
        dataSource={MilestoneData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
      <UMModal
        title="Remove Module"
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleOk={() => deleteModuleHandler(adminId)}
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
      </Drawer>
      ;
    </div>
  );
}
