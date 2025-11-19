import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import { HealthOverview, ApiResponse } from '@/types';

export const dashboardApi = {
  // 获取健康概览
  getHealthOverview: async (): Promise<HealthOverview> => {
    const response = await apiClient.get<ApiResponse<HealthOverview>>(
      API_PATHS.DASHBOARD.HEALTH_OVERVIEW
    );
    return response.data.data;
  },
};
