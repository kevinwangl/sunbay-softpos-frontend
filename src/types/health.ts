export type RecommendedAction = 'PROCEED' | 'WARN' | 'BLOCK';

export interface HealthCheck {
  id: string;
  deviceId: string;
  timestamp: string;
  securityScore: number;
  checks: {
    root: CheckResult;
    hook: CheckResult;
    debug: CheckResult;
    tee: CheckResult;
  };
  recommendedAction: RecommendedAction;
  threats: string[];
}

export interface CheckResult {
  passed: boolean;
  details: string;
}

export interface HealthOverview {
  totalDevices: number;
  onlineDevices: number;
  abnormalDevices: number;
  averageSecurityScore: number;
  statusDistribution: StatusDistribution[];
  scoreDistribution: ScoreDistribution[];
  recentAbnormalDevices: AbnormalDevice[];
}

export interface StatusDistribution {
  status: string;
  count: number;
}

export interface ScoreDistribution {
  range: string;
  count: number;
}

export interface AbnormalDevice {
  id: string;
  merchantName: string;
  securityScore: number;
  lastCheckAt: string;
}
