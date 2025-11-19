#!/bin/bash

echo "========================================="
echo "SDK版本管理菜单 - 验证和修复脚本"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 步骤1: 验证文件内容
echo "步骤1: 验证Sidebar.tsx文件内容..."
if grep -q "SDK版本管理" src/components/layout/Sidebar.tsx; then
    echo -e "${GREEN}✓${NC} Sidebar.tsx包含'SDK版本管理'菜单项"
else
    echo -e "${RED}✗${NC} Sidebar.tsx不包含'SDK版本管理'菜单项"
    echo -e "${YELLOW}!${NC} 这不应该发生，文件可能被覆盖了"
    exit 1
fi

# 步骤2: 验证路由配置
echo ""
echo "步骤2: 验证App.tsx路由配置..."
if grep -q "sdk-versions" src/App.tsx; then
    echo -e "${GREEN}✓${NC} App.tsx包含SDK版本路由"
else
    echo -e "${RED}✗${NC} App.tsx不包含SDK版本路由"
    exit 1
fi

# 步骤3: 验证页面组件
echo ""
echo "步骤3: 验证页面组件..."
if [ -f "src/pages/SDKVersions/VersionList.tsx" ]; then
    echo -e "${GREEN}✓${NC} VersionList.tsx存在"
else
    echo -e "${RED}✗${NC} VersionList.tsx不存在"
    exit 1
fi

if [ -f "src/pages/SDKVersions/VersionDetail.tsx" ]; then
    echo -e "${GREEN}✓${NC} VersionDetail.tsx存在"
else
    echo -e "${RED}✗${NC} VersionDetail.tsx不存在"
    exit 1
fi

# 步骤4: 检查TypeScript错误
echo ""
echo "步骤4: 检查TypeScript编译错误..."
if npx tsc --noEmit 2>&1 | grep -q "error TS"; then
    echo -e "${RED}✗${NC} 发现TypeScript错误"
    echo "运行 'npx tsc --noEmit' 查看详细错误"
else
    echo -e "${GREEN}✓${NC} 没有TypeScript错误"
fi

# 步骤5: 清除缓存
echo ""
echo "步骤5: 清除Vite缓存..."
if [ -d "node_modules/.vite" ]; then
    rm -rf node_modules/.vite
    echo -e "${GREEN}✓${NC} Vite缓存已清除"
else
    echo -e "${YELLOW}!${NC} Vite缓存目录不存在（可能已经清除）"
fi

if [ -d "dist" ]; then
    rm -rf dist
    echo -e "${GREEN}✓${NC} dist目录已清除"
fi

# 步骤6: 显示文件内容
echo ""
echo "步骤6: 显示Sidebar.tsx中的菜单配置..."
echo "----------------------------------------"
grep -A 3 "sdk-versions" src/components/layout/Sidebar.tsx
echo "----------------------------------------"

# 步骤7: 提供下一步指示
echo ""
echo "========================================="
echo "验证完成！"
echo "========================================="
echo ""
echo -e "${GREEN}所有文件都已正确配置！${NC}"
echo ""
echo "下一步操作："
echo "1. 如果开发服务器正在运行，请停止它（Ctrl+C）"
echo "2. 运行: ${YELLOW}npm run dev${NC}"
echo "3. 打开浏览器: ${YELLOW}http://localhost:5173${NC}"
echo "4. 清除浏览器缓存:"
echo "   - Chrome/Edge: Ctrl+Shift+Delete"
echo "   - 或使用无痕模式: Ctrl+Shift+N"
echo "5. 登录系统（admin/admin123）"
echo "6. 查看左侧菜单，应该看到'SDK版本管理'"
echo ""
echo "如果仍然看不到菜单，请尝试："
echo "- 直接访问: ${YELLOW}http://localhost:5173/sdk-versions${NC}"
echo "- 完全关闭并重新打开浏览器"
echo "- 检查浏览器控制台（F12）是否有错误"
echo ""
echo "========================================="
