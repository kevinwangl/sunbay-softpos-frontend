import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { healthApi, GetHealthChecksParams } from '@/api/health';
import { HealthCheck, HealthOverview } from '@/types';

/**
 * 获取设备健康检查记录
 */
export const useHealthChecks = (
  deviceId: string,
  params?: GetHealthChecksParams
): UseQueryResult<{ healthChecks: HealthCheck[]; total: number }> => {
  return useQuery({
    queryKey: ['health-checks', deviceId, params],
    queryFn: () => healthApi.getHealthChecks(deviceId, params),
    enabled: !!deviceId,
    staleTime: 30000, // 30秒
  });
};

/**
 * 获取健康概览
 */
export const useHealthOverview = (): UseQueryResult<HealthOverview> => {
  return useQuery({
    queryKey: ['health-overview'],
    queryFn: () => healthApi.getHealthOverview(),
    refetchInterval: 10000, // 10秒自动刷新
    staleTime: 5000,
  });
};

/**
 * 获取单个健康检查详情
 */
export const useHealthCheckDetail = (id: string): UseQueryResult<HealthCheck> => {
  return useQuery({
    queryKey: ['health-check', id],
    queryFn: () => healthApi.getHealthCheckById(id),
    enabled: !!id,
  });
};
