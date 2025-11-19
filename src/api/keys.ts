import apiClient from './client';

// 密钥状态接口
export interface KeyStatus {
  deviceId: string;
  currentKSN: string;
  remainingCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'NEAR_EXPIRY';
  lastUpdated: string;
  nextUpdateRequired?: string;
}

// 密钥更新请求
export interface KeyUpdateRequest {
  deviceId: string;
  force?: boolean;
}

// 密钥更新响应
export interface KeyUpdateResponse {
  success: boolean;
  newKSN: string;
  message: string;
  remainingCount: number;
}

// 获取设备密钥状态
export const getDeviceKeyStatus = async (deviceId: string): Promise<KeyStatus> => {
  const response = await apiClient.get(`/devices/${deviceId}/keys/status`);
  return response.data;
};

// 更新设备密钥
export const updateDeviceKey = async (data: KeyUpdateRequest): Promise<KeyUpdateResponse> => {
  const response = await apiClient.post(`/devices/${data.deviceId}/keys/update`, data);
  return response.data;
};

// 获取密钥预警设备列表
export const getKeyWarningDevices = async (): Promise<any[]> => {
  const response = await apiClient.get('/devices/key-warnings');
  return response.data;
};
