// 断点定义
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
  desktop: 1920,
} as const;

// API路径
export const API_PATHS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
  },
  DEVICES: {
    LIST: '/devices',
    DETAIL: (id: string) => `/devices/${id}`,
    APPROVE: (id: string) => `/devices/${id}/approve`,
    SUSPEND: (id: string) => `/devices/${id}/suspend`,
    RESUME: (id: string) => `/devices/${id}/resume`,
    REVOKE: (id: string) => `/devices/${id}/revoke`,
    HEALTH_CHECKS: (id: string) => `/devices/${id}/health-checks`,
    KEY_STATUS: (id: string) => `/devices/${id}/keys/status`,
    KEY_UPDATE: (id: string) => `/devices/${id}/keys/update`,
  },
  DASHBOARD: {
    HEALTH_OVERVIEW: '/dashboard/health-overview',
  },
  HEALTH: {
    OVERVIEW: '/dashboard/health-overview',
    DETAIL: (id: string) => `/health-checks/${id}`,
  },
  THREATS: {
    LIST: '/threats',
    DETAIL: (id: string) => `/threats/${id}`,
    RESOLVE: (id: string) => `/threats/${id}/resolve`,
  },
  TRANSACTIONS: {
    LIST: '/transactions',
    DETAIL: (id: string) => `/transactions/${id}`,
  },
  LOGS: {
    LIST: '/logs',
    DETAIL: (id: string) => `/logs/${id}`,
    EXPORT: '/logs/export',
  },
} as const;

// 状态枚举
export const DEVICE_STATUS = {
  PENDING: 'PENDING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  REVOKED: 'REVOKED',
} as const;

export const DEVICE_STATUS_LABELS = {
  PENDING: '待审批',
  ACTIVE: '正常',
  SUSPENDED: '已暂停',
  REVOKED: '已吊销',
} as const;

export const DEVICE_STATUS_COLORS = {
  PENDING: 'orange',
  ACTIVE: 'green',
  SUSPENDED: 'red',
  REVOKED: 'gray',
} as const;

// 安全评分等级
export const SECURITY_SCORE_LEVELS = {
  EXCELLENT: { min: 80, max: 100, label: '优秀', color: 'green' },
  GOOD: { min: 60, max: 79, label: '良好', color: 'blue' },
  WARNING: { min: 40, max: 59, label: '警告', color: 'orange' },
  DANGER: { min: 0, max: 39, label: '危险', color: 'red' },
} as const;

// 威胁类型
export const THREAT_TYPES = {
  Root: 'Root检测',
  Hook: 'Hook检测',
  Debug: '调试检测',
  Repack: '重打包检测',
} as const;

export const THREAT_SEVERITY_LABELS = {
  HIGH: '高',
  MEDIUM: '中',
  LOW: '低',
} as const;

export const THREAT_SEVERITY_COLORS = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'blue',
} as const;

// 交易类型
export const TRANSACTION_TYPES = {
  SALE: '消费',
  REFUND: '退款',
  QUERY: '查询',
} as const;

export const TRANSACTION_STATUS_LABELS = {
  SUCCESS: '成功',
  FAILED: '失败',
  PENDING: '处理中',
} as const;

export const TRANSACTION_STATUS_COLORS = {
  SUCCESS: 'green',
  FAILED: 'red',
  PENDING: 'orange',
} as const;

// 刷新间隔（毫秒）
export const REFRESH_INTERVALS = {
  DEVICE_LIST: 30000, // 30秒
  DASHBOARD: 10000, // 10秒
  DEVICE_DETAIL: 15000, // 15秒
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
} as const;

// 本地存储键
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_INFO: 'user_info',
} as const;
