// Token management
export function setToken(token: string) {
  localStorage.setItem('auth_token', token);
}

export function getToken(): string | null {
  return localStorage.getItem('auth_token');
}

export function removeToken() {
  localStorage.removeItem('auth_token');
}

// API request helper with token
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();
  if (!token) {
    throw new Error('No authentication token found');
  }

  const headers = {
    ...options.headers,
    'Authorization': `Bearer ${token}`,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // If we get a 401, clear the token
  if (response.status === 401) {
    removeToken();
  }

  return response;
}

// Helper functions for JWT management
export const getAuthToken = () => localStorage.getItem('token');
export const setAuthToken = (token: string) => localStorage.setItem('token', token);
export const removeAuthToken = () => localStorage.removeItem('token');

// Helper to add auth header to fetch requests
export const authHeaders = () => ({
  'Authorization': `Bearer ${getAuthToken()}`,
  'Content-Type': 'application/json'
}); 