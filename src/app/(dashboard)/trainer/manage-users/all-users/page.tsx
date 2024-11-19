'use client';
import ActionBar from '@/components/ui/ActionBar';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import {
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Input } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import ImageTag from '@/components/ui/CustomTag/CustomImageTag';
import StatusTag from '@/components/ui/CustomTag/StatusTag';
import UMModal from '@/components/ui/UMModal';
import { USER_ROLE } from '@/constants/role';
import {
  useDeleteUserMutation,
  useGetAllUsersQuery,
} from '@/redux/api/adminApi/usersApi';
import { IDecodedInfo, getUserInfo } from '@/services/auth.service';
import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';

const AdminPage = () => {
  // const SUPER_ADMIN = USER_ROLE.ADMIN;
  const userInfo = getUserInfo() as IDecodedInfo;
  const query: Record<string, any> = {};
  const [deleteUser] = useDeleteUserMutation();

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

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });

  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data = [], isLoading } = useGetAllUsersQuery({
    ...query,
  });

  //@ts-ignore
  const UserData = data?.data;

  //@ts-ignore
  const meta = data?.data?.meta;

  const columns = [
    {
      title: 'Profile',
      width: 100,
      render: function (data: any) {
        const img = data[data.role]['img'];
        return (
          <>
            {
              <ImageTag
                src={img}
                width={100}
                height={100}
                className="h-[2.8rem] w-[5rem] rounded"
                alt="dd"
              />
            }
          </>
        );
      },
    },
    {
      title: 'Name',
      ellipsis: true,
      render: function (data: any) {
        let fullName = '';
        if (data?.role === USER_ROLE.ADMIN) {
          fullName = data?.admin?.name?.firstName + ' ' + data?.admin?.name?.lastName;
        } else if (data?.role === USER_ROLE.TRAINER) {
          fullName = data?.trainer?.name?.firstName + ' ' + data?.trainer?.name?.lastName;
        } else if (data?.role === USER_ROLE.SELLER) {
          fullName = data?.seller?.name?.firstName + ' ' + data?.seller?.name?.lastName;
        } else if (data?.role === USER_ROLE.STUDENT) {
          fullName = data?.student?.name?.firstName + ' ' + data?.student?.name?.lastName;
        }
        return <p className="">{fullName}</p>;
      },
    },
    {
      title: 'Email',
      ellipsis: true,
      dataIndex: 'email',
    },
    {
      title: 'Role',
      width: 100,
      render: function (data: any) {
        const role = data?.role;
        return <>{role}</>;
      },
    },
    {
      title: 'Status',
      width: 100,
      render: function (data: any) {
        const status = data?.status;
        return <StatusTag status={status} />;
      },
    },

    {
      title: 'Contact no.',
      render: function (data: any) {
        let Contact = '';
        if (data?.role === USER_ROLE.ADMIN) {
          Contact = data?.admin?.phoneNumber;
        } else if (data?.role === USER_ROLE.TRAINER) {
          Contact = data?.trainer?.phoneNumber;
        } else if (data?.role === USER_ROLE.SELLER) {
          Contact = data?.seller?.phoneNumber;
        } else if (data?.role === USER_ROLE.STUDENT) {
          Contact = data?.student?.phoneNumber;
        }
        return <>{Contact}</>;
      },
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
      dataIndex: '_id',
      width: 130,
      render: function (data: any) {
        return (
          <>
            <Link href={`/${userInfo?.role}/manage-users/all-users/details/${data}`}>
              <Button type="default">
                <EyeOutlined />
              </Button>
            </Link>
            <Link href={`/${userInfo?.role}/manage-users/all-users/edit/${data}`}>
              <Button
                style={{
                  margin: '0px 5px',
                }}
                type="default"
              >
                <EditOutlined />
              </Button>
            </Link>
            <Button onClick={() => deleteUserHandler(data)} type="default" danger>
              <DeleteOutlined />
            </Button>
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

  const deleteUserHandler = async (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deleteUser(id).unwrap();
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Customer Successfully Deleted');
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
      <h1 className="text-center text-2xl font-bold">All User List</h1>
      <hr />
      <ActionBar>
        <Input
          size="large"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '250px',
          }}
        />
        <div>
          <Link href={`/${userInfo?.role}/manage-users/all-users/create`}>
            <Button type="primary">Create Customer</Button>
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
        dataSource={UserData}
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
        handleOk={() => deleteUserHandler(adminId)}
      >
        <p className="my-5">Do you want to remove this admin?</p>
      </UMModal>
    </div>
  );
};

// export default AdminPage;

// export default AdminPage;

export default dynamic(() => Promise.resolve(AdminPage), {
  ssr: false,
});
