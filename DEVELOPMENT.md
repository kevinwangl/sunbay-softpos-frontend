# 开发文档

## 项目结构

```
src/
├── api/                    # API接口层
│   ├── client.ts          # Axios配置和拦截器
│   ├── auth.ts            # 认证相关API
│   └── ...
├── components/            # 可复用组件
│   ├── common/           # 通用组件
│   │   ├── StatusBadge.tsx
│   │   ├── SecurityScore.tsx
│   │   ├── DataTable.tsx
│   │   └── ProtectedRoute.tsx
│   ├── charts/           # 图表组件
│   └── layout/           # 布局组件
│       ├── AppLayout.tsx
│       ├── Sidebar.tsx
│       └── Header.tsx
├── pages/                # 页面组件
│   ├── Login/
│   ├── Dashboard/
│   └── ...
├── hooks/                # 自定义Hooks
│   ├── useAuth.ts
│   └── ...
├── stores/               # Zustand状态管理
│   └── authStore.ts
├── types/                # TypeScript类型定义
│   ├── device.ts
│   ├── health.ts
│   ├── threat.ts
│   └── ...
├── utils/                # 工具函数
│   ├── constants.ts
│   └── errorHandler.ts
├── mocks/                # Mock数据
│   ├── data.ts
│   ├── handlers.ts
│   └── browser.ts
├── App.tsx
└── main.tsx
```

## 开发规范

### 命名规范

- **组件**：PascalCase（如 `DeviceList.tsx`）
- **文件**：kebab-case（如 `use-devices.ts`）
- **变量/函数**：camelCase（如 `getDevices`）
- **常量**：UPPER_SNAKE_CASE（如 `API_BASE_URL`）
- **类型/接口**：PascalCase（如 `Device`, `ApiResponse`）

### 代码组织

- 每个组件一个文件夹（如需要）
- 相关的hooks放在同一文件夹
- 共享类型放在 `types/` 目录
- 工具函数按功能分类

### Git提交规范

```
feat: 新功能
fix: 修复bug
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具链相关
```

## 开发流程

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 3. 构建生产版本

```bash
npm run build
```

### 4. 预览生产构建

```bash
npm run preview
```

## Mock数据

项目使用MSW (Mock Service Worker)进行API模拟。

### 登录凭证

- 用户名：`admin`
- 密码：`admin123`

### Mock数据位置

- `src/mocks/data.ts` - Mock数据定义
- `src/mocks/handlers.ts` - API处理器
- `src/mocks/browser.ts` - MSW配置

## 状态管理

使用Zustand进行状态管理：

- `authStore` - 认证状态（用户信息、token）
- `notificationStore` - 告警通知状态（待实现）

## API调用

使用React Query进行服务端状态管理：

```typescript
import { useQuery } from '@tanstack/react-query';
import { devicesApi } from '@/api/devices';

const { data, isLoading } = useQuery({
  queryKey: ['devices', filters],
  queryFn: () => devicesApi.getDevices(filters),
});
```

## 环境变量

- `VITE_API_BASE_URL` - API基础URL
- `VITE_WS_URL` - WebSocket URL
- `VITE_ENV` - 环境标识

## 常见问题

### 1. 端口被占用

修改 `vite.config.ts` 中的 `server.port`

### 2. API代理配置

修改 `vite.config.ts` 中的 `server.proxy`

### 3. Mock数据不生效

确保在开发环境下运行，检查浏览器控制台是否有MSW启动日志
