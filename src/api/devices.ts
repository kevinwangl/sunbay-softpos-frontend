import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import {
  Device,
  DeviceFilters,
  PaginatedResponse,
  ApiResponse,
  ApproveDeviceRequest,
  RejectDeviceRequest,
  DeviceOperationRequest,
  HealthCheck,
} from '@/types';

export const devicesApi = {
  // 获取设备列表
  getDevices: async (filters: DeviceFilters): Promise<PaginatedResponse<Device>> => {
    const response = await apiClient.get<ApiResponse<{ devices: any[]; total: number }>>(
      API_PATHS.DEVICES.LIST,
      { params: filters }
    );

    // Transform API response (snake_case) to frontend format (camelCase)
    const apiData = response.data.data;
    return {
      items: apiData.devices.map((device: any) => ({
        id: device.id,
        merchantId: device.merchant_id || 'default_merchant',
        merchantName: device.merchant_name || '未分配',
        imei: device.imei,
        model: device.model,
        osVersion: device.os_version,
        teeType: device.tee_type,
        deviceMode: device.device_mode,
        status: device.status,
        securityScore: device.security_score,
        ksn: device.ksn,
        keyInfo: {
          currentKsn: device.ksn,
          ipekInjectedAt: device.key_injected_at || device.registered_at,
          remainingCount: device.key_max_usage - device.key_usage_count,
          totalCount: device.key_max_usage,
        },
        registeredAt: device.registered_at,
        approvedAt: device.approved_at,
        lastActiveAt: device.registered_at, // Use registered_at as fallback for now
        nfcPresent: device.nfc_present || false,
      })),
      total: apiData.total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
    };
  },

  // 获取设备详情
  getDeviceById: async (
    id: string
  ): Promise<{ device: Device; recentHealthChecks: HealthCheck[] }> => {
    const response = await apiClient.get<any>(API_PATHS.DEVICES.DETAIL(id));

    // Transform API response (snake_case) to frontend format (camelCase)
    const apiDevice = response.data;
    const device: Device = {
      id: apiDevice.id,
      merchantId: apiDevice.merchant_id || 'default_merchant',
      merchantName: apiDevice.merchant_name || '未分配',
      imei: apiDevice.imei,
      model: apiDevice.model,
      osVersion: apiDevice.os_version,
      teeType: apiDevice.tee_type,
      deviceMode: apiDevice.device_mode,
      status: apiDevice.status,
      securityScore: apiDevice.security_score,
      ksn: apiDevice.ksn,
      keyInfo: {
        currentKsn: apiDevice.ksn,
        ipekInjectedAt: apiDevice.key_injected_at || apiDevice.registered_at,
        remainingCount: apiDevice.key_max_usage - apiDevice.key_usage_count,
        totalCount: apiDevice.key_max_usage,
      },
      registeredAt: apiDevice.registered_at,
      approvedAt: apiDevice.approved_at,
      lastActiveAt: apiDevice.registered_at, // Use registered_at as fallback for now
      nfcPresent: apiDevice.nfc_present || false,
    };

    return {
      device,
      recentHealthChecks: [], // Backend doesn't return health checks yet
    };
  },

  // 审批设备
  approveDevice: async (id: string, data: ApproveDeviceRequest): Promise<void> => {
    await apiClient.post(API_PATHS.DEVICES.APPROVE(id), {
      device_id: id,
      operator: data.operator
    });
  },

  // 拒绝设备
  rejectDevice: async (id: string, data: RejectDeviceRequest): Promise<void> => {
    await apiClient.post(API_PATHS.DEVICES.REJECT(id), {
      device_id: id,
      operator: data.operator,
      reason: data.reason
    });
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
