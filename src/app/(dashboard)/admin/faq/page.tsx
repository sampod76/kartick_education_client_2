'use client';
import ActionBar from '@/components/ui/ActionBar';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Space } from 'antd';
import { useState } from 'react';

import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import dayjs from 'dayjs';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import ModalComponent from '@/components/Modal/ModalComponents';
import CreateFaqCom from '@/components/faq/createFaq';
import { useDeleteFaqMutation, useGetAllFaqQuery } from '@/redux/api/faqApi';

const FaqList = () => {
  const { userInfo } = useGlobalContext();

  const query: Record<string, any> = {};
  const [deleteFaq, { isLoading: deleteFaqLoading }] = useDeleteFaqMutation();

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
  const { data = [], isLoading } = useGetAllFaqQuery({ ...query });

  //@ts-ignore
  const faqData = data?.data;

  //@ts-ignore
  const meta = data?.meta;

  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deleteFaq(id).unwrap();
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Service Successfully Deleted');
          }
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };

  const columns = [
    {
      title: 'Question',
      dataIndex: 'question',
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
      title: 'Status',
      dataIndex: 'status',
    },
    {
      title: 'Action',

      width: 130,
      render: function (record: any) {
        return (
          <>
            <Space size="middle">
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="details">
                      <ModalComponent
                        button={
                          <Button className="!w-20" type="default">
                            View
                          </Button>
                        }
                      >
                        <CreateFaqCom value={record} />
                      </ModalComponent>
                    </Menu.Item>

                    <Menu.Item key="edit">
                      <ModalComponent
                        button={
                          <Button className="!w-20" type="default">
                            Edit
                          </Button>
                        }
                      >
                        <CreateFaqCom value={record} />
                      </ModalComponent>
                    </Menu.Item>

                    <Menu.Item
                      key="delete"
                      onClick={() => {
                        handleDelete(record._id);
                      }}
                    >
                      <Button className="!w-20" type="dashed">
                        Delete
                      </Button>
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

  return (
    <div>
      {/* <UMBreadCrumb
        items={[
          {
            label: "userInfo?.role",
            link: "/userInfo?.role",
          },
        ]}
      /> */}
      <ActionBar title="Faq List">
        <Input
          size="large"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '250px',
          }}
          value={searchTerm}
        />
        <div>
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
        dataSource={faqData}
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

export default FaqList;
