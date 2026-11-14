/**
 * GVKSS Admin Portal Dedicated API Client
 * Interfaces with the centralized backend API: https://api.YOURDOMAIN.com/api/v1
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

let adminAccessTokenMemory: string | null = null;

export function setAdminAccessToken(token: string | null) {
  adminAccessTokenMemory = token;
}

export function getAdminAccessToken(): string | null {
  return adminAccessTokenMemory;
}

let isRefreshingAdminToken = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onAdminTokenRefreshed(token: string | null) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string | null) => void) {
  refreshSubscribers.push(callback);
}

interface FetchOptions extends RequestInit {
  _retry?: boolean;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  if (adminAccessTokenMemory) {
    headers.set('Authorization', `Bearer ${adminAccessTokenMemory}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes HttpOnly session cookie: gvkss_admin_refresh
  });

  // Handle automatic admin token refresh on 401
  if (
    response.status === 401 &&
    !options._retry &&
    !endpoint.includes('/admin/auth/login') &&
    !endpoint.includes('/admin/auth/session')
  ) {
    if (isRefreshingAdminToken) {
      return new Promise<T>((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          if (!newToken) {
            reject(new Error('Admin session expired. Please sign in again.'));
            return;
          }
          options._retry = true;
          request<T>(endpoint, options).then(resolve).catch(reject);
        });
      });
    }

    isRefreshingAdminToken = true;
    try {
      const refreshRes = await fetch(`${BASE_URL}/admin/auth/session`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
      });
      const refreshData = await refreshRes.json().catch(() => null);
      if (refreshRes.ok && refreshData?.data?.accessToken) {
        setAdminAccessToken(refreshData.data.accessToken);
        onAdminTokenRefreshed(refreshData.data.accessToken);
        isRefreshingAdminToken = false;
        options._retry = true;
        return request<T>(endpoint, options);
      } else {
        setAdminAccessToken(null);
        onAdminTokenRefreshed(null);
        isRefreshingAdminToken = false;
      }
    } catch {
      setAdminAccessToken(null);
      onAdminTokenRefreshed(null);
      isRefreshingAdminToken = false;
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors?.[0]?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const adminApi = {
  // Authentication
  login: async (payload: { email: string; password: string; mfaToken?: string }) => {
    const res: any = await request('/admin/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    if (res?.data?.accessToken) {
      setAdminAccessToken(res.data.accessToken);
    }
    return res;
  },
  getSession: async () => {
    const res: any = await request('/admin/auth/session', { method: 'GET' });
    if (res?.data?.accessToken) {
      setAdminAccessToken(res.data.accessToken);
    }
    return res;
  },
  logout: async () => {
    try {
      await request('/admin/auth/logout', { method: 'POST' });
    } finally {
      setAdminAccessToken(null);
    }
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    return request<any>('/admin/dashboard/stats');
  },

  // Inventory & Stock
  getInventory: async () => {
    return request<any>('/admin/inventory');
  },
  addStock: async (productId: string, quantity: number, referenceNote?: string) => {
    return request<any>(`/admin/inventory/${productId}/add`, {
      method: 'POST',
      body: JSON.stringify({ quantity, referenceNote }),
    });
  },
  adjustInventory: async (productId: string, quantity: number, reason: string) => {
    return request<any>(`/admin/inventory/${productId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity, reason }),
    });
  },

  // Orders Management
  getOrders: async (params?: Record<string, any>) => {
    const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    return request<any>(`/admin/orders${query}`);
  },
  getOrderDetail: async (id: string) => {
    return request<any>(`/admin/orders/${id}`);
  },
  updateOrderStatus: async (id: string, status: string, comment?: string) => {
    return request<any>(`/admin/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, comment }),
    });
  },
  updateTracking: async (id: string, courierName: string, trackingNumber: string, estimatedDelivery?: string) => {
    return request<any>(`/admin/orders/${id}/tracking`, {
      method: 'PUT',
      body: JSON.stringify({ courierName, trackingNumber, estimatedDelivery }),
    });
  },

  // Payments & Manual Verification
  getPendingPayments: async () => {
    return request<any>('/admin/payments/pending');
  },
  confirmPayment: async (paymentId: string, notes?: string) => {
    return request<any>(`/admin/payments/${paymentId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  },
  rejectPayment: async (paymentId: string, reason: string) => {
    return request<any>(`/admin/payments/${paymentId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },

  // Products CRUD
  getProducts: async () => {
    return request<any>('/admin/products');
  },
  createProduct: async (productData: any) => {
    return request<any>('/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },
  updateProduct: async (id: string, productData: any) => {
    return request<any>(`/admin/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },
  deleteProduct: async (id: string) => {
    return request<any>(`/admin/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Customers Management
  getCustomers: async (search?: string, page = 1) => {
    const q = search ? `?search=${encodeURIComponent(search)}&page=${page}` : `?page=${page}`;
    return request<any>(`/admin/customers${q}`);
  },
  toggleCustomerStatus: async (id: string, status: 'active' | 'suspended') => {
    return request<any>(`/admin/customers/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  // Business & Store Settings
  getSettings: async () => {
    return request<any>('/admin/settings');
  },
  updateSettings: async (settingsData: any) => {
    return request<any>('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify(settingsData),
    });
  },

  // Audit Logs
  getAuditLogs: async (page = 1) => {
    return request<any>(`/admin/audit-logs?page=${page}`);
  },
};
