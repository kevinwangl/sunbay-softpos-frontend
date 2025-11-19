/**
 * SDK版本管理API
 */
import client from './client';
import type {
  SDKVersion,
  VersionFilters,
  CreateSDKVersionRequest,
  UpdateSDKVersionRequest,
  VersionStatistics,
  CompatibilityMatrixItem,
  DeviceSDKVersion,
} from '../types/version';
import type {
  GetSDKVersionsResponse,
  CreateSDKVersionResponse,
  GetVersionStatisticsResponse,
  GetCompatibilityMatrixResponse,
  GetDeviceSDKVersionResponse,
} from '../types/api';

/**
 * 获取SDK版本列表
 */
export const getSDKVersions = async (
  filters: VersionFilters = {}
): Promise<GetSDKVersionsResponse> => {
  const response = await client.get<GetSDKVersionsResponse>('/sdk-versions', {
    params: filters,
  });
  return response.data;
};

/**
 * 获取SDK版本详情
 */
export const getSDKVersionById = async (id: string): Promise<SDKVersion> => {
  const response = await client.get<SDKVersion>(`/sdk-versions/${id}`);
  return response.data;
};

/**
 * 创建SDK版本
 */
export const createSDKVersion = async (
  data: CreateSDKVersionRequest
): Promise<CreateSDKVersionResponse> => {
  const response = await client.post<CreateSDKVersionResponse>('/sdk-versions', data);
  return response.data;
};

/**
 * 更新SDK版本
 */
export const updateSDKVersion = async (
  id: string,
  data: UpdateSDKVersionRequest
): Promise<SDKVersion> => {
  const response = await client.put<SDKVersion>(`/sdk-versions/${id}`, data);
  return response.data;
};

/**
 * 删除SDK版本
 */
export const deleteSDKVersion = async (id: string): Promise<void> => {
  await client.delete(`/sdk-versions/${id}`);
};

/**
 * 获取版本统计信息
 */
export const getVersionStatistics = async (
  id: string
): Promise<GetVersionStatisticsResponse> => {
  const response = await client.get<GetVersionStatisticsResponse>(
    `/sdk-versions/${id}/statistics`
  );
  return response.data;
};

/**
 * 获取兼容性矩阵
 */
export const getCompatibilityMatrix = async (): Promise<GetCompatibilityMatrixResponse> => {
  const response = await client.get<GetCompatibilityMatrixResponse>(
    '/sdk-versions/compatibility-matrix'
  );
  return response.data;
};

/**
 * 获取设备的SDK版本信息
 */
export const getDeviceSDKVersion = async (
  deviceId: string
): Promise<GetDeviceSDKVersionResponse> => {
  const response = await client.get<GetDeviceSDKVersionResponse>(
    `/devices/${deviceId}/sdk-version`
  );
  return response.data;
};
