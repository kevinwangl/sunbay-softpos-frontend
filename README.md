# SUNBAY SoftPOS 管理平台

SUNBAY SoftPOS A/M-Backend管理平台前端是一个Web管理界面，为ISO/收单机构和系统管理员提供设备生命周期管理、实时健康监控、威胁检测和交易查询等功能。

## ✨ 核心功能

- 📊 **实时监控仪表板** - 设备状态、安全评分可视化
- 📱 **设备全生命周期管理** - 注册、监控、操作、吊销
- ⚠️ **威胁事件检测** - Root、Hook、Debug检测和处理
- 💳 **交易记录查询** - 完整的交易历史和分析
- 🔐 **安全评分系统** - 实时评分和趋势分析
- 🔑 **密钥管理** - DUKPT密钥状态监控和更新

## 🎨 设计特点

- **Apple风格设计** - 简洁、大气、优雅
- **主题色** - #FF6000（橙色）
- **响应式布局** - 支持桌面、平板、移动端
- **流畅动画** - 自然的交互体验

## 🚨 遇到问题？

- **登录问题**：查看 [LOGIN_DEBUG.md](./LOGIN_DEBUG.md)
- **数据不显示**：查看 [DATA_DEBUG.md](./DATA_DEBUG.md)
- **完整故障排除**：查看 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **快速测试指南**：查看 [QUICK_TEST.md](./QUICK_TEST.md)

## 技术栈

- **React 18** + **TypeScript 5**
- **Vite** - 构建工具
- **Ant Design 5** - UI组件库（主题色：#FF6000）
- **Zustand** - 状态管理
- **React Query** - 服务端状态管理
- **Axios** - HTTP客户端
- **ECharts** - 数据可视化
- **React Router v6** - 路由管理
- **MSW** - Mock数据服务

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

访问 http://localhost:5173

### 登录凭证

- 用户名：`admin`
- 密码：`admin123`

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 项目结构

```
src/
├── api/                    # API接口层
├── components/            # 可复用组件
│   ├── common/           # 通用组件
│   ├── charts/           # 图表组件
│   └── layout/           # 布局组件
├── pages/                # 页面组件
├── hooks/                # 自定义Hooks
├── stores/               # Zustand状态管理
├── types/                # TypeScript类型定义
├── utils/                # 工具函数
├── App.tsx
└── main.tsx
```

## 开发规范

- 组件命名：PascalCase
- 文件命名：kebab-case
- 变量/函数：camelCase
- 常量：UPPER_SNAKE_CASE
- 类型/接口：PascalCase

## 环境变量

开发环境：`.env.development`
生产环境：`.env.production`

```
VITE_API_BASE_URL=API基础URL
VITE_WS_URL=WebSocket URL
VITE_ENV=环境标识
```

## License

Private
