// pages/admin/Inventory.jsx
import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Package,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Download,
  Upload,
  RefreshCw,
  Eye,
  Edit,
  BarChart3,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  ArrowUp,
  ArrowDown,
  Calendar,
  Hash,
  DollarSign,
  ShoppingBag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Loader,
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/common/Button";
import DeleteConfirmation from "./DeleteConfirmation";
import toast from "react-hot-toast";
import { adminAPI } from "../../services/api";

const Inventory = () => {
  // ==================== STATE ====================
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("currentStock:asc");
  const [viewMode, setViewMode] = useState("table");

  // Selection
  const [selectedItems, setSelectedItems] = useState([]);

  // Pagination
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
  });

  // Stats
  const [stats, setStats] = useState({
    totalItems: 0,
    totalStockValue: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    totalSalesLastMonth: 0,
  });

  // Modals
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockUpdateModal, setShowStockUpdateModal] = useState(false);
  const [stockUpdateData, setStockUpdateData] = useState({
    id: null,
    currentStock: 0,
    newStock: 0,
    reason: "manual_adjustment",
    note: "",
  });

  // ==================== API CALLS ====================

  const fetchInventory = useCallback(
    async (page = 1) => {
      try {
        setLoading(true);
        setError(null);

        const [sortField, sortDir] = sortBy.split(":");
        const params = {
          search: debouncedSearchTerm || undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
          page,
          limit: pagination.limit,
          sortBy: sortField,
          sortOrder: sortDir || "asc",
        };

        const response = await adminAPI.getInventory(params);

        // Handle different response structures
        let data = [];
        let paginationData = { page: 1, total: 0, pages: 1, limit: 10 };

        if (response.data?.data) {
          data = response.data.data;
          paginationData = response.data.pagination || paginationData;
        } else if (Array.isArray(response.data)) {
          data = response.data;
        } else if (response.data?.inventory) {
          data = response.data.inventory;
          paginationData = response.data.pagination || paginationData;
        }

        setInventory(data);
        setPagination({
          page: paginationData.page || page,
          limit: paginationData.limit || 10,
          total: paginationData.total || data.length,
          pages:
            paginationData.pages ||
            Math.ceil((paginationData.total || data.length) / 10),
        });
      } catch (err) {
        console.error("Error fetching inventory:", err);
        setError(err.response?.data?.message || "Failed to load inventory");
        toast.error("Failed to load inventory data");
        setInventory([]);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearchTerm, filterStatus, sortBy, pagination.limit]
  );

  const fetchStats = async () => {
    try {
      const response = await adminAPI.getInventoryStats();

      // Handle different response structures
      let statsData = {};
      if (response.data?.data) {
        statsData = response.data.data;
      } else if (response.data?.stats) {
        statsData = response.data.stats;
      } else {
        statsData = response.data;
      }

      setStats({
        totalItems: statsData.totalItems || 0,
        totalStockValue: statsData.totalStockValue || 0,
        lowStockItems: statsData.lowStockItems || 0,
        outOfStockItems: statsData.outOfStockItems || 0,
        totalSalesLastMonth: statsData.totalSalesLastMonth || 0,
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
      // Don't show error toast, stats are non-critical
      setStats({
        totalItems: inventory.length,
        totalStockValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        totalSalesLastMonth: 0,
      });
    }
  };

  // ==================== EFFECTS ====================

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchInventory(1);
  }, [debouncedSearchTerm, filterStatus, sortBy]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // ==================== HANDLERS ====================

  const handleSelectAll = () => {
    if (selectedItems.length === inventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventory.map((item) => item._id || item.id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleBulkUpdateStock = async (action) => {
    if (selectedItems.length === 0) {
      toast.error("Please select items first");
      return;
    }

    let quantity = 0;
    if (action === "increase") quantity = 10;
    else if (action === "decrease") quantity = -10;
    else if (action === "custom") {
      quantity = bulkQuantity;
      if (quantity === 0) {
        toast.error("Please enter a quantity");
        return;
      }
    }

    try {
      const response = await adminAPI.bulkUpdateInventory({
        items: selectedItems,
        quantity,
        reason: `bulk_${quantity > 0 ? "addition" : "reduction"}`,
        note: `Bulk update: ${quantity > 0 ? "+" : ""}${quantity}`,
      });

      toast.success(
        response.data?.message || `Updated ${selectedItems.length} items`
      );
      setShowBulkUpdate(false);
      setBulkQuantity(0);
      setSelectedItems([]);
      fetchInventory(pagination.page);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleUpdateStock = async (
    itemId,
    quantity,
    reason = "manual_adjustment"
  ) => {
    try {
      await adminAPI.updateInventoryStock(itemId, {
        quantity,
        reason,
        note: `Manual adjustment: ${quantity > 0 ? "+" : ""}${quantity}`,
      });

      toast.success("Stock updated successfully");
      fetchInventory(pagination.page);
      fetchStats();
      setShowStockUpdateModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      const deletePromises = selectedItems.map((id) =>
        adminAPI.deleteInventoryItem(id)
      );
      await Promise.all(deletePromises);

      toast.success(`Deleted ${selectedItems.length} inventory items`);
      setSelectedItems([]);
      setShowDeleteModal(false);
      fetchInventory(pagination.page);
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete items");
    }
  };

  const handleExportInventory = async () => {
    try {
      const response = await adminAPI.exportInventory({
        format: "csv",
        includeAll: true,
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `inventory-export-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("Inventory exported successfully");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to export inventory");
    }
  };

  const handleGenerateOrder = async () => {
    try {
      const response = await adminAPI.generateReorderReport({ threshold: 10 });

      if (!response.data || response.data.length === 0) {
        toast.error("No low stock items found");
        return;
      }

      const orderSummary = response.data
        .map(
          (item) =>
            `${item.name}: Order ${item.suggestedOrder} units (Total: ${item.totalCost} TND)`
        )
        .join("\n");

      toast.success(
        `Generated restock order for ${response.data.length} items`
      );

      // Show summary in console
      console.log("Restock Order Summary:", orderSummary);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to generate order");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchInventory(newPage);
    }
  };

  // ==================== HELPERS ====================

  const getStatusConfig = (status) => {
    const configs = {
      "in-stock": {
        label: "In Stock",
        color: "bg-green-100 text-green-800",
        icon: CheckCircle,
      },
      "low-stock": {
        label: "Low Stock",
        color: "bg-amber-100 text-amber-800",
        icon: AlertCircle,
      },
      "out-of-stock": {
        label: "Out of Stock",
        color: "bg-rose-100 text-rose-800",
        icon: XCircle,
      },
    };
    return (
      configs[status] || {
        label: "Unknown",
        color: "bg-gray-100 text-gray-800",
        icon: AlertCircle,
      }
    );
  };

  const getStockPercentage = (item) => {
    const initial = item.initialStock || item.totalStock || 1;
    const current = item.currentStock || 0;
    return Math.min((current / initial) * 100, 100);
  };

  const renderPageNumbers = () => {
    const { page, pages } = pagination;
    const maxVisible = 5;
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > pages) {
      end = pages;
      start = Math.max(1, end - maxVisible + 1);
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "in-stock", label: "In Stock" },
    { value: "low-stock", label: "Low Stock" },
    { value: "out-of-stock", label: "Out of Stock" },
  ];

  const sortOptions = [
    { value: "currentStock:asc", label: "Stock: Low to High" },
    { value: "currentStock:desc", label: "Stock: High to Low" },
    { value: "name:asc", label: "Name: A to Z" },
    { value: "name:desc", label: "Name: Z to A" },
    { value: "soldLastMonth:desc", label: "Sales: High to Low" },
    { value: "updatedAt:desc", label: "Recently Updated" },
  ];

  // ==================== RENDER FUNCTIONS ====================

  const renderTableRow = (item) => {
    const statusConfig = getStatusConfig(item.status);
    const stockPercentage = getStockPercentage(item);
    const itemId = item._id || item.id;

    return (
      <tr
        key={itemId}
        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
      >
        <td className="p-4">
          <input
            type="checkbox"
            checked={selectedItems.includes(itemId)}
            onChange={() => handleSelectItem(itemId)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
        </td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Package className="w-5 h-5 text-gray-600" />
              )}
            </div>
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">
                  {item.color || "N/A"}
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">
                  {item.size || "N/A"}
                </span>
              </div>
            </div>
          </div>
        </td>
        <td className="p-4">
          <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded font-mono">
            {item.sku || "N/A"}
          </code>
        </td>
        <td className="p-4">
          <div>
            <span className="text-gray-700">{item.category || "N/A"}</span>
          </div>
        </td>
        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </td>
        <td className="p-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900">
                {item.currentStock || 0}
              </span>
              <span className="text-sm text-gray-500">
                / {item.initialStock || item.totalStock || "N/A"}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full ${
                  stockPercentage <= 25
                    ? "bg-rose-500"
                    : stockPercentage <= 50
                    ? "bg-amber-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${Math.min(stockPercentage, 100)}%` }}
              />
            </div>
          </div>
        </td>
        <td className="p-4">
          <div className="text-center">
            <span className="font-medium text-gray-900">
              {item.soldLastMonth || 0}
            </span>
            <p className="text-xs text-gray-500">last month</p>
          </div>
        </td>
        <td className="p-4">
          <span className="text-gray-700">{item.location || "—"}</span>
        </td>
        <td className="p-4">
          <div className="text-right">
            <span className="font-bold text-gray-900">
              {((item.currentStock || 0) * (item.cost || 0)).toFixed(2)} TND
            </span>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedProduct(item);
                toast.info(`Viewing ${item.name} details`);
              }}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setStockUpdateData({
                  id: itemId,
                  currentStock: item.currentStock || 0,
                  newStock: item.currentStock || 0,
                  reason: "manual_adjustment",
                  note: "",
                });
                setShowStockUpdateModal(true);
              }}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit Stock"
            >
              <Edit className="w-4 h-4" />
            </button>
            {(item.status === "low-stock" ||
              item.status === "out-of-stock") && (
              <button
                onClick={() => {
                  const reorderQty = item.lowStockThreshold || 10;
                  handleUpdateStock(itemId, reorderQty, "reorder");
                }}
                className="p-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                title="Request Reorder"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>
    );
  };

  const renderCardView = (item) => {
    const statusConfig = getStatusConfig(item.status);
    const stockPercentage = getStockPercentage(item);
    const itemId = item._id || item.id;

    return (
      <div
        key={itemId}
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.sku || "N/A"}</p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
          >
            {statusConfig.label}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-600">Color/Size</p>
            <p className="font-medium text-gray-900">
              {item.color || "N/A"} / {item.size || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium text-gray-900">
              {item.category || "N/A"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium text-gray-900">{item.location || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sold (Month)</p>
            <p className="font-medium text-gray-900">
              {item.soldLastMonth || 0}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Stock Level</span>
            <span className="font-medium">
              {item.currentStock || 0} /{" "}
              {item.initialStock || item.totalStock || "N/A"}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                stockPercentage <= 25
                  ? "bg-rose-500"
                  : stockPercentage <= 50
                  ? "bg-amber-500"
                  : "bg-green-500"
              }`}
              style={{ width: `${Math.min(stockPercentage, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            size="small"
            className="flex-1"
            onClick={() => {
              setSelectedProduct(item);
              toast.info(`Viewing ${item.name} details`);
            }}
          >
            View
          </Button>
          <Button
            size="small"
            className="flex-1"
            onClick={() => {
              setStockUpdateData({
                id: itemId,
                currentStock: item.currentStock || 0,
                newStock: item.currentStock || 0,
                reason: "manual_adjustment",
                note: "",
              });
              setShowStockUpdateModal(true);
            }}
          >
            Update
          </Button>
        </div>
      </div>
    );
  };

  // ==================== LOADING & ERROR STATES ====================

  if (loading && !inventory.length) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <Loader className="w-12 h-12 text-primary-600 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading inventory...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error && !inventory.length) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <p className="mt-4 text-gray-600">{error}</p>
            <Button className="mt-4" onClick={() => fetchInventory(1)}>
              Retry
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // ==================== MAIN RENDER ====================

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Inventory Management
            </h1>
            <p className="text-gray-600">
              Track and manage your product stock levels
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExportInventory}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleGenerateOrder}
            >
              <RefreshCw className="w-4 h-4" />
              Generate Order
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowBulkUpdate(true)}
            >
              <Plus className="w-4 h-4" />
              Bulk Update
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalStockValue.toFixed(2)} TND
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.lowStockItems}
                </p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Sales</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalSalesLastMonth}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:outline-none"
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Loader className="w-4 h-4 text-primary-600 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:outline-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:outline-none"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>

              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "table"
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "cards"
                      ? "bg-primary-100 text-primary-700"
                      : "hover:bg-gray-50"
                  }`}
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-gradient-to-r from-primary-50 to-pink-50 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center font-semibold">
                  {selectedItems.length}
                </div>
                <span className="font-medium text-gray-900">
                  {selectedItems.length} item
                  {selectedItems.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="small"
                  onClick={() => handleBulkUpdateStock("increase")}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add 10
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => handleBulkUpdateStock("decrease")}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Remove 10
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Content */}
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
                          selectedItems.length === inventory.length &&
                          inventory.length > 0
                        }
                        onChange={handleSelectAll}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        disabled={inventory.length === 0}
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
                      Status
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Stock
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Sales
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Location
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Value
                    </th>
                    <th className="text-left p-4 font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.length > 0 ? (
                    inventory.map(renderTableRow)
                  ) : (
                    <tr>
                      <td colSpan="10" className="p-8 text-center">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">
                          No inventory items found
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Try adjusting your search or filters
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {inventory.length} of {pagination.total} items (Page{" "}
                  {pagination.page} of {pagination.pages})
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                    className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                      pagination.page <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {renderPageNumbers().map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                        pagination.page === pageNum
                          ? "bg-primary-600 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages}
                    className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                      pagination.page >= pagination.pages
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inventory.length > 0 ? (
              inventory.map(renderCardView)
            ) : (
              <div className="col-span-3 text-center py-12 bg-white rounded-2xl">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No inventory items found</p>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or filters
                </p>
              </div>
            )}
          </div>
        )}

        {/* Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Stock Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">In Stock</span>
                  <span className="font-medium">
                    {stats.totalItems -
                      stats.lowStockItems -
                      stats.outOfStockItems}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalItems > 0
                          ? ((stats.totalItems -
                              stats.lowStockItems -
                              stats.outOfStockItems) /
                              stats.totalItems) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Low Stock</span>
                  <span className="font-medium">{stats.lowStockItems}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalItems > 0
                          ? (stats.lowStockItems / stats.totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="font-medium">{stats.outOfStockItems}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full"
                    style={{
                      width: `${
                        stats.totalItems > 0
                          ? (stats.outOfStockItems / stats.totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerateOrder}
                className="w-full text-left p-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-xl hover:from-blue-100 hover:to-cyan-100 transition-colors flex items-center gap-3"
              >
                <RefreshCw className="w-5 h-5" />
                <div>
                  <p className="font-medium">Generate Restock Order</p>
                  <p className="text-sm">Based on low stock items</p>
                </div>
              </button>
              <button
                onClick={handleExportInventory}
                className="w-full text-left p-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl hover:from-green-100 hover:to-emerald-100 transition-colors flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                <div>
                  <p className="font-medium">Export Inventory Report</p>
                  <p className="text-sm">CSV format with all details</p>
                </div>
              </button>
              <button
                onClick={() => setShowBulkUpdate(true)}
                className="w-full text-left p-3 bg-gradient-to-r from-primary-50 to-pink-50 text-primary-700 rounded-xl hover:from-primary-100 hover:to-pink-100 transition-colors flex items-center gap-3"
              >
                <Edit className="w-5 h-5" />
                <div>
                  <p className="font-medium">Bulk Stock Update</p>
                  <p className="text-sm">Update multiple items at once</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bulk Update Modal */}
      {showBulkUpdate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowBulkUpdate(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Bulk Stock Update
                  </h3>
                  <p className="text-gray-600">
                    Update {selectedItems.length} selected items
                  </p>
                </div>
                <button
                  onClick={() => setShowBulkUpdate(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleBulkUpdateStock("increase")}
                    className="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Plus className="w-5 h-5" />
                      <span className="font-medium">Add 10</span>
                    </div>
                  </button>
                  <button
                    onClick={() => handleBulkUpdateStock("decrease")}
                    className="p-4 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-colors"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Minus className="w-5 h-5" />
                      <span className="font-medium">Remove 10</span>
                    </div>
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Quantity
                  </label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={bulkQuantity}
                      onChange={(e) =>
                        setBulkQuantity(parseInt(e.target.value) || 0)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:outline-none"
                      placeholder="Enter quantity"
                    />
                    <Button
                      onClick={() => handleBulkUpdateStock("custom")}
                      disabled={!bulkQuantity}
                    >
                      Apply
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Positive = add, Negative = remove
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock Update Modal */}
      {showStockUpdateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowStockUpdateModal(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  Update Stock
                </h3>
                <button
                  onClick={() => setShowStockUpdateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock
                  </label>
                  <input
                    type="number"
                    value={stockUpdateData.currentStock}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Stock
                  </label>
                  <input
                    type="number"
                    value={stockUpdateData.newStock}
                    onChange={(e) =>
                      setStockUpdateData((prev) => ({
                        ...prev,
                        newStock: parseInt(e.target.value) || 0,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Note (Optional)
                  </label>
                  <input
                    type="text"
                    value={stockUpdateData.note}
                    onChange={(e) =>
                      setStockUpdateData((prev) => ({
                        ...prev,
                        note: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:outline-none"
                    placeholder="Reason for update"
                  />
                </div>
                <Button
                  fullWidth
                  onClick={() => {
                    const quantityChange =
                      stockUpdateData.newStock - stockUpdateData.currentStock;
                    if (quantityChange === 0) {
                      toast.info("No change in stock");
                      return;
                    }
                    handleUpdateStock(
                      stockUpdateData.id,
                      quantityChange,
                      "manual_adjustment"
                    );
                  }}
                >
                  Update Stock
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirmation
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteSelected}
        itemName={`${selectedItems.length} inventory items`}
        itemType="inventory items"
        isBulk={selectedItems.length > 1}
      />
    </AdminLayout>
  );
};

export default Inventory;
