/* eslint-disable prefer-const */
'use client';
import { ReloadOutlined } from '@ant-design/icons';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';

import { Button, Input, Select, Space, TableProps, Tooltip } from 'antd';
import { useState } from 'react';

import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import ActionBar from '@/components/ui/ActionBar';
import CustomImageTag from '@/components/ui/CustomTag/CustomImageTag';
import UMTable from '@/components/ui/UMTable';
import { useGetAllPageBuilderQuery } from '@/redux/api/adminApi/pageBuilderApi';
import { IMeta } from '@/types/common';
import fileObjectToLink from '@/utils/fileObjectToLink';
import Link from 'next/link';

export default function PageBuilderListPage() {
  const { userInfo } = useGlobalContext();
  //
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(100);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('desc');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [pageType, setPageType] = useState<string>('');
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['pageType'] = pageType;

  const { data, isLoading } = useGetAllPageBuilderQuery(query);

  if (isLoading) {
    return <LoadingSkeleton />;
  }
  const handleDelete = (id: string) => {};
  let resentUser = data?.data || [];

  const meta = (data?.meta as IMeta) || [];

  const columns: TableProps<any>['columns'] = [
    {
      title: 'Title',
      ellipsis: true,
      key: '_id',
      render: (record: any) => (
        <div className="flex items-center justify-start gap-2">
          <CustomImageTag
            src={fileObjectToLink(record?.bannerImage)}
            width={550}
            height={550}
            preview={true}
            className="h-8 w-8 rounded-full shadow-lg md:h-12 md:w-12"
            alt=""
          />
          <Tooltip title={record.heading}>
            <p className="truncate">{record.heading}</p>
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Type',
      key: '_id',
      dataIndex: ['pageType'],
      width: 150,
    },
    {
      title: 'Status',
      key: '_id',
      ellipsis: true,
      dataIndex: ['status'],
      render: (record: any) => (
        <div className="flex items-start justify-between gap-2">
          <p>{record}</p>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Date',
      key: '_id',
      ellipsis: true,
      render: (record: any) => (
        <div className="flex items-start justify-between gap-2">
          <p>{new Date(record.createdAt).toDateString()}</p>
        </div>
      ),
      width: 200,
    },
    {
      title: 'Action',
      key: '_id',
      width: 120,
      render: (record: any) => {
        if (record.pageType === 'aboutUs') {
          return (
            <div>
              <Space size="middle">
                <Link href={'/aboutUs'}>View</Link>
                <Link href={`/${userInfo?.role}/page-builder/aboutUs/${record._id}`}>
                  Edit
                </Link>
              </Space>
            </div>
          );
        } else {
          return <></>;
        }
      },
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
    setPageType('');
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <ActionBar>
          <div className="mx-2">
            <Select
              onChange={(value) => setPageType(value)}
              placeholder="Select a page type"
              allowClear
              size="large"
            >
              <Select.Option value="aboutUs">About Us</Select.Option>
              <Select.Option value="boardOfTrustees">Board Of Trustees</Select.Option>
              <Select.Option value="leadership">Leadership</Select.Option>
              <Select.Option value="ourStaff">Our Staff</Select.Option>
              <Select.Option value="careerOpportunities">
                Career Opportunities
              </Select.Option>
            </Select>
          </div>
          <Input
            size="large"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '250px',
            }}
          />
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          )}
        </ActionBar>
      </div>
      <div className="bgd2">
        <UMTable
          loading={isLoading}
          columns={columns}
          dataSource={resentUser}
          pageSize={size}
          totalPages={meta?.total}
          showSizeChanger={true}
          onPaginationChange={onPaginationChange}
          onTableChange={onTableChange}
          showPagination={true}
        />
      </div>
    </div>
  );
}
