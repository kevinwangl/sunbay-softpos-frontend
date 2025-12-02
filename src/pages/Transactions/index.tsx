import { useState } from 'react';
import { Card, Input, Select, Button, Space, Tag, DatePicker, Tooltip } from 'antd';
import { SearchOutlined, ReloadOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
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
      render: (id) => (
        <a onClick={() => window.location.href = `/transactions/${id}`}>
          {id}
        </a>
      ),
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
      title: 'IP地址',
      dataIndex: 'clientIp',
      key: 'clientIp',
      width: 140,
      render: (ip) =>
        ip ? (
          <Tooltip 
            title={ip}
            overlayStyle={{
              maxWidth: 400,
            }}
            overlayInnerStyle={{
              backgroundColor: 'rgba(0, 0, 0, 0.85)',
              color: '#fff',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '13px',
            }}
          >
            <Space size={4}>
              <GlobalOutlined style={{ color: '#1890ff', fontSize: 12 }} />
              <span style={{ fontSize: 12 }}>{ip}</span>
            </Space>
          </Tooltip>
        ) : (
          '-'
        ),
    },
    {
      title: '位置',
      dataIndex: 'latitude',
      key: 'location',
      width: 80,
      align: 'center',
      render: (_, record) => {
        if (record.latitude && record.longitude) {
          // 使用 Google Maps 嵌入式地图（无需 API Key）
          const googleMapsEmbedUrl = `https://maps.google.com/maps?q=${record.latitude},${record.longitude}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
          
          return (
            <Tooltip
              title={
                <div>
                  {/* Google Maps 嵌入式地图预览 */}
                  <div
                    style={{
                      width: 300,
                      height: 200,
                      marginBottom: 12,
                      borderRadius: 6,
                      overflow: 'hidden',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <iframe
                      src={googleMapsEmbedUrl}
                      width="300"
                      height="200"
                      style={{ border: 0, display: 'block' }}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="地图位置"
                    />
                  </div>
                  
                  {/* 位置信息 */}
                  <div style={{ fontSize: 13, lineHeight: '1.8' }}>
                    <div>
                      <span style={{ opacity: 0.7 }}>纬度: </span>
                      <span style={{ fontFamily: 'monospace' }}>{record.latitude.toFixed(6)}°</span>
                    </div>
                    <div>
                      <span style={{ opacity: 0.7 }}>经度: </span>
                      <span style={{ fontFamily: 'monospace' }}>{record.longitude.toFixed(6)}°</span>
                    </div>
                    {record.locationAccuracy && (
                      <div>
                        <span style={{ opacity: 0.7 }}>精度: </span>
                        <span>±{record.locationAccuracy.toFixed(1)}米</span>
                      </div>
                    )}
                  </div>
                  
                  {/* 提示信息 */}
                  <div style={{ 
                    textAlign: 'center', 
                    fontSize: 11, 
                    opacity: 0.5,
                    marginTop: 8,
                  }}>
                    点击图标打开完整地图
                  </div>
                </div>
              }
              color="rgba(0, 0, 0, 0.92)"
              overlayClassName="location-tooltip"
            >
              <EnvironmentOutlined
                style={{ color: '#52c41a', fontSize: 16, cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation();
                  // 打开 Google Maps
                  window.open(
                    `https://www.google.com/maps?q=${record.latitude},${record.longitude}`,
                    '_blank'
                  );
                }}
              />
            </Tooltip>
          );
        }
        return '-';
      },
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
              { label: '成功', value: 'APPROVED' },
              { label: '拒绝', value: 'DECLINED' },
              { label: '失败', value: 'FAILED' },
              { label: '处理中', value: 'PENDING' },
              { label: '已撤销', value: 'VOIDED' },
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
