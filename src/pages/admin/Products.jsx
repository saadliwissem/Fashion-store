import React, { useState, useEffect } from "react";
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
  RefreshCw,
  Star,
  TrendingUp,
  Percent,
  Layers,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/common/Button";
import ProductModal from "./ProductModal";
import DeleteConfirmation from "./DeleteConfirmation";
import toast from "react-hot-toast";
import { adminAPI } from "../../services/api";

// Product Card Component for Grid View
const ProductCard = ({
  product,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
}) => {
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

  const statusConfig = getStatusConfig(product.status);
  const StatusIcon = statusConfig.icon;
  const discountPercentage = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-gray-400" />
          </div>
        )}

        {/* Selection checkbox */}
        <div className="absolute top-4 right-4">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onSelect(product._id)}
            className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 bg-white"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.featured && (
            <span className="badge badge-featured">Featured</span>
          )}
          {product.onSale && discountPercentage > 0 && (
            <span className="badge badge-sale">{discountPercentage}% OFF</span>
          )}
          {product.isNewArrival && <span className="badge badge-new">New</span>}
        </div>

        {/* Stock badge */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900 truncate">{product.name}</h3>
            <span className="text-lg font-bold text-gray-900 whitespace-nowrap">
              {product.price.toFixed(2)} DT
            </span>
          </div>

          {product.originalPrice && product.originalPrice > product.price && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                {product.originalPrice.toFixed(2)} DT
              </span>
              <span className="text-xs text-rose-600 font-medium">
                Save {discountPercentage}%
              </span>
            </div>
          )}

          <p className="text-sm text-gray-500 mt-1 truncate">{product.sku}</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Package className="w-3 h-3" />
              Category:
            </span>
            <span className="font-medium">
              {product.category?.name || "Uncategorized"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Layers className="w-3 h-3" />
              Stock:
            </span>
            <span
              className={`font-medium ${
                product.stock === 0
                  ? "text-rose-600"
                  : product.stock <= (product.lowStockThreshold || 10)
                  ? "text-amber-600"
                  : "text-green-600"
              }`}
            >
              {product.stock} units
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <Star className="w-3 h-3" />
              Rating:
            </span>
            <span className="font-medium">
              {product.averageRating || 0} ⭐ ({product.reviewCount || 0})
            </span>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
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
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onEdit(product)}
            className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDuplicate(product)}
            className="py-2.5 px-4 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            title="Duplicate"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product)}
            className="py-2.5 px-4 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    inStock: 0,
    outOfStock: 0,
    totalValue: 0,
    averageRating: 0,
    totalRevenue: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const pageSize = 10;

  // Fetch products from API
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pageSize,
        sortBy: getSortParam(sortBy),
        sortOrder: getSortOrder(sortBy),
        category: filterCategory !== "all" ? filterCategory : undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        search: searchTerm || undefined,
      };

      const response = await adminAPI.getProducts(params);
      const productsData = response.data.products || response.data;

      setProducts(productsData);
      setCurrentPage(response.data.page || page);
      setTotalPages(response.data.pages || 1);
      setTotalProducts(response.data.total || productsData.length);

      // Update stats
      updateStats(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories for filter
  const fetchCategories = async () => {
    try {
      const response = await adminAPI.getCategories({ limit: 100 });
      setCategories(response.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const updateStats = (productsData) => {
    const total = productsData.length;
    const inStock = productsData.filter((p) => p.stock > 0).length;
    const outOfStock = productsData.filter((p) => p.stock === 0).length;
    const totalValue = productsData.reduce(
      (sum, p) => sum + p.price * (p.stock || 0),
      0
    );
    const averageRating =
      productsData.length > 0
        ? productsData.reduce((sum, p) => sum + (p.averageRating || 0), 0) /
          productsData.length
        : 0;
    const totalRevenue = productsData.reduce(
      (sum, p) => sum + (p.purchaseCount || 0) * p.price,
      0
    );

    setStats({
      total,
      inStock,
      outOfStock,
      totalValue,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalRevenue,
    });
  };

  const getSortParam = (sort) => {
    switch (sort) {
      case "price-low":
      case "price-high":
        return "price";
      case "stock-low":
      case "stock-high":
        return "stock";
      case "sales-high":
        return "purchaseCount";
      default:
        return "createdAt";
    }
  };

  const getSortOrder = (sort) => {
    switch (sort) {
      case "price-low":
      case "stock-low":
      case "oldest":
        return "asc";
      default:
        return "desc";
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage === 1) {
        fetchProducts(1);
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterCategory, filterStatus, sortBy]);

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "out-of-stock", label: "Out of Stock" },
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

  const handleSelectAll = () => {
    if (selectedProducts.length === products.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(products.map((p) => p._id));
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

  const handleDuplicateProduct = async (product) => {
    try {
      const { _id, createdAt, updatedAt, __v, ...productData } = product;
      const duplicateData = {
        ...productData,
        name: `${productData.name} (Copy)`,
        sku: `${productData.sku}-COPY`,
        slug: `${productData.slug}-copy`,
        purchaseCount: 0,
        viewCount: 0,
      };

      await adminAPI.createProduct(duplicateData);
      toast.success(`Product "${product.name}" duplicated successfully`);
      fetchProducts();
    } catch (error) {
      console.error("Error duplicating product:", error);
      toast.error(
        error.response?.data?.message || "Failed to duplicate product"
      );
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedProducts.length === 0) {
      toast.error("Please select products first");
      return;
    }

    try {
      switch (action) {
        case "activate":
          await adminAPI.bulkUpdateProducts({
            productIds: selectedProducts,
            updateData: { status: "active" },
          });
          toast.success(`Activated ${selectedProducts.length} products`);
          break;
        case "deactivate":
          await adminAPI.bulkUpdateProducts({
            productIds: selectedProducts,
            updateData: { status: "draft" },
          });
          toast.success(`Deactivated ${selectedProducts.length} products`);
          break;
        case "feature":
          await adminAPI.bulkUpdateProducts({
            productIds: selectedProducts,
            updateData: { featured: true },
          });
          toast.success(`Featured ${selectedProducts.length} products`);
          break;
        case "unfeature":
          await adminAPI.bulkUpdateProducts({
            productIds: selectedProducts,
            updateData: { featured: false },
          });
          toast.success(`Unfeatured ${selectedProducts.length} products`);
          break;
        case "delete":
          setShowDeleteModal(true);
          break;
        case "export":
          // Export functionality
          const exportData = products.filter((p) =>
            selectedProducts.includes(p._id)
          );
          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `products-export-${
            new Date().toISOString().split("T")[0]
          }.json`;
          link.click();
          toast.success(`Exported ${selectedProducts.length} products`);
          break;
      }

      if (action !== "delete" && action !== "export") {
        fetchProducts();
        setSelectedProducts([]);
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to ${action} products`);
    }
  };

  const calculateProfit = (product) => {
    return (product.price - (product.costPrice || 0)).toFixed(2);
  };

  const calculateProfitMargin = (product) => {
    if (product.price > 0) {
      return (
        ((product.price - (product.costPrice || 0)) / product.price) *
        100
      ).toFixed(1);
    }
    return "0.0";
  };

  const handleAddProduct = async (productData) => {
    try {
      await adminAPI.createProduct(productData);
      toast.success(`Product "${productData.name}" added successfully`);
      setShowAddModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await adminAPI.updateProduct(selectedProduct._id, productData);
      toast.success(`Product "${productData.name}" updated successfully`);
      setShowEditModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || "Failed to update product");
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedProducts.map((id) => adminAPI.deleteProduct(id))
      );
      toast.success(`${selectedProducts.length} products deleted successfully`);
      setShowDeleteModal(false);
      setSelectedProducts([]);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting products:", error);
      toast.error(error.response?.data?.message || "Failed to delete products");
    }
  };

  const handleSingleDelete = async () => {
    try {
      await adminAPI.deleteProduct(selectedProduct._id);
      toast.success(`Product "${selectedProduct.name}" deleted successfully`);
      setShowDeleteModal(false);
      setSelectedProduct(null);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || "Failed to delete product");
    }
  };

  const renderTableView = () => {
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No products found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 p-4">
                  <input
                    type="checkbox"
                    checked={
                      selectedProducts.length === products.length &&
                      products.length > 0
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
              {products.map((product) => {
                const statusConfig = getStatusConfig(product.status);
                const StatusIcon = statusConfig.icon;
                const profit = calculateProfit(product);
                const profitMargin = calculateProfitMargin(product);
                const discountPercentage = product.originalPrice
                  ? Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )
                  : 0;

                return (
                  <tr key={product._id} className="hover:bg-gray-50 group">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product._id)}
                        onChange={() => handleSelectProduct(product._id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 truncate max-w-xs">
                            {product.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {product.featured && (
                              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                                Featured
                              </span>
                            )}
                            {product.onSale && discountPercentage > 0 && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                                {discountPercentage}% OFF
                              </span>
                            )}
                            {product.isNewArrival && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                New
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <code className="font-mono text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded">
                        {product.sku}
                      </code>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="text-gray-700">
                          {product.category?.name || "Uncategorized"}
                        </span>
                        <p className="text-xs text-gray-500">
                          {product.subCategory || "-"}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <span className="font-bold text-gray-900">
                          {product.price.toFixed(2)} DT
                        </span>
                        {product.originalPrice &&
                          product.originalPrice > product.price && (
                            <p className="text-sm text-gray-400 line-through">
                              {product.originalPrice.toFixed(2)} DT
                            </p>
                          )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <span
                          className={`font-medium ${
                            product.stock === 0
                              ? "text-rose-600"
                              : product.stock <=
                                (product.lowStockThreshold || 10)
                              ? "text-amber-600"
                              : "text-green-600"
                          }`}
                        >
                          {product.stock}
                        </span>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div
                            className={`h-1.5 rounded-full ${
                              product.stock === 0
                                ? "bg-rose-500"
                                : product.stock <=
                                  (product.lowStockThreshold || 10)
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (product.stock /
                                  ((product.lowStockThreshold || 10) * 3)) *
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
                          {profit} DT
                        </span>
                        <p className="text-xs text-gray-500">
                          {profitMargin}% margin
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicateProduct(product)}
                          className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                          title="Duplicate"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product)}
                          className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
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
            Showing {products.length} of {totalProducts} products
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-2 border border-gray-300 rounded-lg ${
                currentPage === 1
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                      currentPage === pageNum
                        ? "bg-purple-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 3 && <span className="px-2">...</span>}
              {totalPages > 3 && (
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                    currentPage === totalPages
                      ? "bg-purple-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {totalPages}
                </button>
              )}
            </div>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-2 border border-gray-300 rounded-lg ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-50"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderGridView = () => {
    if (products.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No products found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            isSelected={selectedProducts.includes(product._id)}
            onSelect={handleSelectProduct}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onDuplicate={handleDuplicateProduct}
          />
        ))}
      </div>
    );
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
            <button
              onClick={() => fetchProducts()}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleBulkAction("export")}
              disabled={selectedProducts.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="w-4 h-4" />
              Add Product
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        )}

        {/* Content when not loading */}
        {!loading && (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.total}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      {/* Growth can be calculated from historical data */}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">In Stock</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.inStock}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {products.filter((p) => p.status === "low-stock").length}{" "}
                      low stock
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Out of Stock</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.outOfStock}
                    </p>
                    <p className="text-sm text-rose-600 mt-1">
                      Requires attention
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-rose-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Value</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.totalValue.toFixed(2)} DT
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Inventory value
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Filters and Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
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
                      <option value="all">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
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
                      {statusOptions.map((status) => (
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
                      className={`px-4 py-3 transition-colors ${
                        viewMode === "table"
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-50 text-gray-700"
                      }`}
                    >
                      Table
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-4 py-3 transition-colors ${
                        viewMode === "grid"
                          ? "bg-purple-600 text-white"
                          : "hover:bg-gray-50 text-gray-700"
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
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg flex items-center justify-center font-semibold">
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
                      Activate
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleBulkAction("deactivate")}
                    >
                      Draft
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      onClick={() => handleBulkAction("feature")}
                    >
                      Feature
                    </Button>
                    <Button
                      size="small"
                      variant="outline"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => handleBulkAction("delete")}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Content */}
            {viewMode === "table" ? renderTableView() : renderGridView()}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Stock Overview
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">In Stock</span>
                      <span className="font-medium">{stats.inStock}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats.total > 0
                              ? (stats.inStock / stats.total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Low Stock</span>
                      <span className="font-medium">
                        {
                          products.filter((p) => p.status === "low-stock")
                            .length
                        }
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-amber-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats.total > 0
                              ? (products.filter(
                                  (p) => p.status === "low-stock"
                                ).length /
                                  stats.total) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Out of Stock</span>
                      <span className="font-medium">{stats.outOfStock}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-rose-500 h-2 rounded-full"
                        style={{
                          width: `${
                            stats.total > 0
                              ? (stats.outOfStock / stats.total) * 100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Categories Distribution
                </h3>
                <div className="space-y-4">
                  {categories.slice(0, 3).map((category) => {
                    const count = products.filter(
                      (p) => p.category?._id === category._id
                    ).length;
                    return (
                      <div key={category._id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">{category.name}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-purple-500 h-2 rounded-full"
                            style={{
                              width: `${
                                stats.total > 0
                                  ? (count / stats.total) * 100
                                  : 0
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Quick Actions
                </h3>
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
          </>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <ProductModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          mode="add"
          categories={categories}
          onSave={handleAddProduct}
        />
      )}

      {showEditModal && selectedProduct && (
        <ProductModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedProduct(null);
          }}
          mode="edit"
          product={selectedProduct}
          categories={categories}
          onSave={handleUpdateProduct}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedProduct(null);
          }}
          onConfirm={selectedProduct ? handleSingleDelete : handleBulkDelete}
          title={
            selectedProduct
              ? `Delete "${selectedProduct.name}"`
              : `Delete ${selectedProducts.length} products`
          }
          message={
            selectedProduct
              ? `Are you sure you want to delete "${selectedProduct.name}"? This action cannot be undone.`
              : `Are you sure you want to delete ${selectedProducts.length} selected products? This action cannot be undone.`
          }
        />
      )}
    </AdminLayout>
  );
};

export default Products;
