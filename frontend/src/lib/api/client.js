const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export function getToken() {
  if (typeof localStorage === "undefined") return null;
  return localStorage.getItem("recaply_token");
}

export function setAuth(token, user) {
  localStorage.setItem("recaply_token", token);
  localStorage.setItem("recaply_user", JSON.stringify(user));
}

export function getUser() {
  if (typeof localStorage === "undefined") return null;
  try { return JSON.parse(localStorage.getItem("recaply_user") || "null"); } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem("recaply_token");
  localStorage.removeItem("recaply_user");
}

async function request(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = getToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  login: (body) => request("/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }),
  register: (body) => request("/auth/register", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body)
  }),
  meetings: () => request("/meetings"),
  meeting: (id) => request(`/meetings/${id}`),
  deleteMeeting: (id) => request(`/meetings/${id}`, { method: "DELETE" }),
  upload: (formData) => request("/meetings/upload", { method: "POST", body: formData })
};
