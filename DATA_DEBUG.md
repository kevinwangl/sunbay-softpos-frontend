# 数据显示问题调试指南

## 🔍 问题诊断步骤

### 1. 打开浏览器开发者工具（F12）

### 2. 检查Console输出

登录成功后，你应该看到以下日志：

```
MSW: Base URL is /api
MSW: Handlers initialized
[MSW] Mocking enabled.
MSW: 收到登录请求
MSW: 登录数据 {username: "admin", password: "admin123"}
MSW: 登录成功
useLogin: 登录成功 {...}
```

进入Dashboard后，应该看到：

```
useDashboard: 开始获取健康概览数据
MSW: 收到健康概览请求
useDashboard: 获取健康概览成功 {...}
```

### 3. 检查Network标签

查看是否有以下请求：
- `GET /api/dashboard/health-overview` - 状态码 200
- `GET /api/devices` - 状态码 200
- `GET /api/threats` - 状态码 200
- `GET /api/transactions` - 状态码 200

### 4. 常见问题

#### 问题A：看到"MSW: 收到健康概览请求"但没有数据

**可能原因**：API响应格式不匹配

**解决方案**：
1. 在Console中执行：
```javascript
fetch('/api/dashboard/health-overview')
  .then(res => res.json())
  .then(data => console.log('API响应:', data));
```

2. 检查响应格式是否为：
```json
{
  "code": 200,
  "data": {
    "totalDevices": 10,
    "onlineDevices": 8,
    ...
  }
}
```

#### 问题B：没有看到"MSW: 收到健康概览请求"

**可能原因**：MSW未正确拦截请求

**解决方案**：
1. 确认Console中有 `[MSW] Mocking enabled.`
2. 检查API路径是否正确
3. 重新启动开发服务器：
```bash
# 停止当前服务器（Ctrl+C）
npm run dev
```

#### 问题C：页面一直显示Loading

**可能原因**：API请求失败或超时

**解决方案**：
1. 查看Console中的错误信息
2. 检查Network标签中的失败请求
3. 尝试手动调用API：
```javascript
// 在Console中执行
fetch('/api/dashboard/health-overview', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(res => res.json())
.then(data => console.log('手动API调用结果:', data))
.catch(err => console.error('手动API调用失败:', err));
```

#### 问题D：显示"No data"或空白

**可能原因**：Mock数据为空

**解决方案**：
1. 检查 `src/mocks/data.ts` 文件
2. 确认Mock数据已正确导出
3. 在Console中执行：
```javascript
// 检查Mock数据
import('./src/mocks/data.ts').then(module => {
  console.log('Mock设备数据:', module.mockDevices);
  console.log('Mock威胁数据:', module.mockThreats);
  console.log('Mock交易数据:', module.mockTransactions);
});
```

## 🛠️ 快速修复方案

### 方案1：清除缓存并重新登录

```javascript
// 在Console中执行
localStorage.clear();
sessionStorage.clear();
location.reload();
```

然后重新登录（admin / admin123）

### 方案2：手动触发数据刷新

```javascript
// 在Console中执行
// 清除React Query缓存
window.location.reload();
```

### 方案3：检查React Query DevTools

如果安装了React Query DevTools，可以：
1. 打开DevTools面板
2. 查看 `healthOverview` 查询状态
3. 检查是否有错误或数据

## 📊 预期的数据结构

### Dashboard健康概览数据

```json
{
  "totalDevices": 10,
  "onlineDevices": 8,
  "abnormalDevices": 2,
  "averageSecurityScore": 75,
  "statusDistribution": [
    { "status": "ACTIVE", "count": 8 },
    { "status": "PENDING", "count": 1 },
    { "status": "SUSPENDED", "count": 1 }
  ],
  "scoreDistribution": [
    { "range": "80-100", "count": 5 },
    { "range": "60-80", "count": 3 },
    { "range": "0-60", "count": 2 }
  ],
  "recentAbnormalDevices": [...]
}
```

### 设备列表数据

```json
{
  "items": [...],
  "total": 10,
  "page": 1,
  "pageSize": 20
}
```

## 🎯 如果以上都不行

请提供以下信息：

1. **Console中的完整错误信息**
2. **Network标签中失败的请求详情**
3. **执行以下命令的输出**：

```javascript
// 在Console中执行
console.log('=== 调试信息 ===');
console.log('Token:', localStorage.getItem('auth_token'));
console.log('User:', localStorage.getItem('auth-storage'));
console.log('Environment:', import.meta.env);

// 测试所有API端点
const endpoints = [
  '/api/dashboard/health-overview',
  '/api/devices',
  '/api/threats',
  '/api/transactions'
];

endpoints.forEach(endpoint => {
  fetch(endpoint, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
    }
  })
  .then(res => res.json())
  .then(data => console.log(`✅ ${endpoint}:`, data))
  .catch(err => console.error(`❌ ${endpoint}:`, err));
});
```

---

**提示**：大多数情况下，清除缓存并重新登录可以解决问题。
