/* eslint-disable prettier/prettier */
'use client';
import ModalComponent from '@/components/Modal/ModalComponents';
import ActionBar from '@/components/ui/ActionBar';
import UMTable from '@/components/ui/UMTable';
import { useGetAllEmailMarketingQuery } from '@/redux/api/public/emailMarketingApi';
import { useDebounced } from '@/redux/hooks';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Space } from 'antd';
import { SetStateAction, useState } from 'react';

/* eslint-disable prettier/prettier */
export default function EmailListMarketing() {
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const query: Record<string, any> = {};
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
  const { data, isLoading } = useGetAllEmailMarketingQuery(query);
  //@ts-ignore
  const courseData = data?.data || [];
  // console.log('🚀 ~ CourseList ~ courseData:', courseData);
  //
  //@ts-ignore
  const meta = data?.meta;

  const columns = [
    {
      title: 'Name',
      // fixed:"left",
      dataIndex: 'name',

      render: function (data: any) {
        return <p className="line-clamp-2">{data}</p>;
      },
    },

    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      ellipsis: true,
    },

    {
      title: 'Action',
      fixed: 'right',
      width: 110,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <ModalComponent width={1000} button={<Button>View</Button>}>
                    <div>
                      <h1>Name: {record?.name}</h1>
                      <h4>Email: {record?.email}</h4>
                      <p>Description: {record?.description}</p>
                    </div>
                  </ModalComponent>
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

  const resetFilters = () => {
    setSortBy('');
    setSortOrder('');
    setSearchTerm('');
  };
  return (
    <div>
      <ActionBar>
        <div className="gap-2 lg:flex">
          <Input
            size="large"
            placeholder="Search"
            onChange={(e: { target: { value: SetStateAction<string> } }) =>
              setSearchTerm(e.target.value)
            }
            style={{
              width: '250px',
            }}
            value={searchTerm}
          />
        </div>

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
        dataSource={courseData}
        pageSize={size}
        totalPages={meta?.total}
        showSizeChanger={true}
        onPaginationChange={onPaginationChange}
        onTableChange={onTableChange}
        showPagination={true}
      />
    </div>
  );
}
