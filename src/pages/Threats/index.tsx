import { useState } from 'react';
import { Card, Select, Button, Space, Tag, Modal, Form, Input, Descriptions, Spin } from 'antd';
import { ReloadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/common/DataTable';
import { useThreats, useResolveThreat } from '@/hooks/useThreats';
import { useDeviceDetail } from '@/hooks/useDevices';
import { ThreatEvent, ThreatFilters } from '@/types';
import {
  THREAT_TYPES,
  THREAT_SEVERITY_LABELS,
  THREAT_SEVERITY_COLORS,
} from '@/utils/constants';
import type { ColumnsType } from 'antd/es/table';

// Separate component for the modal content to use hooks
const ThreatDetailContent = ({ threat }: { threat: ThreatEvent }) => {
  const { data: deviceData, isLoading: isDeviceLoading } = useDeviceDetail(threat.deviceId);
  const device = deviceData?.device;

  return (
    <div style={{ marginBottom: 24 }}>
      <Descriptions title="事件详情" bordered column={1} size="small">
        <Descriptions.Item label="事件ID">{threat.id}</Descriptions.Item>
        <Descriptions.Item label="威胁类型">
          {THREAT_TYPES[threat.type as keyof typeof THREAT_TYPES] || threat.type}
        </Descriptions.Item>
        <Descriptions.Item label="严重级别">
          <Tag color={THREAT_SEVERITY_COLORS[threat.severity as keyof typeof THREAT_SEVERITY_COLORS]}>
            {THREAT_SEVERITY_LABELS[threat.severity as keyof typeof THREAT_SEVERITY_LABELS]}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="检测时间">
          {new Date(threat.detectedAt).toLocaleString('zh-CN')}
        </Descriptions.Item>
        <Descriptions.Item label="描述">{threat.description}</Descriptions.Item>
      </Descriptions>

      <div style={{ marginTop: 16 }}>
        <Descriptions title="设备信息" bordered column={1} size="small">
          <Descriptions.Item label="设备ID">{threat.deviceId}</Descriptions.Item>
          {isDeviceLoading ? (
            <Descriptions.Item label="加载中"><Spin size="small" /></Descriptions.Item>
          ) : device ? (
            <>
              <Descriptions.Item label="设备型号">{device.model}</Descriptions.Item>
              <Descriptions.Item label="IMEI">{device.imei}</Descriptions.Item>
              <Descriptions.Item label="商户">{device.merchantName}</Descriptions.Item>
            </>
          ) : (
            <Descriptions.Item label="信息">无法获取设备信息</Descriptions.Item>
          )}
        </Descriptions>
      </div>

      {threat.status === 'RESOLVED' && threat.resolution && (
        <div style={{ marginTop: 16 }}>
          <Descriptions title="处理记录" bordered column={1} size="small">
            <Descriptions.Item label="处理人">{threat.resolution.resolvedBy}</Descriptions.Item>
            <Descriptions.Item label="处理时间">
              {new Date(threat.resolution.resolvedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="处理备注">{threat.resolution.notes}</Descriptions.Item>
          </Descriptions>
        </div>
      )}
    </div>
  );
};

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
      render: (type) => THREAT_TYPES[type as keyof typeof THREAT_TYPES] || type,
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
        <Tag color={status === 'ACTIVE' ? 'orange' : 'green'}>
          {status === 'ACTIVE' ? '待处理' : '已处理'}
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
        record.status === 'ACTIVE' ? (
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
          <Space>
            <span style={{ color: '#52c41a' }}>已处理</span>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedThreat(record);
                setResolveModalVisible(true);
              }}
            >
              查看
            </Button>
          </Space>
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
              { label: '严重', value: 'CRITICAL' },
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
              { label: '待处理', value: 'ACTIVE' },
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
          rowClassName={(record) => (record.status === 'ACTIVE' ? 'pending-row' : '')}
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
        title={selectedThreat?.status === 'ACTIVE' ? '处理威胁事件' : '威胁事件详情'}
        open={resolveModalVisible}
        onOk={selectedThreat?.status === 'ACTIVE' ? handleResolve : () => setResolveModalVisible(false)}
        onCancel={() => {
          setResolveModalVisible(false);
          setSelectedThreat(null);
          form.resetFields();
        }}
        confirmLoading={isResolving}
        width={600}
        footer={selectedThreat?.status === 'ACTIVE' ? undefined : [
          <Button key="close" onClick={() => setResolveModalVisible(false)}>
            关闭
          </Button>
        ]}
      >
        {selectedThreat && <ThreatDetailContent threat={selectedThreat} />}

        {selectedThreat?.status === 'ACTIVE' && (
          <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
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
        )}
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
