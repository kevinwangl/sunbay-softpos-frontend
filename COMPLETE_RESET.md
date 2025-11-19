# 🔄 完整重置和测试指南

## 📋 当前状态检查

已完成的修复：
- ✅ 创建了 `public/mockServiceWorker.js`
- ✅ 修正了 `.env.development`
- ✅ 移除了 Vite 代理配置
- ✅ 创建了 `src/vite-env.d.ts` 类型定义

## 🚀 完整重置步骤

### 步骤1：清理项目
```bash
cd sunbay-softpos-frontend

# 停止所有运行的进程
# 按 Ctrl+C

# 清理缓存和构建文件
rm -rf node_modules
rm -rf dist
rm -rf .vite
rm package-lock.json
```

### 步骤2：重新安装依赖
```bash
npm install
```

### 步骤3：验证MSW文件
```bash
# 检查文件是否存在
ls -la public/mockServiceWorker.js
```

应该看到文件存在。

### 步骤4：启动开发服务器
```bash
npm run dev
```

### 步骤5：测试应用

1. **打开浏览器**
   - 访问：http://localhost:5173
   - 打开开发者工具（F12）
   - 切换到Console标签

2. **验证MSW启动**
   
   应该看到：
   ```
   MSW: Base URL is /api
   MSW: Handlers initialized
   [MSW] Mocking enabled.
   ```

3. **测试登录**
   - 用户名：`admin`
   - 密码：`admin123`
   - 点击登录

4. **验证登录成功**
   
   Console应该显示：
   ```
   登录表单提交: {username: "admin", password: "admin123"}
   useLogin: 发送登录请求 ...
   API Client: 发送请求 POST /auth/login
   MSW: 收到登录请求
   MSW: 登录成功
   API Client: 收到响应 /auth/login 200 ...
   ```

5. **验证Dashboard数据**
   
   应该看到：
   - 4个统计卡片（总设备数、在线设备、异常设备、平均安全评分）
   - 2个图表（设备状态分布、安全评分分布）
   - 异常设备列表

6. **测试其他页面**
   - 设备管理 → 设备列表（应该显示10个设备）
   - 安全监控 → 威胁事件（应该显示5个事件）
   - 交易管理 → 交易记录（应该显示20条记录）

## 🔍 故障排除

### 问题A：MSW未启动

**症状**：Console中没有 "[MSW] Mocking enabled."

**解决方案**：
```bash
# 1. 确认文件存在
ls public/mockServiceWorker.js

# 2. 如果不存在，重新生成
npx msw init public --save

# 3. 重启服务器
npm run dev
```

### 问题B：404错误

**症状**：`POST /api/auth/login 404`

**原因**：MSW未正确启动

**解决方案**：
1. 检查Console是否有MSW启动日志
2. 检查 `public/mockServiceWorker.js` 是否存在
3. 清除浏览器缓存（Ctrl+Shift+Delete）
4. 强制刷新（Ctrl+Shift+R）

### 问题C：500错误

**症状**：`POST /api/auth/login 500`

**原因**：Vite代理仍在运行

**解决方案**：
1. 检查 `vite.config.ts` 确认代理已注释
2. 完全停止服务器（Ctrl+C）
3. 重新启动 `npm run dev`

### 问题D：Connection Refused

**症状**：`net::ERR_CONNECTION_REFUSED`

**原因**：环境变量配置错误

**解决方案**：
1. 检查 `.env.development`：
   ```
   VITE_API_BASE_URL=/api
   ```
2. 重启服务器

## 📊 完整测试清单

### 基础功能
- [ ] MSW正确启动
- [ ] 登录成功
- [ ] 自动跳转到Dashboard
- [ ] 退出登录功能

### Dashboard页面
- [ ] 总设备数显示正确（10）
- [ ] 在线设备显示正确（8）
- [ ] 异常设备显示正确（2）
- [ ] 平均安全评分显示正确（75）
- [ ] 设备状态分布饼图显示
- [ ] 安全评分分布柱状图显示
- [ ] 异常设备列表显示

### 设备管理
- [ ] 设备列表显示10个设备
- [ ] 状态筛选功能正常
- [ ] 搜索功能正常
- [ ] 点击设备查看详情
- [ ] 设备详情页显示完整信息
- [ ] 设备操作按钮可用（审批、暂停、恢复、吊销）

### 安全监控
- [ ] 威胁事件列表显示5个事件
- [ ] 类型筛选功能正常
- [ ] 严重程度筛选功能正常
- [ ] 状态筛选功能正常
- [ ] 处理威胁功能正常

### 交易管理
- [ ] 交易记录列表显示20条记录
- [ ] 交易金额显示正确
- [ ] 交易状态显示正确
- [ ] 交易时间显示正确

### UI/UX
- [ ] 左侧导航菜单正常
- [ ] 右上角用户信息显示
- [ ] 页面切换流畅
- [ ] 响应式布局正常
- [ ] 主题色（#FF6000）应用正确

## 🎯 预期最终状态

当一切正常时：

1. **Console日志清晰**
   - 有MSW启动日志
   - 有API请求/响应日志
   - 无错误信息

2. **所有页面有数据**
   - Dashboard有统计和图表
   - 设备列表有10个设备
   - 威胁列表有5个事件
   - 交易列表有20条记录

3. **功能完全可用**
   - 登录/退出正常
   - 页面导航正常
   - 数据筛选正常
   - 操作按钮正常

## 💡 如果仍然有问题

请提供以下信息：

1. **完整的Console日志**（从打开页面到出现问题）
2. **Network标签截图**（显示所有请求）
3. **具体的错误信息**
4. **执行的步骤**

---

**重要提示**：如果按照以上步骤仍然无法解决，可能需要从头开始重新创建项目。
