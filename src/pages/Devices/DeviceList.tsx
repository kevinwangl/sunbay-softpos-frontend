import { useState } from 'react';
import { Card, Input, Select, Button, Space, Tag } from 'antd';
import { SearchOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SecurityScore } from '@/components/common/SecurityScore';
import { useDevices } from '@/hooks/useDevices';
import { Device, DeviceFilters } from '@/types';
import { DEVICE_STATUS } from '@/utils/constants';
import type { ColumnsType } from 'antd/es/table';

const DeviceList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<DeviceFilters>({
    page: 1,
    pageSize: 20,
  });

  const { data, isLoading, refetch } = useDevices(filters);

  const columns: ColumnsType<Device> = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
      fixed: 'left',
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
      width: 200,
    },
    {
      title: '设备型号',
      dataIndex: 'model',
      key: 'model',
      width: 180,
    },
    {
      title: 'IMEI',
      dataIndex: 'imei',
      key: 'imei',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => <StatusBadge status={status} />,
    },
    {
      title: '安全评分',
      dataIndex: 'securityScore',
      key: 'securityScore',
      width: 150,
      sorter: true,
      render: (score) => <SecurityScore score={score} />,
    },
    {
      title: '密钥状态',
      key: 'keyStatus',
      width: 120,
      render: (_, record) => {
        const percentage = (record.keyInfo.remainingCount / record.keyInfo.totalCount) * 100;
        if (percentage < 10) {
          return <Tag color="red">密钥预警</Tag>;
        }
        return <Tag color="green">正常</Tag>;
      },
    },
    {
      title: '注册时间',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '最后活跃',
      dataIndex: 'lastActiveAt',
      key: 'lastActiveAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/devices/${record.id}`)}
        >
          查看
        </Button>
      ),
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
            placeholder="搜索设备ID、IMEI或商户"
            prefix={<SearchOutlined />}
            style={{ width: 280 }}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
            }
            allowClear
          />
          <Select
            placeholder="设备状态"
            style={{ width: 150 }}
            onChange={(value) => setFilters((prev) => ({ ...prev, status: value, page: 1 }))}
            allowClear
            options={[
              { label: '待审批', value: DEVICE_STATUS.PENDING },
              { label: '正常', value: DEVICE_STATUS.ACTIVE },
              { label: '已暂停', value: DEVICE_STATUS.SUSPENDED },
              { label: '已吊销', value: DEVICE_STATUS.REVOKED },
            ]}
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

export default DeviceList;
