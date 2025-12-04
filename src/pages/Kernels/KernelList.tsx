/**
 * 内核列表页面
 */
import React, { useEffect, useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  Select,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  DownloadOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  FileOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useKernels } from '@/hooks/useKernels';
import type { Kernel, KernelStatus } from '@/types/kernel';
import UploadKernelModal from './UploadKernelModal';
import dayjs from 'dayjs';

const { Title } = Typography;
const { Option } = Select;

const KernelList: React.FC = () => {
  const {
    kernels,
    loading,
    fetchKernels,
    publishKernel,
    deleteKernel,
    downloadKernel,
  } = useKernels();

  const [uploadModalVisible, setUploadModalVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<KernelStatus | undefined>(undefined);

  useEffect(() => {
    fetchKernels(statusFilter);
  }, [fetchKernels, statusFilter]);

  const handlePublish = async (version: string) => {
    try {
      await publishKernel(version);
    } catch (error) {
      console.error('Failed to publish kernel:', error);
    }
  };

  const handleDelete = async (version: string) => {
    try {
      await deleteKernel(version);
    } catch (error) {
      console.error('Failed to delete kernel:', error);
    }
  };

  const handleDownload = async (kernel: Kernel) => {
    try {
      await downloadKernel(kernel.version, `kernel-${kernel.version}.wasm`);
    } catch (error) {
      console.error('Failed to download kernel:', error);
    }
  };

  const getStatusTag = (status: KernelStatus) => {
    const statusConfig = {
      draft: { color: 'default', text: '草稿' },
      stable: { color: 'success', text: '稳定版' },
      deprecated: { color: 'warning', text: '已弃用' },
    };

    const config = statusConfig[status];
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const columns: ColumnsType<Kernel> = [
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
      render: (version: string) => (
        <Space>
          <FileOutlined />
          <span style={{ fontWeight: 500 }}>{version}</span>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: KernelStatus) => getStatusTag(status),
    },
    {
      title: '文件大小',
      dataIndex: 'file_size',
      key: 'file_size',
      render: (size: number) => formatFileSize(size),
    },
    {
      title: '文件哈希',
      dataIndex: 'file_hash',
      key: 'file_hash',
      render: (hash: string) => (
        <Tooltip title={hash}>
          <code style={{ fontSize: '12px' }}>{hash.substring(0, 16)}...</code>
        </Tooltip>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '更新时间',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="下载">
            <Button
              type="link"
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => handleDownload(record)}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <Popconfirm
              title="确定要发布此内核版本吗？"
              onConfirm={() => handlePublish(record.version)}
              okText="确定"
              cancelText="取消"
            >
              <Tooltip title="发布">
                <Button
                  type="link"
                  size="small"
                  icon={<CheckCircleOutlined />}
                  style={{ color: '#52c41a' }}
                />
              </Tooltip>
            </Popconfirm>
          )}
          {record.status !== 'stable' && (
            <Popconfirm
              title="确定要删除此内核吗？"
              description="删除后将无法恢复"
              onConfirm={() => handleDelete(record.version)}
              okText="确定"
              cancelText="取消"
            >
              <Tooltip title="删除">
                <Button
                  type="link"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>内核管理</Title>
          <Space>
            <Select
              placeholder="筛选状态"
              style={{ width: 150 }}
              allowClear
              value={statusFilter}
              onChange={setStatusFilter}
            >
              <Option value="draft">草稿</Option>
              <Option value="stable">稳定版</Option>
              <Option value="deprecated">已弃用</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setUploadModalVisible(true)}
            >
              上传内核
            </Button>
          </Space>
        </div>

        <Table
          columns={columns}
          dataSource={kernels}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 个内核`,
          }}
        />
      </Card>

      <UploadKernelModal
        visible={uploadModalVisible}
        onCancel={() => setUploadModalVisible(false)}
        onSuccess={() => {
          setUploadModalVisible(false);
          fetchKernels(statusFilter);
        }}
      />
    </div>
  );
};

export default KernelList;
