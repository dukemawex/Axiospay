import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useRates() {
  const { data, isLoading } = useQuery({
    queryKey: ['rates'],
    queryFn: async () => {
      const res = await api.get<{ data: Record<string, string> }>('/rates');
      return res.data.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  return { rates: data ?? {}, isLoading };
}
