import { useState } from 'react';
import { Card, Table, Tag, Space, Select, DatePicker, Input, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { AuditLog } from '@/types';

const { RangePicker } = DatePicker;

// Mock数据 - 实际应该从API获取
const mockLogs: AuditLog[] = [
  {
    id: 'log-001',
    userId: '1',
    username: 'admin',
    action: '设备审批',
    resource: 'device',
    resourceId: 'device-003',
    ipAddress: '192.168.1.100',
    timestamp: '2024-11-17T09:00:00Z',
    details: { action: 'approve', deviceId: 'device-003' },
    result: 'SUCCESS',
  },
  {
    id: 'log-002',
    userId: '1',
    username: 'admin',
    action: '设备暂停',
    resource: 'device',
    resourceId: 'device-006',
    ipAddress: '192.168.1.100',
    timestamp: '2024-11-16T14:30:00Z',
    details: { action: 'suspend', reason: '安全评分过低' },
    result: 'SUCCESS',
  },
  {
    id: 'log-003',
    userId: '1',
    username: 'admin',
    action: '威胁处理',
    resource: 'threat',
    resourceId: 'threat-002',
    ipAddress: '192.168.1.100',
    timestamp: '2024-11-16T09:00:00Z',
    details: { action: 'resolve', notes: '已通知商户卸载Xposed框架' },
    result: 'SUCCESS',
  },
  {
    id: 'log-004',
    userId: '1',
    username: 'admin',
    action: '登录',
    resource: 'auth',
    resourceId: '1',
    ipAddress: '192.168.1.100',
    timestamp: '2024-11-17T08:00:00Z',
    details: { method: 'password' },
    result: 'SUCCESS',
  },
  {
    id: 'log-005',
    userId: '2',
    username: 'operator',
    action: '登录失败',
    resource: 'auth',
    resourceId: '2',
    ipAddress: '192.168.1.105',
    timestamp: '2024-11-17T07:45:00Z',
    details: { method: 'password', reason: '密码错误' },
    result: 'FAILED',
  },
];

const Logs = () => {
  const [loading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [actionFilter, setActionFilter] = useState<string | undefined>();
  const [resultFilter, setResultFilter] = useState<string | undefined>();

  const columns: ColumnsType<AuditLog> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (timestamp) => new Date(timestamp).toLocaleString('zh-CN'),
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
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
      title: '详情',
      dataIndex: 'details',
      key: 'details',
      ellipsis: true,
      render: (details) => JSON.stringify(details),
    },
  ];

  // 过滤数据
  const filteredData = mockLogs.filter((log) => {
    if (searchText && !log.username.includes(searchText) && !log.action.includes(searchText)) {
      return false;
    }
    if (actionFilter && log.action !== actionFilter) {
      return false;
    }
    if (resultFilter && log.result !== resultFilter) {
      return false;
    }
    return true;
  });

  const handleExport = () => {
    // 导出功能 - 实际应该调用API
    console.log('导出日志');
  };

  return (
    <div>
      <Card
        title="系统日志"
        extra={
          <Space>
            <Button icon={<ReloadOutlined />}>刷新</Button>
            <Button icon={<DownloadOutlined />} onClick={handleExport}>
              导出
            </Button>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <Space wrap style={{ marginBottom: 16 }}>
          <Input
            placeholder="搜索用户或操作"
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Select
            placeholder="操作类型"
            style={{ width: 150 }}
            value={actionFilter}
            onChange={setActionFilter}
            allowClear
          >
            <Select.Option value="登录">登录</Select.Option>
            <Select.Option value="登录失败">登录失败</Select.Option>
            <Select.Option value="设备审批">设备审批</Select.Option>
            <Select.Option value="设备暂停">设备暂停</Select.Option>
            <Select.Option value="设备恢复">设备恢复</Select.Option>
            <Select.Option value="设备吊销">设备吊销</Select.Option>
            <Select.Option value="威胁处理">威胁处理</Select.Option>
          </Select>
          <Select
            placeholder="结果"
            style={{ width: 120 }}
            value={resultFilter}
            onChange={setResultFilter}
            allowClear
          >
            <Select.Option value="SUCCESS">成功</Select.Option>
            <Select.Option value="FAILED">失败</Select.Option>
          </Select>
          <RangePicker placeholder={['开始时间', '结束时间']} />
        </Space>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredData.length,
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );
};

export default Logs;
