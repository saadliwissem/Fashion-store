import React, { useState, useEffect } from "react";
import { X, Upload, Globe, Eye, EyeOff, HelpCircle } from "lucide-react";
import Button from "../../components/common/Button";

const CategoryModal = ({
  isOpen,
  onClose,
  mode,
  category,
  categories,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    parentId: "",
    status: "active",
    featured: false,
    image: "",
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
    displayOrder: 1,
  });

  const [imagePreview, setImagePreview] = useState("");
  const [showSeoFields, setShowSeoFields] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (mode === "edit" && category) {
      setFormData({
        name: category.name || "",
        slug: category.slug || "",
        description: category.description || "",
        parentId: category.parentId || "",
        status: category.status || "active",
        featured: category.featured || false,
        image: category.image || "",
        seo: {
          title: category.seo?.title || "",
          description: category.seo?.description || "",
          keywords: Array.isArray(category.seo?.keywords)
            ? category.seo.keywords.join(", ")
            : category.seo?.keywords || "",
        },
        displayOrder: category.displayOrder || 1,
      });
      setImagePreview(category.image || "");
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        slug: "",
        description: "",
        parentId: "",
        status: "active",
        featured: false,
        image: "",
        seo: {
          title: "",
          description: "",
          keywords: "",
        },
        displayOrder: (categories?.length || 0) + 1,
      });
      setImagePreview("");
      setShowSeoFields(false);
      setErrors({});
    }
  }, [mode, category, categories]);

  const flattenCategoriesForSelect = (cats, level = 0, parentName = "") => {
    let result = [];
    cats.forEach((cat) => {
      const prefix = "— ".repeat(level);
      result.push({
        value: cat.id,
        label: `${prefix}${cat.name}`,
        disabled: mode === "edit" && cat.id === category?.id, // Can't select itself as parent
      });
      if (cat.children && cat.children.length > 0) {
        result.push(
          ...flattenCategoriesForSelect(cat.children, level + 1, cat.name)
        );
      }
    });
    return result;
  };

  const parentOptions = [
    { value: "", label: "No Parent (Top Level)" },
    ...flattenCategoriesForSelect(categories || []),
  ];

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("seo.")) {
      const seoField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));

      // Auto-generate slug from name
      if (name === "name" && mode === "add") {
        const generatedSlug = generateSlug(value);
        setFormData((prev) => ({
          ...prev,
          slug: generatedSlug,
          seo: {
            ...prev.seo,
            title: value ? `${value} - FashionStore Tunisia` : "",
            description: value ? `Shop ${value} at FashionStore Tunisia` : "",
          },
        }));
      }
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload an image file",
        }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
        if (errors.image) {
          setErrors((prev) => ({ ...prev, image: null }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Category name is required";
    } else if (formData.name.length < 2) {
      newErrors.name = "Category name must be at least 2 characters";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug =
        "Slug can only contain lowercase letters, numbers, and hyphens";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (formData.seo.title && formData.seo.title.length > 60) {
      newErrors["seo.title"] = "SEO Title must be less than 60 characters";
    }

    if (formData.seo.description && formData.seo.description.length > 160) {
      newErrors["seo.description"] =
        "SEO Description must be less than 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Prepare data for saving
    const categoryData = {
      ...formData,
      seo: {
        ...formData.seo,
        keywords: formData.seo.keywords
          .split(",")
          .map((kw) => kw.trim())
          .filter((kw) => kw.length > 0),
      },
    };

    onSave(categoryData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {mode === "add" ? "Add New Category" : "Edit Category"}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {mode === "add"
                  ? "Create a new category to organize your products"
                  : "Update category details and settings"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column - Basic Info */}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none ${
                        errors.name ? "border-rose-500" : "border-gray-300"
                      }`}
                      placeholder="e.g., Men's Fashion"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-rose-600">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Slug */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Slug *
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">
                        fashionstore.com/c/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className={`flex-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none ${
                          errors.slug ? "border-rose-500" : "border-gray-300"
                        }`}
                        placeholder="mens-fashion"
                      />
                    </div>
                    {errors.slug && (
                      <p className="mt-1 text-sm text-rose-600">
                        {errors.slug}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-gray-500">
                      URL-friendly version of the name. Use lowercase letters,
                      numbers, and hyphens.
                    </p>
                  </div>

                  {/* Parent Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Parent Category
                    </label>
                    <select
                      name="parentId"
                      value={formData.parentId}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    >
                      {parentOptions.map((option) => (
                        <option
                          key={option.value}
                          value={option.value}
                          disabled={option.disabled}
                          className={option.disabled ? "text-gray-400" : ""}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-sm text-gray-500">
                      Select parent category to create a sub-category. Leave
                      empty for top-level.
                    </p>
                  </div>

                  {/* Status & Featured */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="displayOrder"
                        value={formData.displayOrder}
                        onChange={handleInputChange}
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Featured Checkbox */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <label
                      htmlFor="featured"
                      className="ml-2 text-sm text-gray-900"
                    >
                      Mark as Featured Category
                    </label>
                    <div className="ml-2 group relative">
                      <HelpCircle className="w-4 h-4 text-gray-400" />
                      <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 w-48 p-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Featured categories appear on homepage and get special
                        visibility
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Image & Description */}
                <div className="space-y-6">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Category Image
                    </label>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-xl"
                          />
                          <button
                            type="button"
                            onClick={handleRemoveImage}
                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600 mb-2">
                            Upload category image (Recommended: 400x300px)
                          </p>
                          <label className="inline-block">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="hidden"
                            />
                            <span className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer">
                              Choose Image
                            </span>
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG, GIF up to 5MB
                          </p>
                        </div>
                      )}
                      {errors.image && (
                        <p className="text-sm text-rose-600">{errors.image}</p>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none ${
                        errors.description
                          ? "border-rose-500"
                          : "border-gray-300"
                      }`}
                      placeholder="Describe this category (optional)"
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-rose-600">
                        {errors.description}
                      </p>
                    )}
                    <div className="flex justify-between mt-1">
                      <p className="text-sm text-gray-500">
                        Optional description for internal use
                      </p>
                      <span
                        className={`text-sm ${
                          formData.description.length > 500
                            ? "text-rose-600"
                            : "text-gray-500"
                        }`}
                      >
                        {formData.description.length}/500
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEO Fields Section */}
              <div className="border-t border-gray-200 pt-6">
                <button
                  type="button"
                  onClick={() => setShowSeoFields(!showSeoFields)}
                  className="flex items-center gap-2 text-gray-900 hover:text-purple-600"
                >
                  <Globe className="w-5 h-5" />
                  <span className="font-medium">SEO Settings</span>
                  <span className="ml-auto">
                    {showSeoFields ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </span>
                </button>

                {showSeoFields && (
                  <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-xl">
                    {/* SEO Title */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-900">
                          SEO Title
                        </label>
                        <span
                          className={`text-xs ${
                            formData.seo.title.length > 60
                              ? "text-rose-600"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.seo.title.length}/60
                        </span>
                      </div>
                      <input
                        type="text"
                        name="seo.title"
                        value={formData.seo.title}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none ${
                          errors["seo.title"]
                            ? "border-rose-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Optimized title for search engines"
                      />
                      {errors["seo.title"] && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors["seo.title"]}
                        </p>
                      )}
                    </div>

                    {/* SEO Description */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-900">
                          SEO Description
                        </label>
                        <span
                          className={`text-xs ${
                            formData.seo.description.length > 160
                              ? "text-rose-600"
                              : "text-gray-500"
                          }`}
                        >
                          {formData.seo.description.length}/160
                        </span>
                      </div>
                      <textarea
                        name="seo.description"
                        value={formData.seo.description}
                        onChange={handleInputChange}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none ${
                          errors["seo.description"]
                            ? "border-rose-500"
                            : "border-gray-300"
                        }`}
                        placeholder="Meta description for search results"
                      />
                      {errors["seo.description"] && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors["seo.description"]}
                        </p>
                      )}
                    </div>

                    {/* SEO Keywords */}
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        SEO Keywords
                      </label>
                      <input
                        type="text"
                        name="seo.keywords"
                        value={formData.seo.keywords}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        placeholder="fashion, clothing, style (comma separated)"
                      />
                      <p className="mt-1 text-sm text-gray-500">
                        Keywords help search engines understand your category
                        content
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {mode === "add" ? "Create Category" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
