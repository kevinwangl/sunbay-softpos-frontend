import { Card, Button, Descriptions, Tag, Alert, Modal } from 'antd';
import { KeyOutlined, ReloadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useDeviceKeyStatus, useKeyUpdate } from '@/hooks/useKeys';

interface KeyManagementProps {
  deviceId: string;
}

const KeyManagement: React.FC<KeyManagementProps> = ({ deviceId }) => {
  const { data: keyStatus, isLoading, refetch } = useDeviceKeyStatus(deviceId);
  const keyUpdate = useKeyUpdate();

  // 获取状态显示信息
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return { color: 'green', text: '正常' };
      case 'NEAR_EXPIRY':
        return { color: 'orange', text: '即将过期' };
      case 'EXPIRED':
        return { color: 'red', text: '已过期' };
      default:
        return { color: 'default', text: '未知' };
    }
  };

  // 处理密钥更新
  const handleKeyUpdate = () => {
    Modal.confirm({
      title: '确认密钥更新',
      icon: <ExclamationCircleOutlined />,
      content: (
        <div>
          <p>您确定要更新此设备的密钥吗？</p>
          <p>当前KSN: <code>{keyStatus?.currentKSN}</code></p>
          <p>剩余次数: <strong>{keyStatus?.remainingCount}</strong></p>
          <Alert
            message="提示"
            description="密钥更新后，KSN将重置，剩余使用次数将恢复到初始值。"
            type="info"
            showIcon
            style={{ marginTop: 12 }}
          />
        </div>
      ),
      okText: '确认更新',
      cancelText: '取消',
      onOk: () => {
        keyUpdate.mutate({ deviceId });
      },
    });
  };

  if (isLoading) {
    return (
      <Card title="密钥管理" loading>
        <div style={{ height: 200 }} />
      </Card>
    );
  }

  if (!keyStatus) {
    return (
      <Card title="密钥管理">
        <Alert message="无法获取密钥状态" type="error" />
      </Card>
    );
  }

  const statusDisplay = getStatusDisplay(keyStatus.status);
  const isNearExpiry = keyStatus.status === 'NEAR_EXPIRY';
  const isExpired = keyStatus.status === 'EXPIRED';

  return (
    <Card
      title="密钥管理"
      extra={
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
          刷新
        </Button>
      }
    >
      {/* 状态警告 */}
      {isNearExpiry && (
        <Alert
          message="密钥即将过期"
          description={`当前密钥剩余使用次数较少（${keyStatus.remainingCount}次），建议及时更新密钥。`}
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}
      
      {isExpired && (
        <Alert
          message="密钥已过期"
          description="当前密钥已过期，设备无法正常进行交易，请立即更新密钥。"
          type="error"
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      {/* 密钥状态信息 */}
      <Descriptions column={2} bordered>
        <Descriptions.Item label="当前KSN">
          <code>{keyStatus.currentKSN}</code>
        </Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusDisplay.color}>{statusDisplay.text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="剩余使用次数">
          <span className={keyStatus.remainingCount < 100 ? 'text-orange-500 font-semibold' : ''}>
            {keyStatus.remainingCount.toLocaleString()}
          </span>
        </Descriptions.Item>
        <Descriptions.Item label="最后更新时间">
          {new Date(keyStatus.lastUpdated).toLocaleString('zh-CN')}
        </Descriptions.Item>
        {keyStatus.nextUpdateRequired && (
          <Descriptions.Item label="建议更新时间" span={2}>
            {new Date(keyStatus.nextUpdateRequired).toLocaleString('zh-CN')}
          </Descriptions.Item>
        )}
      </Descriptions>

      {/* 操作按钮 */}
      <div className="mt-4">
        <Button
          type="primary"
          icon={<KeyOutlined />}
          onClick={handleKeyUpdate}
          loading={keyUpdate.isPending}
        >
          更新密钥
        </Button>
      </div>
    </Card>
  );
};

export default KeyManagement;
