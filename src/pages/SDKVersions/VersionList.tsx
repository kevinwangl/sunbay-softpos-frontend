import { useState } from 'react';
import { Card, Button, Table, Tag, Space, Select } from 'antd';
import { PlusOutlined, ReloadOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useSDKVersions } from '@/hooks/useSDKVersions';
import { getVersionStatusDisplay, getUpdateTypeDisplay, formatFileSize } from '@/utils/versionUtils';
import CreateVersionModal from '@/components/versions/CreateVersionModal';
import EditVersionModal from '@/components/versions/EditVersionModal';
import type { VersionFilters } from '@/types/version';
import type { ColumnsType } from 'antd/es/table';
import type { SDKVersion } from '@/types/version';

const { Option } = Select;

const VersionList = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<VersionFilters>({
    page: 1,
    pageSize: 20,
    sortBy: 'releasedAt',
    sortOrder: 'desc',
  });
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVersion, setSelectedVersion] = useState<SDKVersion | null>(null);

  const { data, isLoading, refetch } = useSDKVersions(filters);

  const columns: ColumnsType<SDKVersion> = [
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version',
      width: 120,
      render: (version: string) => <strong>{version}</strong>,
    },
    {
      title: '更新类型',
      dataIndex: 'updateType',
      key: 'updateType',
      width: 120,
      render: (type: 'FORCE' | 'OPTIONAL') => {
        const { text, color } = getUpdateTypeDisplay(type);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: 'ACTIVE' | 'MAINTENANCE' | 'DEPRECATED') => {
        const { text, color } = getVersionStatusDisplay(status);
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '文件大小',
      dataIndex: 'fileSize',
      key: 'fileSize',
      width: 120,
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '设备数量',
      dataIndex: 'deviceCount',
      key: 'deviceCount',
      width: 120,
      sorter: true,
      render: (count: number) => count.toLocaleString(),
    },
    {
      title: '采用率',
      dataIndex: 'adoptionRate',
      key: 'adoptionRate',
      width: 100,
      render: (rate: number) => `${rate}%`,
    },
    {
      title: 'API兼容性',
      key: 'apiCompatibility',
      width: 150,
      render: (_, record) => `${record.minApiVersion} - ${record.maxApiVersion}`,
    },
    {
      title: '发布时间',
      dataIndex: 'releasedAt',
      key: 'releasedAt',
      width: 180,
      sorter: true,
      render: (date: string) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '发布人',
      dataIndex: 'releasedBy',
      key: 'releasedBy',
      width: 120,
    },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 150,
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setSelectedVersion(record);
              setEditModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Button type="link" onClick={() => navigate(`/sdk-versions/${record.id}`)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any, _: any, sorter: any) => {
    setFilters({
      ...filters,
      page: pagination.current,
      pageSize: pagination.pageSize,
      sortBy: sorter.field || 'releasedAt',
      sortOrder: sorter.order === 'ascend' ? 'asc' : 'desc',
    });
  };

  const handleStatusFilter = (status: string) => {
    setFilters({
      ...filters,
      status: status as any,
      page: 1,
    });
  };

  const handleUpdateTypeFilter = (updateType: string) => {
    setFilters({
      ...filters,
      updateType: updateType as any,
      page: 1,
    });
  };

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex justify-between items-center">
            <span className="text-xl font-semibold">SDK版本管理</span>
            <Space>
              <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setCreateModalVisible(true)}
              >
                发布新版本
              </Button>
            </Space>
          </div>
        }
      >
        <div className="mb-4 flex gap-4">
          <Select
            placeholder="筛选状态"
            style={{ width: 150 }}
            allowClear
            onChange={handleStatusFilter}
          >
            <Option value="ACTIVE">活跃</Option>
            <Option value="MAINTENANCE">维护</Option>
            <Option value="DEPRECATED">废弃</Option>
          </Select>

          <Select
            placeholder="筛选更新类型"
            style={{ width: 150 }}
            allowClear
            onChange={handleUpdateTypeFilter}
          >
            <Option value="FORCE">强制更新</Option>
            <Option value="OPTIONAL">可选更新</Option>
          </Select>
        </div>

        <Table
          columns={columns}
          dataSource={data?.versions}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: data?.total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个版本`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1400 }}
        />
      </Card>

      <CreateVersionModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      <EditVersionModal
        visible={editModalVisible}
        version={selectedVersion}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedVersion(null);
        }}
      />
    </div>
  );
};

export default VersionList;
