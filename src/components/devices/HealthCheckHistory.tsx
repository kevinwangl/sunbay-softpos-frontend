import { Card, Timeline, Tag, Empty, Spin, Modal, Descriptions, Row, Col } from 'antd';
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { HealthCheck } from '@/types';
import { useHealthChecks } from '@/hooks/useHealthCheck';
import { LineChart } from '@/components/charts/LineChart';

interface HealthCheckHistoryProps {
  deviceId: string;
}

const HealthCheckHistory: React.FC<HealthCheckHistoryProps> = ({ deviceId }) => {
  const [selectedCheck, setSelectedCheck] = useState<HealthCheck | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  // 获取最近30天的健康检查记录
  const { data, isLoading } = useHealthChecks(deviceId, {
    limit: 30,
  });

  const handleViewDetail = (check: HealthCheck) => {
    setSelectedCheck(check);
    setDetailModalVisible(true);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'green';
    if (score >= 60) return 'blue';
    if (score >= 40) return 'orange';
    return 'red';
  };

  const getCheckIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircleOutlined style={{ color: '#52c41a' }} />
    ) : (
      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    );
  };

  const getRecommendedActionTag = (action: string) => {
    const actionMap = {
      PROCEED: { text: '允许交易', color: 'green' },
      WARN: { text: '警告', color: 'orange' },
      BLOCK: { text: '阻止交易', color: 'red' },
    };
    const config = actionMap[action as keyof typeof actionMap] || {
      text: action,
      color: 'default',
    };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  // 准备评分趋势图表数据
  const scoreTrendData = data?.healthChecks
    .slice()
    .reverse()
    .map((check) => ({
      date: new Date(check.timestamp).toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
      }),
      score: check.securityScore,
    }));

  if (isLoading) {
    return (
      <Card title="健康检查记录" style={{ marginBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin />
        </div>
      </Card>
    );
  }

  if (!data || data.healthChecks.length === 0) {
    return (
      <Card title="健康检查记录" style={{ marginBottom: 16 }}>
        <Empty description="暂无健康检查记录" />
      </Card>
    );
  }

  return (
    <>
      {/* 评分趋势图 */}
      <Card title="安全评分趋势" style={{ marginBottom: 16 }}>
        <LineChart
          data={scoreTrendData || []}
          xField="date"
          yField="score"
          height={300}
        />
      </Card>

      {/* 健康检查时间线 */}
      <Card title={`健康检查记录（最近${data.healthChecks.length}次）`}>
        <Timeline>
          {data.healthChecks.map((check) => (
            <Timeline.Item
              key={check.id}
              color={getScoreColor(check.securityScore)}
              dot={
                check.securityScore >= 60 ? (
                  <CheckCircleOutlined />
                ) : (
                  <WarningOutlined />
                )
              }
            >
              <div style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontWeight: 500 }}>
                    {new Date(check.timestamp).toLocaleString('zh-CN')}
                  </span>
                  <Tag color={getScoreColor(check.securityScore)}>
                    评分: {check.securityScore}
                  </Tag>
                  {getRecommendedActionTag(check.recommendedAction)}
                </div>

                <div style={{ marginTop: 8, display: 'flex', gap: 16 }}>
                  <span>
                    {getCheckIcon(check.checks.root.passed)} Root检测
                  </span>
                  <span>
                    {getCheckIcon(check.checks.hook.passed)} Hook检测
                  </span>
                  <span>
                    {getCheckIcon(check.checks.debug.passed)} Debug检测
                  </span>
                  <span>
                    {getCheckIcon(check.checks.tee.passed)} TEE检测
                  </span>
                </div>

                {check.threats.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Tag color="red">检测到威胁</Tag>
                    {check.threats.map((threat, index) => (
                      <Tag key={index} color="red">
                        {threat}
                      </Tag>
                    ))}
                  </div>
                )}

                <a
                  onClick={() => handleViewDetail(check)}
                  style={{ marginTop: 8, display: 'inline-block' }}
                >
                  <EyeOutlined /> 查看详情
                </a>
              </div>
            </Timeline.Item>
          ))}
        </Timeline>
      </Card>

      {/* 详情对话框 */}
      <Modal
        title="健康检查详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedCheck && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="检查时间" span={2}>
                {new Date(selectedCheck.timestamp).toLocaleString('zh-CN')}
              </Descriptions.Item>
              <Descriptions.Item label="安全评分">
                <Tag color={getScoreColor(selectedCheck.securityScore)}>
                  {selectedCheck.securityScore}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="推荐操作">
                {getRecommendedActionTag(selectedCheck.recommendedAction)}
              </Descriptions.Item>
            </Descriptions>

            <Card
              title="检测项详情"
              size="small"
              style={{ marginTop: 16 }}
            >
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Card
                    type="inner"
                    title={
                      <span>
                        {getCheckIcon(selectedCheck.checks.root.passed)} Root检测
                      </span>
                    }
                  >
                    <p style={{ margin: 0 }}>
                      {selectedCheck.checks.root.details}
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    type="inner"
                    title={
                      <span>
                        {getCheckIcon(selectedCheck.checks.hook.passed)} Hook检测
                      </span>
                    }
                  >
                    <p style={{ margin: 0 }}>
                      {selectedCheck.checks.hook.details}
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    type="inner"
                    title={
                      <span>
                        {getCheckIcon(selectedCheck.checks.debug.passed)} Debug检测
                      </span>
                    }
                  >
                    <p style={{ margin: 0 }}>
                      {selectedCheck.checks.debug.details}
                    </p>
                  </Card>
                </Col>
                <Col span={12}>
                  <Card
                    type="inner"
                    title={
                      <span>
                        {getCheckIcon(selectedCheck.checks.tee.passed)} TEE检测
                      </span>
                    }
                  >
                    <p style={{ margin: 0 }}>
                      {selectedCheck.checks.tee.details}
                    </p>
                  </Card>
                </Col>
              </Row>
            </Card>

            {selectedCheck.threats.length > 0 && (
              <Card
                title="检测到的威胁"
                size="small"
                style={{ marginTop: 16 }}
              >
                {selectedCheck.threats.map((threat, index) => (
                  <Tag key={index} color="red" style={{ marginBottom: 8 }}>
                    {threat}
                  </Tag>
                ))}
              </Card>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default HealthCheckHistory;
