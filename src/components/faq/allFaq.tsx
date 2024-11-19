/* eslint-disable prettier/prettier */
'use client';

import LoadingSkeleton from '@/components/ui/Loading/LoadingSkeleton';
import { useGetAllFaqQuery } from '@/redux/api/faqApi';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Input, Pagination } from 'antd';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { UMCollapseHtml } from '../ui/UMCollapse';
export default function FaqCom() {
  const router = useRouter();
  const pathname = usePathname(); // only path example /home --> not /home?page=12
  const urlQuery = useSearchParams();
  const getCurrentPage = urlQuery.get('page'); //get current page query
  const getLimit = urlQuery.get('limit');
  const query: any = {};
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [page, setPage] = useState(getCurrentPage ? Number(getCurrentPage) : 1);
  const [limit, setLimit] = useState(getLimit ? Number(getLimit) : 10);
  query['limit'] = limit;
  query['page'] = page;
  query['searchTerm'] = searchTerm;
  const { data, isLoading } = useGetAllFaqQuery(query);
  useEffect(() => {
    //first time user got this page then auto set the limit and page size in url -->when user enter full url but pathname is not included query
    router.push(pathname + `?page=${page}&limit=${Number(limit) > 100 ? 100 : limit}`);
  }, [page, limit]);
  const onShowSizeChange = (current: number, pageSize: number) => {
    setPage(current);
    setLimit(pageSize);
  };
  const onChange = (page: number) => {
    setPage(page);
  };
  if (isLoading) {
    return <LoadingSkeleton />;
  }
  const getData = data?.data;
  const meta = data?.meta;
  const resetFilters = () => {
    setSearchTerm('');
  };
  return (
    <div
      className="my-9"
      style={{
        backgroundImage:
          'url(https://img.freepik.com/free-vector/white-question-mark-background-minimal-style_1017-25235.jpg)',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        padding: '20px',
        borderRadius: '8px',
      }}
    >
      <div className="flex flex-col justify-center items-center space-y-3 mb-2">
        <div className="flex justify-between items-center">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              margin: '20px 0',
            }}
          >
            <h1 style={{ fontWeight: 600, color: '#333' }}>How can we help you?</h1>
            <Input
              size="large"
              placeholder="Search help articles..."
              prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
              style={{
                width: '60vw',
                maxWidth: '800px',
                backgroundColor: '#f5f7fa',
                border: 'none',
                borderRadius: '8px',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
              }}
            />
          </div>
          <div>
            {!!searchTerm && (
              <Button style={{ margin: '0px 5px' }} type="default" onClick={resetFilters}>
                <ReloadOutlined />
              </Button>
            )}
          </div>
        </div>
      </div>

      <UMCollapseHtml items={getData!} />
      <div className="flex items-end justify-end mt-5 text-2xl">
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
