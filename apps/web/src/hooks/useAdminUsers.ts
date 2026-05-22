import useSWR from 'swr';
import { adminApi, AdminUsersListResponse } from '../lib/admin';

export function useAdminUsers(params: {
  page: number;
  limit: number;
  search: string;
  filter: string;
}) {
  const cacheKey = `/admin/users?page=${params.page}&limit=${params.limit}&search=${encodeURIComponent(
    params.search
  )}&filter=${params.filter}`;

  return useSWR<AdminUsersListResponse>(
    cacheKey,
    () => adminApi.getUsers(params),
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000, // short cache for active dynamic operations
    }
  );
}
