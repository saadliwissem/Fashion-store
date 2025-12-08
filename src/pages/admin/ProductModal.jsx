import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import Button from "../../components/common/Button";

const ProductModal = ({ isOpen, onClose, mode = "add", product = null }) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    subCategory: "",
    price: "",
    originalPrice: "",
    cost: "",
    stock: "",
    lowStockThreshold: "10",
    description: "",
    shortDescription: "",
    status: "draft",
    featured: false,
    onSale: false,
    tags: [],
    images: [],
    specifications: {
      material: "",
      weight: "",
      fit: "",
      care: "",
    },
    seo: {
      title: "",
      description: "",
      keywords: "",
    },
    variants: [],
  });

  const categories = ["Men", "Women", "Kids", "Accessories"];

  const subCategories = {
    Men: ["T-Shirts", "Shirts", "Jeans", "Hoodies", "Jackets", "Shorts"],
    Women: ["Dresses", "Tops", "Skirts", "Jeans", "Jackets", "Activewear"],
    Kids: ["Boys", "Girls", "Baby"],
    Accessories: ["Bags", "Shoes", "Watches", "Jewelry", "Belts"],
  };

  const statusOptions = [
    { value: "draft", label: "Draft", color: "bg-gray-100 text-gray-800" },
    { value: "active", label: "Active", color: "bg-green-100 text-green-800" },
    {
      value: "out-of-stock",
      label: "Out of Stock",
      color: "bg-rose-100 text-rose-800",
    },
    {
      value: "archived",
      label: "Archived",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const tabs = [
    { id: "basic", label: "Basic Info", icon: Package },
    { id: "pricing", label: "Pricing & Inventory", icon: DollarSign },
    { id: "media", label: "Media", icon: ImageIcon },
    { id: "description", label: "Description", icon: AlignLeft },
    { id: "specifications", label: "Specifications", icon: Settings },
    { id: "seo", label: "SEO", icon: Globe },
    { id: "variants", label: "Variants", icon: Tag },
  ];

  useEffect(() => {
    if (mode === "edit" && product) {
      setFormData(product);
    }
  }, [mode, product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
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

  const handleAddImage = () => {
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
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData((prev) => ({ ...prev, images: newImages }));
  };

  const handleAddVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        { color: "", size: "", price: "", stock: "", sku: "" },
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
    newVariants[index] = { ...newVariants[index], [field]: value };
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const generateSKU = () => {
    const prefix = "FS";
    const categoryCode = formData.category
      ? formData.category.substring(0, 3).toUpperCase()
      : "GEN";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const sku = `${prefix}-${categoryCode}-${randomNum}`;
    setFormData((prev) => ({ ...prev, sku }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onClose();
      // Show success message
      alert(
        `${mode === "add" ? "Product added" : "Product updated"} successfully!`
      );
    }, 1500);
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
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
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
              {/* Basic Info Tab */}
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
                        required
                        className="input-modern"
                        placeholder="e.g., Premium Cotton T-Shirt"
                      />
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
                          required
                          className="input-modern flex-1"
                          placeholder="e.g., FS-MEN-001"
                        />
                        <button
                          type="button"
                          onClick={generateSKU}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                        >
                          Generate
                        </button>
                      </div>
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
                        required
                        className="input-modern"
                      >
                        <option value="">Select category</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sub Category
                      </label>
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleInputChange}
                        className="input-modern"
                      >
                        <option value="">Select sub-category</option>
                        {formData.category &&
                          subCategories[formData.category]?.map((subCat) => (
                            <option key={subCat} value={subCat}>
                              {subCat}
                            </option>
                          ))}
                      </select>
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
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label
                        htmlFor="featured"
                        className="text-sm text-gray-700"
                      >
                        Mark as Featured Product
                      </label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="onSale"
                        name="onSale"
                        checked={formData.onSale}
                        onChange={handleInputChange}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor="onSale" className="text-sm text-gray-700">
                        Put on Sale
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Pricing & Inventory Tab */}
              {activeTab === "pricing" && (
                <div className="space-y-6">
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
                          required
                          step="0.01"
                          min="0"
                          className="input-modern pl-10"
                          placeholder="29.99"
                        />
                      </div>
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
                          step="0.01"
                          min="0"
                          className="input-modern pl-10"
                          placeholder="39.99"
                        />
                      </div>
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
                          name="cost"
                          value={formData.cost}
                          onChange={handleInputChange}
                          step="0.01"
                          min="0"
                          className="input-modern pl-10"
                          placeholder="15.50"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="input-modern"
                        placeholder="150"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Low Stock Threshold
                      </label>
                      <input
                        type="number"
                        name="lowStockThreshold"
                        value={formData.lowStockThreshold}
                        onChange={handleInputChange}
                        min="0"
                        className="input-modern"
                        placeholder="10"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Get notified when stock falls below this number
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {statusOptions.map((status) => (
                        <button
                          key={status.value}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              status: status.value,
                            }))
                          }
                          className={`p-3 rounded-xl border-2 transition-all ${
                            formData.status === status.value
                              ? "border-purple-500 bg-purple-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-3 h-3 rounded-full ${
                                status.color.split(" ")[0]
                              }`}
                            ></div>
                            <span className="font-medium">{status.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Media Tab */}
              {activeTab === "media" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      Product Images
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                            {image ? (
                              <img
                                src={image}
                                alt={`Product ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <input
                            type="text"
                            value={image}
                            onChange={(e) =>
                              handleImageChange(index, e.target.value)
                            }
                            className="mt-2 input-modern text-sm"
                            placeholder="Image URL"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddImage}
                        className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:border-purple-500 hover:text-purple-600 transition-colors"
                      >
                        <Plus className="w-8 h-8" />
                        <span className="mt-2 text-sm">Add Image</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Image Upload
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">
                        Drag & drop images here or click to browse
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports JPG, PNG, WEBP up to 5MB
                      </p>
                      <Button type="button" variant="outline" className="mt-4">
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Description Tab */}
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
                      rows="3"
                      className="input-modern"
                      placeholder="Brief description for product cards and listings"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Max 160 characters recommended for SEO
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows="8"
                      className="input-modern"
                      placeholder="Detailed product description with features, benefits, etc."
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Use rich text formatting to make the description engaging
                    </p>
                  </div>
                </div>
              )}

              {/* Specifications Tab */}
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
                      className="input-modern"
                      placeholder="Add any additional specifications here..."
                    />
                  </div>
                </div>
              )}

              {/* SEO Tab */}
              {activeTab === "seo" && (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      SEO Title
                    </label>
                    <input
                      type="text"
                      value={formData.seo.title}
                      onChange={(e) =>
                        handleNestedChange("seo", "title", e.target.value)
                      }
                      className="input-modern"
                      placeholder="e.g., Premium Cotton T-Shirt - FashionStore Tunisia"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Recommended: 50-60 characters
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Meta Description
                    </label>
                    <textarea
                      value={formData.seo.description}
                      onChange={(e) =>
                        handleNestedChange("seo", "description", e.target.value)
                      }
                      rows="3"
                      className="input-modern"
                      placeholder="Brief description for search engines"
                    />
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
                      value={formData.seo.keywords}
                      onChange={(e) =>
                        handleNestedChange("seo", "keywords", e.target.value)
                      }
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
                        fashionstore.tn/products/
                      </span>
                      <input
                        type="text"
                        className="input-modern flex-1"
                        placeholder="premium-cotton-t-shirt"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Variants Tab */}
              {activeTab === "variants" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Product Variants
                    </h3>
                    <Button
                      type="button"
                      onClick={handleAddVariant}
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
                      <p className="text-sm text-gray-500">
                        Add variants for different colors, sizes, or styles
                      </p>
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
                              Stock
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
                                  className="input-modern text-sm"
                                  placeholder="FS-MEN-001-NAVY-M"
                                />
                              </td>
                              <td className="p-3">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveVariant(index)}
                                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Variant Tips
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        • Each variant can have different price, stock, and SKU
                      </li>
                      <li>
                        • Variants will be displayed as options on the product
                        page
                      </li>
                      <li>
                        • Customers can select their preferred variant when
                        ordering
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
    </div>
  );
};

export default ProductModal;
