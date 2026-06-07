import api from './api';

export interface RetailerCustomer {
  id: string;
  email: string | null;
  phone: string;
  name: string | null;
  activated_at: string;
  expires_at: string | null;
}

export const retailerApi = {
  /**
   * Fetch list of customer accounts registered/activated under this retailer
   */
  getCustomers: async (): Promise<RetailerCustomer[]> => {
    const res = await api.get('/retailer/customers');
    return res.customers;
  },

  /**
   * Register and activate a new customer account directly under this retailer
   */
  createCustomer: async (data: {
    name: string;
    email: string;
    phone: string;
    password?: string;
  }): Promise<{ success: boolean; customer: any }> => {
    const res = await api.post('/retailer/customers/create', data);
    return res;
  },

  /**
   * Search for an existing customer account by exact email ID or phone number
   */
  searchCustomer: async (query: string): Promise<{ success: boolean; user: any }> => {
    const res = await api.get(`/retailer/customers/search?query=${encodeURIComponent(query)}`);
    return res;
  },

  /**
   * Fetch available customers who are unclaimed, non-admin, and in TRIAL/EXPIRED status
   */
  getAvailableCustomers: async (params: { search?: string; page?: number; limit?: number }): Promise<{
    success: boolean;
    customers: any[];
    totalCount: number;
    totalPages: number;
    page: number;
  }> => {
    const queryParams = new URLSearchParams();
    if (params.search) queryParams.append('search', params.search);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    const res = await api.get(`/retailer/customers/available?${queryParams.toString()}`);
    return res;
  },

  /**
   * Upgrade an existing customer account to premium PRO
   */
  upgradeCustomer: async (customerId: string, durationDays: number): Promise<{ success: boolean; customer: any; message?: string }> => {
    const res = await api.post('/retailer/customers/upgrade', { customerId, durationDays });
    return res;
  },
};
