import { useQuery } from '@tanstack/react-query';
import { transactionsApi } from '@/api/transactions';
import { TransactionFilters } from '@/types';

// 获取交易列表
export const useTransactions = (filters: TransactionFilters) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: async () => {
      console.log('useTransactions: 开始获取交易列表', filters);
      try {
        const data = await transactionsApi.getTransactions(filters);
        console.log('useTransactions: 获取交易列表成功', data);
        return data;
      } catch (error) {
        console.error('useTransactions: 获取交易列表失败', error);
        throw error;
      }
    },
  });
};

// 获取交易详情
export const useTransactionDetail = (id: string) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionsApi.getTransactionById(id),
    enabled: !!id,
  });
};
