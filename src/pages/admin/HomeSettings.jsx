// pages/admin/HomeSettings.jsx
import React, { useState, useEffect } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { homeAPI } from "../../services/homeAPI";
import toast from "react-hot-toast";
import Button from "../../components/common/Button";
import { Loader, Save, RefreshCw } from "lucide-react";

const HomeSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState(null);
  const [formData, setFormData] = useState({
    hero: {
      badge: "",
      title: "",
      subtitle: "",
      image: { url: "", alt: "" },
      stats: {
        customers: { value: "", label: "" },
        products: { value: "", label: "" },
        support: { value: "", label: "" },
      },
      buttons: {
        primary: { text: "", link: "" },
        secondary: { text: "", link: "" },
      },
    },
    mysteries: {
      enabled: true,
      badge: "",
      title: "",
      subtitle: "",
      ctaButton: { text: "", link: "" },
      featuredMystery: {
        title: "",
        description: "",
        image: { url: "", alt: "" },
        stats: { fragments: 0, claimed: 0, available: 0 },
        badge: "",
        badgeColor: "",
        link: "",
      },
      steps: [],
    },
    features: [],
    cta: {
      title: "",
      subtitle: "",
      buttons: {
        primary: { text: "", link: "", variant: "" },
        secondary: { text: "", link: "", variant: "" },
      },
      bgGradient: "",
    },
  });
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [mysteryImageFile, setMysteryImageFile] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await homeAPI.getSettings();
      const data = response.data.data;
      setSettings(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (section, nested, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [nested]: {
          ...prev[section]?.[nested],
          [field]: value,
        },
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const formDataToSend = new FormData();

      // Append the main data as JSON
      const dataToSend = {
        hero: formData.hero,
        mysteries: formData.mysteries,
        features: formData.features,
        cta: formData.cta,
      };

      formDataToSend.append("data", JSON.stringify(dataToSend));

      // Append images if selected
      if (heroImageFile) {
        formDataToSend.append("heroImage", heroImageFile);
      }
      if (mysteryImageFile) {
        formDataToSend.append("mysteryImage", mysteryImageFile);
      }

      console.log("Sending data:", dataToSend);
      console.log("FormData entries:", [...formDataToSend.entries()]);

      const response = await homeAPI.updateSettings(formDataToSend);

      toast.success("Settings updated successfully!");
      fetchSettings(); // Refresh data
      setHeroImageFile(null);
      setMysteryImageFile(null);
    } catch (error) {
      console.error("Error updating settings:", error);
      toast.error(error.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center py-20">
          <Loader className="w-8 h-8 text-primary-600 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Home Page Settings
            </h1>
            <p className="text-gray-600">
              Customize the content displayed on the home page
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={fetchSettings}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button onClick={handleSubmit} disabled={saving}>
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Hero Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Hero Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge
                </label>
                <input
                  type="text"
                  value={formData.hero?.badge || ""}
                  onChange={(e) =>
                    handleInputChange("hero", "badge", e.target.value)
                  }
                  className="input-modern w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.hero?.title || ""}
                  onChange={(e) =>
                    handleInputChange("hero", "title", e.target.value)
                  }
                  className="input-modern w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={formData.hero?.subtitle || ""}
                  onChange={(e) =>
                    handleInputChange("hero", "subtitle", e.target.value)
                  }
                  rows="3"
                  className="input-modern w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hero Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setHeroImageFile(file);
                    }
                  }}
                  className="input-modern w-full"
                />
                {formData.hero?.image?.url && (
                  <img
                    src={formData.hero.image.url}
                    alt="Hero"
                    className="mt-2 w-32 h-32 object-cover rounded-lg"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Mysteries Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Mysteries Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Badge
                </label>
                <input
                  type="text"
                  value={formData.mysteries?.badge || ""}
                  onChange={(e) =>
                    handleInputChange("mysteries", "badge", e.target.value)
                  }
                  className="input-modern w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.mysteries?.title || ""}
                  onChange={(e) =>
                    handleInputChange("mysteries", "title", e.target.value)
                  }
                  className="input-modern w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={formData.mysteries?.subtitle || ""}
                  onChange={(e) =>
                    handleInputChange("mysteries", "subtitle", e.target.value)
                  }
                  rows="3"
                  className="input-modern w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mystery Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setMysteryImageFile(file);
                    }
                  }}
                  className="input-modern w-full"
                />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              CTA Section
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.cta?.title || ""}
                  onChange={(e) =>
                    handleInputChange("cta", "title", e.target.value)
                  }
                  className="input-modern w-full"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subtitle
                </label>
                <textarea
                  value={formData.cta?.subtitle || ""}
                  onChange={(e) =>
                    handleInputChange("cta", "subtitle", e.target.value)
                  }
                  rows="3"
                  className="input-modern w-full"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => fetchSettings()}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default HomeSettings;
