# Frontend 重新构建指南

## 问题描述

修改了 `.env.production` 文件后，编译出来的版本仍然使用旧的 API 地址。

## 原因分析

Vite 在构建时会将环境变量编译到 JavaScript 文件中。如果修改了环境变量但没有重新构建，`dist` 目录中的文件仍然包含旧的值。

## 解决方案

### 1. 清理旧的构建文件

```bash
cd sunbay-softpos-frontend

# 删除旧的 dist 目录
rm -rf dist

# 或者使用 npm 清理命令（如果配置了）
npm run clean
```

### 2. 重新构建项目

```bash
# 使用生产环境配置构建
npm run build

# 或者明确指定模式
npm run build -- --mode production
```

### 3. 验证构建结果

```bash
# 检查编译后的文件中是否使用了正确的 API 地址
grep -r "softpos.sunbay.dev" dist/

# 不应该再看到旧的 IP 地址
grep -r "10.162.24.174" dist/
```

### 4. 预览构建结果（可选）

```bash
# 本地预览生产构建
npm run preview

# 访问 http://localhost:4173
# 打开浏览器开发者工具，检查网络请求是否使用正确的域名
```

## 完整的重新构建流程

```bash
cd sunbay-softpos-frontend

# 1. 清理
rm -rf dist

# 2. 确认环境变量配置正确
cat .env.production

# 应该看到:
# VITE_API_BASE_URL=http://softpos.sunbay.dev/api/v1
# VITE_WS_URL=ws://softpos.sunbay.dev/ws
# VITE_ENV=production

# 3. 重新构建
npm run build

# 4. 验证
grep "softpos.sunbay.dev" dist/assets/*.js

# 5. 部署到 Vercel（如果需要）
# Vercel 会自动使用 .env.production 中的变量
```

## 环境变量优先级

Vite 的环境变量加载优先级（从高到低）：

1. `.env.[mode].local` (例如 `.env.production.local`)
2. `.env.[mode]` (例如 `.env.production`)
3. `.env.local`
4. `.env`

**注意**: `.local` 文件不应该提交到 Git，它们用于本地覆盖。

## 常见问题

### Q1: 为什么修改了 .env.production 但没有生效？

**A**: 因为 Vite 在构建时将环境变量编译到代码中，必须重新构建才能生效。

### Q2: 开发环境和生产环境使用不同的 API 地址？

**A**: 是的，这是正确的做法：
- 开发环境 (`.env.development`): `http://localhost:8080/api/v1`
- 生产环境 (`.env.production`): `http://softpos.sunbay.dev/api/v1`

### Q3: 如何在构建时覆盖环境变量？

**A**: 可以在构建命令中指定：

```bash
# 方法1: 使用环境变量
VITE_API_BASE_URL=http://custom.domain.com/api/v1 npm run build

# 方法2: 创建 .env.production.local 文件
echo "VITE_API_BASE_URL=http://custom.domain.com/api/v1" > .env.production.local
npm run build
```

### Q4: Vercel 部署时如何配置环境变量？

**A**: 在 Vercel 项目设置中：

1. 进入项目设置 → Environment Variables
2. 添加环境变量：
   - `VITE_API_BASE_URL` = `http://softpos.sunbay.dev/api/v1`
   - `VITE_WS_URL` = `ws://softpos.sunbay.dev/ws`
   - `VITE_ENV` = `production`
3. 选择环境：Production
4. 保存并重新部署

## 验证清单

构建完成后，检查以下内容：

- [ ] `dist` 目录已重新生成
- [ ] `dist/assets/*.js` 文件中包含正确的域名
- [ ] `dist/assets/*.js` 文件中不包含旧的 IP 地址
- [ ] 本地预览 (`npm run preview`) 使用正确的 API 地址
- [ ] 浏览器开发者工具中的网络请求指向正确的域名

## 自动化脚本

创建一个清理并重新构建的脚本：

```bash
#!/bin/bash
# rebuild.sh

echo "🧹 清理旧的构建文件..."
rm -rf dist

echo "📦 重新构建项目..."
npm run build

echo "✅ 验证构建结果..."
if grep -r "10.162.24.174" dist/ > /dev/null; then
    echo "❌ 错误: 仍然包含旧的 IP 地址"
    exit 1
else
    echo "✅ 成功: 使用正确的域名"
fi

echo "🎉 构建完成！"
```

使用方法：

```bash
chmod +x rebuild.sh
./rebuild.sh
```

---

**最后更新**: 2024-12-09  
**维护者**: SUNBAY 技术团队

