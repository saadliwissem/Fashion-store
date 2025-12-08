import React, { useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Copy,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
  Tag,
  Package,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/common/Button";
import ProductModal from "./ProductModal";
import DeleteConfirmation from "./DeleteConfirmation";
import toast from "react-hot-toast";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'grid'
  const [sortBy, setSortBy] = useState("newest");

  // Enhanced mock products data
  const products = [
    {
      id: 1,
      sku: "FS-MEN-001",
      name: "Premium Cotton T-Shirt",
      category: "Men",
      subCategory: "T-Shirts",
      price: 29.99,
      originalPrice: 39.99,
      cost: 15.5,
      stock: 150,
      lowStockThreshold: 20,
      status: "active",
      featured: true,
      onSale: true,
      rating: 4.8,
      reviews: 124,
      tags: ["cotton", "casual", "summer"],
      variants: [
        { color: "Navy Blue", size: "M", stock: 50 },
        { color: "Charcoal Gray", size: "L", stock: 45 },
        { color: "Forest Green", size: "XL", stock: 55 },
      ],
      images: [
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop",
      ],
      description:
        "Premium quality cotton t-shirt with excellent comfort and durability.",
      specifications: {
        material: "100% Organic Cotton",
        weight: "180 GSM",
        fit: "Regular Fit",
        care: "Machine Washable",
      },
      seo: {
        title: "Premium Cotton T-Shirt - FashionStore",
        description:
          "Buy premium cotton t-shirt online. 100% organic cotton, comfortable fit.",
        keywords: ["t-shirt", "cotton", "casual", "men"],
      },
      createdAt: "2024-11-15",
      updatedAt: "2024-12-01",
    },
    {
      id: 2,
      sku: "FS-WOM-002",
      name: "Elegant Summer Dress",
      category: "Women",
      subCategory: "Dresses",
      price: 59.99,
      originalPrice: 79.99,
      cost: 28.75,
      stock: 89,
      lowStockThreshold: 15,
      status: "active",
      featured: true,
      onSale: true,
      rating: 4.9,
      reviews: 89,
      tags: ["dress", "summer", "elegant"],
      variants: [
        { color: "Floral Pink", size: "S", stock: 30 },
        { color: "Sky Blue", size: "M", stock: 35 },
        { color: "Mint Green", size: "L", stock: 24 },
      ],
      images: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
      ],
      description: "Elegant summer dress perfect for warm weather occasions.",
      createdAt: "2024-11-20",
      updatedAt: "2024-12-01",
    },
    {
      id: 3,
      sku: "FS-WOM-003",
      name: "Designer Denim Jacket",
      category: "Women",
      subCategory: "Jackets",
      price: 89.99,
      originalPrice: 99.99,
      cost: 45.25,
      stock: 45,
      lowStockThreshold: 10,
      status: "low-stock",
      featured: false,
      onSale: false,
      rating: 4.7,
      reviews: 67,
      tags: ["jacket", "denim", "designer"],
      variants: [
        { color: "Dark Wash", size: "M", stock: 20 },
        { color: "Light Wash", size: "L", stock: 15 },
        { color: "Black", size: "XL", stock: 10 },
      ],
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
      ],
      createdAt: "2024-11-10",
      updatedAt: "2024-11-25",
    },
    {
      id: 4,
      sku: "FS-MEN-004",
      name: "Classic Polo Shirt",
      category: "Men",
      subCategory: "Shirts",
      price: 34.99,
      originalPrice: 44.99,
      cost: 18.5,
      stock: 0,
      lowStockThreshold: 25,
      status: "out-of-stock",
      featured: false,
      onSale: true,
      rating: 4.6,
      reviews: 92,
      tags: ["polo", "shirt", "classic"],
      variants: [
        { color: "Navy", size: "M", stock: 0 },
        { color: "White", size: "L", stock: 0 },
        { color: "Black", size: "XL", stock: 0 },
      ],
      images: [
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop",
      ],
      createdAt: "2024-10-30",
      updatedAt: "2024-11-28",
    },
    {
      id: 5,
      sku: "FS-MEN-005",
      name: "Casual Hoodie",
      category: "Men",
      subCategory: "Hoodies",
      price: 49.99,
      originalPrice: 59.99,
      cost: 25.75,
      stock: 200,
      lowStockThreshold: 30,
      status: "active",
      featured: true,
      onSale: false,
      rating: 4.5,
      reviews: 156,
      tags: ["hoodie", "casual", "winter"],
      variants: [
        { color: "Charcoal", size: "M", stock: 80 },
        { color: "Navy", size: "L", stock: 70 },
        { color: "Burgundy", size: "XL", stock: 50 },
      ],
      images: [
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
      ],
      createdAt: "2024-11-05",
      updatedAt: "2024-11-30",
    },
  ];

  const categories = [
    { value: "all", label: "All Categories" },
    { value: "Men", label: "Men's Clothing" },
    { value: "Women", label: "Women's Clothing" },
    { value: "Kids", label: "Kids' Clothing" },
    { value: "Accessories", label: "Accessories" },
  ];

  const statuses = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "out-of-stock", label: "Out of Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "archived", label: "Archived" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "stock-low", label: "Stock: Low to High" },
    { value: "stock-high", label: "Stock: High to Low" },
    { value: "sales-high", label: "Sales: High to Low" },
  ];

  const filteredProducts = products.filter((product) => {
    // Search filter
    const matchesSearch =
      searchTerm === "" ||
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    // Category filter
    const matchesCategory =
      filterCategory === "all" || product.category === filterCategory;

    // Status filter
    const matchesStatus =
      filterStatus === "all" || product.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map((p) => p.id));
    }
  };

  const handleSelectProduct = (productId) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "active":
        return {
          label: "Active",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "draft":
        return {
          label: "Draft",
          color: "bg-gray-100 text-gray-800",
          icon: Copy,
        };
      case "out-of-stock":
        return {
          label: "Out of Stock",
          color: "bg-rose-100 text-rose-800",
          icon: XCircle,
        };
      case "low-stock":
        return {
          label: "Low Stock",
          color: "bg-amber-100 text-amber-800",
          icon: AlertCircle,
        };
      case "archived":
        return {
          label: "Archived",
          color: "bg-gray-100 text-gray-800",
          icon: Package,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: AlertCircle,
        };
    }
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleDeleteProduct = (product) => {
    setSelectedProduct(product);
    setShowDeleteModal(true);
  };

  const handleDuplicateProduct = (product) => {
    toast.success(`Duplicated ${product.name}`);
    // In real app, make API call to duplicate
  };

  const handleBulkAction = (action) => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products first");
      return;
    }

    switch (action) {
      case "activate":
        toast.success(`Activated ${selectedProducts.length} products`);
        break;
      case "deactivate":
        toast.success(`Deactivated ${selectedProducts.length} products`);
        break;
      case "delete":
        setShowDeleteModal(true);
        break;
      case "export":
        toast.success(`Exported ${selectedProducts.length} products`);
        break;
    }
  };

  const calculateProfit = (product) => {
    return product.price - product.cost;
  };

  const calculateProfitMargin = (product) => {
    return (((product.price - product.cost) / product.price) * 100).toFixed(1);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Product Management
            </h1>
            <p className="text-gray-600">Manage your entire product catalog</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleBulkAction("export")}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {products.length}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +12% from last month
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {products.filter((p) => p.stock > 0).length}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {products.filter((p) => p.status === "low-stock").length} low
                  stock
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {products.filter((p) => p.stock === 0).length}
                </p>
                <p className="text-sm text-rose-600 mt-1">Requires attention</p>
              </div>
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-rose-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {products
                    .reduce((sum, p) => sum + p.price * p.stock, 0)
                    .toFixed(2)}{" "}
                  DT
                </p>
                <p className="text-sm text-gray-600 mt-1">Inventory value</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, SKU, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Right: Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Category Filter */}
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-3 ${
                    viewMode === "table"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`px-4 py-3 ${
                    viewMode === "grid"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Grid
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center">
                  {selectedProducts.length}
                </div>
                <span className="font-medium text-gray-900">
                  {selectedProducts.length} product
                  {selectedProducts.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="small"
                  onClick={() => handleBulkAction("activate")}
                >
                  Activate Selected
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => handleBulkAction("deactivate")}
                >
                  Deactivate
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => handleBulkAction("delete")}
                >
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Table */}
        {viewMode === "table" ? (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 p-4">
                      <input
                        type="checkbox"
                        checked={
                          selectedProducts.length === filteredProducts.length &&
                          filteredProducts.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Product
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      SKU
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Category
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Stock
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Profit
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.map((product) => {
                    const statusConfig = getStatusConfig(product.status);
                    const StatusIcon = statusConfig.icon;
                    const profit = calculateProfit(product);
                    const profitMargin = calculateProfitMargin(product);

                    return (
                      <tr key={product.id} className="hover:bg-gray-50 group">
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={selectedProducts.includes(product.id)}
                            onChange={() => handleSelectProduct(product.id)}
                            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                          />
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {product.name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {product.featured && (
                                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                    Featured
                                  </span>
                                )}
                                {product.onSale && (
                                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                    On Sale
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-sm text-gray-600">
                            {product.sku}
                          </span>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="text-gray-700">
                              {product.category}
                            </span>
                            <p className="text-xs text-gray-500">
                              {product.subCategory}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="font-bold text-gray-900">
                              {product.price.toFixed(2)} DT
                            </span>
                            {product.originalPrice && (
                              <p className="text-sm text-gray-400 line-through">
                                {product.originalPrice.toFixed(2)} DT
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="font-medium text-gray-900">
                              {product.stock}
                            </span>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div
                                className={`h-1.5 rounded-full ${
                                  product.stock === 0
                                    ? "bg-rose-500"
                                    : product.stock <= product.lowStockThreshold
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                                }`}
                                style={{
                                  width: `${Math.min(
                                    (product.stock /
                                      (product.lowStockThreshold * 3)) *
                                      100,
                                    100
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <StatusIcon className="w-4 h-4" />
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                            >
                              {statusConfig.label}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <span className="font-medium text-gray-900">
                              {profit.toFixed(2)} DT
                            </span>
                            <p className="text-xs text-gray-500">
                              {profitMargin}% margin
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDuplicateProduct(product)}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
                              title="Duplicate"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product)}
                              className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              <div className="flex items-center gap-4">
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-purple-600 text-white">
                    1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
                    2
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100">
                    3
                  </button>
                </div>
                <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  Next
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => {
              const statusConfig = getStatusConfig(product.status);
              const StatusIcon = statusConfig.icon;

              return (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden group"
                >
                  {/* Product Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {product.featured && (
                        <span className="badge badge-new">Featured</span>
                      )}
                      {product.onSale && (
                        <span className="badge badge-sale">Sale</span>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                      >
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {product.sku}
                        </p>
                      </div>
                      <span className="text-xl font-bold text-gray-900">
                        {product.price.toFixed(2)} DT
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Category:</span>
                        <span className="font-medium">{product.category}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Stock:</span>
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? "text-rose-600"
                              : product.stock <= product.lowStockThreshold
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock} units
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Rating:</span>
                        <span className="font-medium">
                          {product.rating} ⭐ ({product.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      {product.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {product.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                          +{product.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="mt-6 flex items-center gap-3">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="flex-1 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product)}
                        className="flex-1 py-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Stock Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">In Stock</span>
                  <span className="font-medium">
                    {products.filter((p) => p.stock > 0).length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (products.filter((p) => p.stock > 0).length /
                          products.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Low Stock</span>
                  <span className="font-medium">
                    {products.filter((p) => p.status === "low-stock").length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (products.filter((p) => p.status === "low-stock")
                          .length /
                          products.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="font-medium">
                    {products.filter((p) => p.stock === 0).length}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full"
                    style={{
                      width: `${
                        (products.filter((p) => p.stock === 0).length /
                          products.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Categories Distribution
            </h3>
            <div className="space-y-4">
              {["Men", "Women", "Accessories"].map((category) => {
                const count = products.filter(
                  (p) => p.category === category
                ).length;
                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">{category}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(count / products.length) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors">
                Update Inventory
              </button>
              <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors">
                Generate Stock Report
              </button>
              <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors">
                Restock Products
              </button>
              <button className="w-full text-left p-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors">
                Set Up Price Alerts
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Product Modal */}
      <ProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        mode="add"
      />

      {/* Edit Product Modal */}
      <ProductModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        mode="edit"
        product={selectedProduct}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          toast.success(`Deleted ${selectedProduct?.name}`);
          setShowDeleteModal(false);
        }}
        itemName={selectedProduct?.name}
        itemType="product"
      />
    </AdminLayout>
  );
};

export default Products;
