# 🎯 如何调试"页面没有数据"问题

## 📋 问题描述
登录成功后，页面显示但没有数据。

## 🔍 现在该做什么

### 第1步：重启开发服务器

```bash
# 1. 停止当前服务器（按 Ctrl+C）

# 2. 重新启动
cd sunbay-softpos-frontend
npm run dev
```

### 第2步：打开浏览器

1. 访问：http://localhost:5173
2. 按 **F12** 打开开发者工具
3. 切换到 **Console** 标签
4. 点击清除按钮清空旧日志

### 第3步：查看初始化日志

在Console中，你应该立即看到：

```
MSW: Base URL is /api
MSW: Handlers initialized
[MSW] Mocking enabled.
```

✅ **如果看到这些日志** → 继续第4步  
❌ **如果没有看到** → MSW未启动，请：
   - 确认在 `sunbay-softpos-frontend` 目录下运行
   - 重新执行 `npm install`
   - 再次 `npm run dev`

### 第4步：登录系统

1. 输入凭证：
   - 用户名：`admin`
   - 密码：`admin123`

2. 点击"登录"

3. **观察Console输出**，应该看到：

```
登录表单提交: {username: "admin", password: "admin123"}
useLogin: 发送登录请求 {username: "admin", password: "admin123"}
API Client: 发送请求 POST /auth/login
MSW: 收到登录请求
MSW: 登录数据 {username: "admin", password: "admin123"}
MSW: 登录成功
API Client: 收到响应 /auth/login 200 {code: 200, data: {...}}
useLogin: 登录成功 {user: {...}, token: "...", refreshToken: "..."}
```

✅ **如果看到完整日志** → 登录成功，继续第5步  
❌ **如果日志不完整** → 记录缺失的部分，跳到[问题诊断](#问题诊断)

### 第5步：检查Dashboard数据

登录后应自动跳转到Dashboard，**观察Console输出**：

```
useDashboard: 开始获取健康概览数据
API Client: 发送请求 GET /dashboard/health-overview
MSW: 收到健康概览请求
API Client: 收到响应 /dashboard/health-overview 200 {code: 200, data: {...}}
useDashboard: 获取健康概览成功 {totalDevices: 10, onlineDevices: 8, ...}
Dashboard: isLoading= false data= {...} error= undefined
```

✅ **如果看到完整日志且页面有数据** → 问题已解决！  
✅ **如果看到完整日志但页面无数据** → 跳到[数据显示问题](#数据显示问题)  
❌ **如果日志不完整或有错误** → 跳到[问题诊断](#问题诊断)

---

## 🔧 问题诊断

### 情况A：没有看到 "MSW: 收到XXX请求"

**原因**：MSW未正确拦截API请求

**解决方案**：

1. 检查是否看到 `[MSW] Mocking enabled.`
2. 如果没有，检查 `src/main.tsx` 中的MSW配置
3. 重启开发服务器

### 情况B：看到 "API Client: 响应错误"

**原因**：API请求失败

**解决方案**：

1. 查看错误状态码：
   - **401**：Token无效，清除缓存并重新登录
   - **404**：API路径错误，检查URL
   - **500**：服务器错误，检查Mock handlers

2. 执行清除缓存：
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 情况C：看到 "useXXX: 获取失败"

**原因**：数据处理失败

**解决方案**：

1. 查看错误详情
2. 检查响应数据格式是否正确
3. 在Console中手动测试API：

```javascript
fetch('/api/dashboard/health-overview', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
})
.then(res => res.json())
.then(data => console.log('手动测试结果:', data))
.catch(err => console.error('手动测试失败:', err));
```

### 情况D：日志显示成功但页面无数据

**原因**：数据格式不匹配或组件渲染问题

**解决方案**：

1. 在Console中检查数据结构：
```javascript
// 查看最后一次成功的响应数据
// 应该在 "useDashboard: 获取健康概览成功" 日志中看到
```

2. 确认数据格式是否包含：
```json
{
  "totalDevices": 10,
  "onlineDevices": 8,
  "abnormalDevices": 2,
  "averageSecurityScore": 75,
  "statusDistribution": [...],
  "scoreDistribution": [...],
  "recentAbnormalDevices": [...]
}
```

3. 如果数据格式正确但页面仍无显示，可能是组件问题

---

## 📊 数据显示问题

如果API请求成功但页面不显示数据：

### 检查1：Dashboard页面

应该显示：
- 4个统计卡片（总设备数、在线设备、异常设备、平均安全评分）
- 2个图表（设备状态分布、安全评分分布）
- 异常设备列表（如果有）

### 检查2：设备列表页面

1. 点击左侧菜单"设备管理" → "设备列表"
2. Console应显示：
```
useDevices: 开始获取设备列表
MSW: 收到设备列表请求
useDevices: 获取设备列表成功 {items: [...], total: 10}
```
3. 页面应显示10个设备

### 检查3：其他页面

同样的方式检查：
- 威胁事件页面（应该有5个事件）
- 交易记录页面（应该有20条记录）

---

## 🛠️ 快速修复工具

### 工具1：完全重置

```javascript
// 在Console中执行
function fullReset() {
  console.log('🔄 开始完全重置...');
  localStorage.clear();
  sessionStorage.clear();
  console.log('✅ 缓存已清除');
  console.log('🔄 3秒后刷新页面...');
  setTimeout(() => location.reload(), 3000);
}

fullReset();
```

### 工具2：完整诊断

```javascript
// 在Console中执行
async function fullDiagnosis() {
  console.log('=== 开始完整诊断 ===\n');
  
  // 1. 环境
  console.log('1. 环境信息:');
  console.log('  Mode:', import.meta.env.MODE);
  console.log('  Base URL:', import.meta.env.VITE_API_BASE_URL || '/api');
  
  // 2. 认证
  console.log('\n2. 认证状态:');
  const token = localStorage.getItem('auth_token');
  console.log('  Token:', token ? '✅ 存在' : '❌ 不存在');
  
  // 3. API测试
  console.log('\n3. API测试:');
  const apis = [
    { name: 'Dashboard', url: '/api/dashboard/health-overview' },
    { name: '设备列表', url: '/api/devices' },
    { name: '威胁列表', url: '/api/threats' },
    { name: '交易列表', url: '/api/transactions' }
  ];
  
  for (const api of apis) {
    try {
      const res = await fetch(api.url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {}
      });
      const data = await res.json();
      console.log(`  ✅ ${api.name}:`, {
        status: res.status,
        code: data.code,
        hasData: !!data.data
      });
    } catch (err) {
      console.error(`  ❌ ${api.name}:`, err.message);
    }
  }
  
  console.log('\n=== 诊断完成 ===');
}

fullDiagnosis();
```

### 工具3：测试单个API

```javascript
// 测试Dashboard API
async function testDashboard() {
  const token = localStorage.getItem('auth_token');
  const res = await fetch('/api/dashboard/health-overview', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await res.json();
  console.log('Dashboard API测试:', data);
  return data;
}

testDashboard();
```

---

## 📞 需要帮助？

如果以上步骤都无法解决问题，请提供以下信息：

### 必需信息：

1. **Console中的完整日志**（从打开页面到出现问题）
2. **执行 `fullDiagnosis()` 的输出**
3. **Network标签中的请求列表**（特别是失败的请求）

### 可选信息：

4. 浏览器版本
5. 操作系统
6. 是否修改过代码

---

## ✅ 成功标志

当一切正常时，你应该：

1. ✅ 在Console中看到完整的日志链
2. ✅ Dashboard显示4个统计卡片和2个图表
3. ✅ 设备列表显示10个设备
4. ✅ 威胁列表显示5个事件
5. ✅ 交易列表显示20条记录
6. ✅ 可以点击查看详情
7. ✅ 可以执行操作（审批、暂停等）

---

## 📚 相关文档

- [LOGIN_DEBUG.md](./LOGIN_DEBUG.md) - 登录问题专项调试
- [DATA_DEBUG.md](./DATA_DEBUG.md) - 数据显示问题专项调试
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - 完整故障排除指南
- [QUICK_TEST.md](./QUICK_TEST.md) - 快速测试指南
- [DEBUG_SUMMARY.md](./DEBUG_SUMMARY.md) - 调试功能总结

---

**提示**：大多数问题可以通过清除缓存并重新登录解决！
