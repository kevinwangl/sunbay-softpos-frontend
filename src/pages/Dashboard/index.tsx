import { Row, Col, Card, Statistic, Table, Tag, Spin } from 'antd';
import {
  MobileOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { PieChart } from '@/components/charts/PieChart';
import { BarChart } from '@/components/charts/BarChart';
import { SecurityScore } from '@/components/common/SecurityScore';
import { useHealthOverview } from '@/hooks/useDashboard';
import { DEVICE_STATUS_LABELS } from '@/utils/constants';
import type { ColumnsType } from 'antd/es/table';

interface AbnormalDevice {
  id: string;
  merchantName: string;
  securityScore: number;
  lastCheckAt: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useHealthOverview();

  console.log('Dashboard: isLoading=', isLoading, 'data=', data, 'error=', error);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p style={{ color: 'red' }}>加载失败: {String(error)}</p>
        <p>请打开Console查看详细错误信息</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <p>没有数据</p>
        <p>请打开Console查看调试信息</p>
      </div>
    );
  }

  const columns: ColumnsType<AbnormalDevice> = [
    {
      title: '设备ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
      key: 'merchantName',
    },
    {
      title: '安全评分',
      dataIndex: 'securityScore',
      key: 'securityScore',
      render: (score) => <SecurityScore score={score} />,
    },
    {
      title: '最后检查',
      dataIndex: 'lastCheckAt',
      key: 'lastCheckAt',
      render: (date) => new Date(date).toLocaleString('zh-CN'),
    },
  ];

  const statusChartData =
    data?.statusDistribution.map((item) => ({
      name: DEVICE_STATUS_LABELS[item.status as keyof typeof DEVICE_STATUS_LABELS] || item.status,
      value: item.count,
    })) || [];

  const scoreChartData =
    data?.scoreDistribution.map((item) => ({
      name: item.range,
      value: item.count,
    })) || [];

  return (
    <div>
      {/* 关键指标卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Statistic
              title="总设备数"
              value={data?.totalDevices}
              prefix={<MobileOutlined style={{ color: '#ff6000' }} />}
              valueStyle={{ color: '#1d1d1f', fontSize: 32, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Statistic
              title="在线设备"
              value={data?.onlineDevices}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#1d1d1f', fontSize: 32, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Statistic
              title="异常设备"
              value={data?.abnormalDevices}
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#1d1d1f', fontSize: 32, fontWeight: 600 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <Statistic
              title="平均安全评分"
              value={data?.averageSecurityScore}
              prefix={<SafetyOutlined style={{ color: '#1890ff' }} />}
              valueStyle={{ color: '#1d1d1f', fontSize: 32, fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card
            title="设备状态分布"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <PieChart data={statusChartData} />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card
            title="安全评分分布"
            bordered={false}
            style={{
              borderRadius: 12,
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            }}
          >
            <BarChart data={scoreChartData} />
          </Card>
        </Col>
      </Row>

      {/* 异常设备列表 */}
      {data?.recentAbnormalDevices && data.recentAbnormalDevices.length > 0 && (
        <Card
          title={
            <span>
              <WarningOutlined style={{ color: '#faad14', marginRight: 8 }} />
              异常设备列表（最近24小时）
            </span>
          }
          bordered={false}
          style={{
            borderRadius: 12,
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
          }}
        >
          <Table
            columns={columns}
            dataSource={data.recentAbnormalDevices}
            rowKey="id"
            pagination={false}
            onRow={(record) => ({
              onClick: () => navigate(`/devices/${record.id}`),
              style: { cursor: 'pointer' },
            })}
          />
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
