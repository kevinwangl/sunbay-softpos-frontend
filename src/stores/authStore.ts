import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';
import { STORAGE_KEYS } from '@/utils/constants';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string, refreshToken: string) => void;
  logout: () => void;
  updateToken: (token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user: User, token: string, refreshToken: string) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        localStorage.setItem(STORAGE_KEYS.USER_INFO, JSON.stringify(user));
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateToken: (token: string) => {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
        set({ token });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      // 在hydration后检查token是否存在
      onRehydrateStorage: () => (state) => {
        if (state) {
          const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
          const user = state.user;
          
          // 如果有user但没有token，或者有token但没有user，清除认证状态
          if ((user && !token) || (!user && token)) {
            state.logout();
          } else if (user && token) {
            // 确保isAuthenticated为true
            state.isAuthenticated = true;
            state.token = token;
          }
        }
      },
    }
  )
);
