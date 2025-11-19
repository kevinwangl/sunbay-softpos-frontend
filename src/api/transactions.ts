import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import { Transaction, TransactionFilters, PaginatedResponse, ApiResponse } from '@/types';

export const transactionsApi = {
  // 获取交易列表
  getTransactions: async (
    filters: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Transaction>>>(
      API_PATHS.TRANSACTIONS.LIST,
      { params: filters }
    );
    return response.data.data;
  },

  // 获取交易详情
  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<ApiResponse<Transaction>>(
      API_PATHS.TRANSACTIONS.DETAIL(id)
    );
    return response.data.data;
  },
};
