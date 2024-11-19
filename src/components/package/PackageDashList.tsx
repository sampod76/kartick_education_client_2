'use client';
import ActionBar from '@/components/ui/ActionBar';
import UMBreadCrumb from '@/components/ui/UMBreadCrumb';
import { Button, Drawer, DrawerProps, Dropdown, Input, Menu, Space, message } from 'antd';
import Link from 'next/link';
import { ReloadOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { useDebounced } from '@/redux/hooks';
import UMTable from '@/components/ui/UMTable';

import dayjs from 'dayjs';
import UMModal from '@/components/ui/UMModal';

import Image from 'next/image';
import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';

import {
  useDeleteMilestoneMutation,
  useGetAllMilestoneQuery,
} from '@/redux/api/adminApi/milestoneApi';
import HeadingUI from '@/components/ui/dashboardUI/HeadingUI';
import FilterCourse from '@/components/dashboard/Filter/FilterCourse';
import { AllImage } from '@/assets/AllImge';
import { useGetAllCategoryChildrenQuery } from '@/redux/api/categoryChildrenApi';
import SelectCategoryChildren from '../Forms/GeneralField/SelectCategoryChildren';
import { IDecodedInfo, getUserInfo } from '@/services/auth.service';
import {
  useDeletePackageMutation,
  useGetAllPackageQuery,
} from '@/redux/api/userApi/packageAPi';

export default function PackageDashList() {
  //
  const [openDrawer, setOpenDrawer] = useState(false);
  const [placement, setPlacement] = useState<DrawerProps['placement']>('right');
  //
  //----------------------------------------------------------------
  const [category, setCategory] = useState<{ _id?: string; title?: string }>({});
  const [course, setCourse] = useState<{ _id?: string; title?: string }>({});

  const queryCategory: Record<string, any> = {};
  queryCategory['children'] = 'course';
  //! for Category options selection
  const { data: Category, isLoading: categoryLoading } = useGetAllCategoryChildrenQuery({
    ...queryCategory,
  });
  const categoryData: any = Category?.data;
  //----------------------------------------------------------------

  const query: Record<string, any> = {};

  // const SUPER_ADMIN=USER_ROLE.ADMIN
  const userInfo = getUserInfo() as IDecodedInfo;

  const [deletePackage] = useDeletePackageMutation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
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
  query['category'] = category?._id;

  //
  if (filterValue) {
    query['category'] = filterValue;
  }

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data = [], isLoading } = useGetAllPackageQuery({ ...query });

  //@ts-ignore
  const packageData = data?.data || [];

  //@ts-ignore
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deletePackage(id).unwrap();

          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Package Successfully Deleted');
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
                src={data?.img ? data?.img : AllImage.notFoundImage}
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
      title: 'Type',
      dataIndex: 'type',
      ellipsis: true,
      width: 100,
    },
    {
      title: 'MemberShip',
      dataIndex: ['membership', 'title'],
      ellipsis: true,
    },
    {
      title: 'Monthly',
      dataIndex: ['monthly', 'price'],
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Biannual',
      dataIndex: ['biannual', 'price'],
      ellipsis: true,
      width: 100,
    },
    {
      title: 'Yearly',
      dataIndex: ['yearly', 'price'],
      ellipsis: true,
      width: 100,
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
      width: 130,
      render: (record: any) => (
        // console.log(object);
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  {/* <Menu.Item key="view">
                    <Link href={`/${userInfo?.role}/package/details/${record._id}`}>
                      View
                    </Link>
                  </Menu.Item> */}
                  <Menu.Item key="edit">
                    <Link href={`/${userInfo?.role}/package/edit/${record._id}`}>
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
      // width: 100,
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
      const res = await deletePackage(id);
      if (res) {
        message.success('Package Successfully Deleted!');
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
      {/* <UMBreadCrumb
        items={[
          {
            label: `${userInfo?.role}`,
            link: `/${userInfo?.role}`,
          },
          {
            label: `Package`,
            link: `/${userInfo?.role}/package`,
          },
        ]}
      /> */}
      <h1>Package List</h1>
      <ActionBar>
        <div className="block gap-5 lg:flex">
          <Input
            size="large"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '15rem',
            }}
          />
          {/* <FilterCourse
            filterValue={filterValue}
            setFilterValue={setFilterValue}
          /> */}
        </div>
        <div className="block gap-5 lg:flex">
          {/* <Button
            type="default"
            style={{ marginRight: "5px" }}
            onClick={showDrawer}
          >
            Filter
          </Button> */}

          <Link href={`/${userInfo?.role}/package/create`}>
            <Button type="default">Create Package</Button>
          </Link>
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </ActionBar>
      <UMTable
        loading={isLoading}
        columns={columns}
        dataSource={packageData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
      <UMModal
        title="Remove Package"
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleOk={() => deleteAdminHandler(adminId)}
      >
        <p className="my-5">Do you want to remove this admin?</p>
      </UMModal>
      {/* <Drawer
        title={
          <div className="flex justify-between items-center ">
            <p>Filter</p>{" "}
            <button
              onClick={onClose}
              className="text-lg text-red-500 rounded hover:text-white px-5  hover:bg-red-600"
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
      </Drawer> */}
      ;
    </div>
  );
}
