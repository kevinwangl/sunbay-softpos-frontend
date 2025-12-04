# 内核管理功能实现文档

## 概述

本文档描述了前端新增的内核管理功能，该功能与后端的kernel API集成，提供完整的WebAssembly内核文件管理能力。

## 功能特性

### 1. 内核列表管理
- 查看所有已上传的内核版本
- 按状态筛选（草稿、稳定版、已弃用）
- 显示内核详细信息（版本号、文件大小、哈希值、创建时间等）

### 2. 内核上传
- 支持拖拽上传 .wasm 文件
- 版本号格式验证（vX.Y.Z）
- 文件大小限制（最大50MB）
- 文件类型验证（仅支持.wasm）

### 3. 内核发布
- 将草稿状态的内核发布为稳定版
- 发布后可供设备下载使用

### 4. 内核下载
- 支持下载任意版本的内核文件
- 自动命名为 `kernel-{version}.wasm`

### 5. 内核删除
- 删除非稳定版的内核
- 稳定版内核不可删除（保护生产环境）

## 技术实现

### 文件结构

```
sunbay-softpos-frontend/src/
├── api/
│   └── kernels.ts                    # Kernel API接口
├── hooks/
│   └── useKernels.ts                 # Kernel管理Hook
├── types/
│   └── kernel.ts                     # Kernel类型定义
├── pages/
│   └── Kernels/
│       ├── index.tsx                 # 页面入口
│       ├── KernelList.tsx            # 内核列表页面
│       └── UploadKernelModal.tsx     # 上传内核模态框
└── components/
    └── layout/
        └── Sidebar.tsx               # 更新菜单（添加内核管理）
```

### API接口

#### 1. 上传内核
```typescript
POST /api/v1/kernels
Content-Type: multipart/form-data

FormData:
  - file: File (WASM文件)
  - version: string (版本号，格式：vX.Y.Z)

Response:
{
  id: string;
  version: string;
  download_url: string;
}
```

#### 2. 获取内核列表
```typescript
GET /api/v1/kernels?status={status}

Response: Kernel[]
```

#### 3. 获取内核详情
```typescript
GET /api/v1/kernels/{version}

Response: Kernel
```

#### 4. 下载内核
```typescript
GET /api/v1/kernels/{version}/download

Response: Blob (application/wasm)
```

#### 5. 发布内核
```typescript
POST /api/v1/kernels/{version}/publish

Response: 200 OK
```

#### 6. 删除内核
```typescript
DELETE /api/v1/kernels/{version}

Response: 204 No Content
```

### 类型定义

```typescript
// Kernel状态
export type KernelStatus = 'draft' | 'stable' | 'deprecated';

// Kernel模型
export interface Kernel {
  id: string;
  version: string;
  file_path: string;
  file_hash: string;
  file_size: number;
  status: KernelStatus;
  created_at: string;
  updated_at: string;
}
```

### Hook使用

```typescript
import { useKernels } from '@/hooks/useKernels';

const MyComponent = () => {
  const {
    kernels,           // 内核列表
    loading,           // 加载状态
    uploading,         // 上传状态
    fetchKernels,      // 获取内核列表
    uploadKernel,      // 上传内核
    publishKernel,     // 发布内核
    deleteKernel,      // 删除内核
    downloadKernel,    // 下载内核
  } = useKernels();

  // 使用示例
  useEffect(() => {
    fetchKernels(); // 获取所有内核
    // 或
    fetchKernels('stable'); // 仅获取稳定版
  }, []);

  return (
    // 组件内容
  );
};
```

## 页面功能

### 内核列表页面 (KernelList)

**路由**: `/kernels`

**功能**:
1. 显示内核列表表格
2. 状态筛选下拉框
3. 上传内核按钮
4. 每行操作按钮：
   - 下载：所有状态可用
   - 发布：仅草稿状态可用
   - 删除：非稳定版可用

**表格列**:
- 版本号
- 状态（带颜色标签）
- 文件大小（格式化显示）
- 文件哈希（截断显示，悬停显示完整）
- 创建时间
- 更新时间
- 操作

### 上传内核模态框 (UploadKernelModal)

**功能**:
1. 版本号输入框（带格式验证）
2. 文件拖拽上传区域
3. 文件类型和大小验证
4. 上传进度显示

**验证规则**:
- 版本号必须符合 `vX.Y.Z` 格式（如：v1.0.0）
- 文件必须是 .wasm 格式
- 文件大小不超过 50MB

## 菜单集成

在侧边栏菜单中添加了"内核管理"菜单项：

```typescript
{
  key: '/kernels',
  icon: <CodeOutlined />,
  label: '内核管理',
}
```

位置：SDK版本管理和威胁事件之间

## 状态管理

使用 React Hooks 进行状态管理：
- `useState`: 管理本地状态（列表、加载状态等）
- `useCallback`: 优化函数性能
- Ant Design Message: 显示操作反馈

## 错误处理

所有API调用都包含错误处理：
1. 捕获异常
2. 显示用户友好的错误消息
3. 记录控制台日志便于调试

## 用户体验优化

1. **加载状态**: 所有异步操作都有loading状态
2. **操作反馈**: 使用Ant Design Message组件显示成功/失败消息
3. **确认对话框**: 删除和发布操作需要用户确认
4. **文件大小格式化**: 自动转换为KB/MB显示
5. **哈希值截断**: 长哈希值截断显示，悬停显示完整值
6. **状态标签**: 不同状态使用不同颜色标签

## 安全考虑

1. **文件类型验证**: 仅允许上传.wasm文件
2. **文件大小限制**: 防止上传过大文件
3. **版本号格式验证**: 确保版本号符合规范
4. **稳定版保护**: 稳定版内核不可删除
5. **JWT认证**: 所有API请求都需要认证

## 测试建议

### 功能测试
1. 上传不同大小的WASM文件
2. 测试版本号格式验证
3. 测试状态筛选功能
4. 测试发布和删除操作
5. 测试下载功能

### 边界测试
1. 上传超大文件（>50MB）
2. 上传非WASM文件
3. 输入无效版本号
4. 尝试删除稳定版内核
5. 重复上传相同版本

### 集成测试
1. 与后端API的完整流程测试
2. 文件上传和下载的完整性验证
3. 多用户并发操作测试

## 后续优化建议

1. **批量操作**: 支持批量删除、批量发布
2. **版本比较**: 显示版本之间的差异
3. **使用统计**: 显示每个内核版本的使用设备数
4. **自动更新**: 支持设备自动更新到最新稳定版
5. **回滚功能**: 支持将设备回滚到旧版本
6. **发布说明**: 为每个版本添加发布说明
7. **审批流程**: 添加内核发布审批流程
8. **版本依赖**: 管理内核版本之间的依赖关系

## 相关文档

- 后端API文档: `sunbay-softpos-backend/API_DOCUMENTATION.md`
- 后端Kernel实现: `sunbay-softpos-backend/src/api/handlers/kernel.rs`
- Kernel Service: `sunbay-softpos-backend/src/services/kernel.rs`
- Kernel Model: `sunbay-softpos-backend/src/models/kernel.rs`

## 更新日志

### 2024-12-04
- ✅ 创建Kernel类型定义
- ✅ 实现Kernel API接口
- ✅ 创建useKernels Hook
- ✅ 实现内核列表页面
- ✅ 实现上传内核模态框
- ✅ 更新路由配置
- ✅ 更新侧边栏菜单
- ✅ 完成代码审查和错误修复
