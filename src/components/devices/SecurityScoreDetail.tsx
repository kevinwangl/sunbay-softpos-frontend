import { Card, Progress, Tooltip, Descriptions, Tag, Space, Divider } from 'antd';
import { InfoCircleOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import type { HealthCheck } from '@/types';

interface SecurityScoreDetailProps {
  score: number;
  healthCheck?: HealthCheck;
}

// 安全评分计算模型
interface ScoreWeights {
  root: number;      // Root检测权重
  hook: number;      // Hook检测权重
  debug: number;     // 调试模式权重
  tee: number;       // TEE完整性权重
}

const SCORE_WEIGHTS: ScoreWeights = {
  root: 30,   // 30分
  hook: 25,   // 25分
  debug: 20,  // 20分
  tee: 25,    // 25分
};

const SecurityScoreDetail: React.FC<SecurityScoreDetailProps> = ({ score, healthCheck }) => {
  // 计算各项得分
  const calculateItemScore = (passed: boolean, weight: number): number => {
    return passed ? weight : 0;
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return '#00C853';
    if (score >= 60) return '#00B0FF';
    if (score >= 40) return '#FFB300';
    return '#FF3D00';
  };

  const getScoreLevel = (score: number): { text: string; color: string } => {
    if (score >= 80) return { text: '优秀', color: 'success' };
    if (score >= 60) return { text: '良好', color: 'processing' };
    if (score >= 40) return { text: '警告', color: 'warning' };
    return { text: '危险', color: 'error' };
  };

  const level = getScoreLevel(score);

  // 如果有健康检查数据，计算详细得分
  const detailScores = healthCheck ? {
    root: calculateItemScore(healthCheck.checks.root.passed, SCORE_WEIGHTS.root),
    hook: calculateItemScore(healthCheck.checks.hook.passed, SCORE_WEIGHTS.hook),
    debug: calculateItemScore(healthCheck.checks.debug.passed, SCORE_WEIGHTS.debug),
    tee: calculateItemScore(healthCheck.checks.tee.passed, SCORE_WEIGHTS.tee),
  } : null;

  return (
    <Card
      title={
        <Space>
          <span>安全评分详情</span>
          <Tooltip title="安全评分基于多维度检测结果，采用加权计算模型">
            <InfoCircleOutlined style={{ color: '#999' }} />
          </Tooltip>
        </Space>
      }
      bordered={false}
    >
      {/* 总分展示 */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 48, fontWeight: 'bold', color: getScoreColor(score) }}>
          {score}
        </div>
        <div style={{ marginTop: 8 }}>
          <Tag color={level.color} style={{ fontSize: 14 }}>
            {level.text}
          </Tag>
        </div>
        <Progress
          percent={score}
          strokeColor={getScoreColor(score)}
          showInfo={false}
          style={{ marginTop: 16 }}
        />
      </div>

      <Divider>评分模型</Divider>

      {/* 计算公式说明 */}
      <div style={{ 
        background: '#F5F7FA', 
        padding: 16, 
        borderRadius: 8,
        marginBottom: 16,
        fontFamily: 'monospace'
      }}>
        <div style={{ marginBottom: 8, fontWeight: 'bold', color: '#1A1A1A' }}>
          计算公式：
        </div>
        <div style={{ color: '#666' }}>
          安全评分 = Root检测(30%) + Hook检测(25%) + 调试模式(20%) + TEE完整性(25%)
        </div>
      </div>

      {/* 各项指标详情 */}
      {healthCheck && detailScores ? (
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          {/* Root检测 */}
          <Card size="small" style={{ background: '#FAFBFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                {healthCheck.checks.root.passed ? (
                  <CheckCircleOutlined style={{ color: '#00C853', fontSize: 18 }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#FF3D00', fontSize: 18 }} />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>Root检测</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {healthCheck.checks.root.details}
                  </div>
                </div>
              </Space>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: getScoreColor(detailScores.root) }}>
                  {detailScores.root}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  / {SCORE_WEIGHTS.root}分
                </div>
              </div>
            </div>
            <Progress
              percent={(detailScores.root / SCORE_WEIGHTS.root) * 100}
              strokeColor={getScoreColor(detailScores.root)}
              showInfo={false}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>

          {/* Hook检测 */}
          <Card size="small" style={{ background: '#FAFBFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                {healthCheck.checks.hook.passed ? (
                  <CheckCircleOutlined style={{ color: '#00C853', fontSize: 18 }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#FF3D00', fontSize: 18 }} />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>Hook检测</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {healthCheck.checks.hook.details}
                  </div>
                </div>
              </Space>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: getScoreColor(detailScores.hook) }}>
                  {detailScores.hook}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  / {SCORE_WEIGHTS.hook}分
                </div>
              </div>
            </div>
            <Progress
              percent={(detailScores.hook / SCORE_WEIGHTS.hook) * 100}
              strokeColor={getScoreColor(detailScores.hook)}
              showInfo={false}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>

          {/* 调试模式检测 */}
          <Card size="small" style={{ background: '#FAFBFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                {healthCheck.checks.debug.passed ? (
                  <CheckCircleOutlined style={{ color: '#00C853', fontSize: 18 }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#FF3D00', fontSize: 18 }} />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>调试模式检测</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {healthCheck.checks.debug.details}
                  </div>
                </div>
              </Space>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: getScoreColor(detailScores.debug) }}>
                  {detailScores.debug}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  / {SCORE_WEIGHTS.debug}分
                </div>
              </div>
            </div>
            <Progress
              percent={(detailScores.debug / SCORE_WEIGHTS.debug) * 100}
              strokeColor={getScoreColor(detailScores.debug)}
              showInfo={false}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>

          {/* TEE完整性检测 */}
          <Card size="small" style={{ background: '#FAFBFC' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Space>
                {healthCheck.checks.tee.passed ? (
                  <CheckCircleOutlined style={{ color: '#00C853', fontSize: 18 }} />
                ) : (
                  <CloseCircleOutlined style={{ color: '#FF3D00', fontSize: 18 }} />
                )}
                <div>
                  <div style={{ fontWeight: 'bold' }}>TEE完整性检测</div>
                  <div style={{ fontSize: 12, color: '#666' }}>
                    {healthCheck.checks.tee.details}
                  </div>
                </div>
              </Space>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 20, fontWeight: 'bold', color: getScoreColor(detailScores.tee) }}>
                  {detailScores.tee}
                </div>
                <div style={{ fontSize: 12, color: '#999' }}>
                  / {SCORE_WEIGHTS.tee}分
                </div>
              </div>
            </div>
            <Progress
              percent={(detailScores.tee / SCORE_WEIGHTS.tee) * 100}
              strokeColor={getScoreColor(detailScores.tee)}
              showInfo={false}
              size="small"
              style={{ marginTop: 8 }}
            />
          </Card>
        </Space>
      ) : (
        <Descriptions column={1} bordered size="small">
          <Descriptions.Item label="Root检测权重">30%</Descriptions.Item>
          <Descriptions.Item label="Hook检测权重">25%</Descriptions.Item>
          <Descriptions.Item label="调试模式检测权重">20%</Descriptions.Item>
          <Descriptions.Item label="TEE完整性检测权重">25%</Descriptions.Item>
        </Descriptions>
      )}

      <Divider>评分标准</Divider>

      {/* 评分标准说明 */}
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Tag color="success">优秀</Tag>
            <span style={{ color: '#666' }}>设备安全状态良好，可正常使用</span>
          </Space>
          <span style={{ color: '#00C853', fontWeight: 'bold' }}>80-100分</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Tag color="processing">良好</Tag>
            <span style={{ color: '#666' }}>设备基本安全，建议关注</span>
          </Space>
          <span style={{ color: '#00B0FF', fontWeight: 'bold' }}>60-79分</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Tag color="warning">警告</Tag>
            <span style={{ color: '#666' }}>存在安全风险，需要处理</span>
          </Space>
          <span style={{ color: '#FFB300', fontWeight: 'bold' }}>40-59分</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Tag color="error">危险</Tag>
            <span style={{ color: '#666' }}>严重安全问题，禁止交易</span>
          </Space>
          <span style={{ color: '#FF3D00', fontWeight: 'bold' }}>0-39分</span>
        </div>
      </Space>
    </Card>
  );
};

export default SecurityScoreDetail;
