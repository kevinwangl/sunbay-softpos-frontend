import axios from 'axios';

export const handleApiError = (error: any): string => {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    switch (status) {
      case 400:
        return message || '请求参数错误';
      case 401:
        return '会话已过期，请重新登录';
      case 403:
        return '没有权限执行此操作';
      case 404:
        return '请求的资源不存在';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return message || '操作失败，请重试';
    }
  }

  if (error.message === 'Network Error') {
    return '网络连接失败，请检查网络设置';
  }

  return '未知错误，请联系管理员';
};
