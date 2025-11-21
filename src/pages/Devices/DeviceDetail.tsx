import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Descriptions,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Spin,
} from 'antd';
import {
  ArrowLeftOutlined,
  PauseCircleOutlined,
  PlayCircleOutlined,
  StopOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { StatusBadge } from '@/components/common/StatusBadge';
import KeyManagement from '@/components/devices/KeyManagement';
import SecurityScoreDetail from '@/components/devices/SecurityScoreDetail';
import HealthCheckHistory from '@/components/devices/HealthCheckHistory';
import {
  useDeviceDetail,
  useSuspendDevice,
  useResumeDevice,
  useRevokeDevice,
} from '@/hooks/useDevices';

const DeviceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [revokeModalVisible, setRevokeModalVisible] = useState(false);
  const [suspendModalVisible, setSuspendModalVisible] = useState(false);
  const [form] = Form.useForm();

  const { data, isLoading, refetch } = useDeviceDetail(id!);
  const { mutate: suspendDevice, isPending: isSuspending } = useSuspendDevice();
  const { mutate: resumeDevice, isPending: isResuming } = useResumeDevice();
  const { mutate: revokeDevice, isPending: isRevoking } = useRevokeDevice();

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!data) {
    return <div>设备不存在</div>;
  }

  const { device } = data;

  const handleSuspend = () => {
    form.validateFields().then((values) => {
      suspendDevice(
        { id: device.id, data: { reason: values.reason } },
        {
          onSuccess: () => {
            setSuspendModalVisible(false);
            form.resetFields();
          },
        }
      );
    });
  };

  const handleRevoke = () => {
    form.validateFields().then((values) => {
      revokeDevice(
        { id: device.id, data: { reason: values.reason } },
        {
          onSuccess: () => {
            setRevokeModalVisible(false);
            form.resetFields();
          },
        }
      );
    });
  };

  const handleResume = () => {
    resumeDevice(device.id);
  };

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/devices')}
        >
          返回列表
        </Button>
        <Button
          icon={<ReloadOutlined />}
          onClick={() => refetch()}
        >
          刷新
        </Button>
      </Space>

      {/* 基本信息 */}
      <Card
        title="设备基本信息"
        bordered={false}
        style={{
          marginBottom: 16,
          borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        }}
        extra={
          <Space>
            {device.status === 'ACTIVE' && (
              <>
                <Button
                  icon={<PauseCircleOutlined />}
                  onClick={() => setSuspendModalVisible(true)}
                  loading={isSuspending}
                >
                  暂停设备
                </Button>
                <Button
                  danger
                  icon={<StopOutlined />}
                  onClick={() => setRevokeModalVisible(true)}
                  loading={isRevoking}
                >
                  吊销设备
                </Button>
              </>
            )}
            {device.status === 'SUSPENDED' && (
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleResume}
                loading={isResuming}
              >
                恢复设备
              </Button>
            )}
          </Space>
        }
      >
        <Descriptions column={{ xs: 1, sm: 2, md: 3 }}>
          <Descriptions.Item label="设备ID">{device.id}</Descriptions.Item>
          <Descriptions.Item label="IMEI">{device.imei}</Descriptions.Item>
          <Descriptions.Item label="设备型号">{device.model}</Descriptions.Item>
          <Descriptions.Item label="操作系统">{device.osVersion}</Descriptions.Item>
          <Descriptions.Item label="TEE类型">{device.teeType}</Descriptions.Item>
          <Descriptions.Item label="设备状态">
            <StatusBadge status={device.status} />
          </Descriptions.Item>
          <Descriptions.Item label="商户ID">{device.merchantId}</Descriptions.Item>
          <Descriptions.Item label="商户名称">{device.merchantName}</Descriptions.Item>
          <Descriptions.Item label="注册时间">
            {new Date(device.registeredAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
          <Descriptions.Item label="最后活跃">
            {new Date(device.lastActiveAt).toLocaleString('zh-CN')}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      {/* 安全评分详情 */}
      <SecurityScoreDetail 
        score={device.securityScore} 
        healthCheck={data.recentHealthChecks?.[0]}
      />

      {/* 密钥管理 */}
      <KeyManagement deviceId={device.id} />

      {/* 健康检查记录 */}
      <HealthCheckHistory deviceId={device.id} />

      {/* 暂停设备对话框 */}
      <Modal
        title="暂停设备"
        open={suspendModalVisible}
        onOk={handleSuspend}
        onCancel={() => setSuspendModalVisible(false)}
        confirmLoading={isSuspending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="reason"
            label="暂停原因"
            rules={[
              { required: true, message: '请输入暂停原因' },
              { min: 10, message: '原因至少10个字符' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="请输入暂停原因" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 吊销设备对话框 */}
      <Modal
        title="吊销设备"
        open={revokeModalVisible}
        onOk={handleRevoke}
        onCancel={() => setRevokeModalVisible(false)}
        confirmLoading={isRevoking}
        okButtonProps={{ danger: true }}
      >
        <Form form={form} layout="vertical">
          <p style={{ color: '#ff4d4f', marginBottom: 16 }}>
            警告：吊销设备后将无法恢复，请谨慎操作！
          </p>
          <Form.Item
            name="reason"
            label="吊销原因"
            rules={[
              { required: true, message: '请输入吊销原因' },
              { min: 10, message: '原因至少10个字符' },
            ]}
          >
            <Input.TextArea rows={4} placeholder="请输入吊销原因" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DeviceDetail;
