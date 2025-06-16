'use client';
import ModalComponent from '@/components/Modal/ModalComponents';
import ActionBar from '@/components/ui/ActionBar';
import UMTable from '@/components/ui/UMTable';
import HeadingUI from '@/components/ui/dashboardUI/HeadingUI';
import {
  useDeleteGradeLevelMutation,
  useGetAllGradeLevelQuery,
} from '@/redux/api/adminApi/gradeLevelApi';
import { useDebounced } from '@/redux/hooks';
import fileObjectToLink from '@/utils/fileObjectToLink';
import { Error_model_hook, Success_model, confirm_modal } from '@/utils/modalHook';
import { ReloadOutlined } from '@ant-design/icons';
import { Button, Dropdown, Input, Menu, Space } from 'antd';
import { useState } from 'react';
import { useGlobalContext } from '../ContextApi/GlobalContextApi';
import PDFViewer from '../ui/PdfViewer';
import CreateUpdateGradeLevel from './CreateUpdateGradeLevel';

const GradeLevelList = ({ categoryId }: { categoryId?: string }) => {
  const query: Record<string, any> = {};
  // const userInfo = getUserInfo() as IDecodedInfo;
  const { userInfo, userInfoLoading } = useGlobalContext();
  const [deleteGradeLevel, { isLoading: deleteLoading }] = useDeleteGradeLevelMutation();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterValue, setFilterValue] = useState(categoryId || '');
  query['limit'] = size;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  // query['status'] = 'active';

  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });
  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data, isLoading, isFetching } = useGetAllGradeLevelQuery({ ...query });
  //@ts-ignore
  const courseData = data?.data || [];
  //
  //@ts-ignore
  const meta = data?.meta;

  //

  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deleteGradeLevel(id).unwrap();
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Course Successfully Deleted');
          }
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };

  const columns = [
    {
      title: 'title',
      // fixed:"left",
      dataIndex: 'title',

      render: function (data: any) {
        return <p className="line-clamp-2">{data}</p>;
      },
    },

    {
      title: 'Total Milestone',
      dataIndex: 'totalModuleSize',
      width: 120,
    },

    {
      title: 'Grade Vocabulary',
      width: 80,
      render: function (data: any) {
        return (
          <>
            {data?.files && data?.files[0] ? (
              <ModalComponent buttonText="Pdf view">
                <PDFViewer file={fileObjectToLink(data?.files[0])} />
              </ModalComponent>
            ) : (
              'N/A'
            )}
          </>
        );
      },
    },
    {
      title: 'Action',
      // fixed: "right",
      width: 110,
      render: (record: any) => (
        <>
          <Space size="middle">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="delete"
                    onClick={() => {
                      handleDelete(record._id);
                    }}
                  >
                    Delete
                  </Menu.Item>
                  <Menu.Item key="update">
                    <ModalComponent buttonText="Edit">
                      <CreateUpdateGradeLevel id={record?._id} />
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
      <HeadingUI>Grade Level List</HeadingUI>

      <ActionBar>
        <div className="gap-2 lg:flex">
          <Input
            size="large"
            placeholder="Search"
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '250px',
            }}
          />
        </div>

        <div>
          <ModalComponent buttonText="Create">
            <CreateUpdateGradeLevel />
          </ModalComponent>
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </ActionBar>

      <UMTable
        loading={isLoading || userInfoLoading || isFetching}
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
};

export default GradeLevelList;
