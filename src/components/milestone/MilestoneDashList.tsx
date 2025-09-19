'use client';
import UMTable from '@/components/ui/UMTable';
import { useDebounced } from '@/redux/hooks';
import { Dropdown, Menu, Space } from 'antd';
import Link from 'next/link';
import { useState } from 'react';

import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import Image from 'next/image';

import { AllImage } from '@/assets/AllImge';
import {
  useDeleteMilestoneMutation,
  useGetAllMilestoneQuery,
} from '@/redux/api/adminApi/milestoneApi';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import ModalComponent from '../Modal/ModalComponents';
import CreateMilestone from './create/createAndUpdateMilestoned';
import CustomImageTag from '../ui/CustomTag/CustomImageTag';

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

  const query: Record<string, any> = {};

  const [deleteMilestone] = useDeleteMilestoneMutation();

  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>(queryObject?.sortBy || 'milestone_number');
  const [sortOrder, setSortOrder] = useState<string>(queryObject?.setSortOrder || '');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const [filterValue, setFilterValue] = useState('');

  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['status'] = 'active';
  //
  query['category'] = queryObject?.category;
  query['course'] = queryObject?.course;
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
              <CustomImageTag
                src={data?.imgs?.length ? data?.imgs[0] : AllImage.notFoundImage}
                //@ts-ignore
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

      render: function (data: any) {
        return <p className="line-clamp-2">{data}</p>;
      },
    },

    {
      title: 'S/N',
      dataIndex: 'milestone_number',
      ellipsis: true,
      width: 120,
    },
    {
      title: 'Grade level',
      dataIndex: ['gradeLevelsDetails', 'title'],
      ellipsis: true,
    },
    {
      title: 'Total module',
      dataIndex: ['totalModules'],
      ellipsis: true,

      width: 150,
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
                    {/* <Link href={`/${userInfo?.role}/milestone/edit/${record._id}`}>
                      Edit
                    </Link> */}
                    <ModalComponent
                      button={<button className="text-blue-700">Edit</button>}
                    >
                      <CreateMilestone
                        milestoneId={record._id}
                        // courseId={record?.course?._id || record?.course}
                        // categoryId={record?.category?._id || record?.category}
                        // title={record.title}
                      />
                    </ModalComponent>
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
    </div>
  );
};

export default MileStoneList;
