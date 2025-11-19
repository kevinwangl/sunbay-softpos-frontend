/**
 * SDK版本管理相关类型定义
 */

/**
 * SDK版本
 */
export interface SDKVersion {
  id: string;
  version: string; // 语义化版本号 MAJOR.MINOR.PATCH
  updateType: 'FORCE' | 'OPTIONAL';
  status: 'ACTIVE' | 'MAINTENANCE' | 'DEPRECATED';
  downloadUrl: string;
  fileSize: number;
  md5: string;
  releaseNotes: string;
  releasedAt: string;
  releasedBy: string;
  minApiVersion: string;
  maxApiVersion: string;
  deviceCount: number; // 使用该版本的设备数量
  adoptionRate: number; // 采用率百分比
}

/**
 * 版本分发策略
 */
export interface VersionDistribution {
  id: string;
  versionId: string;
  strategyType: 'FULL' | 'GRAY' | 'WHITELIST';
  targetDevices?: string[]; // 设备ID列表（白名单模式）
  targetMerchants?: string[]; // 商户ID列表
  targetModels?: string[]; // 设备型号列表
  percentage?: number; // 灰度发布百分比
  startTime: string;
  endTime?: string;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  createdBy: string;
  createdAt: string;
}

/**
 * 版本更新记录
 */
export interface VersionUpdateRecord {
  id: string;
  deviceId: string;
  fromVersion: string;
  toVersion: string;
  status: 'PENDING' | 'DOWNLOADING' | 'INSTALLING' | 'SUCCESS' | 'FAILED';
  failureReason?: string;
  startedAt: string;
  completedAt?: string;
  notifiedAt: string;
}

/**
 * 版本推送任务
 */
export interface VersionPushTask {
  id: string;
  versionId: string;
  targetType: 'ALL' | 'MERCHANT' | 'DEVICE_LIST';
  targetIds?: string[];
  totalCount: number;
  successCount: number;
  failedCount: number;
  pendingCount: number;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  scheduledAt?: string;
  startedAt?: string;
  completedAt?: string;
  createdBy: string;
  createdAt: string;
}

/**
 * 版本筛选条件
 */
export interface VersionFilters {
  status?: 'ACTIVE' | 'MAINTENANCE' | 'DEPRECATED';
  updateType?: 'FORCE' | 'OPTIONAL';
  sortBy?: 'version' | 'releasedAt' | 'deviceCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

/**
 * 创建SDK版本请求
 */
export interface CreateSDKVersionRequest {
  version: string;
  updateType: 'FORCE' | 'OPTIONAL';
  downloadUrl: string;
  fileSize: number;
  md5: string;
  releaseNotes: string;
  minApiVersion: string;
  maxApiVersion: string;
}

/**
 * 更新SDK版本请求
 */
export interface UpdateSDKVersionRequest {
  updateType?: 'FORCE' | 'OPTIONAL';
  status?: 'ACTIVE' | 'MAINTENANCE' | 'DEPRECATED';
  releaseNotes?: string;
}

/**
 * 版本统计信息
 */
export interface VersionStatistics {
  version: SDKVersion;
  deviceCount: number;
  adoptionRate: number;
  devicesByStatus: { status: string; count: number }[];
  devicesByMerchant: { merchantId: string; merchantName: string; count: number }[];
  updateTrend: { date: string; count: number }[];
}

/**
 * 兼容性矩阵项
 */
export interface CompatibilityMatrixItem {
  sdkVersion: string;
  minApiVersion: string;
  maxApiVersion: string;
  status: string;
}

/**
 * 设备SDK版本信息
 */
export interface DeviceSDKVersion {
  currentVersion: string;
  lastUpdatedAt: string;
  availableVersion?: string;
  updateRequired: boolean;
}

/**
 * 创建分发策略请求
 */
export interface CreateDistributionRequest {
  versionId: string;
  strategyType: 'FULL' | 'GRAY' | 'WHITELIST';
  targetDevices?: string[];
  targetMerchants?: string[];
  targetModels?: string[];
  percentage?: number;
  startTime: string;
  endTime?: string;
}

/**
 * 更新分发策略请求
 */
export interface UpdateDistributionRequest {
  status?: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  percentage?: number;
  endTime?: string;
}

/**
 * 版本更新筛选条件
 */
export interface VersionUpdateFilters {
  deviceId?: string;
  versionId?: string;
  status?: 'PENDING' | 'DOWNLOADING' | 'INSTALLING' | 'SUCCESS' | 'FAILED';
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}

/**
 * 更新监控仪表板数据
 */
export interface UpdateDashboardData {
  pendingCount: number;
  downloadingCount: number;
  installingCount: number;
  successCount: number;
  failedCount: number;
  updateTrend: { date: string; success: number; failed: number }[];
  outdatedDevices: any[]; // Device类型
}

/**
 * 创建推送任务请求
 */
export interface CreatePushTaskRequest {
  versionId: string;
  targetType: 'ALL' | 'MERCHANT' | 'DEVICE_LIST';
  targetIds?: string[];
  scheduledAt?: string;
}

/**
 * 推送任务筛选条件
 */
export interface PushTaskFilters {
  versionId?: string;
  status?: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  page?: number;
  pageSize?: number;
}

/**
 * 推送任务详情
 */
export interface PushTaskDetail {
  task: VersionPushTask;
  details: {
    successDevices: string[];
    failedDevices: { deviceId: string; reason: string }[];
    pendingDevices: string[];
  };
}
