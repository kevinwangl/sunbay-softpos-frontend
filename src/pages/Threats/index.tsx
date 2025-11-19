import { useState } from 'react';
import { Card, Select, Button, Space, Tag, Modal, Form, Input } from 'antd';
import { ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/common/DataTable';
import { useThreats, useResolveThreat } from '@/hooks/useThreats';
import { ThreatEvent, ThreatFilters } from '@/types';
import {
  THREAT_TYPES,
  THREAT_SEVERITY_LABELS,
  THREAT_SEVERITY_COLORS,
} from '@/utils/constants';
import type { ColumnsType } from 'antd/es/table';

const Threats = () => {
  const [filters, setFilters] = useState<ThreatFilters>({
    page: 1,
    pageSize: 20,
  });
  const [selectedThreat, setSelectedThreat] = useState<ThreatEvent | null>(null);
  const [resolveModalVisible, setResolveModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useThreats(filters);
  const { mutate: resolveThreat, isPending: isResolving } = useResolveThreat();

  const handleResolve = () => {
    if (!selectedThreat) return;

    form.validateFields().then((values) => {
      resolveThreat(
        { id: selectedThreat.id, data: { notes: values.notes } },
        {
          onSuccess: () => {
            setResolveModalVisible(false);
            setSelectedThreat(null);
            form.resetFields();
          },
        }
      );
    });
  };

  const columns: ColumnsType<ThreatEvent> = [
    {
      title: '事件ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      key: 'deviceId',
      width: 150,
    },
    {
      title: '威胁类型',
      dataIndex: 'type',
      key: 'type',
      width: 120,
      render: (type) => THREAT_TYPES[type as keyof typeof THREAT_TYPES],
    },
    {
      title: '严重级别',
      dataIndex: 'severity',
      key: 'severity',
      width: 100,
      render: (severity) => (
        <Tag
          color={THREAT_SEVERITY_COLORS[severity as keyof typeof THREAT_SEVERITY_COLORS]}
        >
          {THREAT_SEVERITY_LABELS[severity as keyof typeof THREAT_SEVERITY_LABELS]}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status) => (
        <Tag color={status === 'PENDING' ? 'orange' : 'green'}>
          {status === 'PENDING' ? '待处理' : '已处理'}
        </Tag>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '检测时间',
      dataIndex: 'detectedAt',
      key: 'detectedAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) =>
        record.status === 'PENDING' ? (
          <Button
            type="link"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setSelectedThreat(record);
              setResolveModalVisible(true);
            }}
          >
            处理
          </Button>
        ) : (
          <span style={{ color: '#52c41a' }}>已处理</span>
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
          <Select
            placeholder="威胁类型"
            style={{ width: 150 }}
            onChange={(value) => setFilters((prev) => ({ ...prev, type: value, page: 1 }))}
            allowClear
            options={Object.entries(THREAT_TYPES).map(([key, value]) => ({
              label: value,
              value: key,
            }))}
          />
          <Select
            placeholder="严重级别"
            style={{ width: 150 }}
            onChange={(value) => setFilters((prev) => ({ ...prev, severity: value, page: 1 }))}
            allowClear
            options={[
              { label: '高', value: 'HIGH' },
              { label: '中', value: 'MEDIUM' },
              { label: '低', value: 'LOW' },
            ]}
          />
          <Select
            placeholder="处理状态"
            style={{ width: 150 }}
            onChange={(value) => setFilters((prev) => ({ ...prev, status: value, page: 1 }))}
            allowClear
            options={[
              { label: '待处理', value: 'PENDING' },
              { label: '已处理', value: 'RESOLVED' },
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
          rowClassName={(record) => (record.status === 'PENDING' ? 'pending-row' : '')}
          pagination={{
            current: filters.page,
            pageSize: filters.pageSize,
            total: data?.total,
            onChange: (page, pageSize) => setFilters((prev) => ({ ...prev, page, pageSize })),
          }}
        />
      </Card>

      {/* 处理威胁事件对话框 */}
      <Modal
        title="处理威胁事件"
        open={resolveModalVisible}
        onOk={handleResolve}
        onCancel={() => {
          setResolveModalVisible(false);
          setSelectedThreat(null);
          form.resetFields();
        }}
        confirmLoading={isResolving}
      >
        {selectedThreat && (
          <div style={{ marginBottom: 16 }}>
            <p>
              <strong>事件ID：</strong>
              {selectedThreat.id}
            </p>
            <p>
              <strong>设备ID：</strong>
              {selectedThreat.deviceId}
            </p>
            <p>
              <strong>威胁类型：</strong>
              {THREAT_TYPES[selectedThreat.type]}
            </p>
            <p>
              <strong>描述：</strong>
              {selectedThreat.description}
            </p>
          </div>
        )}
        <Form form={form} layout="vertical">
          <Form.Item
            name="notes"
            label="处理备注"
            rules={[
              { required: true, message: '请输入处理备注' },
              { min: 10, message: '备注至少10个字符' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="请输入处理措施和备注" />
          </Form.Item>
        </Form>
      </Modal>

      <style>{`
        .pending-row {
          background-color: #fff7e6;
        }
      `}</style>
    </div>
  );
};

export default Threats;
