const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

export function toArray(value) {
  return Array.isArray(value) ? value : [];
}

export function numberOrNull(value) {
  if (value === "" || value === null || value === undefined) return null;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
}

export function compactPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined && value !== null && value !== "")
  );
}

export function extractError(error) {
  if (error?.response?.data) {
    if (typeof error.response.data === "string") return error.response.data;
    return JSON.stringify(error.response.data);
  }

  return error?.message || "Request failed";
}

export function getEntityId(value) {
  if (value && typeof value === "object") {
    if (value.id !== undefined && value.id !== null) return value.id;
    return "";
  }

  return value ?? "";
}

export function formatValue(value) {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "object") {
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

export function normalizeMediaUrl(value) {
  if (!value) return "";

  const url = String(value);
  if (/^https?:\/\//i.test(url)) return url;

  const mediaBase = String(API_BASE_URL || "").replace(/\/api\/?$/, "").replace(/\/$/, "");
  if (!mediaBase) return url;

  return `${mediaBase}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function getUserDisplayName(userRow) {
  const directName = String(userRow?.name || "").trim();
  if (directName) return directName;

  const first = String(userRow?.first_name || userRow?.user?.first_name || "").trim();
  const last = String(userRow?.last_name || userRow?.user?.last_name || "").trim();
  const full = `${first} ${last}`.trim();
  if (full) return full;

  const email = String(userRow?.email || userRow?.user?.email || "").trim();
  return email || "User";
}

export function buildUserLabel(userRow) {
  const name = getUserDisplayName(userRow);
  const email = String(userRow?.email || userRow?.user?.email || "").trim();
  return email && email !== name ? `${name} (${email})` : name;
}

export function mergeRowsById(...groups) {
  const merged = [];
  const seen = new Set();

  for (const group of groups) {
    for (const row of toArray(group)) {
      const rowId = String(getEntityId(row?.id ?? row) || "").trim();
      if (!rowId || seen.has(rowId)) continue;
      seen.add(rowId);
      merged.push(row);
    }
  }

  return merged;
}
