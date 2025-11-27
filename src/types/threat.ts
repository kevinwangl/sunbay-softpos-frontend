export type ThreatType =
  | 'ROOT_DETECTION'
  | 'BOOTLOADER_UNLOCK'
  | 'SYSTEM_TAMPER'
  | 'APP_TAMPER'
  | 'TEE_COMPROMISE'
  | 'LOW_SECURITY_SCORE'
  | 'CONSECUTIVE_LOW_SCORES'
  | 'OTHER';

export type ThreatSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ThreatStatus = 'ACTIVE' | 'RESOLVED';

export interface ThreatEvent {
  id: string;
  deviceId: string;
  type: ThreatType;
  severity: ThreatSeverity;
  status: ThreatStatus;
  detectedAt: string;
  description: string;
  // detectionData: Record<string, any>; // Backend doesn't return this
  resolution?: ThreatResolution;
}

export interface ThreatResolution {
  resolvedBy: string;
  resolvedAt: string;
  notes?: string; // Backend doesn't return this in list, but might be useful if added later
}

export interface ThreatFilters {
  type?: ThreatType;
  severity?: ThreatSeverity;
  status?: ThreatStatus;
  page?: number;
  pageSize?: number;
}
