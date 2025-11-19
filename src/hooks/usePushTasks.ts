/**
 * 版本推送任务相关Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as distributionApi from '../api/distributions';
import type { CreatePushTaskRequest, PushTaskFilters } from '../types/version';

/**
 * 获取推送任务列表
 */
export const usePushTasks = (filters: PushTaskFilters = {}) => {
  return useQuery({
    queryKey: ['push-tasks', filters],
    queryFn: () => distributionApi.getPushTasks(filters),
    staleTime: 30000, // 30秒
  });
};

/**
 * 获取推送任务详情
 */
export const usePushTaskDetail = (id: string) => {
  return useQuery({
    queryKey: ['push-task', id],
    queryFn: () => distributionApi.getPushTaskDetail(id),
    enabled: !!id,
    refetchInterval: (query) => {
      // 如果任务还在运行中，每10秒刷新一次
      const data = query.state.data;
      if (data?.task?.status === 'RUNNING' || data?.task?.status === 'PENDING') {
        return 10000;
      }
      return false;
    },
  });
};

/**
 * 创建推送任务
 */
export const useCreatePushTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePushTaskRequest) => distributionApi.createPushTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['push-tasks'] });
      message.success('推送任务创建成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '推送任务创建失败');
    },
  });
};

/**
 * 导出推送报告
 */
export const useExportPushReport = () => {
  return useMutation({
    mutationFn: (id: string) => distributionApi.exportPushReport(id),
    onSuccess: (data) => {
      // 下载文件
      window.open(data.downloadUrl, '_blank');
      message.success('报告导出成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '报告导出失败');
    },
  });
};
