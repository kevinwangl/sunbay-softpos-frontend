#!/bin/bash

echo "🔍 SUNBAY SoftPOS 项目验证脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查计数
PASS=0
FAIL=0

# 检查函数
check() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC} $1"
        ((PASS++))
    else
        echo -e "${RED}✗${NC} $1"
        ((FAIL++))
    fi
}

echo "1. 检查必需文件..."
echo "-------------------"

# 检查package.json
test -f package.json
check "package.json 存在"

# 检查.env.development
test -f .env.development
check ".env.development 存在"

# 检查vite.config.ts
test -f vite.config.ts
check "vite.config.ts 存在"

# 检查src/main.tsx
test -f src/main.tsx
check "src/main.tsx 存在"

# 检查src/vite-env.d.ts
test -f src/vite-env.d.ts
check "src/vite-env.d.ts 存在"

# 检查MSW文件
test -f src/mocks/browser.ts
check "src/mocks/browser.ts 存在"

test -f src/mocks/handlers.ts
check "src/mocks/handlers.ts 存在"

test -f src/mocks/data.ts
check "src/mocks/data.ts 存在"

# 检查public/mockServiceWorker.js
test -f public/mockServiceWorker.js
check "public/mockServiceWorker.js 存在"

echo ""
echo "2. 检查配置内容..."
echo "-------------------"

# 检查.env.development内容
if grep -q "VITE_API_BASE_URL=/api" .env.development; then
    echo -e "${GREEN}✓${NC} .env.development 配置正确"
    ((PASS++))
else
    echo -e "${RED}✗${NC} .env.development 配置错误"
    ((FAIL++))
fi

# 检查vite.config.ts没有启用代理
if grep -q "// proxy:" vite.config.ts || ! grep -q "proxy:" vite.config.ts; then
    echo -e "${GREEN}✓${NC} Vite代理已禁用"
    ((PASS++))
else
    echo -e "${YELLOW}⚠${NC} Vite代理可能仍然启用"
    ((FAIL++))
fi

# 检查MSW配置
if grep -q "workerDirectory" package.json; then
    echo -e "${GREEN}✓${NC} MSW配置存在于package.json"
    ((PASS++))
else
    echo -e "${RED}✗${NC} MSW配置缺失"
    ((FAIL++))
fi

echo ""
echo "3. 检查依赖..."
echo "-------------------"

# 检查node_modules
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules 存在"
    ((PASS++))
else
    echo -e "${RED}✗${NC} node_modules 不存在 - 需要运行 npm install"
    ((FAIL++))
fi

# 检查关键依赖
if [ -d "node_modules/msw" ]; then
    echo -e "${GREEN}✓${NC} MSW 已安装"
    ((PASS++))
else
    echo -e "${RED}✗${NC} MSW 未安装"
    ((FAIL++))
fi

if [ -d "node_modules/react" ]; then
    echo -e "${GREEN}✓${NC} React 已安装"
    ((PASS++))
else
    echo -e "${RED}✗${NC} React 未安装"
    ((FAIL++))
fi

if [ -d "node_modules/antd" ]; then
    echo -e "${GREEN}✓${NC} Ant Design 已安装"
    ((PASS++))
else
    echo -e "${RED}✗${NC} Ant Design 未安装"
    ((FAIL++))
fi

echo ""
echo "================================"
echo "验证结果："
echo -e "${GREEN}通过: $PASS${NC}"
echo -e "${RED}失败: $FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ 所有检查通过！项目配置正确。${NC}"
    echo ""
    echo "下一步："
    echo "1. 运行 'npm run dev' 启动开发服务器"
    echo "2. 访问 http://localhost:5173"
    echo "3. 使用 admin/admin123 登录"
    exit 0
else
    echo -e "${RED}✗ 发现 $FAIL 个问题，请修复后重试。${NC}"
    echo ""
    echo "建议："
    if [ ! -d "node_modules" ]; then
        echo "- 运行 'npm install' 安装依赖"
    fi
    if [ ! -f "public/mockServiceWorker.js" ]; then
        echo "- 运行 'npx msw init public --save' 生成MSW文件"
    fi
    exit 1
fi
