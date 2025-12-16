import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import AdminLayout from "../../components/layout/AdminLayout";
import Button from "../../components/common/Button";
import DeleteConfirmation from "./DeleteConfirmation";
import toast from "react-hot-toast";
import { adminAPI } from "../../services/api";

const Inventory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showBulkUpdate, setShowBulkUpdate] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'cards'
  const [sortBy, setSortBy] = useState("currentStock");
  const [sortOrder, setSortOrder] = useState("asc");

  // State for API data
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    pages: 1,
    limit: 10,
  });

  const statusOptions = [
    { value: "all", label: "All Status" },
    {
      value: "in-stock",
      label: "In Stock",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "low-stock",
      label: "Low Stock",
      color: "bg-amber-100 text-amber-800",
    },
    {
      value: "out-of-stock",
      label: "Out of Stock",
      color: "bg-rose-100 text-rose-800",
    },
  ];

  const sortOptions = [
    { value: "currentStock:asc", label: "Stock: Low to High" },
    { value: "currentStock:desc", label: "Stock: High to Low" },
    { value: "product.name:asc", label: "Name: A to Z" },
    { value: "product.name:desc", label: "Name: Z to A" },
    { value: "soldLastMonth:desc", label: "Sales: High to Low" },
    { value: "updatedAt:desc", label: "Recently Updated" },
  ];

  // Fetch inventory data
  const fetchInventory = async (page = 1) => {
    try {
      setLoading(true);
      const [sortField, sortDir] = sortBy.split(":");

      const params = {
        search: searchTerm || undefined,
        status: filterStatus !== "all" ? filterStatus : undefined,
        page: page,
        limit: pagination.limit,
        sortBy: sortField,
        sortOrder: sortDir || "asc",
      };

      const response = await adminAPI.getInventory(params);
      setInventory(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory data");
      setInventory([]);
      setPagination({
        page: 1,
        total: 0,
        pages: 1,
        limit: 10,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await adminAPI.getInventoryStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Failed to load inventory statistics");
      setStats(null);
    }
  };

  // Initial load
  useEffect(() => {
    fetchInventory(1);
    fetchStats();
  }, []);

  // Fetch data when filters change (with debounce for search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchInventory(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filterStatus, sortBy]);

  // Calculate statistics from API or local data
  const totalItems = stats?.totalItems || 0;
  const totalStockValue = stats?.totalStockValue || 0;
  const outOfStockItems = stats?.outOfStockItems || 0;
  const lowStockItems = stats?.lowStockItems || 0;
  const totalSalesLastMonth = stats?.totalSalesLastMonth || 0;

  const getStockPercentage = (item) => {
    return item.initialStock > 0
      ? (item.currentStock / item.initialStock) * 100
      : 0;
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "in-stock":
        return {
          label: "In Stock",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "low-stock":
        return {
          label: "Low Stock",
          color: "bg-amber-100 text-amber-800",
          icon: AlertCircle,
        };
      case "out-of-stock":
        return {
          label: "Out of Stock",
          color: "bg-rose-100 text-rose-800",
          icon: XCircle,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: AlertCircle,
        };
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === inventory.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(inventory.map((item) => item.id));
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

    let quantity = bulkQuantity;
    if (action === "increase") quantity = 10;
    if (action === "decrease") quantity = -10;

    if (action === "custom" && quantity === 0) {
      toast.error("Please enter a quantity");
      return;
    }

    try {
      const response = await adminAPI.bulkUpdateInventory({
        items: selectedItems,
        quantity,
        reason: `bulk_${quantity > 0 ? "addition" : "reduction"}`,
        note: `Bulk update: ${quantity > 0 ? "+" : ""}${quantity}`,
      });

      toast.success(response.message);
      setShowBulkUpdate(false);
      setBulkQuantity(0);
      setSelectedItems([]);

      // Refresh data
      fetchInventory(pagination.page);
      fetchStats();
    } catch (error) {
      toast.error(error.message || "Failed to update stock");
    }
  };

  const handleGenerateOrder = async () => {
    try {
      const response = await adminAPI.generateReorderReport({ threshold: 10 });

      if (response.data.length === 0) {
        toast.error("No low stock items found");
        return;
      }

      const orderSummary = response.data
        .map(
          (item) =>
            `${item.name}: Order ${item.suggestedOrder} units (Total: ${item.totalCost} DT)`
        )
        .join("\n");

      toast.success(
        `Generated restock order for ${response.data.length} items`,
        {
          duration: 5000,
        }
      );

      // In a real app, you might want to show a modal with the order details
      console.log("Restock Order Summary:", response.summary);
      console.log("Order Details:", orderSummary);
    } catch (error) {
      toast.error("Failed to generate order");
    }
  };

  const handleExportInventory = async () => {
    try {
      const response = await adminAPI.exportInventory({
        format: "csv",
        includeAll: true,
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `inventory-export-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Inventory exported successfully");
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export inventory");
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
    } catch (error) {
      toast.error(error.message || "Failed to update stock");
    }
  };

  const handleDeleteSelected = async () => {
    try {
      // Delete each selected item
      const deletePromises = selectedItems.map((id) =>
        adminAPI.deleteInventoryItem(id)
      );

      await Promise.all(deletePromises);

      toast.success(`Deleted ${selectedItems.length} inventory items`);
      setSelectedItems([]);
      setShowDeleteModal(false);

      // Refresh data
      fetchInventory(pagination.page);
      fetchStats();
    } catch (error) {
      toast.error(error.message || "Failed to delete items");
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      setPagination((prev) => ({ ...prev, page: newPage }));
      fetchInventory(newPage);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(
      1,
      pagination.page - Math.floor(maxVisiblePages / 2)
    );
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > pagination.pages) {
      endPage = pagination.pages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const renderTableRow = (item) => {
    const statusConfig = getStatusConfig(item.status);
    const stockPercentage = getStockPercentage(item);
    const needsReorder =
      item.status === "low-stock" || item.status === "out-of-stock";

    return (
      <tr
        key={item.id}
        className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors"
      >
        <td className="p-4">
          <input
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleSelectItem(item.id)}
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
          />
        </td>
        <td className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{item.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-gray-500">{item.color}</span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{item.size}</span>
              </div>
            </div>
          </div>
        </td>
        <td className="p-4">
          <code className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded font-mono">
            {item.sku}
          </code>
        </td>
        <td className="p-4">
          <div>
            <span className="text-gray-700">{item.category}</span>
            <p className="text-xs text-gray-500">{item.subCategory || "—"}</p>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full ${
                statusConfig.color.split(" ")[0]
              }`}
            ></div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
            >
              {statusConfig.label}
            </span>
          </div>
        </td>
        <td className="p-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900">
                {item.currentStock}
              </span>
              <span className="text-sm text-gray-500">
                / {item.initialStock}
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
          <div className="text-right">
            <span className="font-medium text-gray-900">
              {item.soldLastMonth}
            </span>
            <p className="text-xs text-gray-500">last month</p>
          </div>
        </td>
        <td className="p-4">
          <div>
            <span className="font-medium text-gray-900">
              {item.location || "—"}
            </span>
          </div>
        </td>
        <td className="p-4">
          <div className="text-right">
            <span className="font-bold text-gray-900">
              {(item.currentStock * item.cost).toFixed(2)} DT
            </span>
            <p className="text-xs text-gray-500">value</p>
          </div>
        </td>
        <td className="p-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => toast.info(`Viewing ${item.name} details`)}
              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setSelectedProduct(item);
                const newQuantity = parseInt(
                  prompt(
                    `Enter new stock quantity for ${item.name}:`,
                    item.currentStock
                  )
                );
                if (!isNaN(newQuantity) && newQuantity >= 0) {
                  const quantityChange = newQuantity - item.currentStock;
                  handleUpdateStock(
                    item.id,
                    quantityChange,
                    "manual_adjustment"
                  );
                }
              }}
              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit Stock"
            >
              <Edit className="w-4 h-4" />
            </button>
            {needsReorder && (
              <button
                onClick={() =>
                  handleUpdateStock(
                    item.id,
                    item.lowStockThreshold || 10,
                    "reorder"
                  )
                }
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

    return (
      <div
        key={item.id}
        className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">{item.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{item.sku}</p>
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
              {item.color} / {item.size}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Category</p>
            <p className="font-medium text-gray-900">{item.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="font-medium text-gray-900">{item.location || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Sold (Month)</p>
            <p className="font-medium text-gray-900">{item.soldLastMonth}</p>
          </div>
        </div>

        {/* Stock Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Stock Level</span>
            <span className="font-medium">
              {item.currentStock} / {item.initialStock}
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

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="small"
            className="flex-1"
            onClick={() => toast.info(`Viewing ${item.name} details`)}
          >
            View
          </Button>
          <Button
            size="small"
            className="flex-1"
            onClick={() => {
              setSelectedProduct(item);
              const newQuantity = parseInt(
                prompt(
                  `Enter new stock quantity for ${item.name}:`,
                  item.currentStock
                )
              );
              if (!isNaN(newQuantity) && newQuantity >= 0) {
                const quantityChange = newQuantity - item.currentStock;
                handleUpdateStock(item.id, quantityChange, "manual_adjustment");
              }
            }}
          >
            Update
          </Button>
        </div>
      </div>
    );
  };

  if (loading && !inventory.length) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

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
              disabled={loading}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleGenerateOrder}
              disabled={loading}
            >
              <RefreshCw className="w-4 h-4" />
              Generate Order
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowBulkUpdate(true)}
              disabled={loading}
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
                  {totalItems}
                </p>
                <p className="text-sm text-gray-600 mt-1">in inventory</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stock Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {totalStockValue.toFixed(2)} DT
                </p>
                <p className="text-sm text-green-600 mt-1">
                  +5.2% from last month
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
                  {lowStockItems}
                </p>
                <p className="text-sm text-amber-600 mt-1">
                  Requires attention
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
                  {totalSalesLastMonth}
                </p>
                <p className="text-sm text-gray-600 mt-1">units sold</p>
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
            {/* Left: Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, SKU, product ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition-colors"
                  disabled={loading}
                />
                {loading && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Filters */}
            <div className="flex flex-wrap gap-3">
              {/* Status Filter */}
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {statusOptions.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* Sort By */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ArrowUp className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>

              {/* View Mode */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden">
                <button
                  onClick={() => setViewMode("table")}
                  disabled={loading}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "table"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-50"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Table View"
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode("cards")}
                  disabled={loading}
                  className={`px-4 py-3 transition-colors ${
                    viewMode === "cards"
                      ? "bg-purple-100 text-purple-700"
                      : "hover:bg-gray-50"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  title="Card View"
                >
                  Cards
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center">
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
                  disabled={loading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add 10
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  onClick={() => handleBulkUpdateStock("decrease")}
                  disabled={loading}
                >
                  <Minus className="w-4 h-4 mr-2" />
                  Remove 10
                </Button>
                <Button
                  size="small"
                  variant="outline"
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={loading}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Inventory Content */}
        {loading && inventory.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading inventory data...</p>
            </div>
          </div>
        ) : viewMode === "table" ? (
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
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading || inventory.length === 0}
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

            {/* Table Footer with Pagination */}
            {pagination.pages > 1 && (
              <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="text-sm text-gray-600">
                  Showing {inventory.length} of {pagination.total} items
                  {pagination.total > 0 && (
                    <span className="ml-2">
                      (Page {pagination.page} of {pagination.pages})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1 || loading}
                    className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                      pagination.page <= 1 || loading
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {renderPageNumbers().map((pageNum) => (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={loading}
                        className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                          pagination.page === pageNum
                            ? "bg-purple-600 text-white"
                            : "hover:bg-gray-100"
                        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {pageNum}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pages || loading}
                    className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                      pagination.page >= pagination.pages || loading
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
          /* Card View */
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inventory.length > 0 ? (
                inventory.map(renderCardView)
              ) : (
                <div className="col-span-3 text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No inventory items found</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>

            {/* Pagination for Card View */}
            {pagination.pages > 1 && (
              <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {inventory.length} of {pagination.total} items
                    {pagination.total > 0 && (
                      <span className="ml-2">
                        (Page {pagination.page} of {pagination.pages})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page <= 1 || loading}
                      className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                        pagination.page <= 1 || loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-1">
                      {renderPageNumbers().map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          disabled={loading}
                          className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg transition-colors ${
                            pagination.page === pageNum
                              ? "bg-purple-600 text-white"
                              : "hover:bg-gray-100"
                          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          {pageNum}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.pages || loading}
                      className={`p-2 border border-gray-300 rounded-lg transition-colors ${
                        pagination.page >= pagination.pages || loading
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inventory Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock Distribution */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Stock Distribution
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">In Stock</span>
                  <span className="font-medium">
                    {totalItems - lowStockItems - outOfStockItems}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full"
                    style={{
                      width: `${
                        totalItems > 0
                          ? ((totalItems - lowStockItems - outOfStockItems) /
                              totalItems) *
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
                  <span className="font-medium">{lowStockItems}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-amber-500 h-2 rounded-full"
                    style={{
                      width: `${
                        totalItems > 0 ? (lowStockItems / totalItems) * 100 : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Out of Stock</span>
                  <span className="font-medium">{outOfStockItems}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-rose-500 h-2 rounded-full"
                    style={{
                      width: `${
                        totalItems > 0
                          ? (outOfStockItems / totalItems) * 100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">
              Inventory Actions
            </h3>
            <div className="space-y-3">
              <button
                onClick={handleGenerateOrder}
                disabled={loading}
                className={`w-full text-left p-3 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-xl transition-colors flex items-center gap-3 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-blue-100 hover:to-cyan-100"
                }`}
              >
                <RefreshCw className="w-5 h-5" />
                <div>
                  <p className="font-medium">Generate Restock Order</p>
                  <p className="text-sm">Based on low stock items</p>
                </div>
              </button>
              <button
                onClick={handleExportInventory}
                disabled={loading}
                className={`w-full text-left p-3 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-xl transition-colors flex items-center gap-3 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-green-100 hover:to-emerald-100"
                }`}
              >
                <Download className="w-5 h-5" />
                <div>
                  <p className="font-medium">Export Inventory Report</p>
                  <p className="text-sm">CSV format with all details</p>
                </div>
              </button>
              <button
                onClick={() => setShowBulkUpdate(true)}
                disabled={loading || selectedItems.length === 0}
                className={`w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 rounded-xl transition-colors flex items-center gap-3 ${
                  loading || selectedItems.length === 0
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-purple-100 hover:to-pink-100"
                }`}
              >
                <Edit className="w-5 h-5" />
                <div>
                  <p className="font-medium">Bulk Stock Update</p>
                  <p className="text-sm">Update multiple items at once</p>
                </div>
              </button>
              <button
                onClick={() => toast.info("Audit log feature coming soon")}
                disabled={loading}
                className={`w-full text-left p-3 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-xl transition-colors flex items-center gap-3 ${
                  loading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:from-amber-100 hover:to-orange-100"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <div>
                  <p className="font-medium">View Audit Log</p>
                  <p className="text-sm">Track inventory changes</p>
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
              className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
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
                    <XCircle className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Quick Actions */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => handleBulkUpdateStock("increase")}
                      className="p-4 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-5 h-5" />
                        <span className="font-medium">Add 10</span>
                      </div>
                      <p className="text-sm mt-2">Increase stock by 10 units</p>
                    </button>
                    <button
                      onClick={() => handleBulkUpdateStock("decrease")}
                      className="p-4 bg-rose-50 text-rose-700 rounded-xl hover:bg-rose-100 transition-colors"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Minus className="w-5 h-5" />
                        <span className="font-medium">Remove 10</span>
                      </div>
                      <p className="text-sm mt-2">Decrease stock by 10 units</p>
                    </button>
                  </div>

                  {/* Custom Quantity */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or enter custom quantity
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={bulkQuantity}
                        onChange={(e) =>
                          setBulkQuantity(parseInt(e.target.value) || 0)
                        }
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
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
                      Positive numbers add stock, negative numbers remove stock
                    </p>
                  </div>

                  {/* Selected Items Preview */}
                  {selectedItems.length > 0 && (
                    <div className="border-t pt-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Selected Items
                      </h4>
                      <div className="max-h-32 overflow-y-auto space-y-2">
                        {inventory
                          .filter((item) => selectedItems.includes(item.id))
                          .slice(0, 5)
                          .map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded"></div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {item.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {item.sku}
                                </p>
                              </div>
                            </div>
                          ))}
                        {selectedItems.length > 5 && (
                          <p className="text-sm text-gray-500 text-center">
                            + {selectedItems.length - 5} more items
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
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
