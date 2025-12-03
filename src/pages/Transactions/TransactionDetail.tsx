import { useParams, useNavigate } from 'react-router-dom';
import { Card, Descriptions, Tag, Button, Spin, Alert, Space, Typography } from 'antd';
import { ArrowLeftOutlined, EnvironmentOutlined, GlobalOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions';
import { TRANSACTION_TYPES, TRANSACTION_STATUS_LABELS, TRANSACTION_STATUS_COLORS } from '@/utils/constants';

const { Text } = Typography;

const TransactionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: transaction, isLoading, error } = useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsApi.getTransactionById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <Alert
        message="加载失败"
        description="无法加载交易详情"
        type="error"
        showIcon
      />
    );
  }

  return (
    <div>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/transactions')}
        style={{ marginBottom: 16 }}
      >
        返回列表
      </Button>

      <Card
        title="交易详情"
        bordered={false}
        style={{
          borderRadius: 12,
          boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
        }}
      >
        <Descriptions column={2} bordered>
          <Descriptions.Item label="交易ID" span={2}>
            {transaction.id}
          </Descriptions.Item>

          <Descriptions.Item label="设备ID">
            <a onClick={() => navigate(`/devices/${transaction.deviceId}`)}>
              {transaction.deviceId}
            </a>
          </Descriptions.Item>

          <Descriptions.Item label="交易类型">
            {TRANSACTION_TYPES[transaction.type as keyof typeof TRANSACTION_TYPES] || transaction.type}
          </Descriptions.Item>

          <Descriptions.Item label="金额">
            ¥{(transaction.amount / 100).toFixed(2)} {transaction.currency}
          </Descriptions.Item>

          <Descriptions.Item label="状态">
            <Tag color={TRANSACTION_STATUS_COLORS[transaction.status as keyof typeof TRANSACTION_STATUS_COLORS]}>
              {TRANSACTION_STATUS_LABELS[transaction.status as keyof typeof TRANSACTION_STATUS_LABELS]}
            </Tag>
          </Descriptions.Item>

          <Descriptions.Item label="安全评分">
            {transaction.securityScore || '-'}
          </Descriptions.Item>

          <Descriptions.Item label="交易时间" span={2}>
            {new Date(transaction.timestamp).toLocaleString('zh-CN')}
          </Descriptions.Item>

          {transaction.clientIp && (
            <Descriptions.Item label="客户端 IP" span={2}>
              <Space>
                <GlobalOutlined style={{ color: '#1890ff' }} />
                <Text copyable>{transaction.clientIp}</Text>
              </Space>
            </Descriptions.Item>
          )}

          {transaction.latitude && transaction.longitude && (
            <Descriptions.Item label="GPS 位置" span={2}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space>
                  <EnvironmentOutlined style={{ color: '#52c41a' }} />
                  <Text>
                    纬度: {transaction.latitude.toFixed(6)}, 经度: {transaction.longitude.toFixed(6)}
                  </Text>
                </Space>
                {transaction.locationAccuracy && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    精度: ±{transaction.locationAccuracy.toFixed(1)}米
                  </Text>
                )}
                {transaction.locationTimestamp && (
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    位置获取时间: {new Date(transaction.locationTimestamp).toLocaleString('zh-CN')}
                  </Text>
                )}
                <Button
                  size="small"
                  type="link"
                  icon={<EnvironmentOutlined />}
                  onClick={() =>
                    window.open(
                      `https://www.google.com/maps?q=${transaction.latitude},${transaction.longitude}`,
                      '_blank'
                    )
                  }
                  style={{ padding: 0 }}
                >
                  在地图上查看
                </Button>
              </Space>
            </Descriptions.Item>
          )}

          {transaction.errorMessage && (
            <Descriptions.Item label="错误信息" span={2}>
              <Alert
                message={transaction.errorMessage}
                type="error"
                showIcon
                style={{ marginTop: 8 }}
              />
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>
    </div>
  );
};

export default TransactionDetail;
