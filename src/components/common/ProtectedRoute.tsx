import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { STORAGE_KEYS } from '@/utils/constants';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, user, setAuth, logout } = useAuthStore();

  useEffect(() => {
    // 检查localStorage中的认证信息
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    const userInfo = localStorage.getItem(STORAGE_KEYS.USER_INFO);
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

    // 如果store中没有认证信息，但localStorage中有，恢复认证状态
    if (!isAuthenticated && token && userInfo && refreshToken) {
      try {
        const parsedUser = JSON.parse(userInfo);
        setAuth(parsedUser, token, refreshToken);
      } catch (error) {
        console.error('Failed to parse user info:', error);
        logout();
      }
    }
    // 如果store中有认证信息，但localStorage中没有token，清除认证状态
    else if (isAuthenticated && !token) {
      logout();
    }
  }, [isAuthenticated, user, setAuth, logout]);

  // 检查是否已认证
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
