import api from "./api";

// ==================== Enigmas Admin API ====================
export const adminEnigmaAPI = {
  // Get all enigmas with filtering and pagination
  getEnigmas: (params) => api.get("/admin/enigmas", { params }),

  // Get single enigma by ID
  getEnigma: (id) => api.get(`/admin/enigmas/${id}`),

  // Create new enigma
  createEnigma: (data) => api.post("/admin/enigmas", data),

  // Update enigma
  updateEnigma: (id, data) => api.put(`/admin/enigmas/${id}`, data),

  // Delete enigma
  deleteEnigma: (id) => api.delete(`/admin/enigmas/${id}`),

  // Bulk update enigmas
  bulkUpdateEnigmas: (data) => api.put("/admin/enigmas/bulk", data),

  // Get enigma stats for dashboard
  getEnigmaStats: () => api.get("/admin/enigmas/stats"),

  // Export enigmas
  exportEnigmas: (format = "json") =>
    api.get("/admin/enigmas/export", { params: { format } }),

  // Update enigma order (for drag-and-drop)
  updateEnigmasOrder: (data) => api.put("/admin/enigmas/order", data),
};

// ==================== Chronicles Admin API ====================
export const adminChronicleAPI = {
  // Get all chronicles with filtering
  getChronicles: (params) => api.get("/admin/chronicles", { params }),

  // Get single chronicle
  getChronicle: (id) => api.get(`/admin/chronicles/${id}`),

  // Create new chronicle
  createChronicle: (data) => api.post("/admin/chronicles", data),

  // Update chronicle
  updateChronicle: (id, data) => api.put(`/admin/chronicles/${id}`, data),

  // Delete chronicle
  deleteChronicle: (id) => api.delete(`/admin/chronicles/${id}`),

  // Bulk update chronicles
  bulkUpdateChronicles: (data) => api.put("/admin/chronicles/bulk", data),

  // Get chronicle stats
  getChronicleStats: () => api.get("/admin/chronicles/stats"),

  // Update production status
  updateProductionStatus: (id, data) =>
    api.put(`/admin/chronicles/${id}/production-status`, data),

  // Update chronicles order
  updateChroniclesOrder: (data) => api.put("/admin/chronicles/order", data),
};

// ==================== Fragments Admin API ====================
export const adminFragmentAPI = {
  // Get all fragments with filtering
  getFragments: (params) => api.get("/admin/fragments", { params }),

  // Get single fragment
  getFragment: (id) => api.get(`/admin/fragments/${id}`),

  // Create new fragment
  createFragment: (data) => api.post("/admin/fragments", data),

  // Update fragment
  updateFragment: (id, data) => api.put(`/admin/fragments/${id}`, data),

  // Delete fragment
  deleteFragment: (id) => api.delete(`/admin/fragments/${id}`),

  // Bulk update fragments
  bulkUpdateFragments: (data) => api.put("/admin/fragments/bulk", data),

  // Get fragment stats
  getFragmentStats: () => api.get("/admin/fragments/stats"),

  // Update fragments order
  updateFragmentsOrder: (data) => api.put("/admin/fragments/order", data),
};

// ==================== Claims Admin API ====================
export const adminClaimAPI = {
  // Get all claims with filtering
  getClaims: (params) => api.get("/admin/claims", { params }),

  // Get single claim
  getClaim: (id) => api.get(`/admin/claims/${id}`),

  // Update claim
  updateClaim: (id, data) => api.put(`/admin/claims/${id}`, data),

  // Delete claim
  deleteClaim: (id) => api.delete(`/admin/claims/${id}`),

  // Bulk update claims
  bulkUpdateClaims: (data) => api.put("/admin/claims/bulk", data),

  // Get claim stats
  getClaimStats: () => api.get("/admin/claims/stats"),

  // Export claims
  exportClaims: (params) => api.get("/admin/claims/export", { params }),

  // Update claim status
  updateClaimStatus: (id, data) => api.put(`/admin/claims/${id}/status`, data),

  // Update payment status
  updatePaymentStatus: (id, data) =>
    api.put(`/admin/claims/${id}/payment`, data),

  // Add tracking information
  addTracking: (id, data) => api.put(`/admin/claims/${id}/tracking`, data),
};

// ==================== Waitlist Admin API ====================
export const adminWaitlistAPI = {
  // Get all waitlist entries with filtering
  getWaitlistEntries: (params) => api.get("/admin/waitlist", { params }),

  // Get single waitlist entry
  getWaitlistEntry: (id) => api.get(`/admin/waitlist/${id}`),

  // Update waitlist entry
  updateWaitlistEntry: (id, data) => api.put(`/admin/waitlist/${id}`, data),

  // Delete waitlist entry
  deleteWaitlistEntry: (id) => api.delete(`/admin/waitlist/${id}`),

  // Bulk update waitlist
  bulkUpdateWaitlist: (data) => api.put("/admin/waitlist/bulk", data),

  // Get waitlist stats
  getWaitlistStats: () => api.get("/admin/waitlist/stats"),

  // Send notifications to waitlist users
  notifyWaitlist: (data) => api.post("/admin/waitlist/notify", data),

  // Clear waitlist for a chronicle
  clearWaitlist: (chronicleId) =>
    api.post(`/admin/waitlist/clear/${chronicleId}`),
};

// ==================== Dashboard Admin API ====================
export const adminDashboardAPI = {
  // Get dashboard stats
  getDashboardStats: () => api.get("/admin/dashboard/stats"),

  // Get recent activity
  getRecentActivity: (params) =>
    api.get("/admin/dashboard/recent-activity", { params }),

  // Get sales data for charts
  getSalesData: (params) => api.get("/admin/dashboard/sales-data", { params }),

  // Get top performing chronicles
  getTopChronicles: (params) =>
    api.get("/admin/dashboard/top-chronicles", { params }),

  // Get enigma performance metrics
  getEnigmaPerformance: (params) =>
    api.get("/admin/dashboard/enigma-performance", { params }),
};

// ==================== Bulk Operations Helper ====================
export const adminBulkAPI = {
  // Bulk delete items (generic)
  bulkDelete: (endpoint, ids) => api.post(endpoint, { ids, action: "delete" }),

  // Bulk update status
  bulkUpdateStatus: (endpoint, ids, status) =>
    api.post(endpoint, { ids, action: "updateStatus", data: { status } }),

  // Bulk feature/unfeature
  bulkFeature: (endpoint, ids, featured) =>
    api.post(endpoint, { ids, action: "updateFeatured", data: { featured } }),
};
