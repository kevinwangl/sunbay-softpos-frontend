/**
 * 版本分发策略API
 */
import client from './client';
import type {
  VersionDistribution,
  CreateDistributionRequest,
  UpdateDistributionRequest,
  VersionUpdateRecord,
  VersionUpdateFilters,
  UpdateDashboardData,
  VersionPushTask,
  CreatePushTaskRequest,
  PushTaskFilters,
  PushTaskDetail,
} from '../types/version';
import type {
  CreateDistributionResponse,
  GetDistributionResponse,
  GetVersionUpdatesResponse,
  GetUpdateDashboardResponse,
  GetOutdatedDevicesResponse,
  CreatePushTaskResponse,
  GetPushTasksResponse,
  GetPushTaskResponse,
  ExportPushReportResponse,
} from '../types/api';

/**
 * 创建分发策略
 */
export const createDistribution = async (
  versionId: string,
  data: Omit<CreateDistributionRequest, 'versionId'>
): Promise<CreateDistributionResponse> => {
  const response = await client.post<CreateDistributionResponse>(
    `/sdk-versions/${versionId}/distribution`,
    { ...data, versionId }
  );
  return response.data;
};

/**
 * 获取分发策略
 */
export const getDistribution = async (
  versionId: string
): Promise<GetDistributionResponse> => {
  const response = await client.get<GetDistributionResponse>(
    `/sdk-versions/${versionId}/distribution`
  );
  return response.data;
};

/**
 * 更新分发策略
 */
export const updateDistribution = async (
  id: string,
  data: UpdateDistributionRequest
): Promise<VersionDistribution> => {
  const response = await client.put<VersionDistribution>(`/distributions/${id}`, data);
  return response.data;
};

/**
 * 获取版本更新记录
 */
export const getVersionUpdates = async (
  filters: VersionUpdateFilters = {}
): Promise<GetVersionUpdatesResponse> => {
  const response = await client.get<GetVersionUpdatesResponse>('/version-updates', {
    params: filters,
  });
  return response.data;
};

/**
 * 获取更新监控仪表板数据
 */
export const getUpdateDashboard = async (): Promise<GetUpdateDashboardResponse> => {
  const response = await client.get<GetUpdateDashboardResponse>(
    '/version-updates/dashboard'
  );
  return response.data;
};

/**
 * 获取过期版本设备列表
 */
export const getOutdatedDevices = async (
  olderThanDays: number = 180,
  page: number = 1,
  pageSize: number = 20
): Promise<GetOutdatedDevicesResponse> => {
  const response = await client.get<GetOutdatedDevicesResponse>('/devices/outdated', {
    params: { olderThanDays, page, pageSize },
  });
  return response.data;
};

/**
 * 创建推送任务
 */
export const createPushTask = async (
  data: CreatePushTaskRequest
): Promise<CreatePushTaskResponse> => {
  const response = await client.post<CreatePushTaskResponse>('/version-push-tasks', data);
  return response.data;
};

/**
 * 获取推送任务列表
 */
export const getPushTasks = async (
  filters: PushTaskFilters = {}
): Promise<GetPushTasksResponse> => {
  const response = await client.get<GetPushTasksResponse>('/version-push-tasks', {
    params: filters,
  });
  return response.data;
};

/**
 * 获取推送任务详情
 */
export const getPushTaskDetail = async (id: string): Promise<GetPushTaskResponse> => {
  const response = await client.get<GetPushTaskResponse>(`/version-push-tasks/${id}`);
  return response.data;
};

/**
 * 导出推送报告
 */
export const exportPushReport = async (id: string): Promise<ExportPushReportResponse> => {
  const response = await client.post<ExportPushReportResponse>(
    `/version-push-tasks/${id}/export`
  );
  return response.data;
};
