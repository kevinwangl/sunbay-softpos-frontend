import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import {
  Device,
  DeviceFilters,
  PaginatedResponse,
  ApiResponse,
  ApproveDeviceRequest,
  DeviceOperationRequest,
  HealthCheck,
} from '@/types';

export const devicesApi = {
  // 获取设备列表
  getDevices: async (filters: DeviceFilters): Promise<PaginatedResponse<Device>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Device>>>(
      API_PATHS.DEVICES.LIST,
      { params: filters }
    );
    return response.data.data;
  },

  // 获取设备详情
  getDeviceById: async (
    id: string
  ): Promise<{ device: Device; recentHealthChecks: HealthCheck[] }> => {
    const response = await apiClient.get<
      ApiResponse<{ device: Device; recentHealthChecks: HealthCheck[] }>
    >(API_PATHS.DEVICES.DETAIL(id));
    return response.data.data;
  },

  // 审批设备
  approveDevice: async (id: string, data: ApproveDeviceRequest): Promise<void> => {
    await apiClient.post(API_PATHS.DEVICES.APPROVE(id), data);
  },

  // 暂停设备
  suspendDevice: async (id: string, data: DeviceOperationRequest): Promise<void> => {
    await apiClient.post(API_PATHS.DEVICES.SUSPEND(id), data);
  },

  // 恢复设备
  resumeDevice: async (id: string): Promise<void> => {
    await apiClient.post(API_PATHS.DEVICES.RESUME(id));
  },

  // 吊销设备
  revokeDevice: async (id: string, data: DeviceOperationRequest): Promise<void> => {
    await apiClient.post(API_PATHS.DEVICES.REVOKE(id), data);
  },

  // 获取健康检查记录
  getHealthChecks: async (id: string): Promise<HealthCheck[]> => {
    const response = await apiClient.get<ApiResponse<{ healthChecks: HealthCheck[] }>>(
      API_PATHS.DEVICES.HEALTH_CHECKS(id)
    );
    return response.data.data.healthChecks;
  },

  // 触发密钥更新
  updateKey: async (id: string): Promise<void> => {
    await apiClient.post(API_PATHS.DEVICES.KEY_UPDATE(id));
  },
};
