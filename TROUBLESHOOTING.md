# 🔧 SUNBAY SoftPOS 故障排除指南

## 📋 目录
1. [登录问题](#登录问题)
2. [数据不显示问题](#数据不显示问题)
3. [常见错误](#常见错误)
4. [调试工具](#调试工具)

---

## 🔐 登录问题

### 正确的登录凭证
```
用户名：admin
密码：admin123
```

### 登录失败排查

1. **清除浏览器缓存**
```javascript
// 在Console中执行
localStorage.clear();
sessionStorage.clear();
location.reload();
```

2. **检查MSW是否启动**
- 打开Console（F12）
- 应该看到：`[MSW] Mocking enabled.`
- 如果没有，重启开发服务器

3. **查看登录日志**
登录时Console应显示：
```
MSW: 收到登录请求
MSW: 登录数据 {username: "admin", password: "admin123"}
MSW: 登录成功
useLogin: 登录成功
```

---

## 📊 数据不显示问题

### 症状
- 登录成功但页面显示空白
- Dashboard没有数据
- 设备列表/威胁列表/交易列表为空

### 解决步骤

#### 步骤1：检查Console日志

打开Console（F12），你应该看到以下日志：

**Dashboard页面：**
```
useDashboard: 开始获取健康概览数据
MSW: 收到健康概览请求
useDashboard: 获取健康概览成功 {totalDevices: 10, ...}
Dashboard: isLoading= false data= {...} error= undefined
```

**设备列表页面：**
```
useDevices: 开始获取设备列表 {...}
MSW: 收到设备列表请求
useDevices: 获取设备列表成功 {items: [...], total: 10}
```

**威胁列表页面：**
```
useThreats: 开始获取威胁列表 {...}
MSW: 收到威胁事件列表请求
useThreats: 获取威胁列表成功 {items: [...], total: 5}
```

**交易列表页面：**
```
useTransactions: 开始获取交易列表 {...}
MSW: 收到交易列表请求
useTransactions: 获取交易列表成功 {items: [...], total: 20}
```

#### 步骤2：检查Network请求

1. 打开Network标签（F12）
2. 刷新页面
3. 查看以下请求是否成功（状态码200）：
   - `GET /api/dashboard/health-overview`
   - `GET /api/devices`
   - `GET /api/threats`
   - `GET /api/transactions`

#### 步骤3：手动测试API

在Console中执行以下代码测试所有API：

```javascript
// 测试Dashboard API
fetch('/api/dashboard/health-overview', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(res => res.json())
.then(data => console.log('✅ Dashboard API:', data))
.catch(err => console.error('❌ Dashboard API:', err));

// 测试设备列表API
fetch('/api/devices', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(res => res.json())
.then(data => console.log('✅ 设备列表 API:', data))
.catch(err => console.error('❌ 设备列表 API:', err));

// 测试威胁列表API
fetch('/api/threats', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(res => res.json())
.then(data => console.log('✅ 威胁列表 API:', data))
.catch(err => console.error('❌ 威胁列表 API:', err));

// 测试交易列表API
fetch('/api/transactions', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(res => res.json())
.then(data => console.log('✅ 交易列表 API:', data))
.catch(err => console.error('❌ 交易列表 API:', err));
```

#### 步骤4：检查响应格式

所有API响应应该遵循以下格式：

```json
{
  "code": 200,
  "data": {
    // 实际数据
  }
}
```

如果格式不对，可能是Mock handlers配置问题。

---

## ⚠️ 常见错误

### 错误1：401 Unauthorized

**原因**：Token过期或无效

**解决**：
```javascript
// 清除token并重新登录
localStorage.removeItem('auth_token');
localStorage.removeItem('refresh_token');
location.reload();
```

### 错误2：404 Not Found

**原因**：API路径不匹配

**检查**：
1. 确认MSW handlers中的路径
2. 确认API_PATHS配置
3. 查看Console中的"MSW: Base URL is"日志

**解决**：
```javascript
// 检查Base URL
console.log('Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
```

### 错误3：Network Error

**原因**：MSW未正确启动

**解决**：
1. 重启开发服务器：
```bash
# 停止当前服务器（Ctrl+C）
npm run dev
```

2. 清除node_modules并重新安装：
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### 错误4：页面一直Loading

**原因**：API请求挂起或超时

**解决**：
1. 检查Console是否有错误
2. 检查Network标签中的请求状态
3. 尝试刷新页面（Ctrl+R 或 Cmd+R）

---

## 🛠️ 调试工具

### 完整诊断脚本

在Console中执行以下脚本进行完整诊断：

```javascript
console.log('=== SUNBAY SoftPOS 诊断报告 ===\n');

// 1. 检查环境
console.log('1. 环境信息:');
console.log('  - Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
console.log('  - Mode:', import.meta.env.MODE);
console.log('  - Dev:', import.meta.env.DEV);

// 2. 检查认证状态
console.log('\n2. 认证状态:');
console.log('  - Token:', localStorage.getItem('auth_token') ? '✅ 存在' : '❌ 不存在');
console.log('  - User:', localStorage.getItem('auth-storage') ? '✅ 存在' : '❌ 不存在');

// 3. 测试所有API
console.log('\n3. API测试:');
const token = localStorage.getItem('auth_token');
const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

const endpoints = [
  { name: 'Dashboard', url: '/api/dashboard/health-overview' },
  { name: '设备列表', url: '/api/devices' },
  { name: '威胁列表', url: '/api/threats' },
  { name: '交易列表', url: '/api/transactions' }
];

Promise.all(
  endpoints.map(endpoint =>
    fetch(endpoint.url, { headers })
      .then(res => res.json())
      .then(data => ({
        name: endpoint.name,
        status: '✅ 成功',
        code: data.code,
        hasData: !!data.data
      }))
      .catch(err => ({
        name: endpoint.name,
        status: '❌ 失败',
        error: err.message
      }))
  )
).then(results => {
  results.forEach(result => {
    console.log(`  - ${result.name}: ${result.status}`, result);
  });
  console.log('\n=== 诊断完成 ===');
});
```

### 快速修复命令

```javascript
// 完全重置应用状态
function resetApp() {
  console.log('重置应用状态...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ 缓存已清除');
  console.log('🔄 3秒后刷新页面...');
  setTimeout(() => location.reload(), 3000);
}

// 执行重置
resetApp();
```

---

## 📞 仍然无法解决？

如果以上步骤都无法解决问题，请提供以下信息：

1. **Console中的完整错误日志**
2. **Network标签中失败请求的详情**
3. **诊断脚本的输出结果**
4. **浏览器版本和操作系统**

### 临时解决方案

如果急需演示，可以尝试：

1. **使用无痕模式**（避免缓存问题）
2. **切换浏览器**（Chrome、Firefox、Edge）
3. **重启电脑**（清除所有缓存）

---

## ✅ 成功标志

当一切正常时，你应该看到：

### Dashboard页面
- 4个统计卡片显示数字
- 2个图表（饼图和柱状图）
- 异常设备列表（如果有）

### 设备列表页面
- 显示10个设备
- 可以筛选状态
- 可以搜索设备

### 威胁列表页面
- 显示5个威胁事件
- 可以筛选类型和严重程度
- 可以处理威胁

### 交易列表页面
- 显示20条交易记录
- 显示交易金额和状态
- 可以查看详情

---

**提示**：90%的问题可以通过清除缓存并重新登录解决！
