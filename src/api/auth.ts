import apiClient from './client';
import { API_PATHS } from '@/utils/constants';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  ApiResponse,
} from '@/types';

export const authApi = {
  // 登录
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      API_PATHS.AUTH.LOGIN,
      data
    );
    return response.data.data;
  },

  // 刷新Token
  refreshToken: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<ApiResponse<RefreshTokenResponse>>(
      API_PATHS.AUTH.REFRESH,
      data
    );
    return response.data.data;
  },

  // 登出
  logout: async (): Promise<void> => {
    await apiClient.post(API_PATHS.AUTH.LOGOUT);
  },
};
