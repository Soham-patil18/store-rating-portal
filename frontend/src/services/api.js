import { localBackend } from './localBackend';

const API_BASE = import.meta.env.VITE_API_URL || '';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Safe request wrapper that tries remote API if configured, and falls back to localBackend
async function safeRequest(remoteCall, localCall) {
  // If no explicit remote API host is configured and we are running in production/Vercel
  // or if remote fails, seamlessly fall back to localBackend
  if (API_BASE) {
    try {
      const res = await remoteCall();
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Server request failed');
        }
        return data;
      }
    } catch (err) {
      console.warn('Remote API request failed, delegating to client-side storage:', err.message);
    }
  }

  // Fallback to local persistent storage engine
  return await localCall();
}

export const api = {
  // Auth
  login: async (credentials) => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(credentials),
        }),
      () => localBackend.login(credentials)
    );
  },

  register: async (userData) => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        }),
      () => localBackend.register(userData)
    );
  },

  getMe: async () => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/auth/me`, {
          headers: getAuthHeaders(),
        }),
      () => localBackend.getMe()
    );
  },

  updatePassword: async (passwords) => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/auth/password`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify(passwords),
        }),
      () => localBackend.updatePassword(passwords)
    );
  },

  // Stores & Ratings
  getStores: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/stores${query ? `?${query}` : ''}`, {
          headers: getAuthHeaders(),
        }),
      () => localBackend.getStores(params)
    );
  },

  submitRating: async (storeId, rating) => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/stores/${storeId}/rate`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ rating }),
        }),
      () => localBackend.submitRating(storeId, rating)
    );
  },

  getOwnerDashboard: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/stores/owner/dashboard${query ? `?${query}` : ''}`, {
          headers: getAuthHeaders(),
        }),
      () => localBackend.getOwnerDashboard(params)
    );
  },

  // Admin
  getAdminStats: async () => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/admin/stats`, {
          headers: getAuthHeaders(),
        }),
      () => localBackend.getAdminStats()
    );
  },

  adminAddUser: async (userData) => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/admin/users`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(userData),
        }),
      () => localBackend.adminAddUser(userData)
    );
  },

  adminAddStore: async (storeData) => {
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/admin/stores`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(storeData),
        }),
      () => localBackend.adminAddStore(storeData)
    );
  },

  adminGetUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/admin/users${query ? `?${query}` : ''}`, {
          headers: getAuthHeaders(),
        }),
      () => localBackend.adminGetUsers(params)
    );
  },

  adminGetStores: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return safeRequest(
      () =>
        fetch(`${API_BASE}/api/admin/stores${query ? `?${query}` : ''}`, {
          headers: getAuthHeaders(),
        }),
      () => localBackend.adminGetStores(params)
    );
  },
};
