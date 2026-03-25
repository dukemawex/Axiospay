import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { api } from '@/lib/api';
import type { User } from '@/types';

export function useAuth() {
  const { user, token, login, logout } = useAuthStore();
  const isAuthenticated = !!token;

  const { data: freshUser } = useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const res = await api.get<{ data: User }>('/users/me');
      return res.data.data;
    },
    enabled: isAuthenticated,
  });

  return {
    user: freshUser ?? user,
    token,
    isAuthenticated,
    login,
    logout,
  };
}
