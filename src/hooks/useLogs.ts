import { useQuery, useMutation, UseQueryResult } from '@tanstack/react-query';
import { message } from 'antd';
import { logsApi } from '@/api/logs';
import { AuditLog, AuditLogFilters, PaginatedResponse } from '@/types';

/**
 * 获取审计日志列表
 */
export const useAuditLogs = (
  filters: AuditLogFilters
): UseQueryResult<PaginatedResponse<AuditLog>> => {
  return useQuery({
    queryKey: ['audit-logs', filters],
    queryFn: () => logsApi.getAuditLogs(filters),
    staleTime: 30000, // 30秒
  });
};

/**
 * 获取审计日志详情
 */
export const useAuditLogDetail = (id: string): UseQueryResult<AuditLog> => {
  return useQuery({
    queryKey: ['audit-log', id],
    queryFn: () => logsApi.getAuditLogById(id),
    enabled: !!id,
  });
};

/**
 * 导出日志
 */
export const useExportLogs = () => {
  return useMutation({
    mutationFn: (filters: AuditLogFilters) => logsApi.exportLogs(filters),
    onSuccess: (blob) => {
      // 创建下载链接
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('日志导出成功');
    },
    onError: () => {
      message.error('日志导出失败');
    },
  });
};
