import { lazy, Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider, theme, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import AppLayout from '@/components/layout/AppLayout';

// 懒加载页面组件
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const DeviceList = lazy(() => import('@/pages/Devices/DeviceList'));
const DeviceDetail = lazy(() => import('@/pages/Devices/DeviceDetail'));
const DeviceApproval = lazy(() => import('@/pages/Devices/DeviceApproval'));
const Threats = lazy(() => import('@/pages/Threats'));
const Transactions = lazy(() => import('@/pages/Transactions'));
const Logs = lazy(() => import('@/pages/Logs/index'));
const VersionList = lazy(() => import('@/pages/SDKVersions/VersionList'));
const VersionDetail = lazy(() => import('@/pages/SDKVersions/VersionDetail'));

// Loading组件
const PageLoading = () => (
  <div style={{ textAlign: 'center', padding: '100px 0' }}>
    <Spin size="large" />
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 20000,
      gcTime: 300000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<PageLoading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Dashboard />
          </Suspense>
        ),
      },
      {
        path: 'devices',
        element: (
          <Suspense fallback={<PageLoading />}>
            <DeviceList />
          </Suspense>
        ),
      },
      {
        path: 'devices/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <DeviceDetail />
          </Suspense>
        ),
      },
      {
        path: 'devices/approval',
        element: (
          <Suspense fallback={<PageLoading />}>
            <DeviceApproval />
          </Suspense>
        ),
      },
      {
        path: 'threats',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Threats />
          </Suspense>
        ),
      },
      {
        path: 'transactions',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Transactions />
          </Suspense>
        ),
      },
      {
        path: 'logs',
        element: (
          <Suspense fallback={<PageLoading />}>
            <Logs />
          </Suspense>
        ),
      },
      {
        path: 'sdk-versions',
        element: (
          <Suspense fallback={<PageLoading />}>
            <VersionList />
          </Suspense>
        ),
      },
      {
        path: 'sdk-versions/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <VersionDetail />
          </Suspense>
        ),
      },
    ],
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        locale={zhCN}
        theme={{
          token: {
            // 主色调 - Copilot橙
            colorPrimary: '#FF6000',
            colorLink: '#FF6000',
            colorLinkHover: '#FF7A33',
            colorLinkActive: '#E65500',
            
            // 成功色 - 安全绿
            colorSuccess: '#52C41A',
            colorSuccessBg: '#F6FFED',
            colorSuccessBorder: '#B7EB8F',
            
            // 警告色 - 警戒黄
            colorWarning: '#FAAD14',
            colorWarningBg: '#FFFBE6',
            colorWarningBorder: '#FFE58F',
            
            // 错误色 - 危险红
            colorError: '#FF4D4F',
            colorErrorBg: '#FFF2F0',
            colorErrorBorder: '#FFCCC7',
            
            // 信息色 - 科技蓝
            colorInfo: '#1890FF',
            colorInfoBg: '#E6F7FF',
            colorInfoBorder: '#91D5FF',
            
            // 背景色 - 参考Copilot风格
            colorBgBase: '#FFFFFF',
            colorBgContainer: '#FFFFFF',
            colorBgElevated: '#FFFFFF',
            colorBgLayout: '#F0F2F5',
            colorBgSpotlight: '#FAFAFA',
            
            // 文字色 - 清晰层次
            colorText: '#262626',
            colorTextSecondary: '#595959',
            colorTextTertiary: '#8C8C8C',
            colorTextQuaternary: '#BFBFBF',
            
            // 边框色 - 柔和边框
            colorBorder: '#D9D9D9',
            colorBorderSecondary: '#F0F0F0',
            
            // 其他
            borderRadius: 4,
            borderRadiusLG: 8,
            borderRadiusSM: 2,
            
            // 字体
            fontFamily:
              "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            fontSize: 14,
            fontSizeHeading1: 38,
            fontSizeHeading2: 30,
            fontSizeHeading3: 24,
            
            // 阴影 - 柔和阴影
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)',
            boxShadowSecondary: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
          },
          algorithm: theme.defaultAlgorithm,
          components: {
            Layout: {
              headerBg: '#FFFFFF',
              siderBg: '#001529',  // 深色侧边栏，参考Copilot
              bodyBg: '#F0F2F5',
              triggerBg: '#002140',
              triggerColor: '#FFFFFF',
            },
            Menu: {
              darkItemBg: '#001529',
              darkSubMenuItemBg: '#000C17',
              darkItemSelectedBg: '#FF6000',
              darkItemHoverBg: 'rgba(255, 96, 0, 0.2)',
              darkItemColor: 'rgba(255, 255, 255, 0.65)',
              darkItemSelectedColor: '#FFFFFF',
              darkItemHoverColor: '#FFFFFF',
            },
            Button: {
              primaryColor: '#FFFFFF',
              primaryShadow: '0 2px 0 rgba(255, 96, 0, 0.1)',
              dangerShadow: '0 2px 0 rgba(255, 77, 79, 0.1)',
              defaultBorderColor: '#D9D9D9',
              defaultColor: '#262626',
            },
            Card: {
              colorBgContainer: '#FFFFFF',
              boxShadowTertiary: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02)',
            },
            Table: {
              headerBg: '#FAFAFA',
              headerColor: '#262626',
              rowHoverBg: '#FFF7E6',
              borderColor: '#F0F0F0',
            },
            Input: {
              activeBorderColor: '#FF6000',
              hoverBorderColor: '#FF7A33',
              activeShadow: '0 0 0 2px rgba(255, 96, 0, 0.1)',
            },
            Select: {
              optionSelectedBg: '#FFF7E6',
              optionActiveBg: '#FFF7E6',
            },
            Tag: {
              defaultBg: '#FAFAFA',
              defaultColor: '#262626',
            },
          },
        }}
      >
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
