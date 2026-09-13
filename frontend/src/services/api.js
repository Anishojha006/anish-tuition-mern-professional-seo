const DEFAULT_RENDER_API_URL = "https://anish-tuition-mern-professional-seo.onrender.com/api";

const getDefaultApiUrl = () => {
  if (typeof window === "undefined") return DEFAULT_RENDER_API_URL;

  const host = window.location.hostname;
  const isLocalhost = ["localhost", "127.0.0.1"].includes(host);
  const isRenderHost = host.includes("onrender.com") || host.includes("render.com");

  if (isLocalhost) return "http://localhost:5000/api";
  if (isRenderHost) return DEFAULT_RENDER_API_URL;

  return `${window.location.origin}/api`;
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
