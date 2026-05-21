const BASE = '/auth';

export const authService = {
  refresh(): Promise<Response> {
    return fetch(`${BASE}/refresh`, { method: 'POST', credentials: 'include' });
  },
  me(token: string): Promise<Response> {
    return fetch(`${BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  logout(): Promise<Response> {
    return fetch(`${BASE}/logout`, { method: 'POST', credentials: 'include' });
  },
};
