import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Upload,
  Image as ImageIcon,
  Tag,
  Package,
  DollarSign,
  Hash,
  AlignLeft,
  BarChart3,
  Globe,
  Settings,
  Plus,
  Minus,
  HelpCircle,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash2,
  Info,
} from "lucide-react";
import Button from "../../components/common/Button";

const ProductModal = ({
  isOpen,
  onClose,
  mode = "add",
  product = null,
  categories = [],
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [imageErrors, setImageErrors] = useState({});
  const [uploadingImages, setUploadingImages] = useState([]);
  const [showInventoryInfo, setShowInventoryInfo] = useState(false);
  const fileInputRef = useRef(null);

  // Form state - REMOVED stock-related fields
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    slug: "",
    category: "",
    subCategory: "",
    price: 0,
    originalPrice: 0,
    costPrice: 0,
    // REMOVED: stock, lowStockThreshold, manageStock
    description: "",
    shortDescription: "",
    status: "draft",
    featured: false,
    onSale: false,
    isNewArrival: false,
    tags: [],
    images: [],
    specifications: {
      material: "",
      weight: "",
      fit: "",
      care: "",
      additional: [],
    },
    seo: {
      title: "",
      description: "",
      keywords: [],
    },
    variants: [],
    weight: 0,
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
    },
    freeShipping: false,
  });

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing", icon: DollarSign }, // Changed from "Pricing & Inventory"
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "description", label: "Description", icon: AlignLeft },
    { id: "specifications", label: "Specifications", icon: Settings },
    { id: "shipping", label: "Shipping", icon: Package },
    { id: "seo", label: "SEO", icon: Globe },
    { id: "variants", label: "Variants", icon: Tag },
  ];

  useEffect(() => {
    if (mode === "edit" && product) {
      // For edit mode, we might still want to show variants data
      // but inventory will be managed separately
      setFormData({
        ...product,
        category: product.category?._id || product.category || "",
        variants: product.variants || [],
        specifications: {
          material: product.specifications?.material || "",
          weight: product.specifications?.weight || "",
          fit: product.specifications?.fit || "",
          care: product.specifications?.care || "",
          additional: product.specifications?.additional || [],
        },
        seo: {
          title: product.seo?.title || "",
          description: product.seo?.description || "",
          keywords: product.seo?.keywords || [],
        },
        dimensions: product.dimensions || { length: 0, width: 0, height: 0 },
        // REMOVED stock-related fields
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        sku: "",
        slug: "",
        category: "",
        subCategory: "",
        price: 0,
        originalPrice: 0,
        costPrice: 0,
        // REMOVED: stock, lowStockThreshold, manageStock
        description: "",
        shortDescription: "",
        status: "draft",
        featured: false,
        onSale: false,
        isNewArrival: false,
        tags: [],
        images: [],
        specifications: {
          material: "",
          weight: "",
          fit: "",
          care: "",
          additional: [],
        },
        seo: {
          title: "",
          description: "",
          keywords: [],
        },
        variants: [],
        weight: 0,
        dimensions: {
          length: 0,
          width: 0,
          height: 0,
        },
        freeShipping: false,
      });
      setActiveTab("basic");
      setErrors({});
      setImageErrors({});
      setUploadingImages([]);
    }
  }, [mode, product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseFloat(value) || 0
          : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]:
          typeof value === "string"
            ? value
            : typeof value === "number"
            ? parseFloat(value) || 0
            : value,
      },
    }));
  };

  const handleTagsChange = (e) => {
    const tags = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag);
    setFormData((prev) => ({ ...prev, tags }));
  };

  // Handle file upload from device
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    // Validate total number of images
    const totalImages = formData.images.length + files.length;
    if (totalImages > 10) {
      setImageErrors((prev) => ({
        ...prev,
        upload: `Maximum 10 images allowed. You already have ${formData.images.length} images.`,
      }));
      return;
    }

    // Track uploading images
    setUploadingImages(files.map((file) => file.name));

    for (const file of files) {
      try {
        // Validate file
        const validationError = validateImageFile(file);
        if (validationError) {
          setImageErrors((prev) => ({
            ...prev,
            [file.name]: validationError,
          }));
          continue;
        }

        // Convert file to base64
        const base64Image = await convertToBase64(file);

        // Add to images array
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, base64Image],
        }));

        // Clear any previous error for this file
        setImageErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[file.name];
          return newErrors;
        });
      } catch (error) {
        console.error("Error processing image:", error);
        setImageErrors((prev) => ({
          ...prev,
          [file.name]: "Failed to process image. Please try another file.",
        }));
      }
    }

    // Clear uploading images after processing
    setUploadingImages([]);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateImageFile = (file) => {
    // Check file type
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!validTypes.includes(file.type)) {
      return "Invalid file type. Please upload JPG, PNG, GIF, or WEBP images.";
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return "File is too large. Maximum size is 5MB.";
    }

    return null;
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleAddImageUrl = () => {
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ""],
    }));
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    // Clear any error for this image
    setImageErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleImageUrlChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));

    // Clear error when user types
    if (imageErrors[index]) {
      setImageErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[index];
        return newErrors;
      });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const event = { target: { files } };
      handleFileUpload(event);
    }
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          color: "",
          size: "",
          price: prev.price,
          stock: 0, // This will be used to create initial inventory
          sku: "",
          image: "",
        },
      ],
    }));
  };

  const handleRemoveVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...formData.variants];
    newVariants[index] = {
      ...newVariants[index],
      [field]:
        field === "price" || field === "stock" ? parseFloat(value) || 0 : value,
    };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const generateSKU = () => {
    const prefix = "FS";
    const categoryCode = formData.category ? "CAT" : "GEN";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const sku = `${prefix}-${categoryCode}-${randomNum}`;
    setFormData((prev) => ({ ...prev, sku }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Basic info validation
    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    } else if (formData.name.length < 3) {
      newErrors.name = "Product name must be at least 3 characters";
    }

    if (!formData.sku.trim()) {
      newErrors.sku = "SKU is required";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    // Pricing validation
    if (formData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (formData.originalPrice < 0) {
      newErrors.originalPrice = "Original price cannot be negative";
    }

    if (formData.costPrice < 0) {
      newErrors.costPrice = "Cost price cannot be negative";
    }

    // REMOVED: Stock validation since it's now in Inventory

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Image validation
    if (formData.images.length === 0) {
      newErrors.images = "At least one product image is required";
    }

    // SEO validation
    if (formData.seo.title && formData.seo.title.length > 60) {
      newErrors.seoTitle = "SEO title cannot exceed 60 characters";
    }

    if (formData.seo.description && formData.seo.description.length > 160) {
      newErrors.seoDescription = "SEO description cannot exceed 160 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
      return;
    }

    setLoading(true);

    try {
      // Prepare data for saving
      const productData = {
        ...formData,
        // Ensure numeric fields are numbers
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || 0,
        costPrice: parseFloat(formData.costPrice) || 0,
        // REMOVED: stock and lowStockThreshold
        weight: parseFloat(formData.weight) || 0,
        // Ensure arrays are properly formatted
        tags: Array.isArray(formData.tags) ? formData.tags : [],
        images: Array.isArray(formData.images)
          ? formData.images.filter((img) => img && img.trim() !== "")
          : [],
        variants: Array.isArray(formData.variants) ? formData.variants : [],
        // Handle onSale flag
        onSale: formData.originalPrice > formData.price,
        // Ensure SEO keywords are array
        seo: {
          ...formData.seo,
          keywords: Array.isArray(formData.seo.keywords)
            ? formData.seo.keywords
            : typeof formData.seo.keywords === "string"
            ? formData.seo.keywords
                .split(",")
                .map((k) => k.trim())
                .filter((k) => k)
            : [],
        },
      };

      await onSave(productData);
      onClose();
    } catch (error) {
      // Set general error
      setErrors((prev) => ({
        ...prev,
        form:
          error.response?.data?.message ||
          "Failed to save product. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {mode === "add" ? "Add New Product" : "Edit Product"}
              </h2>
              <p className="text-gray-600">
                {mode === "add"
                  ? "Fill in the details to add a new product"
                  : "Update product information"}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Error Alert */}
          {errors.form && (
            <div className="mx-6 mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <p className="text-sm text-rose-700">{errors.form}</p>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    disabled={loading}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors disabled:opacity-50 ${
                      activeTab === tab.id
                        ? "border-purple-600 text-purple-600"
                        : "border-transparent text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto max-h-[60vh]">
            <form onSubmit={handleSubmit} className="p-6">
              {/* Basic Info Tab - NO CHANGES NEEDED */}
              {activeTab === "basic" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                        className={`input-modern ${
                          errors.name ? "border-rose-500" : ""
                        }`}
                        placeholder="e.g., Premium Cotton T-Shirt"
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SKU *
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          name="sku"
                          value={formData.sku}
                          onChange={handleInputChange}
                          disabled={loading}
                          required
                          className={`input-modern flex-1 ${
                            errors.sku ? "border-rose-500" : ""
                          }`}
                          placeholder="e.g., FS-MEN-001"
                        />
                        <button
                          type="button"
                          onClick={generateSKU}
                          disabled={loading}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          Generate
                        </button>
                      </div>
                      {errors.sku && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors.sku}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        disabled={loading}
                        required
                        className={`input-modern ${
                          errors.category ? "border-rose-500" : ""
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category
                      </label>
                      <input
                        type="text"
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="input-modern"
                        placeholder="e.g., T-Shirts"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <input
                      type="text"
                      value={formData.tags.join(", ")}
                      onChange={handleTagsChange}
                      disabled={loading}
                      className="input-modern"
                      placeholder="e.g., cotton, casual, summer (comma separated)"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Add tags to help customers find this product
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="featured"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm text-gray-700"
                      >
                        Featured Product
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isNewArrival"
                        name="isNewArrival"
                        checked={formData.isNewArrival}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="isNewArrival"
                        className="text-sm text-gray-700"
                      >
                        New Arrival
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing Tab - REMOVED Inventory Fields */}
              {activeTab === "pricing" && (
                <div className="space-y-6">
                  {/* Inventory Information Banner */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Inventory Management
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          Stock is now managed through the separate Inventory
                          system. Add variants with initial stock quantities on
                          the Variants tab.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowInventoryInfo(true)}
                          className="text-sm text-blue-600 hover:text-blue-800 mt-2 flex items-center gap-1"
                        >
                          Learn more about inventory management
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Selling Price (DT) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          disabled={loading}
                          required
                          step="0.01"
                          min="0.01"
                          className={`input-modern pl-10 ${
                            errors.price ? "border-rose-500" : ""
                          }`}
                          placeholder="29.99"
                        />
                      </div>
                      {errors.price && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Original Price (DT)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleInputChange}
                          disabled={loading}
                          step="0.01"
                          min="0"
                          className={`input-modern pl-10 ${
                            errors.originalPrice ? "border-rose-500" : ""
                          }`}
                          placeholder="39.99"
                        />
                      </div>
                      {errors.originalPrice && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors.originalPrice}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cost Price (DT)
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="costPrice"
                          value={formData.costPrice}
                          onChange={handleInputChange}
                          disabled={loading}
                          step="0.01"
                          min="0"
                          className={`input-modern pl-10 ${
                            errors.costPrice ? "border-rose-500" : ""
                          }`}
                          placeholder="15.50"
                        />
                      </div>
                      {errors.costPrice && (
                        <p className="mt-1 text-sm text-rose-600">
                          {errors.costPrice}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        {
                          value: "draft",
                          label: "Draft",
                          color: "bg-gray-500",
                        },
                        {
                          value: "active",
                          label: "Active",
                          color: "bg-green-500",
                        },
                        {
                          value: "out-of-stock",
                          label: "Out of Stock", // This will be auto-updated by inventory
                          color: "bg-rose-500",
                        },
                        {
                          value: "archived",
                          label: "Archived",
                          color: "bg-gray-700",
                        },
                      ].map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              status: status.value,
                            }))
                          }
                          disabled={loading}
                          className={`p-3 rounded-xl border-2 transition-all disabled:opacity-50 ${
                            formData.status === status.value
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${status.color}`}
                            ></div>
                            <span className="font-medium">{status.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Note: "Out of Stock" status is automatically updated based
                      on inventory levels
                    </p>
                  </div>
                </div>
              )}

              {/* Media Tab - NO CHANGES NEEDED */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  {/* Upload Errors */}
                  {imageErrors.upload && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <p className="text-sm text-rose-700">
                          {imageErrors.upload}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Image Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Images from Device
                    </label>
                    <div
                      className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag & drop images here or click to browse
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Supports JPG, PNG, GIF, WEBP up to 5MB each
                      </p>

                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                        multiple
                        className="hidden"
                      />

                      <Button
                        type="button"
                        variant="outline"
                        className="mt-4"
                        disabled={loading}
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                      >
                        Browse Files
                      </Button>

                      {/* Uploading indicator */}
                      {uploadingImages.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-2">
                            Uploading:
                          </p>
                          <div className="space-y-1">
                            {uploadingImages.map((filename, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 text-sm text-gray-500"
                              >
                                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                                <span className="truncate">{filename}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Image URLs Section */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Or Add Image URLs
                      </label>
                      <Button
                        type="button"
                        size="small"
                        variant="outline"
                        onClick={handleAddImageUrl}
                        disabled={loading || formData.images.length >= 10}
                        className="flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add URL
                      </Button>
                    </div>

                    {errors.images && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-amber-600" />
                          <p className="text-sm text-amber-700">
                            {errors.images}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            {image ? (
                              image.startsWith("data:") ||
                              image.startsWith("http") ? (
                                <img
                                  src={image}
                                  alt={`Product ${index + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "";
                                    setImageErrors((prev) => ({
                                      ...prev,
                                      [index]: "Failed to load image",
                                    }));
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <AlertCircle className="w-8 h-8 text-amber-400" />
                                </div>
                              )
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>

                          {/* URL Input */}
                          <div className="mt-2">
                            <input
                              type="url"
                              value={image}
                              onChange={(e) =>
                                handleImageUrlChange(index, e.target.value)
                              }
                              disabled={loading}
                              className="input-modern text-sm"
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>

                          {/* Error message */}
                          {imageErrors[index] && (
                            <p className="mt-1 text-xs text-rose-600">
                              {imageErrors[index]}
                            </p>
                          )}

                          {/* Remove button */}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            disabled={loading}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 hover:bg-rose-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {/* Add Image Button */}
                      {formData.images.length === 0 && (
                        <div className="col-span-full text-center py-8">
                          <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600">No images added yet</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Upload images or add image URLs
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Image count */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <span>
                        {formData.images.length} image
                        {formData.images.length !== 1 ? "s" : ""} added
                      </span>
                      <span>{formData.images.length}/10 maximum</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Description Tab - NO CHANGES NEEDED */}
              {activeTab === "description" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Short Description
                    </label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      disabled={loading}
                      rows="3"
                      className="input-modern"
                      placeholder="Brief description for product cards and listings"
                    />
                    <div className="flex justify-between mt-2">
                      <p className="text-sm text-gray-500">
                        Max 160 characters recommended for SEO
                      </p>
                      <span
                        className={`text-sm ${
                          formData.shortDescription.length > 160
                            ? "text-rose-600"
                            : "text-gray-500"
                        }`}
                      >
                        {formData.shortDescription.length}/160
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={loading}
                      required
                      rows="8"
                      className={`input-modern ${
                        errors.description ? "border-rose-500" : ""
                      }`}
                      placeholder="Detailed product description with features, benefits, etc."
                    />
                    {errors.description && (
                      <p className="mt-1 text-sm text-rose-600">
                        {errors.description}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Use rich text formatting to make the description engaging
                    </p>
                  </div>
                </div>
              )}

              {/* Specifications Tab - NO CHANGES NEEDED */}
              {activeTab === "specifications" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Material
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.material}
                        onChange={(e) =>
                          handleNestedChange(
                            "specifications",
                            "material",
                            e.target.value
                          )
                        }
                        disabled={loading}
                        className="input-modern"
                        placeholder="e.g., 100% Organic Cotton"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.weight}
                        onChange={(e) =>
                          handleNestedChange(
                            "specifications",
                            "weight",
                            e.target.value
                          )
                        }
                        disabled={loading}
                        className="input-modern"
                        placeholder="e.g., 180 GSM"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Fit
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.fit}
                        onChange={(e) =>
                          handleNestedChange(
                            "specifications",
                            "fit",
                            e.target.value
                          )
                        }
                        disabled={loading}
                        className="input-modern"
                        placeholder="e.g., Regular Fit"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Care Instructions
                      </label>
                      <input
                        type="text"
                        value={formData.specifications.care}
                        onChange={(e) =>
                          handleNestedChange(
                            "specifications",
                            "care",
                            e.target.value
                          )
                        }
                        disabled={loading}
                        className="input-modern"
                        placeholder="e.g., Machine Washable"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Specifications
                    </label>
                    <textarea
                      rows="4"
                      disabled={loading}
                      className="input-modern"
                      placeholder="Add any additional specifications here..."
                    />
                  </div>
                </div>
              )}

              {/* Shipping Tab - NO CHANGES NEEDED */}
              {activeTab === "shipping" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Weight (kg)
                      </label>
                      <input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        disabled={loading}
                        step="0.01"
                        min="0"
                        className="input-modern"
                        placeholder="0.5"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="freeShipping"
                        name="freeShipping"
                        checked={formData.freeShipping}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="freeShipping"
                        className="text-sm text-gray-700"
                      >
                        Free Shipping
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dimensions (cm)
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Length
                        </label>
                        <input
                          type="number"
                          value={formData.dimensions.length}
                          onChange={(e) =>
                            handleNestedChange(
                              "dimensions",
                              "length",
                              e.target.value
                            )
                          }
                          disabled={loading}
                          step="0.1"
                          min="0"
                          className="input-modern"
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Width
                        </label>
                        <input
                          type="number"
                          value={formData.dimensions.width}
                          onChange={(e) =>
                            handleNestedChange(
                              "dimensions",
                              "width",
                              e.target.value
                            )
                          }
                          disabled={loading}
                          step="0.1"
                          min="0"
                          className="input-modern"
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Height
                        </label>
                        <input
                          type="number"
                          value={formData.dimensions.height}
                          onChange={(e) =>
                            handleNestedChange(
                              "dimensions",
                              "height",
                              e.target.value
                            )
                          }
                          disabled={loading}
                          step="0.1"
                          min="0"
                          className="input-modern"
                          placeholder="10"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SEO Tab - NO CHANGES NEEDED */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
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
                      value={formData.seo.title}
                      onChange={(e) =>
                        handleNestedChange("seo", "title", e.target.value)
                      }
                      disabled={loading}
                      className={`input-modern ${
                        errors.seoTitle ? "border-rose-500" : ""
                      }`}
                      placeholder="e.g., Premium Cotton T-Shirt - DAR ENNAR Tunisia"
                    />
                    {errors.seoTitle && (
                      <p className="mt-1 text-sm text-rose-600">
                        {errors.seoTitle}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Meta Description
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
                      value={formData.seo.description}
                      onChange={(e) =>
                        handleNestedChange("seo", "description", e.target.value)
                      }
                      disabled={loading}
                      rows="3"
                      className={`input-modern ${
                        errors.seoDescription ? "border-rose-500" : ""
                      }`}
                      placeholder="Brief description for search engines"
                    />
                    {errors.seoDescription && (
                      <p className="mt-1 text-sm text-rose-600">
                        {errors.seoDescription}
                      </p>
                    )}
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 150-160 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Keywords
                    </label>
                    <input
                      type="text"
                      value={formData.seo.keywords.join(", ")}
                      onChange={(e) =>
                        handleNestedChange(
                          "seo",
                          "keywords",
                          e.target.value.split(",").map((k) => k.trim())
                        )
                      }
                      disabled={loading}
                      className="input-modern"
                      placeholder="e.g., t-shirt, cotton, casual wear, men's clothing"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Separate keywords with commas
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL Slug
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        DAR ENNAR.tn/products/
                      </span>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        disabled={loading}
                        className="input-modern flex-1"
                        placeholder="premium-cotton-t-shirt"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab - UPDATED with Inventory Info */}
              {activeTab === "variants" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        Product Variants
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Each variant will create a separate inventory item
                      </p>
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddVariant}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add Variant
                    </Button>
                  </div>

                  {formData.variants.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-2xl">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        No variants added yet
                      </p>
                      <p className="text-sm text-gray-500 mb-4">
                        Add variants for different colors, sizes, or styles
                      </p>
                      <div className="p-4 bg-gray-50 rounded-lg inline-block">
                        <p className="text-sm text-gray-700">
                          <strong>Note:</strong> Stock for each variant will be
                          managed in the Inventory system after product creation
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="p-3 text-left font-medium text-gray-700">
                              Color
                            </th>
                            <th className="p-3 text-left font-medium text-gray-700">
                              Size
                            </th>
                            <th className="p-3 text-left font-medium text-gray-700">
                              Price (DT)
                            </th>
                            <th className="p-3 text-left font-medium text-gray-700">
                              Initial Stock
                            </th>
                            <th className="p-3 text-left font-medium text-gray-700">
                              SKU
                            </th>
                            <th className="p-3 text-left font-medium text-gray-700">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {formData.variants.map((variant, index) => (
                            <tr key={index}>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={variant.color}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "color",
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                  className="input-modern text-sm"
                                  placeholder="Navy Blue"
                                />
                              </td>
                              <td className="p-3">
                                <select
                                  value={variant.size}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "size",
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                  className="input-modern text-sm"
                                >
                                  <option value="">Select size</option>
                                  {["XS", "S", "M", "L", "XL", "XXL"].map(
                                    (size) => (
                                      <option key={size} value={size}>
                                        {size}
                                      </option>
                                    )
                                  )}
                                </select>
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  value={variant.price}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "price",
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                  step="0.01"
                                  min="0"
                                  className="input-modern text-sm"
                                  placeholder="29.99"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="number"
                                  value={variant.stock}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "stock",
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                  min="0"
                                  className="input-modern text-sm"
                                  placeholder="50"
                                />
                              </td>
                              <td className="p-3">
                                <input
                                  type="text"
                                  value={variant.sku}
                                  onChange={(e) =>
                                    handleVariantChange(
                                      index,
                                      "sku",
                                      e.target.value
                                    )
                                  }
                                  disabled={loading}
                                  className="input-modern text-sm"
                                  placeholder="FS-MEN-001-NAVY-M"
                                />
                              </td>
                              <td className="p-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(index)}
                                  disabled={loading}
                                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg disabled:opacity-50"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-blue-900 mb-2">
                      Inventory Management Information
                    </h4>
                    <ul className="text-sm text-blue-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          Each variant creates a separate inventory item
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          Initial stock set here will be used to create
                          inventory records
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          After creation, manage stock through the Inventory
                          system
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span>
                          Product status will auto-update based on inventory
                          levels
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Form Actions */}
              <div className="mt-8 pt-8 border-t border-gray-200 flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      {mode === "add" ? "Adding..." : "Updating..."}
                    </div>
                  ) : mode === "add" ? (
                    "Add Product"
                  ) : (
                    "Update Product"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Inventory Info Modal */}
      {showInventoryInfo && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowInventoryInfo(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Inventory Management System
                    </h3>
                    <p className="text-gray-600 mt-1">
                      How stock is managed in the new system
                    </p>
                  </div>
                  <button
                    onClick={() => setShowInventoryInfo(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Old System (Deprecated)
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Stock managed directly in Product model</li>
                      <li>• No tracking of movements or changes</li>
                      <li>• No support for multiple warehouses/locations</li>
                      <li>• Limited reporting capabilities</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-xl">
                    <h4 className="font-medium text-green-900 mb-2">
                      New Inventory System
                    </h4>
                    <ul className="text-sm text-green-700 space-y-2">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Separate Inventory Model:</strong> Each
                          variant gets its own inventory record
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Complete Tracking:</strong> Every stock
                          movement is logged with reason and user
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Multiple Locations:</strong> Track stock
                          across different warehouses
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Advanced Reporting:</strong> Get insights on
                          stock levels, turnover, and more
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>
                          <strong>Auto Status Updates:</strong> Product status
                          updates based on inventory levels
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl">
                    <h4 className="font-medium text-blue-900 mb-2">
                      What This Means for You
                    </h4>
                    <div className="text-sm text-blue-700 space-y-2">
                      <p>
                        <strong>When creating products:</strong>
                      </p>
                      <ol className="list-decimal pl-5 space-y-1">
                        <li>Add variants with initial stock quantities</li>
                        <li>System automatically creates inventory records</li>
                        <li>Each variant gets its own inventory item</li>
                      </ol>
                      <p className="mt-2">
                        <strong>After creation:</strong>
                      </p>
                      <p>
                        Manage stock through the Inventory Management page, not
                        the product page
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
                  <Button onClick={() => setShowInventoryInfo(false)}>
                    Got it!
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductModal;
