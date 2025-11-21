import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import { ApiResponse, HealthCheck, HealthOverview } from '@/types';

export interface GetHealthChecksParams {
  startDate?: string;
  endDate?: string;
  limit?: number;
}

export const healthApi = {
  // 获取设备健康检查记录
  getHealthChecks: async (
    deviceId: string,
    params?: GetHealthChecksParams
  ): Promise<{ healthChecks: HealthCheck[]; total: number }> => {
    const response = await apiClient.get<
      ApiResponse<{ healthChecks: HealthCheck[]; total: number }>
    >(API_PATHS.DEVICES.HEALTH_CHECKS(deviceId), { params });
    return response.data.data;
  },

  // 获取健康概览
  getHealthOverview: async (): Promise<HealthOverview> => {
    const response = await apiClient.get<ApiResponse<HealthOverview>>(
      API_PATHS.HEALTH.OVERVIEW
    );
    return response.data.data;
  },

  // 获取单个健康检查详情
  getHealthCheckById: async (id: string): Promise<HealthCheck> => {
    const response = await apiClient.get<ApiResponse<HealthCheck>>(
      API_PATHS.HEALTH.DETAIL(id)
    );
    return response.data.data;
  },
};
