export type ThreatType = 'Root' | 'Hook' | 'Debug' | 'Repack';
export type ThreatSeverity = 'HIGH' | 'MEDIUM' | 'LOW';
export type ThreatStatus = 'PENDING' | 'RESOLVED';

export interface ThreatEvent {
  id: string;
  deviceId: string;
  type: ThreatType;
  severity: ThreatSeverity;
  status: ThreatStatus;
  detectedAt: string;
  description: string;
  detectionData: Record<string, any>;
  resolution?: ThreatResolution;
}

export interface ThreatResolution {
  resolvedBy: string;
  resolvedAt: string;
  notes: string;
}

export interface ThreatFilters {
  type?: ThreatType;
  severity?: ThreatSeverity;
  status?: ThreatStatus;
  page?: number;
  pageSize?: number;
}
