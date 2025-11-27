import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import {
  ThreatEvent,
  ThreatFilters,
  PaginatedResponse,
  ApiResponse,
  ResolveThreatRequest,
} from '@/types';

// Helper to transform backend response to frontend model
const transformThreat = (data: any): ThreatEvent => ({
  id: data.id,
  deviceId: data.device_id,
  type: data.threat_type, // We will handle mapping in constants
  severity: data.severity?.toUpperCase() as any,
  status: data.status?.toUpperCase() as any,
  detectedAt: data.detected_at,
  description: data.description,
  resolution: data.resolved_at ? {
    resolvedBy: data.resolved_by || 'Unknown',
    resolvedAt: data.resolved_at,
  } : undefined
});

export const threatsApi = {
  // 获取威胁事件列表
  getThreats: async (filters: ThreatFilters): Promise<PaginatedResponse<ThreatEvent>> => {
    const response = await apiClient.get<ApiResponse<{ threats: any[], total: number }>>(
      API_PATHS.THREATS.LIST,
      { params: filters }
    );

    const { threats, total } = response.data.data;

    return {
      items: threats.map(transformThreat),
      total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
    };
  },

  // 获取威胁事件详情
  getThreatById: async (id: string): Promise<ThreatEvent> => {
    const response = await apiClient.get<ApiResponse<any>>(
      API_PATHS.THREATS.DETAIL(id)
    );
    return transformThreat(response.data.data);
  },

  // 处理威胁事件
  resolveThreat: async (id: string, data: ResolveThreatRequest): Promise<void> => {
    await apiClient.post(API_PATHS.THREATS.RESOLVE(id), {
      resolution_notes: data.notes
    });
  },
};
