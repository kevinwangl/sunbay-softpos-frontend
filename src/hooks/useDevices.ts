import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { devicesApi } from '@/api/devices';
import {
  DeviceFilters,
  ApproveDeviceRequest,
  DeviceOperationRequest,
} from '@/types';
import { handleApiError } from '@/utils/errorHandler';
import { REFRESH_INTERVALS } from '@/utils/constants';

// 获取设备列表
export const useDevices = (filters: DeviceFilters) => {
  return useQuery({
    queryKey: ['devices', filters],
    queryFn: async () => {
      console.log('useDevices: 开始获取设备列表', filters);
      try {
        const data = await devicesApi.getDevices(filters);
        console.log('useDevices: 获取设备列表成功', data);
        return data;
      } catch (error) {
        console.error('useDevices: 获取设备列表失败', error);
        throw error;
      }
    },
    refetchInterval: REFRESH_INTERVALS.DEVICE_LIST,
  });
};

// 获取设备详情
export const useDeviceDetail = (id: string) => {
  return useQuery({
    queryKey: ['device', id],
    queryFn: () => devicesApi.getDeviceById(id),
    enabled: !!id,
    refetchInterval: REFRESH_INTERVALS.DEVICE_DETAIL,
  });
};

// 审批设备
export const useApproveDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ApproveDeviceRequest }) =>
      devicesApi.approveDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      message.success('设备审批成功');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};

// 暂停设备
export const useSuspendDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeviceOperationRequest }) =>
      devicesApi.suspendDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device'] });
      message.success('设备已暂停');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};

// 恢复设备
export const useResumeDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => devicesApi.resumeDevice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device'] });
      message.success('设备已恢复');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};

// 吊销设备
export const useRevokeDevice = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: DeviceOperationRequest }) =>
      devicesApi.revokeDevice(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['devices'] });
      queryClient.invalidateQueries({ queryKey: ['device'] });
      message.success('设备已吊销');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};

// 获取健康检查记录
export const useHealthChecks = (deviceId: string) => {
  return useQuery({
    queryKey: ['healthChecks', deviceId],
    queryFn: () => devicesApi.getHealthChecks(deviceId),
    enabled: !!deviceId,
  });
};

// 更新密钥
export const useUpdateKey = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => devicesApi.updateKey(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['device'] });
      message.success('密钥更新成功');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};
