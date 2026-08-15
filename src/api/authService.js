import apiClient from './client';

/**
 * Authentication Service (FastAPI /auth)
 */
export const authService = {
  /**
   * POST /auth/login
   * Authenticates user and returns JWT / session token and user role
   * @param {string} username - e.g. "dr.sarah" or "lab.user"
   * @param {string} password - user credentials
   * @returns {Promise<{ access_token: string, token_type: string, role: string, name: string }>}
   */
  async login(username, password) {
    const data = await apiClient.post('/auth/login', { username, password });
    if (data?.access_token) {
      sessionStorage.setItem('pn_token', data.access_token);
    }
    return data;
  },

  /**
   * Clears local session
   */
  logout() {
    sessionStorage.removeItem('pn_token');
    sessionStorage.removeItem('pn_role');
    sessionStorage.removeItem('pn_user');
  },
};

export default authService;
