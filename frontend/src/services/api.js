const API_BASE = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'An unexpected error occurred');
  }
  return data;
};

export const api = {
  // Auth
  login: async (credentials) => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });
    return handleResponse(res);
  },

  register: async (userData) => {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  getMe: async () => {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  updatePassword: async (passwords) => {
    const res = await fetch(`${API_BASE}/auth/password`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(passwords),
    });
    return handleResponse(res);
  },

  // Stores & Ratings
  getStores: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/stores${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  submitRating: async (storeId, rating) => {
    const res = await fetch(`${API_BASE}/stores/${storeId}/rate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ rating }),
    });
    return handleResponse(res);
  },

  getOwnerDashboard: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/stores/owner/dashboard${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  // Admin
  getAdminStats: async () => {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  adminAddUser: async (userData) => {
    const res = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(res);
  },

  adminAddStore: async (storeData) => {
    const res = await fetch(`${API_BASE}/admin/stores`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(storeData),
    });
    return handleResponse(res);
  },

  adminGetUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/users${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },

  adminGetStores: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/admin/stores${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(res);
  },
};
