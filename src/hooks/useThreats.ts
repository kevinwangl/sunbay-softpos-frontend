import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import { threatsApi } from '@/api/threats';
import { ThreatFilters, ResolveThreatRequest } from '@/types';
import { handleApiError } from '@/utils/errorHandler';

// 获取威胁事件列表
export const useThreats = (filters: ThreatFilters) => {
  return useQuery({
    queryKey: ['threats', filters],
    queryFn: async () => {
      console.log('useThreats: 开始获取威胁列表', filters);
      try {
        const data = await threatsApi.getThreats(filters);
        console.log('useThreats: 获取威胁列表成功', data);
        return data;
      } catch (error) {
        console.error('useThreats: 获取威胁列表失败', error);
        throw error;
      }
    },
  });
};

// 获取威胁事件详情
export const useThreatDetail = (id: string) => {
  return useQuery({
    queryKey: ['threat', id],
    queryFn: () => threatsApi.getThreatById(id),
    enabled: !!id,
  });
};

// 处理威胁事件
export const useResolveThreat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResolveThreatRequest }) =>
      threatsApi.resolveThreat(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threats'] });
      queryClient.invalidateQueries({ queryKey: ['threat'] });
      message.success('威胁事件已处理');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};
