import apiClient from './client';

// 密钥状态接口
export interface KeyStatus {
  deviceId: string;
  currentKSN: string;
  remainingCount: number;
  status: 'ACTIVE' | 'EXPIRED' | 'NEAR_EXPIRY' | 'INACTIVE';
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
  const response = await apiClient.get(`/keys/${deviceId}/status`);
  return response.data;
};

// 更新设备密钥
export const updateDeviceKey = async (data: KeyUpdateRequest): Promise<KeyUpdateResponse> => {
  const response = await apiClient.post(`/keys/${data.deviceId}/update`, data);
  return response.data;
};

// 密钥注入请求
export interface InjectKeyRequest {
  deviceId: string;
}

// 密钥注入响应
export interface InjectKeyResponse {
  deviceId: string;
  encryptedIpek: string;
  ksn: string;
  injectedAt: string;
  message: string;
}

// 注入设备密钥
export const injectDeviceKey = async (data: InjectKeyRequest): Promise<InjectKeyResponse> => {
  const response = await apiClient.post('/keys/inject', data);
  return response.data;
};

// 获取密钥预警设备列表
export const getKeyWarningDevices = async (): Promise<any[]> => {
  const response = await apiClient.get('/devices/key-warnings');
  return response.data;
};
