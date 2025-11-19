import { Layout, Avatar, Dropdown, Badge, Empty, Button } from 'antd';
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
  WarningOutlined,
  SafetyOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useNavigate } from 'react-router-dom';

const { Header: AntHeader } = Layout;

const Header = () => {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotificationStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    // 根据通知类型跳转到对应页面
    if (notification.type === 'security_score') {
      navigate(`/devices/${notification.deviceId}`);
    } else if (notification.type === 'threat') {
      navigate('/threats');
    } else if (notification.type === 'key_warning') {
      navigate(`/devices/${notification.deviceId}`);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'security_score':
        return <WarningOutlined style={{ color: '#faad14' }} />;
      case 'threat':
        return <SafetyOutlined style={{ color: '#ff4d4f' }} />;
      case 'key_warning':
        return <KeyOutlined style={{ color: '#ff6000' }} />;
      default:
        return <BellOutlined />;
    }
  };

  const notificationMenuItems = notifications.length
    ? [
        ...notifications.slice(0, 5).map((notification) => ({
          key: notification.id,
          label: (
            <div
              style={{
                padding: '8px 0',
                borderBottom: '1px solid #f0f0f0',
                background: notification.read ? 'transparent' : '#fff7e6',
              }}
              onClick={() => handleNotificationClick(notification)}
            >
              <div style={{ display: 'flex', alignItems: 'start', gap: '8px' }}>
                {getNotificationIcon(notification.type)}
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(notification.timestamp).toLocaleString('zh-CN')}
                  </div>
                </div>
              </div>
            </div>
          ),
        })),
        {
          key: 'actions',
          label: (
            <div style={{ textAlign: 'center', padding: '8px 0' }}>
              <Button type="link" size="small" onClick={markAllAsRead}>
                全部标记为已读
              </Button>
            </div>
          ),
        },
      ]
    : [
        {
          key: 'empty',
          label: (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="暂无通知"
              style={{ padding: '20px 0' }}
            />
          ),
        },
      ];

  const userMenuItems = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid #f0f0f0',
      }}
    >
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>SUNBAY SoftPOS 管理平台</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Dropdown
          menu={{ items: notificationMenuItems }}
          placement="bottomRight"
          trigger={['click']}
        >
          <Badge count={unreadCount} offset={[-5, 5]}>
            <BellOutlined style={{ fontSize: '18px', cursor: 'pointer' }} />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
            <Avatar icon={<UserOutlined />} />
            <span style={{ marginLeft: '8px' }}>{user?.username || '管理员'}</span>
          </div>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Header;
