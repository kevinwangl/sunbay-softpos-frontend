// API请求和响应类型

export interface ApiResponse<T> {
  data: T;
  message?: string;
  code: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  username: string;
  role: string;
  email?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
}

export interface ApproveDeviceRequest {
  approved: boolean;
  reason?: string;
}

export interface DeviceOperationRequest {
  reason: string;
}

export interface ResolveThreatRequest {
  notes: string;
}

// SDK版本管理相关响应类型
export interface GetSDKVersionsResponse {
  versions: import('./version').SDKVersion[];
  total: number;
}

export interface CreateSDKVersionResponse {
  version: import('./version').SDKVersion;
}

export interface GetVersionStatisticsResponse {
  version: import('./version').SDKVersion;
  deviceCount: number;
  adoptionRate: number;
  devicesByStatus: { status: string; count: number }[];
  devicesByMerchant: { merchantId: string; merchantName: string; count: number }[];
  updateTrend: { date: string; count: number }[];
}

export interface GetCompatibilityMatrixResponse {
  matrix: import('./version').CompatibilityMatrixItem[];
}

export interface GetDeviceSDKVersionResponse {
  currentVersion: string;
  lastUpdatedAt: string;
  availableVersion?: string;
  updateRequired: boolean;
}

export interface CreateDistributionResponse {
  distribution: import('./version').VersionDistribution;
}

export interface GetDistributionResponse {
  distribution: import('./version').VersionDistribution;
  affectedDeviceCount: number;
}

export interface GetVersionUpdatesResponse {
  updates: import('./version').VersionUpdateRecord[];
  total: number;
}

export interface GetUpdateDashboardResponse {
  pendingCount: number;
  downloadingCount: number;
  installingCount: number;
  successCount: number;
  failedCount: number;
  updateTrend: { date: string; success: number; failed: number }[];
  outdatedDevices: any[];
}

export interface GetOutdatedDevicesResponse {
  devices: any[];
  total: number;
}

export interface CreatePushTaskResponse {
  task: import('./version').VersionPushTask;
}

export interface GetPushTasksResponse {
  tasks: import('./version').VersionPushTask[];
  total: number;
}

export interface GetPushTaskResponse {
  task: import('./version').VersionPushTask;
  details: {
    successDevices: string[];
    failedDevices: { deviceId: string; reason: string }[];
    pendingDevices: string[];
  };
}

export interface ExportPushReportResponse {
  downloadUrl: string;
}
