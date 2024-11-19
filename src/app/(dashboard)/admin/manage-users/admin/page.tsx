'use client';
import ActionBar from '@/components/ui/ActionBar';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Space } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import UMModal from '@/components/ui/UMModal';
import { confirm_modal, Error_model_hook, Success_model } from '@/utils/modalHook';
import dayjs from 'dayjs';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import { useDeleteAdminMutation } from '@/redux/api/adminApi';
import { useGetAllAdminsQuery } from '@/redux/api/adminApi/adminApi';

const TrainerListPage = () => {
  // const SUPER_ADMIN = USER_ROLE.ADMIN;
  const { userInfo, userInfoLoading } = useGlobalContext();
  const query: Record<string, any> = {};
  const [deleteAdmin, { isLoading: dloading }] = useDeleteAdminMutation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [open, setOpen] = useState<boolean>(false);
  const [adminId, setAdminId] = useState<string>('');

  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  // query["status"] = "active";

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data, isLoading } = useGetAllAdminsQuery({
    ...query,
  });

  //@ts-ignore
  const AdminData = data?.data;

  //@ts-ignore
  const meta = data?.meta;

  const columns = [
    {
      title: 'Name',
      render: function (data: any) {
        const fullName = `${data?.name?.firstName} ${data?.name?.lastName}  `;
        return <>{fullName}</>;
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
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
      title: 'Contact no.',
      dataIndex: 'phoneNumber',
    },
    {
      title: 'Date Of Birth',
      dataIndex: 'dateOfBirth',
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY ');
      },
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
    },
    {
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',
      dataIndex: '_id',
      width: 130,
      render: function (id: string, data: any) {
        return (
          <>
            <Space size="middle">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="details">
                      <Link href={`/${userInfo?.role}/manage-users/admin/details/${id}`}>
                        View
                      </Link>
                    </Menu.Item>
                    <Menu.Item key="edit">
                      <Link href={`/${userInfo?.role}/manage-users/admin/edit/${id}`}>
                        Edit
                      </Link>
                    </Menu.Item>

                    <Menu.Item key="details">
                      <Button
                        onClick={() => deleteAdminHandler(id)}
                        type="default"
                        danger
                        className="w-full"
                      >
                        <DeleteOutlined /> Delete
                      </Button>
                    </Menu.Item>
                  </Menu>
                }
              >
                <button className="text-blue-700">Action</button>
              </Dropdown>
            </Space>
          </>
        );
      },
    },
  ];
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setSize(pageSize);
  };
  const onTableChange = (pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;

    setSortBy(field as string);
    setSortOrder(order === 'ascend' ? 'asc' : 'desc');
  };

  const resetFilters = () => {
    setSortBy('');
    setSortOrder('');
    setSearchTerm('');
  };

  const deleteAdminHandler = async (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deleteAdmin(id).unwrap();
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Admin Successfully Deleted');
          }
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };
  // if (isLoading) {
  //   return <LoadingForDataFetch />;
  // }
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
      <ActionBar title="Admin List">
        <Input
          size="large"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '250px',
          }}
        />
        <div>
          <Link href={`/${userInfo?.role}/manage-users/admin/create`}>
            <Button type="default">Create Admin</Button>
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
        dataSource={AdminData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />

      <UMModal
        title="Remove admin"
        isOpen={open}
        closeModal={() => setOpen(false)}
        handleOk={() => deleteAdminHandler(adminId)}
      >
        <p className="my-5">Do you want to remove this admin?</p>
      </UMModal>
    </div>
  );
};

export default TrainerListPage;
