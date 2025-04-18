import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import FileContainShow from '@/components/Course/FileContaintShow';
import ModalComponent from '@/components/Modal/ModalComponents';
import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
import {
  useDeleteFileListMutation,
  useGetAllFileListesQuery,
} from '@/redux/api/AllApi/fileListApi';
import { useDebounced } from '@/redux/hooks';
import { IFileAfterUpload } from '@/types/globalType';
import fileObjectToLink from '@/utils/fileObjectToLink';
import {
  CopyOutlined,
  DownloadOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Button, Input, message, Pagination, Select, Tooltip } from 'antd';
import { saveAs } from 'file-saver';

import dayjs from 'dayjs';
import React, { useState } from 'react';
import { MdContentCopy, MdDelete } from 'react-icons/md';
import CustomImageTag from '../CustomTag/CustomImageTag';

import { confirm_modal, Error_model_hook, Success_model } from '@/utils/modalHook';
import UMTable from '../UMTable';
interface ImageModalProps {
  addedImages: IFileAfterUpload[];
  setAddedImages: React.Dispatch<React.SetStateAction<IFileAfterUpload[]>>;
  selectMultiple: boolean;
}
export default function ImageListShow({
  setAddedImages,
  addedImages,
  selectMultiple,
}: ImageModalProps) {
  const [deletefile, { isLoading: dLoading }] = useDeleteFileListMutation();
  const { userInfo } = useGlobalContext();
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [fileType, setFileType] = useState<string>('image');
  const [searchTerm, setSearchTerm] = useState<string>('');
  query['limit'] = limit;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
  query['fileType'] = fileType;
  if (userInfo?.userId) {
    query['author.userId'] = userInfo?.userId;
  }
  const debouncedSearchTerm = useDebounced({
    searchQuery: searchTerm,
    delay: 600,
  });
  if (!!debouncedSearchTerm) {
    query['searchTerm'] = debouncedSearchTerm;
  }
  const { data, isLoading, isFetching, isError, error, refetch } =
    useGetAllFileListesQuery(query);
  if (isLoading || isFetching) {
    return <LoadingForDataFetch />;
  }
  const allFiles = data?.data;
  const meta = data?.meta;
  console.log('🚀 ~ allFiles:', allFiles);
  // Calculate the index of the first and last profile to be displayed on the current page
  const onShowSizeChange = (current: number, pageSize: number) => {
    setPage(current);
    setLimit(pageSize);
  };
  const onChange = (page: number) => {
    setPage(page);
  };
  const handleDelete = (id: string) => {
    confirm_modal(`Are you sure you want to delete`).then(async (res) => {
      if (res.isConfirmed) {
        try {
          const res = await deletefile(id).unwrap();
          if (res?.success == false) {
            // message.success("Admin Successfully Deleted!");
            // setOpen(false);
            Error_model_hook(res?.message);
          } else {
            Success_model('Successfully Deleted');
          }
        } catch (error: any) {
          Error_model_hook(error.message);
        }
      }
    });
  };
  const columns = [
    {
      title: 'Title',
      dataIndex: 'filename',
      ellipsis: true,
    },

    {
      title: 'Created at',
      dataIndex: 'createdAt',
      render: function (data: any) {
        return data && dayjs(data).format('MMM D, YYYY hh:mm A');
      },
      sorter: true,
      width: 200,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: function (data: any) {
        return (
          <p
            className={`${
              data === 'active' ? 'bg-green-500' : 'bg-red-500'
            } text-white rounded-md px-2 py-1`}
          >
            {data === 'active' ? 'Active' : 'Pending'}
          </p>
        );
      },
      width: 100,
    },
    {
      title: 'Action',
      // dataIndex: '_id',
      width: 150,
      render: function (file: any) {
        return (
          <div className=" gap-1">
            <div className="flex items-center gap-1">
              <p
                className="cursor-pointer "
                onClick={() => {
                  if (file.url) {
                    navigator.clipboard.writeText(fileObjectToLink(file));
                  }
                  message.success('Link Copy Success');
                }}
              >
                <Tooltip title="Only Copy file link">
                  <MdContentCopy />
                </Tooltip>
              </p>
              <div>
                <ModalComponent
                  width={1200}
                  button={
                    <Tooltip title="View file">
                      <p className="cursor-pointer">View</p>
                    </Tooltip>
                  }
                >
                  <FileContainShow files={[file]} />
                </ModalComponent>
              </div>
            </div>
            <Tooltip title="Copy JSON file">
              <p
                className="cursor-pointer whitespace-nowrap flex items-center gap-1 border p-1 rounded-xl w-fit my-1 pr-4"
                onClick={() => {
                  if (file.url) {
                    navigator.clipboard.writeText(JSON.stringify(file));
                  }
                  message.success('Link Copy JSON File ');
                }}
              >
                <MdContentCopy />
                JSON
              </p>
            </Tooltip>

            <div>
              <button
                className="flex items-center gap-1 border p-1 rounded-xl"
                onClick={() => handleDelete(file._id)}
              >
                <MdDelete className="text-lg text-red-500" /> Delete
              </button>
            </div>
          </div>
        );
      },
    },
  ];
  const onPaginationChange = (page: number, pageSize: number) => {
    setPage(page);
    setLimit(pageSize);
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
  const fileTypes = [
    { label: 'Image', value: 'image' },
    { label: 'PDF', value: 'pdf' },
    { label: 'Document', value: 'doc' },
    { label: 'Audio', value: 'audio' },
    { label: 'Video', value: 'video' },
    { label: 'Excel', value: 'xlsx' },
    { label: 'Other', value: 'other' },
  ];
  return (
    <div>
      <div className="-mt-3 mb-1 flex  gap-2 justify-between">
        <Input
          size="large"
          placeholder="Search"
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
          }}
          allowClear
        />
        <Select
          value={fileType}
          onChange={(value: string) => {
            setFileType(value);
          }}
          style={{ width: 200, height: 40 }}
          placeholder="Select file type"
          options={fileTypes}
        />
        <div>
          <Button
            loading={isFetching}
            style={{ height: 40 }}
            type="default"
            onClick={() => refetch()}
          >
            <ReloadOutlined /> Soft Reload
          </Button>
          {(!!sortBy || !!sortOrder || !!searchTerm) && (
            <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
              <ReloadOutlined />
            </Button>
          )}
        </div>
      </div>
      <div>
        {fileType === 'image' && (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
              {allFiles?.map((file) => {
                return (
                  <div key={file._id}>
                    <Tooltip title={file.filename}>
                      <div className="relative rounded-md border group">
                        <CustomImageTag
                          src={file}
                          width={300}
                          height={300}
                          className="w-full h-28 cursor-pointer rounded-md"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 hidden group-hover:flex items-center justify-center space-x-6">
                          {/* Icon for Viewing */}
                          <div className="flex justify-center items-center gap-2">
                            <div className="flex flex-col items-center text-white transition-transform cursor-pointer transform hover:scale-110">
                              <EyeOutlined style={{ fontSize: 24 }} />
                            </div>

                            {/* Icon for Copying */}
                            <div
                              onClick={() => {
                                navigator.clipboard.writeText(fileObjectToLink(file));
                                message.success('Link Copy Success');
                              }}
                              className="flex flex-col items-center text-white transition-transform cursor-pointer transform hover:scale-110"
                            >
                              <CopyOutlined style={{ fontSize: 24 }} />
                            </div>

                            {/* Icon for Downloading */}
                            <div
                              onClick={() =>
                                typeof fileObjectToLink(file) === 'string' &&
                                saveAs(fileObjectToLink(file), file.filename)
                              }
                              className="flex flex-col items-center text-white transition-transform cursor-pointer transform hover:scale-110"
                            >
                              <DownloadOutlined style={{ fontSize: 24 }} />
                            </div>
                          </div>
                        </div>
                        {/* <p>Copy link</p> */}
                      </div>
                    </Tooltip>
                  </div>
                );
              })}
            </div>
            <div className="flex items-end justify-end mt-10 text-2xl ">
              <Pagination
                showSizeChanger
                current={page}
                onChange={onChange}
                showQuickJumper
                onShowSizeChange={onShowSizeChange}
                defaultCurrent={1}
                total={meta?.total}
                pageSizeOptions={[10, 20, 50]}
              />
            </div>
          </div>
        )}
        {fileType !== 'image' && (
          <div>
            <UMTable
              loading={isLoading}
              columns={columns}
              dataSource={allFiles}
              pageSize={limit}
              totalPages={meta?.total}
              showSizeChanger={true}
              onPaginationChange={onPaginationChange}
              onTableChange={onTableChange}
              showPagination={true}
            />
          </div>
        )}
      </div>
      {/* <div className="flex justify-center mt-2 items-center border p-1 rounded-md">
        <div className="">
          <Button
            type="primary"
            onClick={() => {
              setAddedImages([]);
            }}
          >
            Add Files
          </Button>
        </div>
      </div> */}
    </div>
  );
}
