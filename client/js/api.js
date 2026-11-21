// FINDORA API Client Module
const API_BASE = '/api';

const API = {
  getToken() {
    return localStorage.getItem('findora_token') || localStorage.getItem('saitrace_token') || '';
  },

  setToken(token) {
    if (token) {
      localStorage.setItem('findora_token', token);
      localStorage.setItem('saitrace_token', token);
    } else {
      localStorage.removeItem('findora_token');
      localStorage.removeItem('saitrace_token');
    }
  },

  getUser() {
    const raw = localStorage.getItem('findora_user') || localStorage.getItem('saitrace_user');
    try {
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  setUser(user) {
    if (user) {
      localStorage.setItem('findora_user', JSON.stringify(user));
      localStorage.setItem('saitrace_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('findora_user');
      localStorage.removeItem('saitrace_user');
    }
  },

  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const headers = options.headers || {};

    const token = this.getToken();
    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Do not set Content-Type if sending FormData (browser sets boundary automatically)
    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    options.headers = headers;

    try {
      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  },

  // Auth endpoints
  async login(email, password) {
    const data = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async register(formData) {
    const data = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async demoLogin(role) {
    const data = await this.request(`/auth/demo/${role}`, {
      method: 'POST'
    });
    this.setToken(data.token);
    this.setUser(data.user);
    return data;
  },

  async getMe() {
    return this.request('/auth/me');
  },

  logout() {
    this.setToken(null);
    this.setUser(null);
  },

  // Items endpoints
  async getItems(filters = {}) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(filters)) {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/items${query}`);
  },

  async getItemById(id) {
    return this.request(`/items/${id}`);
  },

  async createItem(formData) {
    return this.request('/items', {
      method: 'POST',
      body: formData
    });
  },

  async updateItem(id, data) {
    const isFormData = data instanceof FormData;
    return this.request(`/items/${id}`, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data)
    });
  },

  async deleteItem(id) {
    return this.request(`/items/${id}`, {
      method: 'DELETE'
    });
  },

  async getMyItems() {
    return this.request('/items/my-items');
  },

  async getReceivedItems(filters = {}) {
    const params = new URLSearchParams();
    for (const [key, val] of Object.entries(filters)) {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, val);
      }
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request(`/items/received${query}`);
  },

  async getMatchSuggestions(params = {}) {
    const q = new URLSearchParams(params).toString();
    return this.request(`/items/match-suggestions?${q}`);
  },

  // Claims endpoints
  async submitClaim(formData) {
    return this.request('/claims', {
      method: 'POST',
      body: formData
    });
  },

  async getMyClaims() {
    return this.request('/claims/my-claims');
  },

  async getAllClaims(status = 'all') {
    return this.request(`/claims/admin/all?status=${status}`);
  },

  async getClaimsForItem(itemId) {
    return this.request(`/claims/item/${itemId}`);
  },

  async updateClaimStatus(claimId, status, reviewNotes) {
    return this.request(`/claims/${claimId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reviewNotes })
    });
  },

  async confirmHandover(claimId, handoverNotes = '') {
    return this.request(`/claims/${claimId}/handover`, {
      method: 'PATCH',
      body: JSON.stringify({ handoverNotes })
    });
  },

  async submitFeedback(claimId, rating, feedback = '') {
    return this.request(`/claims/${claimId}/feedback`, {
      method: 'POST',
      body: JSON.stringify({ rating, feedback })
    });
  },

  // FINDORA Heroes & Leaderboard
  async getLeaderboard() {
    return this.request('/heroes/leaderboard');
  },

  async getHeroesStats() {
    return this.request('/heroes/stats');
  },

  async getRewardLogs() {
    return this.request('/heroes/admin/logs');
  },

  // Notifications
  async getNotifications() {
    return this.request('/notifications');
  },

  async markNotificationRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: 'PATCH'
    });
  },

  async markAllNotificationsRead() {
    return this.request('/notifications/read-all', {
      method: 'PATCH'
    });
  },

  // Stats / Dashboard
  async getDashboardStats() {
    return this.request('/stats/dashboard');
  }
};
