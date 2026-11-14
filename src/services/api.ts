/**
 * GVKSS Frontend API Client
 * Seamlessly interfaces with the production-ready Node/Express/MongoDB backend.
 */

const BASE_URL = '/api/v1';

let accessTokenMemory: string | null = null;
let adminAccessTokenMemory: string | null = null;

export function setAccessToken(token: string | null) {
  accessTokenMemory = token;
}

export function setAdminAccessToken(token: string | null) {
  adminAccessTokenMemory = token;
}

export function getAccessToken(): string | null {
  return accessTokenMemory;
}

export function getAdminAccessToken(): string | null {
  return adminAccessTokenMemory;
}

let isRefreshingCustomerToken = false;
let refreshSubscribers: Array<(token: string | null) => void> = [];

function onCustomerTokenRefreshed(token: string | null) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(callback: (token: string | null) => void) {
  refreshSubscribers.push(callback);
}

interface FetchOptions extends RequestInit {
  isAdmin?: boolean;
  _retry?: boolean;
}

async function request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');

  const token = options.isAdmin ? adminAccessTokenMemory : accessTokenMemory;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Includes HttpOnly session cookies
  });

  // Handle automatic customer token refresh on 401
  if (
    response.status === 401 &&
    !options.isAdmin &&
    !options._retry &&
    !endpoint.includes('/auth/login') &&
    !endpoint.includes('/auth/register') &&
    !endpoint.includes('/auth/session') &&
    !endpoint.includes('/auth/refresh-token')
  ) {
    if (isRefreshingCustomerToken) {
      return new Promise<T>((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          if (!newToken) {
            reject(new Error('Session expired. Please log in again.'));
            return;
          }
          options._retry = true;
          request<T>(endpoint, options).then(resolve).catch(reject);
        });
      });
    }

    isRefreshingCustomerToken = true;
    try {
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
      });
      const refreshData = await refreshRes.json().catch(() => null);
      if (refreshRes.ok && refreshData?.data?.accessToken) {
        setAccessToken(refreshData.data.accessToken);
        onCustomerTokenRefreshed(refreshData.data.accessToken);
        isRefreshingCustomerToken = false;
        options._retry = true;
        return request<T>(endpoint, options);
      } else {
        setAccessToken(null);
        onCustomerTokenRefreshed(null);
        isRefreshingCustomerToken = false;
      }
    } catch {
      setAccessToken(null);
      onCustomerTokenRefreshed(null);
      isRefreshingCustomerToken = false;
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.message || data?.errors?.[0]?.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // ==========================================
  // CUSTOMER AUTHENTICATION
  // ==========================================
  auth: {
    getSession: async () => {
      const res: any = await request('/auth/session');
      if (res?.data?.accessToken) setAccessToken(res.data.accessToken);
      return res;
    },
    refreshToken: async () => {
      const res: any = await request('/auth/refresh-token', { method: 'POST' });
      if (res?.data?.accessToken) setAccessToken(res.data.accessToken);
      return res;
    },
    register: async (payload: { fullName: string; email: string; password: string; phone: string }) => {
      const res: any = await request('/auth/register', { method: 'POST', body: JSON.stringify(payload) });
      if (res?.data?.accessToken) setAccessToken(res.data.accessToken);
      return res;
    },
    login: async (payload: { email: string; password: string }) => {
      const res: any = await request('/auth/login', { method: 'POST', body: JSON.stringify(payload) });
      if (res?.data?.accessToken) setAccessToken(res.data.accessToken);
      return res;
    },
    logout: async () => {
      try {
        await request('/auth/logout', { method: 'POST' });
      } finally {
        setAccessToken(null);
      }
    },
    getMe: async () => {
      return request<any>('/users/me');
    },
    updateProfile: async (payload: { fullName?: string; phone?: string }) => {
      return request<any>('/users/me', { method: 'PUT', body: JSON.stringify(payload) });
    },
    forgotPassword: async (email: string) => {
      return request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) });
    },
  },

  // ==========================================
  // CATALOG & PRODUCTS
  // ==========================================
  catalog: {
    getCategories: async () => {
      return request<any>('/categories');
    },
    getProducts: async (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
      return request<any>(`/products${query}`);
    },
    getProduct: async (idOrSlug: string) => {
      return request<any>(`/products/${idOrSlug}`);
    },
    getFeatured: async () => {
      return request<any>('/products/featured');
    },
  },

  // ==========================================
  // PERSISTENT CART
  // ==========================================
  cart: {
    getCart: async () => {
      return request<any>('/cart');
    },
    addItem: async (productId: string, quantity: number = 1) => {
      return request<any>('/cart/items', { method: 'POST', body: JSON.stringify({ productId, quantity }) });
    },
    updateQuantity: async (productId: string, quantity: number) => {
      return request<any>(`/cart/items/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) });
    },
    removeItem: async (productId: string) => {
      return request<any>(`/cart/items/${productId}`, { method: 'DELETE' });
    },
    clearCart: async () => {
      return request<any>('/cart', { method: 'DELETE' });
    },
    sync: async (items: Array<{ id: string; quantity: number }>) => {
      return request<any>('/cart/sync', { method: 'POST', body: JSON.stringify({ items }) });
    },
  },

  // ==========================================
  // CHECKOUT & ORDERS
  // ==========================================
  checkout: {
    calculateTotals: async (items: any[], couponCode?: string, pinCode?: string) => {
      return request<any>('/checkout/calculate', {
        method: 'POST',
        body: JSON.stringify({ items, couponCode, pinCode }),
      });
    },
    placeOrder: async (payload: {
      shippingAddress: any;
      items: any[];
      paymentMethod: 'UPI' | 'COD';
      couponCode?: string;
    }) => {
      return request<any>('/checkout/place-order', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    },
  },

  // ==========================================
  // PAYMENTS & UPI VERIFICATION
  // ==========================================
  payments: {
    getUpiInfo: async () => {
      return request<any>('/payments/upi-info');
    },
    submitUtr: async (orderNumber: string, utrNumber: string) => {
      return request<any>('/payments/submit-utr', {
        method: 'POST',
        body: JSON.stringify({ orderNumber, utrNumber }),
      });
    },
  },

  // ==========================================
  // ORDERS & RECEIPT TRACKING
  // ==========================================
  orders: {
    getMyOrders: async () => {
      return request<any>('/orders/my-orders');
    },
    getByNumber: async (orderNumber: string) => {
      return request<any>(`/orders/${orderNumber}`);
    },
    cancelOrder: async (orderNumber: string, reason?: string) => {
      return request<any>(`/orders/${orderNumber}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
    },
  },

  // ==========================================
  // STORE PUBLIC SETTINGS
  // ==========================================
  settings: {
    getPublic: async () => {
      return request<any>('/settings/public');
    },
  },

  // ==========================================
  // ADMIN PORTAL
  // ==========================================
  admin: {
    login: async (payload: { email: string; password: string; mfaToken?: string }) => {
      const res: any = await request('/admin/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
      if (res?.data?.accessToken) setAdminAccessToken(res.data.accessToken);
      return res;
    },
    getSession: async () => {
      const res: any = await request('/admin/auth/session', { isAdmin: true });
      if (res?.data?.accessToken) setAdminAccessToken(res.data.accessToken);
      return res;
    },
    getDashboardStats: async () => {
      return request<any>('/admin/dashboard/stats', { isAdmin: true });
    },
    getInventory: async () => {
      return request<any>('/admin/inventory', { isAdmin: true });
    },
    addStock: async (productId: string, quantity: number, referenceNote?: string) => {
      return request<any>(`/admin/inventory/${productId}/add`, {
        method: 'POST',
        body: JSON.stringify({ quantity, referenceNote }),
        isAdmin: true,
      });
    },
    getOrders: async (params?: Record<string, any>) => {
      const query = params ? `?${new URLSearchParams(params as any).toString()}` : '';
      return request<any>(`/admin/orders${query}`, { isAdmin: true });
    },
    getOrderDetail: async (id: string) => {
      return request<any>(`/admin/orders/${id}`, { isAdmin: true });
    },
    updateOrderStatus: async (id: string, status: string, comment?: string) => {
      return request<any>(`/admin/orders/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, comment }),
        isAdmin: true,
      });
    },
    updateTracking: async (id: string, courierName: string, trackingNumber: string) => {
      return request<any>(`/admin/orders/${id}/tracking`, {
        method: 'PUT',
        body: JSON.stringify({ courierName, trackingNumber }),
        isAdmin: true,
      });
    },
    getPendingPayments: async () => {
      return request<any>('/admin/payments/pending', { isAdmin: true });
    },
    confirmPayment: async (paymentId: string, notes?: string) => {
      return request<any>(`/admin/payments/${paymentId}/confirm`, {
        method: 'POST',
        body: JSON.stringify({ notes }),
        isAdmin: true,
      });
    },
    rejectPayment: async (paymentId: string, reason: string) => {
      return request<any>(`/admin/payments/${paymentId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
        isAdmin: true,
      });
    },
    createProduct: async (productData: any) => {
      return request<any>('/admin/products', {
        method: 'POST',
        body: JSON.stringify(productData),
        isAdmin: true,
      });
    },
    updateProduct: async (id: string, productData: any) => {
      return request<any>(`/admin/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
        isAdmin: true,
      });
    },
    deleteProduct: async (id: string) => {
      return request<any>(`/admin/products/${id}`, {
        method: 'DELETE',
        isAdmin: true,
      });
    },
    adjustInventory: async (productId: string, quantity: number, reason: string) => {
      return request<any>(`/admin/inventory/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ quantity, reason }),
        isAdmin: true,
      });
    },
    getCustomers: async (search?: string, page = 1) => {
      const q = search ? `?search=${encodeURIComponent(search)}&page=${page}` : `?page=${page}`;
      return request<any>(`/admin/customers${q}`, { isAdmin: true });
    },
    toggleCustomerStatus: async (id: string, status: 'active' | 'suspended') => {
      return request<any>(`/admin/customers/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status }),
        isAdmin: true,
      });
    },
    getSettings: async () => {
      return request<any>('/admin/settings', { isAdmin: true });
    },
    updateSettings: async (settingsData: any) => {
      return request<any>('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData),
        isAdmin: true,
      });
    },
    getAuditLogs: async (page = 1) => {
      return request<any>(`/admin/audit-logs?page=${page}`, { isAdmin: true });
    },
  },
};
