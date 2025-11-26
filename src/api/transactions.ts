import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import { Transaction, TransactionFilters, PaginatedResponse, ApiResponse } from '@/types';

export const transactionsApi = {
  // 获取交易列表
  getTransactions: async (
    filters: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<ApiResponse<{ transactions: any[]; total: number }>>(
      API_PATHS.TRANSACTIONS.LIST,
      { params: filters }
    );

    // Transform API response (snake_case) to frontend format (camelCase)
    const apiData = response.data.data;
    return {
      items: apiData.transactions.map((tx: any) => ({
        id: tx.id,
        deviceId: tx.device_id,
        type: tx.transaction_type,
        amount: tx.amount,
        currency: tx.currency,
        status: tx.status,
        authCode: tx.authorization_code,
        timestamp: tx.created_at,
        healthCheckId: tx.health_check_id || '',
        securityScore: tx.security_score || 0,
        errorMessage: tx.error_message,
        errorCode: tx.error_code,
      })),
      total: apiData.total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
    };
  },

  // 获取交易详情
  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<ApiResponse<Transaction>>(
      API_PATHS.TRANSACTIONS.DETAIL(id)
    );
    return response.data.data;
  },
};
