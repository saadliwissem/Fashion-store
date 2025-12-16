import axios from "axios";

// Create axios instance with base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 10 seconds timeout
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    // Handle network errors
    if (!error.response) {
      console.error("Network error:", error);
      return Promise.reject(
        new Error("Network error. Please check your connection.")
      );
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post("/auth/login", credentials),
  register: (userData) => api.post("/auth/register", userData),
  logout: () => api.post("/auth/logout"),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (data) => api.post(`/auth/reset-password/${data.token}`, data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  updatePassword: (data) => api.put("/auth/password", data),
  addAddress: (data) => api.post("/auth/address", data),
  deleteAddress: (id) => api.delete(`/auth/address/${id}`),
};

// Products API
export const productsAPI = {
  getAll: (params) => api.get("/products", { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  search: (query) => api.get(`/products/search/${query}`),
  getFeatured: () => api.get("/products/featured"),
  getNewArrivals: () => api.get("/products/new"),
  getOnSale: () => api.get("/products/sale"),
  getCategoryFilters: () => api.get("/products/filters/categories"),
  createReview: (productId, reviewData) =>
    api.post(`/products/${productId}/reviews`, reviewData),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get("/categories"),
  getBySlug: (slug, params) => api.get(`/categories/${slug}`, { params }),
  getFeatured: () => api.get("/categories/featured"),
  getBreadcrumbs: (slug) => api.get(`/categories/${slug}/breadcrumbs`),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (data) => api.post("/cart/add", data),
  updateQuantity: (itemId, quantity) =>
    api.put(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
  clearCart: () => api.delete("/cart/clear"),
  applyCoupon: (code) => api.post("/cart/coupon", { code }),
};

// Orders API
export const ordersAPI = {
  create: (orderData) => api.post("/orders", orderData),
  getAll: (params) => api.get("/orders", { params }),
  getById: (id) => api.get(`/orders/${id}`),
  updateToPaid: (id, paymentData) => api.put(`/orders/${id}/pay`, paymentData),
  cancel: (id) => api.put(`/orders/${id}/cancel`),
  getTracking: (id) => api.get(`/orders/${id}/tracking`),
};

// Wishlist API
export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId) => api.post("/wishlist/add", { productId }),
  removeFromWishlist: (itemId) => api.delete(`/wishlist/${itemId}`),
  moveToCart: (itemId) => api.post(`/wishlist/${itemId}/move-to-cart`),
  clearWishlist: () => api.delete("/wishlist/clear"),
};

// Reviews API
export const reviewsAPI = {
  getProductReviews: (productId, params) =>
    api.get(`/reviews/product/${productId}`, { params }),
  createReview: (data) => api.post("/reviews", data),
  updateReview: (id, data) => api.put(`/reviews/${id}`, data),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  markHelpful: (id) => api.post(`/reviews/${id}/helpful`),
};

// Add these to your adminAPI object in api.js
export const adminAPI = {
  dashboardStats: () => api.get("/admin/dashboard"),
  getUsers: (params) => api.get("/admin/users", { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  updateOrderStatus: (id, data) => api.put(`/admin/orders/${id}/status`, data),
  getAnalytics: (type, params) =>
    api.get(`/admin/analytics/${type}`, { params }),

  // Categories API
  getCategories: (params) => api.get("/admin/categories", { params }),
  createCategory: (data) => api.post("/admin/categories", data),
  getCategory: (id) => api.get(`/admin/categories/${id}`),
  updateCategory: (id, data) => api.put(`/admin/categories/${id}`, data),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  updateCategoriesOrder: (data) => api.put("/admin/categories/order", data),

  // Products API (for admin)
  getProducts: (params) => api.get("/admin/products", { params }),
  createProduct: (data) => api.post("/admin/products", data),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  updateProduct: (id, data) => api.put(`/admin/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),

  bulkUpdateProducts: (data) => api.put("/admin/products/bulk", data),
  getProductStats: () => api.get("/admin/products/stats"),
  updateProductStock: (id, data) =>
    api.put(`/admin/products/${id}/stock`, data),
  uploadProductImages: (id, formData) =>
    api.post(`/admin/products/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // Inventory API
  getInventory: (params) => api.get("/admin/inventory", { params }),
  getInventoryItem: (id) => api.get(`/admin/inventory/${id}`),
  updateInventoryItem: (id, data) => api.put(`/admin/inventory/${id}`, data),
  updateInventoryStock: (id, data) =>
    api.put(`/admin/inventory/${id}/stock`, data),
  bulkUpdateInventory: (data) => api.put("/admin/inventory/bulk", data),
  deleteInventoryItem: (id) => api.delete(`/admin/inventory/${id}`),
  getInventoryStats: () => api.get("/admin/inventory/stats"),
  generateReorderReport: (data) =>
    api.post("/admin/inventory/reorder-report", data),
  exportInventory: (params) =>
    api.get("/admin/inventory/export", {
      params,
      responseType: "blob", // For file download
    }),
  // Inventory movements/history
  getInventoryMovements: (params) =>
    api.get("/admin/inventory/movements", { params }),
  addInventoryMovement: (data) => api.post("/admin/inventory/movements", data),
  // New inventory methods
  syncInventoryFromProducts: (data) => api.post("/admin/inventory/sync", data),
  getLowStockAlerts: (params) => api.get("/admin/inventory/alerts", { params }),
  getInventoryByProductId: (productId) =>
    api.get(`/admin/inventory/product/${productId}`),
  // Orders API
  getOrders: (params) => api.get("/admin/orders", { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrder: (id, data) => api.put(`/admin/orders/${id}`, data),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  bulkUpdateOrders: (data) => api.put("/admin/orders/bulk", data),
  getOrderStats: () => api.get("/admin/orders/stats"),
  updateTracking: (id, data) => api.put(`/admin/orders/${id}/tracking`, data),
  updatePaymentStatus: (id, data) =>
    api.put(`/admin/orders/${id}/payment`, data),

  // Order Analytics
  getOrdersAnalytics: (params) =>
    api.get("/admin/orders/analytics", { params }),
  getSalesReport: (params) => api.get("/admin/orders/sales-report", { params }),
  exportOrders: (params) =>
    api.get("/admin/orders/export", {
      params,
      responseType: "blob",
    }),
};

export default api;
