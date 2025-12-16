// /components/admin/orders/OrdersManagement.js
import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Download,
  Upload,
  MoreVertical,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  DollarSign,
  User,
  MapPin,
  Phone,
  Mail,
  AlertCircle,
  RefreshCw,
  Printer,
  Eye,
  Edit,
  Trash2,
  TrendingUp,
  BarChart3,
  CreditCard,
  ShoppingBag,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/common/Button";
import StatusUpdateModal from "./StatusUpdateModal";
import TrackingUpdateModal from "./TrackingUpdateModal";
import PaymentUpdateModal from "./PaymentUpdateModal";
import OrderDetailsModal from "./OrderDetailsModal";
import DeleteConfirmation from "../DeleteConfirmation";
import toast from "react-hot-toast";
import { adminAPI } from "../../../services/api";

const OrderCard = ({
  order,
  isSelected,
  onSelect,
  onView,
  onStatusUpdate,
  onTrackingUpdate,
  onPaymentUpdate,
  onDelete,
}) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "delivered":
        return {
          label: "Delivered",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "shipped":
        return {
          label: "Shipped",
          color: "bg-blue-100 text-blue-800",
          icon: Truck,
        };
      case "processing":
        return {
          label: "Processing",
          color: "bg-yellow-100 text-yellow-800",
          icon: Package,
        };
      case "pending":
        return {
          label: "Pending",
          color: "bg-orange-100 text-orange-800",
          icon: Clock,
        };
      case "confirmed":
        return {
          label: "Confirmed",
          color: "bg-purple-100 text-purple-800",
          icon: CheckCircle,
        };
      case "cancelled":
        return {
          label: "Cancelled",
          color: "bg-red-100 text-red-800",
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

  const getPaymentStatusConfig = (status) => {
    switch (status) {
      case "paid":
        return {
          label: "Paid",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "pending":
        return {
          label: "Pending",
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
        };
      case "failed":
        return {
          label: "Failed",
          color: "bg-red-100 text-red-800",
          icon: XCircle,
        };
      case "refunded":
        return {
          label: "Refunded",
          color: "bg-gray-100 text-gray-800",
          icon: DollarSign,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: AlertCircle,
        };
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);
  const StatusIcon = statusConfig.icon;
  const PaymentStatusIcon = paymentStatusConfig.icon;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300">
      {/* Order Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelect(order._id)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              <h3 className="font-bold text-gray-900">
                Order #{order.orderNumber}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
              >
                {statusConfig.label}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStatusConfig.color}`}
              >
                {paymentStatusConfig.label}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)} • {order.items.length} item
              {order.items.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">
              {order.total.toFixed(3)} DT
            </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-6">
        {/* Customer Info */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <User className="w-4 h-4" />
            Customer Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  {order.shippingAddress.firstName}{" "}
                  {order.shippingAddress.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {order.user?.email || order.shippingAddress.email}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">
                  +216 {order.shippingAddress.phone}
                </p>
                <p className="text-sm text-gray-600">
                  {order.paymentMethod === "cod"
                    ? "Cash on Delivery"
                    : order.paymentMethod === "card"
                    ? "Credit Card"
                    : order.paymentMethod === "mobile"
                    ? "Mobile Money"
                    : "Bank Transfer"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Info */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Shipping Information
          </h4>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                {order.shippingAddress.address}
              </p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city},{" "}
                {order.shippingAddress.governorate}
              </p>
              <p className="text-sm text-gray-600">
                {order.shippingMethod === "express"
                  ? "Express Delivery"
                  : order.shippingMethod === "pickup"
                  ? "Store Pickup"
                  : "Standard Delivery"}
                {order.trackingNumber && ` • Tracking: ${order.trackingNumber}`}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
          <div className="space-y-2">
            {order.items.slice(0, 3).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">
                      Qty: {item.quantity} × {item.price.toFixed(3)} DT
                    </p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">
                  {item.total.toFixed(3)} DT
                </p>
              </div>
            ))}
            {order.items.length > 3 && (
              <p className="text-sm text-gray-600 text-center">
                +{order.items.length - 3} more items
              </p>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            size="small"
            onClick={() => onView(order)}
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="small"
            onClick={() => onStatusUpdate(order)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Update Status
          </Button>
          {order.status === "shipped" && !order.trackingNumber && (
            <Button
              variant="outline"
              size="small"
              onClick={() => onTrackingUpdate(order)}
              className="flex items-center gap-2"
            >
              <Truck className="w-4 h-4" />
              Add Tracking
            </Button>
          )}
          <Button
            variant="outline"
            size="small"
            onClick={() => onPaymentUpdate(order)}
            className="flex items-center gap-2"
          >
            <DollarSign className="w-4 h-4" />
            Payment
          </Button>
          {["pending", "cancelled"].includes(order.status) && (
            <Button
              variant="outline"
              size="small"
              className="text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
              onClick={() => onDelete(order)}
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const OrdersManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterPaymentMethod, setFilterPaymentMethod] = useState("all");
  const [filterShippingMethod, setFilterShippingMethod] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    monthlyOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    totalItemsSold: 0,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [viewMode, setViewMode] = useState("table");
  const pageSize = 10;

  // Fetch orders from API
  const fetchOrders = async (page = 1) => {
    try {
      setLoading(true);

      const params = {
        page,
        limit: pageSize,
        sortBy: getSortParam(sortBy),
        sortOrder: getSortOrder(sortBy),
        status: filterStatus !== "all" ? filterStatus : undefined,
        paymentStatus:
          filterPaymentStatus !== "all" ? filterPaymentStatus : undefined,
        paymentMethod:
          filterPaymentMethod !== "all" ? filterPaymentMethod : undefined,
        shippingMethod:
          filterShippingMethod !== "all" ? filterShippingMethod : undefined,
        search: searchTerm || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };

      const response = await adminAPI.getOrders(params);
      const ordersData = response.data.orders || response.data;

      setOrders(ordersData);
      setCurrentPage(response.data.page || page);
      setTotalPages(response.data.pages || 1);
      setTotalOrders(response.data.total || ordersData.length);

      // Update summary stats from response
      if (response.data.summary) {
        setStats((prev) => ({
          ...prev,
          totalRevenue: response.data.summary.totalRevenue || 0,
          totalItemsSold: response.data.summary.totalItems || 0,
          totalOrders: response.data.summary.totalOrders || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Fetch order statistics
  const fetchOrderStats = async () => {
    try {
      const response = await adminAPI.getOrderStats();
      if (response.data.stats) {
        setStats((prev) => ({
          ...prev,
          todayOrders: response.data.stats.todayOrders || 0,
          monthlyOrders: response.data.stats.monthlyOrders || 0,
          averageOrderValue:
            response.data.stats.revenue?.averageOrderValue || 0,
        }));
      }
    } catch (error) {
      console.error("Error fetching order stats:", error);
    }
  };
  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, []);

  // Use debounced search term in your main useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (currentPage === 1) {
        fetchOrders(1);
      } else {
        setCurrentPage(1);
      }
    }, 100); // Small delay after debounced term changes

    return () => clearTimeout(delayDebounceFn);
  }, [
    debouncedSearchTerm, // Use debounced term instead of searchTerm
    filterStatus,
    filterPaymentStatus,
    filterPaymentMethod,
    filterShippingMethod,
    startDate,
    endDate,
    sortBy,
  ]);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "processing", label: "Processing" },
    { value: "shipped", label: "Shipped" },
    { value: "delivered", label: "Delivered" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const paymentStatusOptions = [
    { value: "all", label: "All Payment Status" },
    { value: "pending", label: "Pending" },
    { value: "paid", label: "Paid" },
    { value: "failed", label: "Failed" },
    { value: "refunded", label: "Refunded" },
  ];

  const paymentMethodOptions = [
    { value: "all", label: "All Payment Methods" },
    { value: "cod", label: "Cash on Delivery" },
    { value: "card", label: "Credit/Debit Card" },
    { value: "mobile", label: "Mobile Money" },
    { value: "bank", label: "Bank Transfer" },
  ];

  const shippingMethodOptions = [
    { value: "all", label: "All Shipping Methods" },
    { value: "standard", label: "Standard Delivery" },
    { value: "express", label: "Express Delivery" },
    { value: "pickup", label: "Store Pickup" },
  ];

  const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "total-high", label: "Total: High to Low" },
    { value: "total-low", label: "Total: Low to High" },
  ];

  const getSortParam = (sort) => {
    switch (sort) {
      case "total-high":
      case "total-low":
        return "total";
      default:
        return "createdAt";
    }
  };

  const getSortOrder = (sort) => {
    switch (sort) {
      case "oldest":
      case "total-low":
        return "asc";
      default:
        return "desc";
    }
  };

  const handleSelectAll = () => {
    if (selectedOrders.length === orders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(orders.map((o) => o._id));
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleStatusUpdate = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleTrackingUpdate = (order) => {
    setSelectedOrder(order);
    setShowTrackingModal(true);
  };

  const handlePaymentUpdate = (order) => {
    setSelectedOrder(order);
    setShowPaymentModal(true);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleDeleteOrder = (order) => {
    setSelectedOrder(order);
    setShowDeleteModal(true);
  };

  const handleBulkStatusUpdate = async (status) => {
    if (selectedOrders.length === 0) {
      toast.error("Please select orders first");
      return;
    }

    try {
      await adminAPI.bulkUpdateOrders({
        orderIds: selectedOrders,
        updateData: { status },
      });
      toast.success(`Updated ${selectedOrders.length} orders to ${status}`);
      fetchOrders();
      setSelectedOrders([]);
    } catch (error) {
      console.error("Error updating orders:", error);
      toast.error("Failed to update orders");
    }
  };

  const handleExportOrders = async () => {
    try {
      const params = {
        status: filterStatus !== "all" ? filterStatus : undefined,
        paymentStatus:
          filterPaymentStatus !== "all" ? filterPaymentStatus : undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        format: "csv",
      };

      const response = await adminAPI.exportOrders(params);

      // Create blob and download
      const blob = new Blob([response.data], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders-export-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Orders exported successfully");
    } catch (error) {
      console.error("Error exporting orders:", error);
      toast.error("Failed to export orders");
    }
  };

  const handleDelete = async () => {
    try {
      await adminAPI.deleteOrder(selectedOrder._id);
      toast.success(`Order #${selectedOrder.orderNumber} deleted successfully`);
      setShowDeleteModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error.response?.data?.message || "Failed to delete order");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderTableView = () => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    const getStatusConfig = (status) => {
      switch (status) {
        case "delivered":
          return {
            label: "Delivered",
            color: "bg-green-100 text-green-800",
            icon: CheckCircle,
          };
        case "shipped":
          return {
            label: "Shipped",
            color: "bg-blue-100 text-blue-800",
            icon: Truck,
          };
        case "processing":
          return {
            label: "Processing",
            color: "bg-yellow-100 text-yellow-800",
            icon: Package,
          };
        case "pending":
          return {
            label: "Pending",
            color: "bg-orange-100 text-orange-800",
            icon: Clock,
          };
        case "cancelled":
          return {
            label: "Cancelled",
            color: "bg-red-100 text-red-800",
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
                      selectedOrders.length === orders.length &&
                      orders.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Order
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Total
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Payment
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <tr key={order._id} className="hover:bg-gray-50 group">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectedOrders.includes(order._id)}
                        onChange={() => handleSelectOrder(order._id)}
                        className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          #{order.orderNumber}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">
                          {order.shippingAddress.firstName}{" "}
                          {order.shippingAddress.lastName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {order.shippingAddress.email}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="text-gray-700">
                          {formatDate(order.createdAt)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.shippingMethod}
                        </p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">
                        {order.total.toFixed(3)} DT
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.paymentMethod.toUpperCase()}
                      </p>
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
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800"
                            : order.paymentStatus === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(order)}
                          className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Update Status"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        {order.status === "shipped" &&
                          !order.trackingNumber && (
                            <button
                              onClick={() => handleTrackingUpdate(order)}
                              className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                              title="Add Tracking"
                            >
                              <Truck className="w-4 h-4" />
                            </button>
                          )}
                        {["pending", "cancelled"].includes(order.status) && (
                          <button
                            onClick={() => handleDeleteOrder(order)}
                            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
            Showing {orders.length} of {totalOrders} orders
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
    if (orders.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No orders found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {orders.map((order) => (
          <OrderCard
            key={order._id}
            order={order}
            isSelected={selectedOrders.includes(order._id)}
            onSelect={handleSelectOrder}
            onView={handleViewDetails}
            onStatusUpdate={handleStatusUpdate}
            onTrackingUpdate={handleTrackingUpdate}
            onPaymentUpdate={handlePaymentUpdate}
            onDelete={handleDeleteOrder}
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
              Orders Management
            </h1>
            <p className="text-gray-600">Manage and track customer orders</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                fetchOrders();
                fetchOrderStats();
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleExportOrders}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
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
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.totalOrders}
                    </p>
                    <p className="text-sm text-green-600 mt-1">
                      +{stats.todayOrders} today
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Orders</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.monthlyOrders}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">This month</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.totalRevenue.toFixed(3)} DT
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Avg: {stats.averageOrderValue.toFixed(3)} DT
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Items Sold</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stats.totalItemsSold}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">Total quantity</p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Package className="w-6 h-6 text-amber-600" />
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
                      placeholder="Search by order number, email, or phone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                    {searchTerm !== debouncedSearchTerm && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Filters */}
                <div className="flex flex-wrap gap-3">
                  {/* Date Range */}
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="From"
                    />
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      placeholder="To"
                    />
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

                  {/* Payment Status Filter */}
                  <div className="relative">
                    <select
                      value={filterPaymentStatus}
                      onChange={(e) => setFilterPaymentStatus(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    >
                      {paymentStatusOptions.map((status) => (
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

              {/* Additional Filters */}
              <div className="flex flex-wrap gap-3 mt-4">
                {/* Payment Method Filter */}
                <div className="relative">
                  <select
                    value={filterPaymentMethod}
                    onChange={(e) => setFilterPaymentMethod(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    {paymentMethodOptions.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                {/* Shipping Method Filter */}
                <div className="relative">
                  <select
                    value={filterShippingMethod}
                    onChange={(e) => setFilterShippingMethod(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    {shippingMethodOptions.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedOrders.length > 0 && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg flex items-center justify-center font-semibold">
                      {selectedOrders.length}
                    </div>
                    <span className="font-medium text-gray-900">
                      {selectedOrders.length} order
                      {selectedOrders.length !== 1 ? "s" : ""} selected
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <select
                        onChange={(e) => handleBulkStatusUpdate(e.target.value)}
                        className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Update Status
                        </option>
                        {statusOptions
                          .filter((opt) => opt.value !== "all")
                          .map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    <Button
                      size="small"
                      variant="outline"
                      className="text-rose-600 border-rose-200 hover:bg-rose-50"
                      onClick={() => setShowDeleteModal(true)}
                    >
                      Delete Selected
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Content */}
            {viewMode === "table" ? renderTableView() : renderGridView()}

            {/* Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 lg:col-span-2">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Order Status Distribution
                </h3>
                <div className="space-y-4">
                  {statusOptions
                    .filter((opt) => opt.value !== "all")
                    .map((status) => {
                      const count = orders.filter(
                        (o) => o.status === status.value
                      ).length;
                      const percentage =
                        orders.length > 0 ? (count / orders.length) * 100 : 0;

                      return (
                        <div key={status.value}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-600">
                              {status.label}
                            </span>
                            <span className="font-medium">
                              {count} ({percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${percentage}%` }}
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
                  <button
                    onClick={() => window.print()}
                    className="w-full text-left p-3 bg-purple-50 text-purple-700 rounded-xl hover:bg-purple-100 transition-colors flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Print Report
                  </button>
                  <button
                    onClick={handleExportOrders}
                    className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export Data
                  </button>
                  <button
                    onClick={() => fetchOrderStats()}
                    className="w-full text-left p-3 bg-green-50 text-green-700 rounded-xl hover:bg-green-100 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Refresh Analytics
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showStatusModal && selectedOrder && (
        <StatusUpdateModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onSuccess={() => {
            fetchOrders();
            fetchOrderStats();
          }}
        />
      )}

      {showTrackingModal && selectedOrder && (
        <TrackingUpdateModal
          isOpen={showTrackingModal}
          onClose={() => {
            setShowTrackingModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onSuccess={() => {
            fetchOrders();
            fetchOrderStats();
          }}
        />
      )}

      {showPaymentModal && selectedOrder && (
        <PaymentUpdateModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
          onSuccess={() => {
            fetchOrders();
            fetchOrderStats();
          }}
        />
      )}

      {showDetailsModal && selectedOrder && (
        <OrderDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedOrder(null);
          }}
          order={selectedOrder}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedOrder(null);
          }}
          onConfirm={handleDelete}
          title={
            selectedOrder
              ? `Delete Order #${selectedOrder.orderNumber}`
              : `Delete ${selectedOrders.length} orders`
          }
          message={
            selectedOrder
              ? `Are you sure you want to delete order #${selectedOrder.orderNumber}? This action cannot be undone.`
              : `Are you sure you want to delete ${selectedOrders.length} selected orders? This action cannot be undone.`
          }
        />
      )}
    </AdminLayout>
  );
};

export default OrdersManagement;
