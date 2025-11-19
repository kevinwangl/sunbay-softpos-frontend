/**
 * SDK版本管理相关Hooks
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as versionApi from '../api/versions';
import * as distributionApi from '../api/distributions';
import type {
  VersionFilters,
  CreateSDKVersionRequest,
  UpdateSDKVersionRequest,
  CreateDistributionRequest,
  UpdateDistributionRequest,
} from '../types/version';

/**
 * 获取SDK版本列表
 */
export const useSDKVersions = (filters: VersionFilters = {}) => {
  return useQuery({
    queryKey: ['sdk-versions', filters],
    queryFn: () => versionApi.getSDKVersions(filters),
    staleTime: 60000, // 1分钟
  });
};

/**
 * 获取SDK版本详情
 */
export const useSDKVersion = (id: string) => {
  return useQuery({
    queryKey: ['sdk-version', id],
    queryFn: () => versionApi.getSDKVersionById(id),
    enabled: !!id,
  });
};

/**
 * 创建SDK版本
 */
export const useCreateSDKVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSDKVersionRequest) => versionApi.createSDKVersion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sdk-versions'] });
      message.success('SDK版本创建成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'SDK版本创建失败');
    },
  });
};

/**
 * 更新SDK版本
 */
export const useUpdateSDKVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSDKVersionRequest }) =>
      versionApi.updateSDKVersion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sdk-versions'] });
      queryClient.invalidateQueries({ queryKey: ['sdk-version', variables.id] });
      message.success('SDK版本更新成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'SDK版本更新失败');
    },
  });
};

/**
 * 删除SDK版本
 */
export const useDeleteSDKVersion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => versionApi.deleteSDKVersion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sdk-versions'] });
      message.success('SDK版本删除成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'SDK版本删除失败');
    },
  });
};

/**
 * 获取版本统计信息
 */
export const useVersionStatistics = (id: string) => {
  return useQuery({
    queryKey: ['version-statistics', id],
    queryFn: () => versionApi.getVersionStatistics(id),
    enabled: !!id,
  });
};

/**
 * 获取兼容性矩阵
 */
export const useCompatibilityMatrix = () => {
  return useQuery({
    queryKey: ['compatibility-matrix'],
    queryFn: () => versionApi.getCompatibilityMatrix(),
    staleTime: 300000, // 5分钟
  });
};

/**
 * 获取设备SDK版本信息
 */
export const useDeviceSDKVersion = (deviceId: string) => {
  return useQuery({
    queryKey: ['device-sdk-version', deviceId],
    queryFn: () => versionApi.getDeviceSDKVersion(deviceId),
    enabled: !!deviceId,
  });
};

/**
 * 创建分发策略
 */
export const useCreateDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      versionId,
      data,
    }: {
      versionId: string;
      data: Omit<CreateDistributionRequest, 'versionId'>;
    }) => distributionApi.createDistribution(versionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributions'] });
      message.success('分发策略创建成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '分发策略创建失败');
    },
  });
};

/**
 * 获取分发策略
 */
export const useDistribution = (versionId: string) => {
  return useQuery({
    queryKey: ['distribution', versionId],
    queryFn: () => distributionApi.getDistribution(versionId),
    enabled: !!versionId,
  });
};

/**
 * 更新分发策略
 */
export const useUpdateDistribution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDistributionRequest }) =>
      distributionApi.updateDistribution(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributions'] });
      message.success('分发策略更新成功');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || '分发策略更新失败');
    },
  });
};
