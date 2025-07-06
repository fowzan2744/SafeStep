// API Configuration
const API_BASE_URL = 'https://safestep-backend.onrender.com/api'||'http://localhost:5000/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  REGISTER: `${API_BASE_URL}/auth/register`,
  LOGIN: `${API_BASE_URL}/auth/login`,
  VERIFY_OTP: `${API_BASE_URL}/auth/verify-otp`,
  RESEND_OTP: `${API_BASE_URL}/auth/send-otp`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  SEND_RESET_PASSWORD_OTP: `${API_BASE_URL}/auth/send-reset-password-otp`,
  VERIFY_RESET_PASSWORD_OTP: `${API_BASE_URL}/auth/verify-reset-password-otp`,
};

// User endpoints
export const USER_ENDPOINTS = {
  DASHBOARD_STATS: `${API_BASE_URL}/user/dashboard-stats`,
};

// Emergency contacts endpoints
export const EMERGENCY_CONTACTS_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/emergency-contacts`,
  ADD: `${API_BASE_URL}/emergency-contacts`,
  DELETE: (id) => `${API_BASE_URL}/emergency-contacts/${id}`,
};

// Emergency alerts endpoints
export const EMERGENCY_ALERTS_ENDPOINTS = {
  SEND: `${API_BASE_URL}/emergency-alerts`,
};

// Emergency services endpoints
export const EMERGENCY_SERVICES_ENDPOINTS = {
  GET_NEARBY: `${API_BASE_URL}/emergency-services/nearby`,
};

// Default axios configuration
export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to create API URL with query parameters
export const createApiUrl = (baseUrl, params = {}) => {
  const url = new URL(baseUrl);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
}; 