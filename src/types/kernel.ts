/**
 * Kernel类型定义
 */

export interface Kernel {
  id: string;
  version: string;
  file_path: string;
  file_hash: string;
  file_size: number;
  status: KernelStatus;
  created_at: string;
  updated_at: string;
}

export type KernelStatus = 'draft' | 'stable' | 'deprecated';

export interface UploadKernelRequest {
  file: File;
  version: string;
}

export interface UploadKernelResponse {
  id: string;
  version: string;
  download_url: string;
}

export interface ListKernelsParams {
  status?: KernelStatus;
}
