// services/homeAPI.js
import api from "./api";

export const homeAPI = {
  getSettings: () => api.get("/admin/home/settings"),
  updateSettings: (data) => {
    console.log("API: Updating settings with data:", data);
    return api.put("/admin/home/settings", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  resetSettings: () => api.delete("/admin/home/settings/reset"),
};
