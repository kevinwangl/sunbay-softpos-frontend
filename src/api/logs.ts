import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import { ApiResponse, PaginatedResponse, AuditLog, AuditLogFilters } from '@/types';

export const logsApi = {
  // 获取审计日志列表
  getAuditLogs: async (
    filters: AuditLogFilters
  ): Promise<PaginatedResponse<AuditLog>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<AuditLog>>>(
      API_PATHS.LOGS.LIST,
      { params: filters }
    );
    return response.data.data;
  },

  // 获取审计日志详情
  getAuditLogById: async (id: string): Promise<AuditLog> => {
    const response = await apiClient.get<ApiResponse<AuditLog>>(
      API_PATHS.LOGS.DETAIL(id)
    );
    return response.data.data;
  },

  // 导出日志
  exportLogs: async (filters: AuditLogFilters): Promise<Blob> => {
    const response = await apiClient.post(
      API_PATHS.LOGS.EXPORT,
      filters,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  },
};
