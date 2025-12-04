/**
 * Kernel API接口
 */
import apiClient from './client';
import type { Kernel, ListKernelsParams, UploadKernelResponse } from '@/types/kernel';

const BASE_URL = '/kernels';

/**
 * 上传内核文件
 */
export const uploadKernel = async (file: File, version: string): Promise<UploadKernelResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('version', version);

  const response = await apiClient.post<UploadKernelResponse>(BASE_URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

/**
 * 获取内核列表
 */
export const listKernels = async (params?: ListKernelsParams): Promise<Kernel[]> => {
  const response = await apiClient.get<Kernel[]>(BASE_URL, { params });
  return response.data;
};

/**
 * 获取内核详情
 */
export const getKernel = async (version: string): Promise<Kernel> => {
  const response = await apiClient.get<Kernel>(`${BASE_URL}/${version}`);
  return response.data;
};

/**
 * 下载内核文件
 */
export const downloadKernel = async (version: string): Promise<Blob> => {
  const response = await apiClient.get(`${BASE_URL}/${version}/download`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * 发布内核版本
 */
export const publishKernel = async (version: string): Promise<void> => {
  await apiClient.post(`${BASE_URL}/${version}/publish`);
};

/**
 * 删除内核
 */
export const deleteKernel = async (version: string): Promise<void> => {
  await apiClient.delete(`${BASE_URL}/${version}`);
};
