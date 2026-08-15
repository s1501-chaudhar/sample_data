/**
 * Progress Notes - Centralized API HTTP Client
 * Configured for FastAPI backend (app.api.phase3.*)
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getAuthToken() {
    return sessionStorage.getItem('pn_token') || '';
  }

  getHeaders(customHeaders = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...customHeaders,
    };
    const token = this.getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    const config = {
      ...options,
      headers: this.getHeaders(options.headers),
    };

    try {
      const response = await fetch(url, config);

      if (response.status === 401) {
        // Token expired or unauthorized
        sessionStorage.removeItem('pn_token');
        sessionStorage.removeItem('pn_role');
        sessionStorage.removeItem('pn_user');
      }

      if (!response.ok) {
        let errorData = {};
        try {
          errorData = await response.json();
        } catch {
          errorData = { detail: response.statusText };
        }
        const error = new Error(errorData.detail || errorData.message || `HTTP ${response.status}: ${response.statusText}`);
        error.status = response.status;
        error.data = errorData;
        throw error;
      }

      return await response.json();
    } catch (err) {
      console.warn(`[API Client] Request to ${url} failed:`, err.message);
      throw err;
    }
  }

  get(endpoint, params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value != null && value !== '') {
        query.append(key, value);
      }
    });
    const queryString = query.toString();
    const finalEndpoint = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(finalEndpoint, { method: 'GET' });
  }

  post(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  put(endpoint, body = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;
