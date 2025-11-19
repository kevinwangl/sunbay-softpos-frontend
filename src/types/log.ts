export type AuditLogResult = 'SUCCESS' | 'FAILED';

export interface AuditLog {
  id: string;
  userId: string;
  username: string;
  action: string;
  resource: string;
  resourceId: string;
  ipAddress: string;
  timestamp: string;
  details: Record<string, any>;
  result: AuditLogResult;
}

export interface AuditLogFilters {
  userId?: string;
  action?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  pageSize?: number;
}
