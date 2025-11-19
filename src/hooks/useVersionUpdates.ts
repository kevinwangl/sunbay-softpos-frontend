/**
 * 版本更新监控相关Hooks
 */
import { useQuery } from '@tanstack/react-query';
import * as distributionApi from '../api/distributions';
import type { VersionUpdateFilters } from '../types/version';

/**
 * 获取版本更新记录
 */
export const useVersionUpdates = (filters: VersionUpdateFilters = {}) => {
  return useQuery({
    queryKey: ['version-updates', filters],
    queryFn: () => distributionApi.getVersionUpdates(filters),
    staleTime: 30000, // 30秒
  });
};

/**
 * 获取更新监控仪表板数据
 */
export const useUpdateDashboard = () => {
  return useQuery({
    queryKey: ['update-dashboard'],
    queryFn: () => distributionApi.getUpdateDashboard(),
    refetchInterval: 30000, // 30秒自动刷新
    staleTime: 20000,
  });
};

/**
 * 获取过期版本设备列表
 */
export const useOutdatedDevices = (
  olderThanDays: number = 180,
  page: number = 1,
  pageSize: number = 20
) => {
  return useQuery({
    queryKey: ['outdated-devices', olderThanDays, page, pageSize],
    queryFn: () => distributionApi.getOutdatedDevices(olderThanDays, page, pageSize),
    staleTime: 60000, // 1分钟
  });
};
