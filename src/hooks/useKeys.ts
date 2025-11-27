import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import {
  getDeviceKeyStatus,
  updateDeviceKey,
  injectDeviceKey,
  getKeyWarningDevices,
  type KeyUpdateRequest,
  type KeyUpdateResponse,
  type InjectKeyRequest,
  type InjectKeyResponse,
} from '@/api/keys';

// 获取设备密钥状态
export const useDeviceKeyStatus = (deviceId: string) => {
  return useQuery({
    queryKey: ['device-key-status', deviceId],
    queryFn: () => getDeviceKeyStatus(deviceId),
    enabled: !!deviceId,
    staleTime: 30000, // 30秒
    refetchInterval: 60000, // 1分钟自动刷新
  });
};

// 密钥更新
export const useKeyUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: KeyUpdateRequest) => updateDeviceKey(data),
    onSuccess: (data: KeyUpdateResponse, variables) => {
      message.success(`密钥更新成功！新KSN: ${data.newKSN}`);
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: ['device-key-status', variables.deviceId] });
      queryClient.invalidateQueries({ queryKey: ['device', variables.deviceId] });
      queryClient.invalidateQueries({ queryKey: ['key-warning-devices'] });
    },
    onError: (error: any) => {
      message.error(`密钥更新失败: ${error.message || '未知错误'}`);
    },
  });
};

// 密钥注入
export const useKeyInjection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: InjectKeyRequest) => injectDeviceKey(data),
    onSuccess: (data: InjectKeyResponse, variables) => {
      message.success(`密钥注入成功！KSN: ${data.ksn}`);
      // 刷新相关查询
      queryClient.invalidateQueries({ queryKey: ['device-key-status', variables.deviceId] });
      queryClient.invalidateQueries({ queryKey: ['device', variables.deviceId] });
    },
    onError: (error: any) => {
      message.error(`密钥注入失败: ${error.message || '未知错误'}`);
    },
  });
};

// 获取密钥预警设备列表
export const useKeyWarningDevices = () => {
  return useQuery({
    queryKey: ['key-warning-devices'],
    queryFn: getKeyWarningDevices,
    staleTime: 60000, // 1分钟
    refetchInterval: 120000, // 2分钟自动刷新
  });
};
