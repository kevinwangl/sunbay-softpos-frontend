export type DeviceStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REVOKED';
export type TEEType = 'QTEE' | 'TrustZone';

export interface Device {
  id: string;
  imei: string;
  model: string;
  osVersion: string;
  teeType: TEEType;
  status: DeviceStatus;
  merchantId: string;
  merchantName: string;
  securityScore: number;
  registeredAt: string;
  lastActiveAt: string;
  keyInfo: KeyInfo;
}

export interface KeyInfo {
  currentKsn: string;
  ipekInjectedAt: string;
  remainingCount: number;
  totalCount: number;
}

export interface DeviceFilters {
  status?: DeviceStatus;
  merchantId?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}
