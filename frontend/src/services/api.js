const getDefaultApiUrl = () => {
  if (typeof window === "undefined") return "http://localhost:5000/api";

  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname);
  return isLocalhost ? "http://localhost:5000/api" : `${window.location.origin}/api`;
};

export const API_URL = import.meta.env.VITE_API_URL || getDefaultApiUrl();

export const getAuthToken = () => localStorage.getItem("adminToken");

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const apiFetch = async (endpoint, options = {}) => {
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeaders(),
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
};
