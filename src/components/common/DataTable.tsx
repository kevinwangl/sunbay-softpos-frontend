import { Table, TableProps } from 'antd';
import { PAGINATION } from '@/utils/constants';

interface DataTableProps<T> extends TableProps<T> {
  // 可以扩展额外的props
}

export function DataTable<T extends object>({ ...props }: DataTableProps<T>) {
  return (
    <Table
      {...props}
      pagination={{
        pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
        showSizeChanger: true,
        pageSizeOptions: PAGINATION.PAGE_SIZE_OPTIONS.map(String),
        showTotal: (total) => `共 ${total} 条`,
        ...props.pagination,
      }}
      scroll={{ x: 'max-content', ...props.scroll }}
    />
  );
}
