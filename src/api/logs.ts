import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import { ApiResponse, PaginatedResponse, AuditLog, AuditLogFilters } from '@/types';

export const logsApi = {
  // 获取审计日志列表
  getAuditLogs: async (
    filters: AuditLogFilters
  ): Promise<PaginatedResponse<AuditLog>> => {
    const response = await apiClient.get<ApiResponse<{ logs: any[]; total: number }>>(
      API_PATHS.LOGS.LIST,
      { params: filters }
    );

    const apiData = response.data.data;
    return {
      items: apiData.logs.map(transformLog),
      total: apiData.total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
    };
  },

  // 获取审计日志详情
  getAuditLogById: async (id: string): Promise<AuditLog> => {
    const response = await apiClient.get<ApiResponse<any>>(
      API_PATHS.LOGS.DETAIL(id)
    );
    return transformLog(response.data.data);
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

// Helper to transform backend log data to frontend model
const transformLog = (data: any): AuditLog => {
  let details = {};
  try {
    if (typeof data.details === 'string') {
      details = JSON.parse(data.details);
    } else if (typeof data.details === 'object') {
      details = data.details;
    }
  } catch (e) {
    details = { raw: data.details };
  }

  // Determine resource type from operation
  let resource = 'other';
  const op = data.operation?.toUpperCase() || '';
  if (op.includes('DEVICE')) resource = 'device';
  else if (op.includes('THREAT')) resource = 'threat';
  else if (op.includes('TRANSACTION')) resource = 'transaction';
  else if (op.includes('LOGIN') || op.includes('LOGOUT')) resource = 'auth';
  else if (op.includes('VERSION')) resource = 'version';

  return {
    id: data.id,
    userId: data.operator || 'system',
    username: data.operator || 'System', // Backend doesn't return separate username yet
    action: data.operation,
    resource: resource,
    resourceId: data.device_id || data.resource_id || '-',
    ipAddress: data.ip_address || '-',
    timestamp: data.created_at,
    details: details,
    result: data.result,
  };
};
