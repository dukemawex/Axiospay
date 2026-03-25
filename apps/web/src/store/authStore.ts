import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { setToken, removeToken } from '@/lib/auth';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await api.post<{ data: { token: string; user: User } }>('/auth/login', { email, password });
          const { token, user } = res.data.data;
          setToken(token);
          set({ token, user, isLoading: false });
        } catch (err) {
          set({ isLoading: false });
          throw err;
        }
      },

      logout: () => {
        removeToken();
        set({ user: null, token: null });
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: 'axiospay-auth',
      partialize: (state) => ({ token: state.token, user: state.user }),
    },
  ),
);
