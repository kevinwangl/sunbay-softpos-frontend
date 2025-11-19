export type TransactionType = 'SALE' | 'REFUND' | 'QUERY';
export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface Transaction {
  id: string;
  deviceId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  status: TransactionStatus;
  authCode?: string;
  timestamp: string;
  healthCheckId: string;
  securityScore: number;
  errorCode?: string;
  errorMessage?: string;
}

export interface TransactionFilters {
  deviceId?: string;
  transactionId?: string;
  startDate?: string;
  endDate?: string;
  status?: TransactionStatus;
  page?: number;
  pageSize?: number;
}
