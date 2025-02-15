'use client';

import { Table } from 'antd';

type UMTableProps = {
  loading?: boolean;
  columns: any;
  dataSource: any;
  pageSize?: number;
  totalPages?: number;
  showSizeChanger?: boolean;
  onPaginationChange?: (page: number, pageSize: number) => void;
  onTableChange?: (pagination: any, filter: any, sorter: any) => void;
  showPagination?: boolean;
  showQuickJumper?: boolean;
};

const UMTable = ({
  loading = false,
  columns,
  dataSource,
  pageSize,
  totalPages,
  showSizeChanger = true,
  onPaginationChange,
  onTableChange,
  showPagination = true,
  showQuickJumper = true,
}: UMTableProps) => {
  const paginationConfig = showPagination
    ? {
        pageSize: pageSize,
        total: totalPages,
        pageSizeOptions: [5, 10, 20, 40],
        showSizeChanger: showSizeChanger,
        onChange: onPaginationChange,
        showQuickJumper,
      }
    : false;

  return (
    <Table
      style={
        {
          // overflowX: "auto",
        }
      }
      loading={loading}
      scroll={{ x: 1000 }}
      columns={columns}
      bordered
      dataSource={dataSource}
      pagination={paginationConfig}
      onChange={onTableChange}
    />
  );
};

export default UMTable;
