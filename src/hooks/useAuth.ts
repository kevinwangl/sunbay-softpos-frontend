import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@/api/auth';
import { useAuthStore } from '@/stores/authStore';
import { LoginRequest } from '@/types';
import { handleApiError } from '@/utils/errorHandler';

export const useLogin = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token, data.refreshToken);
      message.success('登录成功');
      navigate('/dashboard');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      logout();
      navigate('/login');
      message.success('已退出登录');
    },
    onError: (error) => {
      message.error(handleApiError(error));
    },
  });
};
