#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

console.log('🔧 开始修复 TypeScript 编译错误...\n');

// 1. 修复 src/pages/Dashboard/index.tsx - 移除 Tag 导入
const dashboardPath = 'src/pages/Dashboard/index.tsx';
let dashboardContent = fs.readFileSync(dashboardPath, 'utf8');
dashboardContent = dashboardContent.replace(
  "import { Row, Col, Card, Statistic, Table, Tag, Spin } from 'antd';",
  "import { Row, Col, Card, Statistic, Table, Spin } from 'antd';"
);
fs.writeFileSync(dashboardPath, dashboardContent);
console.log('✅ 修复 Dashboard/index.tsx');

// 2. 修复 src/pages/Devices/DeviceApproval.tsx - 移除 StatusBadge 导入
const approvalPath = 'src/pages/Devices/DeviceApproval.tsx';
let approvalContent = fs.readFileSync(approvalPath, 'utf8');
approvalContent = approvalContent.replace(
  /import { StatusBadge } from '@\/components\/common\/StatusBadge';\n/g,
  ''
);
fs.writeFileSync(approvalPath, approvalContent);
console.log('✅ 修复 DeviceApproval.tsx');

// 3. 修复 src/stores/authStore.ts - 移除 get 参数
const authStorePath = 'src/stores/authStore.ts';
let authStoreContent = fs.readFileSync(authStorePath, 'utf8');
authStoreContent = authStoreContent.replace(
  '(set, get) => ({',
  '(set) => ({'
);
fs.writeFileSync(authStorePath, authStoreContent);
console.log('✅ 修复 authStore.ts');

// 4. 修复 src/mocks/handlers.ts - 删除 validateToken 函数
const handlersPath = 'src/mocks/handlers.ts';
let handlersContent = fs.readFileSync(handlersPath, 'utf8');
// 删除 validateToken 函数定义
handlersContent = handlersContent.replace(
  /\/\/ Token验证辅助函数\nconst validateToken = \(request: Request\): boolean => \{[\s\S]*?\n\};\n\n/,
  ''
);
fs.writeFileSync(handlersPath, handlersContent);
console.log('✅ 修复 handlers.ts');

console.log('\n✨ 所有修复完成！');
console.log('📦 现在运行: npm run build');
