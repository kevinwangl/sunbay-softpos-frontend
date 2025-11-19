import { useState } from 'react';
import { Card, Button, Modal, Form, Input, Tag, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { DataTable } from '@/components/common/DataTable';
import { StatusBadge } from '@/components/common/StatusBadge';
import { SecurityScore } from '@/components/common/SecurityScore';
import { useDevices, useApproveDevice } from '@/hooks/useDevices';
import { Device } from '@/types';
import type { ColumnsType } from 'antd/es/table';

const DeviceApproval = () => {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useDevices({ status: 'PENDING', page: 1, pageSize: 20 });
  const { mutate: approveDevice, isPending } = useApproveDevice();

  const handleApprove = () => {
    if (!selectedDevice) return;

    approveDevice(
      { id: selectedDevice.id, data: { approved: true } },
      {
        onSuccess: () => {
          setApproveModalVisible(false);
          setSelectedDevice(null);
          refetch();
        },
      }
    );
  };

  const handleReject = () => {
    if (!selectedDevice) return;

    form.validateFields().then((values) => {
      approveDevice(
        { id: selectedDevice.id, data: { approved: false, reason: values.reason } },
        {
          onSuccess: () => {
            setRejectModalVisible(false);
            setSelectedDevice(null);
            form.resetFields();
            refetch();
          },
        }
      );
    });
  };

  const columns: ColumnsType<Device> = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
      width: 150,
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
      title: '安全评分',
      dataIndex: 'securityScore',
      key: 'securityScore',
      width: 150,
      render: (score) => <SecurityScore score={score} />,
    },
    {
      title: '注册时间',
      dataIndex: 'registeredAt',
      key: 'registeredAt',
      width: 180,
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 250,
      fixed: 'right',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedDevice(record);
              setDetailModalVisible(true);
            }}
          >
            查看
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => {
              setSelectedDevice(record);
              setApproveModalVisible(true);
            }}
          >
            批准
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => {
              setSelectedDevice(record);
              setRejectModalVisible(true);
            }}
          >
            拒绝
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Card
        title={
          <span>
            <Tag color="orange" style={{ marginRight: 8 }}>
              待审批
            </Tag>
            设备注册审批
          </span>
        }
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <DataTable
          columns={columns}
          dataSource={data?.items}
          loading={isLoading}
          rowKey="id"
          pagination={{
            total: data?.total,
            pageSize: 20,
          }}
        />
      </Card>

      {/* 设备详情对话框 */}
      <Modal
        title="设备详情"
        open={detailModalVisible}
        onCancel={() => {
          setDetailModalVisible(false);
          setSelectedDevice(null);
        }}
        footer={null}
        width={800}
      >
        {selectedDevice && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="设备ID">{selectedDevice.id}</Descriptions.Item>
              <Descriptions.Item label="IMEI">{selectedDevice.imei}</Descriptions.Item>
              <Descriptions.Item label="设备型号">{selectedDevice.model}</Descriptions.Item>
              <Descriptions.Item label="操作系统">{selectedDevice.osVersion}</Descriptions.Item>
              <Descriptions.Item label="TEE类型">{selectedDevice.teeType}</Descriptions.Item>
              <Descriptions.Item label="商户ID">{selectedDevice.merchantId}</Descriptions.Item>
              <Descriptions.Item label="商户名称" span={2}>
                {selectedDevice.merchantName}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间" span={2}>
                {new Date(selectedDevice.registeredAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 24 }}>
              <h4>初始健康检查</h4>
              <div style={{ marginTop: 16 }}>
                <p>
                  <strong>安全评分：</strong>
                  <SecurityScore score={selectedDevice.securityScore} />
                </p>
                <p>
                  <strong>风险评估：</strong>
                  {selectedDevice.securityScore >= 60 ? (
                    <Tag color="green">低风险</Tag>
                  ) : (
                    <Tag color="red">高风险</Tag>
                  )}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* 批准对话框 */}
      <Modal
        title="批准设备注册"
        open={approveModalVisible}
        onOk={handleApprove}
        onCancel={() => {
          setApproveModalVisible(false);
          setSelectedDevice(null);
        }}
        confirmLoading={isPending}
      >
        {selectedDevice && (
          <div>
            <p>确认批准以下设备的注册申请？</p>
            <div style={{ marginTop: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <p>
                <strong>设备ID：</strong>
                {selectedDevice.id}
              </p>
              <p>
                <strong>商户：</strong>
                {selectedDevice.merchantName}
              </p>
              <p>
                <strong>安全评分：</strong>
                <SecurityScore score={selectedDevice.securityScore} />
              </p>
            </div>
          </div>
        )}
      </Modal>

      {/* 拒绝对话框 */}
      <Modal
        title="拒绝设备注册"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setSelectedDevice(null);
          form.resetFields();
        }}
        confirmLoading={isPending}
        okButtonProps={{ danger: true }}
      >
        {selectedDevice && (
          <div>
            <p style={{ color: '#ff4d4f', marginBottom: 16 }}>
              确认拒绝以下设备的注册申请？
            </p>
            <div style={{ marginBottom: 16, padding: 16, background: '#f5f5f5', borderRadius: 8 }}>
              <p>
                <strong>设备ID：</strong>
                {selectedDevice.id}
              </p>
              <p>
                <strong>商户：</strong>
                {selectedDevice.merchantName}
              </p>
            </div>
            <Form form={form} layout="vertical">
              <Form.Item
                name="reason"
                label="拒绝原因"
                rules={[
                  { required: true, message: '请输入拒绝原因' },
                  { min: 10, message: '原因至少10个字符' },
                  { max: 200, message: '原因不超过200个字符' },
                ]}
              >
                <Input.TextArea rows={4} placeholder="请详细说明拒绝原因" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DeviceApproval;
