import axios from "axios";
import { clearAuthStorage, getRefreshToken, getToken, updateAccessToken } from "./auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://workbridge-smart-enterprise-platform1.onrender.com/api";
const REFRESH_PATH = import.meta.env.VITE_TOKEN_REFRESH_PATH || "/token/refresh/";

const api = axios.create({ baseURL: API_BASE_URL });
const refreshClient = axios.create({ baseURL: API_BASE_URL });

let refreshPromise = null;

function shouldSkipRefresh(url = "") {
  return url.includes("/login/") || url.includes("/set-password/") || url.includes(REFRESH_PATH);
}

async function fetchNewAccessToken(refreshToken) {
  const candidates = [REFRESH_PATH, "/token/refresh/", "/auth/token/refresh/"];

  for (const path of candidates) {
    try {
      const { data } = await refreshClient.post(path, { refresh: refreshToken });
      if (data?.access) {
        return data.access;
      }
    } catch {
      // Try next configured endpoint.
    }
  }

  throw new Error("Unable to refresh access token");
}

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config;
    const status = error?.response?.status;

    if (!originalRequest || status !== 401 || originalRequest._retry || shouldSkipRefresh(originalRequest.url)) {
      throw error;
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearAuthStorage();
      throw error;
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = fetchNewAccessToken(refreshToken).finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;
      updateAccessToken(newAccessToken);
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return api(originalRequest);
    } catch (refreshError) {
      clearAuthStorage();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw refreshError;
    }
  }
);

export async function getData(url) {
  const { data } = await api.get(url);
  return data;
}

export async function postData(url, payload) {
  const { data } = await api.post(url, payload);
  return data;
}

export async function patchData(url, payload) {
  const { data } = await api.patch(url, payload);
  return data;
}

export async function putData(url, payload) {
  const { data } = await api.put(url, payload);
  return data;
}

export async function deleteData(url) {
  const { data } = await api.delete(url);
  return data;
}

/**
 * Extracts a user-friendly error message from an Axios error object.
 * Handles Django Rest Framework error formats:
 * - { detail: "message" }
 * - { non_field_errors: ["message"] }
 * - { field_name: ["message"] }
 */
export function getErrorMessage(err) {
  const data = err?.response?.data;
  if (!data) return err.message || "An unexpected error occurred";

  if (typeof data === "string") return data;

  if (data.detail && typeof data.detail === "string") return data.detail;
  
  if (data.non_field_errors) {
    return Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : data.non_field_errors;
  }

  // Handle nested messages (common in some token/auth errors)
  if (data.messages && Array.isArray(data.messages) && data.messages.length > 0) {
    const firstMsg = data.messages[0];
    if (firstMsg?.message) return firstMsg.message;
  }

  // Handle field errors (e.g. {"email": ["This field is required."]})
  if (typeof data === "object") {
    const firstKey = Object.keys(data)[0];
    const error = data[firstKey];
    if (error) {
      const msg = Array.isArray(error) ? error[0] : error;
      if (typeof msg === "string") {
        // If it's a field error, optionally prefix with field name
        const prefix = firstKey !== "error" && firstKey !== "message" ? `${firstKey.replace(/_/g, ' ')}: ` : "";
        return (prefix + msg).charAt(0).toUpperCase() + (prefix + msg).slice(1);
      }
    }
  }

  return JSON.stringify(data);
}

export default api;