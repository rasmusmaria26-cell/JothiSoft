import api from './api';

export interface AdminStats {
  totalUsers: number;
  activeTrials: number;
  activePros: number;
  expired: number;
}

export interface UserSubscription {
  plan: 'FREE' | 'PRO';
  expires_at: string | null;
  trial_expires_at: string | null;
  payment_note: string | null;
  created_at: string;
}

export interface UserHistoryLog {
  id: string;
  user_id: string;
  activated_by: string;
  plan: string;
  starts_at: string;
  expires_at: string;
  payment_note: string | null;
  created_at: string;
}

export interface AdminUserDetail {
  id: string;
  name: string | null;
  email: string | null;
  phone: string;
  language: 'ta' | 'en';
  is_admin: boolean;
  created_at: string;
  subscription: UserSubscription | null;
  calculatedStatus: 'TRIAL' | 'PRO' | 'EXPIRED' | 'ADMIN';
  history: UserHistoryLog[];
}

export interface AdminUsersListResponse {
  users: AdminUserDetail[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const adminApi = {
  /**
   * Fetch administrative dashboard metrics
   */
  getStats: async (): Promise<AdminStats> => {
    const res = await api.get('/admin/stats');
    return res.data;
  },

  /**
   * Search and filter registered users in a paginated list
   */
  getUsers: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    filter?: string;
  }): Promise<AdminUsersListResponse> => {
    const queryParts = [];
    if (params.page) queryParts.push(`page=${params.page}`);
    if (params.limit) queryParts.push(`limit=${params.limit}`);
    if (params.search) queryParts.push(`search=${encodeURIComponent(params.search)}`);
    if (params.filter) queryParts.push(`filter=${params.filter}`);
    
    const queryString = queryParts.length ? `?${queryParts.join('&')}` : '';
    const res = await api.get(`/admin/users${queryString}`);
    return res.data;
  },

  /**
   * Retrieve single user details and activation log history
   */
  getUserDetail: async (userId: string): Promise<AdminUserDetail> => {
    const res = await api.get(`/admin/users/${userId}`);
    return res.data;
  },

  /**
   * Manually activate/extend a user's PRO plan by 30 days or Lifetime
   */
  activateUser: async (
    userId: string,
    paymentNote?: string,
    duration?: '30_DAYS' | 'LIFETIME'
  ): Promise<{ plan: string; expires_at: string }> => {
    const res = await api.post(`/admin/users/${userId}/activate`, {
      payment_note: paymentNote,
      duration,
    });
    return res.data;
  },

  /**
   * Promote or demote another user to/from Administrator
   */
  toggleAdminRole: async (
    userId: string
  ): Promise<{ userId: string; is_admin: boolean }> => {
    const res = await api.post(`/admin/users/${userId}/toggle-admin`);
    return res.data;
  },

  /**
   * Retrieve list of users whose subscriptions are expiring in the next 7 days
   */
  getExpiringUsers: async (): Promise<
    (AdminUserDetail & { daysLeft: number })[]
  > => {
    const res = await api.get('/admin/expiring');
    return res.data;
  },
};
