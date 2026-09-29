const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include", // send/receive the admin httpOnly cookie
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || `Request failed (${res.status})`);
    err.errors = data.errors;
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  getCategories: () => request("/api/categories"),
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/products${qs ? `?${qs}` : ""}`);
  },
  getProduct: (slug) => request(`/api/products/${slug}`),
  submitContact: (payload) =>
    request("/api/contact", { method: "POST", body: JSON.stringify(payload) }),

  // --- Chatbot ---------------------------------------------------------
  getChatGreeting: (productSlug) => request(`/api/chat/greeting?productSlug=${encodeURIComponent(productSlug)}`),
  sendChatMessage: (payload) => request("/api/chat/message", { method: "POST", body: JSON.stringify(payload) }),

  // --- Admin -------------------------------------------------------------
  adminLogin: (payload) => request("/api/admin/login", { method: "POST", body: JSON.stringify(payload) }),
  adminLogout: () => request("/api/admin/logout", { method: "POST" }),
  adminMe: () => request("/api/admin/me"),
  adminGetCategories: () => request("/api/admin/categories"),
  adminGetProducts: () => request("/api/admin/products"),
  adminGetProduct: (id) => request(`/api/admin/products/${id}`),
  adminCreateProduct: (payload) => request("/api/admin/products", { method: "POST", body: JSON.stringify(payload) }),
  adminUpdateProduct: (id, payload) => request(`/api/admin/products/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  adminDeleteProduct: (id) => request(`/api/admin/products/${id}`, { method: "DELETE" }),
  adminUploadImages: async (productId, files, filenames = []) => {
    const formData = new FormData();
    formData.append("imageNames", JSON.stringify(filenames));
    Array.from(files).forEach((f) => formData.append("images", f));
    const res = await fetch(`${API_BASE}/api/admin/products/${productId}/images`, {
      method: "POST",
      credentials: "include",
      body: formData, // no Content-Type header — browser sets the multipart boundary
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || "Upload failed");
    return data;
  },
  adminDeleteImage: (productId, imageId) =>
    request(`/api/admin/products/${productId}/images/${imageId}`, { method: "DELETE" }),
  adminGetBookings: () => request("/api/admin/bookings"),
  adminGetConversations: () => request("/api/admin/conversations"),
  adminGetConversation: (id) => request(`/api/admin/conversations/${id}`),
};

export function imageUrl(path) {
  if (!path) return null;
  return path.startsWith("http") ? path : `${API_BASE}${path}`;
}
