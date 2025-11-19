import { useState } from 'react';
import { Card, Input, Select, Button, Space, Tag, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/common/DataTable';
import { SecurityScore } from '@/components/common/SecurityScore';
import { useTransactions } from '@/hooks/useTransactions';
import { Transaction, TransactionFilters } from '@/types';
import {
  TRANSACTION_TYPES,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_STATUS_COLORS,
} from '@/utils/constants';
import type { ColumnsType } from 'antd/es/table';

const { RangePicker } = DatePicker;

const Transactions = () => {
  const [filters, setFilters] = useState<TransactionFilters>({
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, refetch } = useTransactions(filters);

  const columns: ColumnsType<Transaction> = [
    {
      title: '交易ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: 150,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      width: 120,
      render: (amount, record) => `¥${(amount / 100).toFixed(2)} ${record.currency}`,
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type) => TRANSACTION_TYPES[type as keyof typeof TRANSACTION_TYPES],
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={TRANSACTION_STATUS_COLORS[status as keyof typeof TRANSACTION_STATUS_COLORS]}>
          {TRANSACTION_STATUS_LABELS[status as keyof typeof TRANSACTION_STATUS_LABELS]}
        </Tag>
      ),
    },
    {
      title: '授权码',
      dataIndex: 'authCode',
      key: 'authCode',
      width: 120,
      render: (code) => code || '-',
    },
    {
      title: '安全评分',
      dataIndex: 'securityScore',
      key: 'securityScore',
      width: 150,
      render: (score) => <SecurityScore score={score} />,
    },
    {
      title: '交易时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '错误信息',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      ellipsis: true,
      render: (msg) => msg || '-',
    },
  ];

  return (
    <div>
      <Card
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索交易ID或设备ID"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, transactionId: e.target.value, page: 1 }))
            }
            allowClear
          />
          <Select
            placeholder="交易状态"
            style={{ width: 150 }}
            onChange={(value) => setFilters((prev) => ({ ...prev, status: value, page: 1 }))}
            allowClear
            options={[
              { label: '成功', value: 'SUCCESS' },
              { label: '失败', value: 'FAILED' },
              { label: '处理中', value: 'PENDING' },
            ]}
          />
          <RangePicker
            style={{ width: 300 }}
            onChange={(dates) => {
              if (dates) {
                setFilters((prev) => ({
                  ...prev,
                  startDate: dates[0]?.toISOString(),
                  endDate: dates[1]?.toISOString(),
                  page: 1,
                }));
              } else {
                setFilters((prev) => ({
                  ...prev,
                  startDate: undefined,
                  endDate: undefined,
                  page: 1,
                }));
              }
            }}
          />
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            刷新
          </Button>
        </Space>

        <DataTable
          columns={columns}
          dataSource={data?.items}
          loading={isLoading}
          rowKey="id"
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: data?.total,
            onChange: (page, pageSize) => setFilters((prev) => ({ ...prev, page, pageSize })),
          }}
        />
      </Card>
    </div>
  );
};

export default Transactions;
