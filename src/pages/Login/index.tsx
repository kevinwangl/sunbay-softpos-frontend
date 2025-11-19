import { Form, Input, Button, Typography } from 'antd';
import { MailOutlined, LockOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { useLogin } from '@/hooks/useAuth';
import { LoginRequest } from '@/types';

const { Text, Link } = Typography;

const Login = () => {
  const { mutate: login, isPending } = useLogin();

  const onFinish = (values: LoginRequest) => {
    login(values);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #2d3748 0%, #1a202c 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 金色装饰条 - 60%位置 */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '60%',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(184, 147, 95, 0.2) 0%, rgba(184, 147, 95, 0.05) 100%)',
          clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0% 100%)',
          zIndex: 0,
        }}
      />

      {/* 左侧装饰区域 */}
      <div
        style={{
          flex: '0 0 60%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* 3D场景占位 - 可以后续添加实际的3D插图 */}
        <div
          style={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.9)',
            paddingRight: '10%',
          }}
        >
          <div
            style={{
              fontSize: 72,
              marginBottom: 24,
              filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3))',
            }}
          >
            🔒
          </div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 600,
              color: '#fff',
              marginBottom: 16,
            }}
          >
            安全支付管理平台
          </h2>
          <p
            style={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: 400,
              margin: '0 auto',
            }}
          >
            为您的SoftPOS设备提供全方位的安全管理和监控
          </p>
        </div>
      </div>

      {/* 右侧登录卡片 - 60%位置 */}
      <div
        style={{
          flex: '0 0 40%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 460,
            background: '#fff',
            borderRadius: 16,
            padding: '32px 28px',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                background: '#FF6000',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 10px',
                fontSize: 15,
                fontWeight: 'bold',
                color: '#fff',
                letterSpacing: '1px',
              }}
            >
              SUNBAY
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                color: '#1a202c',
                margin: '0 0 4px 0',
              }}
            >
              Welcome Back!
            </h1>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Please enter log in details below
            </Text>
          </div>

          {/* 登录表单 */}
          <Form
            name="login"
            onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: '请输入用户名或邮箱' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Email"
                size="large"
                style={{
                  borderRadius: 8,
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: '请输入密码' },
                { min: 6, message: '密码至少6个字符' },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
                placeholder="Password"
                size="large"
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
                style={{
                  borderRadius: 8,
                  padding: '12px 16px',
                }}
              />
            </Form.Item>

            <div
              style={{
                textAlign: 'right',
                marginBottom: 16,
              }}
            >
              <Link
                style={{
                  color: '#FF6000',
                  fontSize: 13,
                }}
              >
                Forget Password?
              </Link>
            </div>

            <Form.Item style={{ marginBottom: 10 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={isPending}
                block
                size="large"
                style={{
                  height: 44,
                  borderRadius: 8,
                  fontSize: 15,
                  fontWeight: 600,
                  background: '#FF6000',
                  borderColor: '#FF6000',
                }}
              >
                Sign In
              </Button>
            </Form.Item>
          </Form>

          {/* 演示提示 */}
          <div
            style={{
              marginTop: 16,
              padding: 12,
              background: '#f5f5f5',
              borderRadius: 8,
              textAlign: 'center',
            }}
          >
            <Text type="secondary" style={{ fontSize: 12 }}>
              演示账号：admin@sunbay.com / admin123
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
