import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/api/dashboard';
import { REFRESH_INTERVALS } from '@/utils/constants';

export const useHealthOverview = () => {
  return useQuery({
    queryKey: ['healthOverview'],
    queryFn: async () => {
      console.log('useDashboard: 开始获取健康概览数据');
      try {
        const data = await dashboardApi.getHealthOverview();
        console.log('useDashboard: 获取健康概览成功', data);
        return data;
      } catch (error) {
        console.error('useDashboard: 获取健康概览失败', error);
        throw error;
      }
    },
    refetchInterval: REFRESH_INTERVALS.DASHBOARD,
  });
};
