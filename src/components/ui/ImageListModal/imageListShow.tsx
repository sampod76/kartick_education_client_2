import { useGlobalContext } from '@/components/ContextApi/GlobalContextApi';
import LoadingForDataFetch from '@/components/Utlis/LoadingForDataFetch';
import { useGetAllFileListesQuery } from '@/redux/api/AllApi/fileListApi';
import { useDebounced } from '@/redux/hooks';
import { IFileAfterUpload } from '@/types/globalType';
import { Button, Pagination, Tooltip } from 'antd';
import React, { useState } from 'react';
import CustomImageTag from '../CustomTag/CustomImageTag';
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
  const { userInfo } = useGlobalContext();
  // console.log('🚀 ~ userInfo:', userInfo);
  const query: Record<string, any> = {};
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [sortBy, setSortBy] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  query['limit'] = limit;
  query['page'] = page;
  query['sortBy'] = sortBy;
  query['sortOrder'] = sortOrder;
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
  const { data, isLoading, isFetching, isError, error } = useGetAllFileListesQuery(query);
  if (isLoading || isFetching) {
    return <LoadingForDataFetch />;
  }
  const allFiles = data?.data;
  // console.log('🚀 ~ allFiles:', allFiles);
  const meta = data?.meta;
  // Calculate the index of the first and last profile to be displayed on the current page
  const onShowSizeChange = (current: number, pageSize: number) => {
    setPage(current);
    setLimit(pageSize);
  };
  const onChange = (page: number) => {
    setPage(page);
  };
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2">
        {allFiles?.map((file) => {
          return (
            <div key={file._id}>
              <Tooltip title={file.filename}>
                <div className="rounded-md border">
                  <CustomImageTag
                    src={file}
                    width={300}
                    height={300}
                    className="w-full h-28 cursor-pointer rounded-md"
                  />
                  {/* <p>Copy link</p> */}
                </div>
              </Tooltip>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            setAddedImages([]);
          }}
        >
          Add Files
        </Button>
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
  );
}
