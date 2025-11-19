/**
 * 版本管理工具函数
 */

/**
 * 验证版本号是否符合语义化版本规范
 */
export const isValidSemanticVersion = (version: string): boolean => {
  const semanticVersionRegex = /^\d+\.\d+\.\d+$/;
  return semanticVersionRegex.test(version);
};

/**
 * 比较两个版本号的大小
 * @returns 1: v1 > v2, 0: v1 === v2, -1: v1 < v2
 */
export const compareVersions = (v1: string, v2: string): number => {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (parts1[i] > parts2[i]) return 1;
    if (parts1[i] < parts2[i]) return -1;
  }

  return 0;
};

/**
 * 对版本号数组进行排序
 */
export const sortVersions = (
  versions: string[],
  order: 'asc' | 'desc' = 'desc'
): string[] => {
  return versions.sort((a, b) => {
    const result = compareVersions(a, b);
    return order === 'asc' ? result : -result;
  });
};

/**
 * 解析版本号
 */
export const parseVersion = (
  version: string
): { major: number; minor: number; patch: number } => {
  const [major, minor, patch] = version.split('.').map(Number);
  return { major, minor, patch };
};

/**
 * 判断版本是否过期（发布超过指定天数）
 */
export const isVersionOutdated = (releasedAt: string, days: number = 180): boolean => {
  const releaseDate = new Date(releasedAt);
  const now = new Date();
  const diffDays = Math.floor(
    (now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays > days;
};

/**
 * 计算版本发布距今天数
 */
export const getDaysSinceRelease = (releasedAt: string): number => {
  const releaseDate = new Date(releasedAt);
  const now = new Date();
  return Math.floor((now.getTime() - releaseDate.getTime()) / (1000 * 60 * 60 * 24));
};

/**
 * 格式化文件大小
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};

/**
 * 验证MD5格式
 */
export const isValidMD5 = (md5: string): boolean => {
  return /^[a-f0-9]{32}$/i.test(md5);
};

/**
 * 判断SDK版本与API版本是否兼容
 */
export const isVersionCompatible = (
  apiVersion: string,
  minApiVersion: string,
  maxApiVersion: string
): boolean => {
  return (
    compareVersions(apiVersion, minApiVersion) >= 0 &&
    compareVersions(apiVersion, maxApiVersion) <= 0
  );
};

/**
 * 获取版本状态的显示文本和颜色
 */
export const getVersionStatusDisplay = (
  status: 'ACTIVE' | 'MAINTENANCE' | 'DEPRECATED'
) => {
  const statusMap = {
    ACTIVE: { text: '活跃', color: 'green' },
    MAINTENANCE: { text: '维护', color: 'orange' },
    DEPRECATED: { text: '废弃', color: 'red' },
  };
  return statusMap[status];
};

/**
 * 获取更新类型的显示文本和颜色
 */
export const getUpdateTypeDisplay = (type: 'FORCE' | 'OPTIONAL') => {
  const typeMap = {
    FORCE: { text: '强制更新', color: 'red' },
    OPTIONAL: { text: '可选更新', color: 'blue' },
  };
  return typeMap[type];
};

/**
 * 计算采用率百分比
 */
export const calculateAdoptionRate = (
  deviceCount: number,
  totalDevices: number
): number => {
  if (totalDevices === 0) return 0;
  return Math.round((deviceCount / totalDevices) * 100 * 100) / 100;
};

/**
 * 获取更新状态的显示文本和颜色
 */
export const getUpdateStatusDisplay = (
  status: 'PENDING' | 'DOWNLOADING' | 'INSTALLING' | 'SUCCESS' | 'FAILED'
) => {
  const statusMap = {
    PENDING: { text: '待更新', color: 'default' },
    DOWNLOADING: { text: '下载中', color: 'processing' },
    INSTALLING: { text: '安装中', color: 'processing' },
    SUCCESS: { text: '成功', color: 'success' },
    FAILED: { text: '失败', color: 'error' },
  };
  return statusMap[status];
};

/**
 * 获取推送任务状态的显示文本和颜色
 */
export const getPushTaskStatusDisplay = (
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
) => {
  const statusMap = {
    PENDING: { text: '待执行', color: 'default' },
    RUNNING: { text: '执行中', color: 'processing' },
    COMPLETED: { text: '已完成', color: 'success' },
    FAILED: { text: '失败', color: 'error' },
  };
  return statusMap[status];
};
