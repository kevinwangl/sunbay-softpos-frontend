import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import {
  ThreatEvent,
  ThreatFilters,
  PaginatedResponse,
  ApiResponse,
  ResolveThreatRequest,
} from '@/types';

export const threatsApi = {
  // 获取威胁事件列表
  getThreats: async (filters: ThreatFilters): Promise<PaginatedResponse<ThreatEvent>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<ThreatEvent>>>(
      API_PATHS.THREATS.LIST,
      { params: filters }
    );
    return response.data.data;
  },

  // 获取威胁事件详情
  getThreatById: async (id: string): Promise<ThreatEvent> => {
    const response = await apiClient.get<ApiResponse<ThreatEvent>>(
      API_PATHS.THREATS.DETAIL(id)
    );
    return response.data.data;
  },

  // 处理威胁事件
  resolveThreat: async (id: string, data: ResolveThreatRequest): Promise<void> => {
    await apiClient.post(API_PATHS.THREATS.RESOLVE(id), data);
  },
};
