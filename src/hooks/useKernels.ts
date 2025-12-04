/**
 * Kernel管理Hook
 */
import { useState, useCallback } from 'react';
import { message } from 'antd';
import * as kernelApi from '@/api/kernels';
import type { Kernel, KernelStatus } from '@/types/kernel';

export const useKernels = () => {
  const [kernels, setKernels] = useState<Kernel[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  /**
   * 获取内核列表
   */
  const fetchKernels = useCallback(async (status?: KernelStatus) => {
    setLoading(true);
    try {
      const data = await kernelApi.listKernels(status ? { status } : undefined);
      setKernels(data);
    } catch (error: any) {
      message.error(error.response?.data?.message || '获取内核列表失败');
      console.error('Failed to fetch kernels:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * 上传内核
   */
  const uploadKernel = useCallback(async (file: File, version: string) => {
    setUploading(true);
    try {
      const result = await kernelApi.uploadKernel(file, version);
      message.success('内核上传成功');
      await fetchKernels();
      return result;
    } catch (error: any) {
      message.error(error.response?.data?.message || '内核上传失败');
      console.error('Failed to upload kernel:', error);
      throw error;
    } finally {
      setUploading(false);
    }
  }, [fetchKernels]);

  /**
   * 发布内核
   */
  const publishKernel = useCallback(async (version: string) => {
    try {
      await kernelApi.publishKernel(version);
      message.success('内核发布成功');
      await fetchKernels();
    } catch (error: any) {
      message.error(error.response?.data?.message || '内核发布失败');
      console.error('Failed to publish kernel:', error);
      throw error;
    }
  }, [fetchKernels]);

  /**
   * 删除内核
   */
  const deleteKernel = useCallback(async (version: string) => {
    try {
      await kernelApi.deleteKernel(version);
      message.success('内核删除成功');
      await fetchKernels();
    } catch (error: any) {
      message.error(error.response?.data?.message || '内核删除失败');
      console.error('Failed to delete kernel:', error);
      throw error;
    }
  }, [fetchKernels]);

  /**
   * 下载内核
   */
  const downloadKernel = useCallback(async (version: string, filename: string) => {
    try {
      const blob = await kernelApi.downloadKernel(version);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `kernel-${version}.wasm`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('内核下载成功');
    } catch (error: any) {
      message.error(error.response?.data?.message || '内核下载失败');
      console.error('Failed to download kernel:', error);
      throw error;
    }
  }, []);

  return {
    kernels,
    loading,
    uploading,
    fetchKernels,
    uploadKernel,
    publishKernel,
    deleteKernel,
    downloadKernel,
  };
};
