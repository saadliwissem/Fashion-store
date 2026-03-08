import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Grid,
  List,
  Download,
  Copy,
  Filter,
  Check,
  X,
  RefreshCw,
  Star,
  DollarSign,
  Users,
  Package,
  Truck,
  Clock,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Eye,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  ShoppingBag,
  FileText,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/common/Button";
import ClaimDetailsModal from "./ClaimDetailsModal";
import DeleteConfirmation from "../categories/DeleteConfirmation";
import toast from "react-hot-toast";
import { adminClaimAPI } from "../../../services/adminApi";
import { formatDate, formatPrice } from "../../../utils/formatters";
import { Link } from "react-router-dom";

// Claim Card Component for Grid View
const ClaimCard = ({ claim, onView, onUpdateStatus, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "shipped":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      case "refunded":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "confirmed":
        return <CheckCircle className="w-4 h-4" />;
      case "processing":
        return <Loader className="w-4 h-4" />;
      case "shipped":
        return <Package className="w-4 h-4" />;
      case "delivered":
        return <Truck className="w-4 h-4" />;
      case "cancelled":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-mono text-gray-500">
                {claim.claimId}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                  claim.status
                )}`}
              >
                {getStatusIcon(claim.status)}
                {claim.status}
              </span>
            </div>
            <h3 className="font-bold text-gray-900">
              {claim.userData?.fullName}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              {claim.userData?.email}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-purple-600">
              ${claim.payment?.amount?.toFixed(2)}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formatDate(claim.createdAt)}
            </p>
          </div>
        </div>

        {/* Fragment Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {claim.fragment?.name || "Unknown Fragment"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {claim.fragment?.chronicle?.name} • #{claim.fragment?.number}
              </p>
            </div>
          </div>
        </div>

        {/* Payment & Shipping Info */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <CreditCard className="w-4 h-4" />
              Payment:
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(
                claim.payment?.status
              )}`}
            >
              {claim.payment?.status}
            </span>
          </div>

          {claim.trackingInfo?.trackingNumber && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 flex items-center gap-1">
                <Package className="w-4 h-4" />
                Tracking:
              </span>
              <span className="font-mono text-xs text-gray-700">
                {claim.trackingInfo.trackingNumber}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              Shipping:
            </span>
            <span className="text-gray-700 text-right">
              {claim.userData?.shippingAddress?.city},{" "}
              {claim.userData?.shippingAddress?.country}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(claim)}
            className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View Details
          </button>
          <button
            onClick={() => onDelete(claim)}
            className="flex-1 py-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// Claim Table Row Component for List View
const ClaimTableRow = ({
  claim,
  isSelected,
  onSelect,
  onView,
  onUpdateStatus,
  onDelete,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-cyan-100 text-cyan-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "failed":
        return "text-red-600";
      case "refunded":
        return "text-gray-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(claim._id)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
      </td>
      <td className="p-4">
        <div className="font-mono text-sm text-gray-900">{claim.claimId}</div>
        <div className="text-xs text-gray-500">
          {formatDate(claim.createdAt)}
        </div>
      </td>
      <td className="p-4">
        <div className="font-medium text-gray-900">
          {claim.userData?.fullName}
        </div>
        <div className="text-sm text-gray-500">{claim.userData?.email}</div>
        <div className="text-xs text-gray-400">{claim.userData?.phone}</div>
      </td>
      <td className="p-4">
        <div className="font-medium text-gray-900">
          {claim.fragment?.name || "Unknown"}
        </div>
        <div className="text-xs text-gray-500">
          {claim.fragment?.chronicle?.name} • #{claim.fragment?.number}
        </div>
      </td>
      <td className="p-4">
        <div className="font-bold text-purple-600">
          ${claim.payment?.amount?.toFixed(2)}
        </div>
        <div
          className={`text-xs ${getPaymentStatusColor(claim.payment?.status)}`}
        >
          {claim.payment?.method} • {claim.payment?.status}
        </div>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            claim.status
          )}`}
        >
          {claim.status}
        </span>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-700">
          {claim.userData?.shippingAddress?.city},{" "}
          {claim.userData?.shippingAddress?.country}
        </div>
        {claim.trackingInfo?.trackingNumber && (
          <div className="text-xs text-gray-500 mt-1">
            📦 {claim.trackingInfo.trackingNumber}
          </div>
        )}
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(claim)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdateStatus(claim)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Update Status"
          >
            <Package className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(claim)}
            className="p-2 text-gray-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

const ClaimsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [claims, setClaims] = useState([]);
  const [stats, setStats] = useState({
    totalClaims: 0,
    totalValue: 0,
    averageValue: 0,
    byStatus: {
      pending: 0,
      confirmed: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    },
    recentActivity: [],
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  // Fetch claims from API
  const fetchClaims = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        paymentStatus: paymentFilter !== "all" ? paymentFilter : undefined,
        search: searchTerm || undefined,
      };

      const response = await adminClaimAPI.getClaims(params);
      setClaims(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching claims:", error);
      toast.error("Failed to load claims");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await adminClaimAPI.getClaimStats();
      setStats(response.data.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchClaims(1);
    fetchStats();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    fetchClaims(1);
  }, [statusFilter, paymentFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchClaims(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectAll = () => {
    if (selectedItems.length === claims.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(claims.map((item) => item._id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    setShowDetailsModal(true);
  };

  const handleUpdateStatus = (claim) => {
    setSelectedClaim(claim);
    setShowStatusModal(true);
  };

  const handleDeleteClaim = (claim) => {
    setSelectedClaim(claim);
    setShowDeleteModal(true);
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error("Please select claims first");
      return;
    }

    try {
      switch (action) {
        case "export":
          const exportData = claims.filter((item) =>
            selectedItems.includes(item._id)
          );
          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `claims-export-${
            new Date().toISOString().split("T")[0]
          }.json`;
          link.click();
          toast.success(`Exported ${selectedItems.length} claims`);
          break;
        case "delete":
          setShowDeleteModal(true);
          break;
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to ${action} claims`);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) => adminClaimAPI.deleteClaim(id))
      );
      toast.success(`${selectedItems.length} claims deleted successfully`);
      setShowDeleteModal(false);
      setSelectedItems([]);
      fetchClaims(1);
      fetchStats();
    } catch (error) {
      console.error("Error deleting claims:", error);
      toast.error(error.response?.data?.message || "Failed to delete claims");
    }
  };

  const handleSingleDelete = async () => {
    try {
      await adminClaimAPI.deleteClaim(selectedClaim._id);
      toast.success(`Claim ${selectedClaim.claimId} deleted successfully`);
      setShowDeleteModal(false);
      setSelectedClaim(null);
      fetchClaims(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error deleting claim:", error);
      toast.error(error.response?.data?.message || "Failed to delete claim");
    }
  };

  const handleUpdateClaimStatus = async (claimId, statusData) => {
    try {
      await adminClaimAPI.updateClaimStatus(claimId, statusData);
      toast.success("Claim status updated successfully");
      setShowStatusModal(false);
      setSelectedClaim(null);
      fetchClaims(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error updating claim status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update claim status"
      );
    }
  };

  const handleAddTracking = async (claimId, trackingInfo) => {
    try {
      await adminClaimAPI.updateTracking(claimId, trackingInfo);
      toast.success("Tracking information added successfully");
      fetchClaims(pagination.page);
    } catch (error) {
      console.error("Error adding tracking:", error);
      toast.error(error.response?.data?.message || "Failed to add tracking");
    }
  };

  const renderListView = () => {
    if (claims.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No claims found</p>
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
                      selectedItems.length === claims.length &&
                      claims.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Claim ID
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Customer
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Fragment
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Shipping
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {claims.map((claim) => (
                <ClaimTableRow
                  key={claim._id}
                  claim={claim}
                  isSelected={selectedItems.includes(claim._id)}
                  onSelect={handleSelectItem}
                  onView={handleViewClaim}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDeleteClaim}
                />
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} claims
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchClaims(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchClaims(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderGridView = () => {
    if (claims.length === 0) {
      return (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No claims found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {claims.map((claim) => (
          <ClaimCard
            key={claim._id}
            claim={claim}
            onView={handleViewClaim}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDeleteClaim}
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
              Claims Management
            </h1>
            <p className="text-gray-600">
              Track and manage fragment claims and orders
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                fetchClaims(pagination.page);
                fetchStats();
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => handleBulkAction("export")}
              disabled={selectedItems.length === 0}
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Claims</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalClaims}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.byStatus?.delivered || 0} delivered
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
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  ${loading ? "..." : stats.totalValue?.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Avg: ${stats.averageValue?.toFixed(2)}
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
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.byStatus?.pending || 0}
                </p>
                <p className="text-sm text-yellow-600 mt-1">
                  {stats.byStatus?.confirmed || 0} confirmed
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading
                    ? "..."
                    : (stats.byStatus?.processing || 0) +
                      (stats.byStatus?.shipped || 0)}
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  {stats.byStatus?.processing || 0} processing,{" "}
                  {stats.byStatus?.shipped || 0} shipped
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Left: Search and Filters */}
            <div className="flex-1 max-w-3xl">
              <div className="flex flex-col md:flex-row md:items-center gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Search claims by ID, customer name, or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Right: View Mode */}
            <div className="flex border border-gray-300 rounded-xl overflow-hidden">
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 transition-colors ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 transition-colors ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white"
                    : "hover:bg-gray-50 text-gray-700"
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 border border-purple-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg flex items-center justify-center font-semibold">
                  {selectedItems.length}
                </div>
                <span className="font-medium text-gray-900">
                  {selectedItems.length} claim
                  {selectedItems.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
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

        {/* Claims Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading claims...</p>
          </div>
        ) : viewMode === "list" ? (
          renderListView()
        ) : (
          renderGridView()
        )}

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Claims Management Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Update claim status as orders progress through fulfillment
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Add tracking numbers when items are shipped</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Monitor payment status to identify failed transactions
                    </span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Export claims for external reporting or analysis
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Contact customers directly from claim details</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Track delivery status to ensure customer satisfaction
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedClaim && (
        <ClaimDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedClaim(null);
          }}
          claim={selectedClaim}
          onUpdateStatus={handleUpdateClaimStatus}
          onAddTracking={handleAddTracking}
        />
      )}

      {showStatusModal && selectedClaim && (
        <ClaimStatusModal
          isOpen={showStatusModal}
          onClose={() => {
            setShowStatusModal(false);
            setSelectedClaim(null);
          }}
          claim={selectedClaim}
          onUpdateStatus={handleUpdateClaimStatus}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedClaim(null);
          }}
          onConfirm={selectedClaim ? handleSingleDelete : handleBulkDelete}
          title={
            selectedClaim
              ? `Delete Claim ${selectedClaim.claimId}`
              : `Delete ${selectedItems.length} claims`
          }
          message={
            selectedClaim
              ? `Are you sure you want to delete claim ${selectedClaim.claimId}? This action cannot be undone.`
              : `Are you sure you want to delete ${selectedItems.length} selected claims? This action cannot be undone.`
          }
        />
      )}
    </AdminLayout>
  );
};

export default ClaimsManagement;
