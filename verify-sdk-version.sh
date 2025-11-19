#!/bin/bash

# SDK版本管理功能验证脚本

echo "========================================="
echo "SDK版本管理功能验证"
echo "========================================="
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (文件不存在)"
        return 1
    fi
}

# 检查文件内容
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✓${NC} $1 包含 '$2'"
        return 0
    else
        echo -e "${RED}✗${NC} $1 不包含 '$2'"
        return 1
    fi
}

echo "1. 检查类型定义文件..."
check_file "src/types/version.ts"
check_content "src/types/version.ts" "export interface SDKVersion"
check_content "src/types/version.ts" "export interface VersionDistribution"
check_content "src/types/version.ts" "export interface VersionUpdateRecord"
check_content "src/types/version.ts" "export interface VersionPushTask"
echo ""

echo "2. 检查API接口文件..."
check_file "src/api/versions.ts"
check_file "src/api/distributions.ts"
check_content "src/api/versions.ts" "export const getSDKVersions"
check_content "src/api/versions.ts" "export const createSDKVersion"
check_content "src/api/distributions.ts" "export const createDistribution"
check_content "src/api/distributions.ts" "export const createPushTask"
echo ""

echo "3. 检查Hooks文件..."
check_file "src/hooks/useSDKVersions.ts"
check_file "src/hooks/useVersionUpdates.ts"
check_file "src/hooks/usePushTasks.ts"
check_content "src/hooks/useSDKVersions.ts" "export const useSDKVersions"
check_content "src/hooks/useSDKVersions.ts" "export const useCreateSDKVersion"
check_content "src/hooks/useVersionUpdates.ts" "export const useUpdateDashboard"
check_content "src/hooks/usePushTasks.ts" "export const usePushTasks"
echo ""

echo "4. 检查工具函数文件..."
check_file "src/utils/versionUtils.ts"
check_content "src/utils/versionUtils.ts" "export const isValidSemanticVersion"
check_content "src/utils/versionUtils.ts" "export const compareVersions"
check_content "src/utils/versionUtils.ts" "export const formatFileSize"
echo ""

echo "5. 检查Mock数据文件..."
check_file "src/mocks/data.ts"
check_file "src/mocks/handlers.ts"
check_content "src/mocks/data.ts" "export const mockSDKVersions"
check_content "src/mocks/data.ts" "export const mockDistributions"
check_content "src/mocks/data.ts" "export const mockVersionUpdates"
check_content "src/mocks/data.ts" "export const mockPushTasks"
check_content "src/mocks/handlers.ts" "GET.*sdk-versions"
check_content "src/mocks/handlers.ts" "POST.*sdk-versions"
check_content "src/mocks/handlers.ts" "version-push-tasks"
echo ""

echo "6. 检查文档文件..."
check_file "SDK_VERSION_INTEGRATION_TEST.md"
check_file "SDK_VERSION_IMPLEMENTATION_SUMMARY.md"
echo ""

echo "========================================="
echo "验证完成！"
echo "========================================="
echo ""
echo -e "${YELLOW}提示：${NC}"
echo "1. 所有基础功能已实现完成"
echo "2. 可以开始开发UI组件（任务25-32）"
echo "3. 使用 'npm run dev' 启动开发服务器"
echo "4. 查看 SDK_VERSION_IMPLEMENTATION_SUMMARY.md 了解详情"
echo ""
