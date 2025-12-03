import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import { Transaction, TransactionFilters, PaginatedResponse } from '@/types';

export const transactionsApi = {
  // 获取交易列表
  getTransactions: async (
    filters: TransactionFilters
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await apiClient.get<{ items: any[]; total: number }>(
      API_PATHS.TRANSACTIONS.LIST,
      { params: filters }
    );

    // 后端现在直接返回 {items, total}，字段已经是 camelCase
    const apiData = response.data;
    return {
      items: apiData.items.map((tx: any) => ({
        id: tx.id,
        deviceId: tx.deviceId,
        type: tx.type,
        amount: tx.amount,
        currency: tx.currency,
        status: tx.status,
        authCode: tx.authCode,
        timestamp: tx.timestamp,
        cardNumberMasked: tx.cardNumberMasked,
        healthCheckId: tx.healthCheckId || '',
        securityScore: tx.securityScore || 0,
        errorMessage: tx.errorMessage,
        errorCode: tx.errorCode,
        clientIp: tx.clientIp,
        latitude: tx.latitude,
        longitude: tx.longitude,
        locationAccuracy: tx.locationAccuracy,
        locationTimestamp: tx.locationTimestamp,
      })),
      total: apiData.total,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
    };
  },

  // 获取交易详情
  getTransactionById: async (id: string): Promise<Transaction> => {
    const response = await apiClient.get<any>(
      API_PATHS.TRANSACTIONS.DETAIL(id)
    );
    // 后端直接返回 TransactionResponse，字段已经是 camelCase
    const tx = response.data;
    return {
      id: tx.id,
      deviceId: tx.deviceId,
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      status: tx.status,
      authCode: tx.authCode,
      timestamp: tx.timestamp,
      cardNumberMasked: tx.cardNumberMasked,
      healthCheckId: tx.healthCheckId || '',
      securityScore: tx.securityScore || 0,
      errorMessage: tx.errorMessage,
      errorCode: tx.errorCode,
      clientIp: tx.clientIp,
      latitude: tx.latitude,
      longitude: tx.longitude,
      locationAccuracy: tx.locationAccuracy,
      locationTimestamp: tx.locationTimestamp,
    };
  },
};
