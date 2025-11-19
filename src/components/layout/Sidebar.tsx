import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  MobileOutlined,
  WarningOutlined,
  TransactionOutlined,
  FileTextOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表板',
    },
    {
      key: '/devices',
      icon: <MobileOutlined />,
      label: '设备管理',
      children: [
        { key: '/devices', label: '设备列表' },
        { key: '/devices/approval', label: '设备审批' },
      ],
    },
    {
      key: '/sdk-versions',
      icon: <AppstoreOutlined />,
      label: 'SDK版本管理',
    },
    {
      key: '/threats',
      icon: <WarningOutlined />,
      label: '威胁事件',
    },
    {
      key: '/transactions',
      icon: <TransactionOutlined />,
      label: '交易记录',
    },
    {
      key: '/logs',
      icon: <FileTextOutlined />,
      label: '系统日志',
    },
  ];

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[location.pathname]}
      items={menuItems}
      onClick={({ key }) => navigate(key)}
      style={{ height: '100%', borderRight: 'none' }}
    />
  );
};

export default Sidebar;
