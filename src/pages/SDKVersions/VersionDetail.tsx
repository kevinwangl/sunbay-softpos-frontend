import { Card, Descriptions, Tag, Button, Space, Spin, Row, Col, Statistic } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useSDKVersion, useVersionStatistics } from '@/hooks/useSDKVersions';
import {
  getVersionStatusDisplay,
  getUpdateTypeDisplay,
  formatFileSize,
  getDaysSinceRelease,
} from '@/utils/versionUtils';

const VersionDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: version, isLoading } = useSDKVersion(id!);
  const { data: statistics } = useVersionStatistics(id!);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!version) {
    return <div style={{ padding: 24 }}>版本不存在</div>;
  }

  const statusDisplay = getVersionStatusDisplay(version.status);
  const updateTypeDisplay = getUpdateTypeDisplay(version.updateType);
  const daysSinceRelease = getDaysSinceRelease(version.releasedAt);

  return (
    <div style={{ padding: 24 }}>
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/sdk-versions')}>
                返回
              </Button>
              <span style={{ fontSize: 20, fontWeight: 600 }}>SDK版本详情 - {version.version}</span>
            </Space>
            <Space>
              <Button icon={<EditOutlined />}>编辑</Button>
              <Button danger icon={<DeleteOutlined />}>
                下架
              </Button>
            </Space>
          </div>
        }
      >
        {/* 统计卡片 */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card>
              <Statistic
                title="使用设备数"
                value={version.deviceCount}
                suffix="台"
                valueStyle={{ color: '#3f8600' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="采用率"
                value={version.adoptionRate}
                suffix="%"
                precision={2}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="发布天数"
                value={daysSinceRelease}
                suffix="天"
                valueStyle={{ color: '#666' }}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="文件大小"
                value={formatFileSize(version.fileSize)}
                valueStyle={{ color: '#666' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 基本信息 */}
        <Card title="基本信息" style={{ marginBottom: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="版本号">{version.version}</Descriptions.Item>
            <Descriptions.Item label="更新类型">
              <Tag color={updateTypeDisplay.color}>{updateTypeDisplay.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={statusDisplay.color}>{statusDisplay.text}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="发布人">{version.releasedBy}</Descriptions.Item>
            <Descriptions.Item label="发布时间">
              {new Date(version.releasedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="文件大小">
              {formatFileSize(version.fileSize)}
            </Descriptions.Item>
            <Descriptions.Item label="MD5校验值" span={2}>
              <code style={{ background: '#F5F7FA', padding: '4px 8px', borderRadius: 4 }}>
                {version.md5}
              </code>
            </Descriptions.Item>
            <Descriptions.Item label="下载地址" span={2}>
              <a href={version.downloadUrl} target="_blank" rel="noopener noreferrer">
                {version.downloadUrl}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        {/* API兼容性 */}
        <Card title="API兼容性" style={{ marginBottom: 16 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="最低API版本">{version.minApiVersion}</Descriptions.Item>
            <Descriptions.Item label="最高API版本">{version.maxApiVersion}</Descriptions.Item>
          </Descriptions>
        </Card>

        {/* 发布说明 */}
        <Card title="发布说明">
          <div style={{ whiteSpace: 'pre-wrap' }}>{version.releaseNotes}</div>
        </Card>

        {/* 设备统计 */}
        {statistics && (
          <Card title="设备统计" style={{ marginTop: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold' }}>按状态分布</h4>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {statistics.devicesByStatus.map((item) => (
                    <div 
                      key={item.status} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#FAFBFC',
                        borderRadius: 8,
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <span style={{ color: '#666' }}>{item.status}</span>
                      <span style={{ fontWeight: 'bold', fontSize: 16, color: '#FF6000' }}>
                        {item.count} 台
                      </span>
                    </div>
                  ))}
                </Space>
              </Col>
              <Col span={12}>
                <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 'bold' }}>按商户分布（Top 5）</h4>
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  {statistics.devicesByMerchant.slice(0, 5).map((item) => (
                    <div 
                      key={item.merchantId} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        padding: '12px 16px',
                        background: '#FAFBFC',
                        borderRadius: 8,
                        border: '1px solid #E5E7EB'
                      }}
                    >
                      <span 
                        style={{ 
                          color: '#666',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '200px'
                        }}
                      >
                        {item.merchantName}
                      </span>
                      <span style={{ fontWeight: 'bold', fontSize: 16, color: '#FF6000' }}>
                        {item.count} 台
                      </span>
                    </div>
                  ))}
                </Space>
              </Col>
            </Row>
          </Card>
        )}
      </Card>
    </div>
  );
};

export default VersionDetail;
