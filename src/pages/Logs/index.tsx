import { useState } from 'react';
import { Card, Table, Tag, Space, Select, DatePicker, Input, Button, Modal, Descriptions } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AuditLog, AuditLogFilters } from '@/types';
import { useAuditLogs, useExportLogs } from '@/hooks/useLogs';
import { PAGINATION } from '@/utils/constants';
import type { Dayjs } from 'dayjs';

const { RangePicker } = DatePicker;

const Logs = () => {
  const [filters, setFilters] = useState<AuditLogFilters>({
    page: 1,
    pageSize: PAGINATION.DEFAULT_PAGE_SIZE,
  });
  const [searchText, setSearchText] = useState('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>([null, null]);
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const { data, isLoading, refetch } = useAuditLogs(filters);
  const { mutate: exportLogs, isPending: isExporting } = useExportLogs();

  const handleSearch = () => {
    setFilters({
      ...filters,
      userId: searchText || undefined,
      startDate: dateRange[0]?.toISOString(),
      endDate: dateRange[1]?.toISOString(),
      page: 1,
    });
  };

  const handleViewDetail = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailModalVisible(true);
  };

  const handleExport = () => {
    exportLogs(filters);
  };

  const columns: ColumnsType<AuditLog> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => new Date(timestamp).toLocaleString('zh-CN'),
    },
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 150,
    },
    {
      title: '资源类型',
      dataIndex: 'resource',
      key: 'resource',
      width: 120,
      render: (resource) => {
        const resourceMap: Record<string, { text: string; color: string }> = {
          device: { text: '设备', color: 'blue' },
          threat: { text: '威胁', color: 'orange' },
          transaction: { text: '交易', color: 'green' },
          auth: { text: '认证', color: 'purple' },
          version: { text: 'SDK版本', color: 'cyan' },
        };
        const info = resourceMap[resource] || { text: resource, color: 'default' };
        return <Tag color={info.color}>{info.text}</Tag>;
      },
    },
    {
      title: '资源ID',
      dataIndex: 'resourceId',
      key: 'resourceId',
      width: 150,
      ellipsis: true,
    },
    {
      title: 'IP地址',
      dataIndex: 'ipAddress',
      key: 'ipAddress',
      width: 150,
    },
    {
      title: '结果',
      dataIndex: 'result',
      key: 'result',
      width: 100,
      render: (result) => (
        <Tag color={result === 'SUCCESS' ? 'success' : 'error'}>
          {result === 'SUCCESS' ? '成功' : '失败'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button
          type="link"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          详情
        </Button>
      ),
    },
  ];



  return (
    <div>
      <Card
        title="系统日志"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
              刷新
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={handleExport}
              loading={isExporting}
            >
              导出
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索用户ID或用户名"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="操作类型"
            style={{ width: 150 }}
            value={filters.action}
            onChange={(value) => setFilters({ ...filters, action: value, page: 1 })}
            allowClear
          >
            <Select.Option value="login">登录</Select.Option>
            <Select.Option value="logout">登出</Select.Option>
            <Select.Option value="device_approve">设备审批</Select.Option>
            <Select.Option value="device_suspend">设备暂停</Select.Option>
            <Select.Option value="device_resume">设备恢复</Select.Option>
            <Select.Option value="device_revoke">设备吊销</Select.Option>
            <Select.Option value="threat_resolve">威胁处理</Select.Option>
            <Select.Option value="version_create">版本创建</Select.Option>
            <Select.Option value="version_update">版本更新</Select.Option>
          </Select>
          <RangePicker
            placeholder={['开始时间', '结束时间']}
            value={dateRange}
            onChange={(dates) => setDateRange(dates as [Dayjs | null, Dayjs | null])}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={data?.items || []}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: data?.total || 0,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, pageSize) => {
              setFilters({ ...filters, page, pageSize });
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 详情对话框 */}
      <Modal
        title="日志详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedLog && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="日志ID" span={2}>
                {selectedLog.id}
              </Descriptions.Item>
              <Descriptions.Item label="用户ID">
                {selectedLog.userId}
              </Descriptions.Item>
              <Descriptions.Item label="用户名">
                {selectedLog.username}
              </Descriptions.Item>
              <Descriptions.Item label="操作">
                {selectedLog.action}
              </Descriptions.Item>
              <Descriptions.Item label="资源类型">
                {selectedLog.resource}
              </Descriptions.Item>
              <Descriptions.Item label="资源ID" span={2}>
                {selectedLog.resourceId}
              </Descriptions.Item>
              <Descriptions.Item label="IP地址">
                {selectedLog.ipAddress}
              </Descriptions.Item>
              <Descriptions.Item label="时间">
                {new Date(selectedLog.timestamp).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="结果" span={2}>
                <Tag color={selectedLog.result === 'SUCCESS' ? 'success' : 'error'}>
                  {selectedLog.result === 'SUCCESS' ? '成功' : '失败'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="详细信息" span={2}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(selectedLog.details, null, 2)}
                </pre>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Logs;
