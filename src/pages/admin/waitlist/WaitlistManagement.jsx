import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Grid,
  List,
  Download,
  Filter,
  RefreshCw,
  Users,
  Clock,
  Bell,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  UserPlus,
  UserMinus,
  Calendar,
  BarChart3,
  TrendingUp,
  AlertCircle,
  Copy,
  Check,
  X,
} from "lucide-react";
import AdminLayout from "../../../components/layout/AdminLayout";
import Button from "../../../components/common/Button";
import WaitlistDetailsModal from "./WaitlistDetailsModal";
import DeleteConfirmation from "../categories/DeleteConfirmation";
import toast from "react-hot-toast";
import { adminWaitlistAPI } from "../../../services/adminApi";
import { formatDate } from "../../../utils/formatters";
import { Link } from "react-router-dom";

// Waitlist Card Component for Grid View
const WaitlistCard = ({ entry, onView, onNotify, onDelete }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "notified":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "fulfilled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "expired":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPositionColor = (position) => {
    if (position <= 10) return "text-green-600 bg-green-50";
    if (position <= 30) return "text-yellow-600 bg-yellow-50";
    if (position <= 50) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case "organic":
        return "🌱";
      case "referral":
        return "🤝";
      case "campaign":
        return "📢";
      default:
        return "📋";
    }
  };

  const daysInWaitlist = Math.floor(
    (new Date() - new Date(entry.createdAt)) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  entry.status
                )}`}
              >
                {entry.status}
              </span>
              <span className="text-xs text-gray-500">
                {getSourceIcon(entry.source)} {entry.source}
              </span>
            </div>
            <h3 className="font-bold text-gray-900">
              {entry.user ? (
                <span>
                  {entry.user.firstName} {entry.user.lastName}
                </span>
              ) : (
                <span className="text-gray-600">Anonymous User</span>
              )}
            </h3>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <Mail className="w-3 h-3" />
              {entry.email}
            </p>
          </div>
          <div className="text-right">
            <div
              className={`text-2xl font-bold rounded-lg px-3 py-1 ${getPositionColor(
                entry.position
              )}`}
            >
              #{entry.position}
            </div>
            <p className="text-xs text-gray-500 mt-1">Position</p>
          </div>
        </div>

        {/* Chronicle Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-900">
                {entry.chronicle?.name || "Unknown Chronicle"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {entry.chronicle?.enigma?.name}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Joined</p>
            <p className="font-medium text-gray-900 text-sm">
              {formatDate(entry.createdAt)}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {daysInWaitlist} days ago
            </p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 mb-1">Notifications</p>
            <div className="space-y-1">
              {entry.preferences?.notifyOnAvailable && (
                <span className="flex items-center gap-1 text-xs text-green-600">
                  <Bell className="w-3 h-3" />
                  Available
                </span>
              )}
              {entry.preferences?.notifyOnNewChronicle && (
                <span className="flex items-center gap-1 text-xs text-blue-600">
                  <Bell className="w-3 h-3" />
                  New Chronicles
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onView(entry)}
            className="flex-1 py-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </button>
          <button
            onClick={() => onNotify(entry)}
            className="flex-1 py-2.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm flex items-center justify-center gap-2"
            disabled={entry.status !== "active"}
          >
            <Send className="w-4 h-4" />
            Notify
          </button>
          <button
            onClick={() => onDelete(entry)}
            className="p-2.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
            title="Delete"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Waitlist Table Row Component for List View
const WaitlistTableRow = ({
  entry,
  isSelected,
  onSelect,
  onView,
  onNotify,
  onDelete,
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "notified":
        return "bg-blue-100 text-blue-800";
      case "fulfilled":
        return "bg-purple-100 text-purple-800";
      case "expired":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPositionColor = (position) => {
    if (position <= 10) return "text-green-600 font-bold";
    if (position <= 30) return "text-yellow-600 font-bold";
    if (position <= 50) return "text-orange-600 font-bold";
    return "text-red-600 font-bold";
  };

  const daysInWaitlist = Math.floor(
    (new Date() - new Date(entry.createdAt)) / (1000 * 60 * 60 * 24)
  );

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="p-4">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(entry._id)}
          className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
      </td>
      <td className="p-4">
        <div className="font-medium text-gray-900">
          {entry.user ? (
            `${entry.user.firstName} ${entry.user.lastName}`
          ) : (
            <span className="text-gray-500">Anonymous</span>
          )}
        </div>
        <div className="text-sm text-gray-500">{entry.email}</div>
      </td>
      <td className="p-4">
        <div className="font-medium text-gray-900">
          {entry.chronicle?.name || "Unknown"}
        </div>
        <div className="text-xs text-gray-500">
          {entry.chronicle?.enigma?.name}
        </div>
      </td>
      <td className="p-4">
        <span
          className={`text-lg font-bold ${getPositionColor(entry.position)}`}
        >
          #{entry.position}
        </span>
      </td>
      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            entry.status
          )}`}
        >
          {entry.status}
        </span>
      </td>
      <td className="p-4">
        <div className="text-sm text-gray-700">
          {formatDate(entry.createdAt)}
        </div>
        <div className="text-xs text-gray-500">{daysInWaitlist} days</div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          {entry.preferences?.notifyOnAvailable && (
            <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-xs flex items-center gap-1">
              <Bell className="w-3 h-3" />
              Available
            </span>
          )}
          {entry.preferences?.notifyOnNewChronicle && (
            <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded text-xs flex items-center gap-1">
              <Bell className="w-3 h-3" />
              New
            </span>
          )}
        </div>
      </td>
      <td className="p-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onView(entry)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNotify(entry)}
            className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg"
            title="Send Notification"
            disabled={entry.status !== "active"}
          >
            <Send className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(entry)}
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

const WaitlistManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [loading, setLoading] = useState(true);
  const [waitlistEntries, setWaitlistEntries] = useState([]);
  const [stats, setStats] = useState({
    totalActive: 0,
    totalNotified: 0,
    totalFulfilled: 0,
    totalExpired: 0,
    averageWaitTime: 0,
    byChronicle: {},
    bySource: {
      organic: 0,
      referral: 0,
      campaign: 0,
    },
  });
  const [statusFilter, setStatusFilter] = useState("all");
  const [chronicleFilter, setChronicleFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [chronicles, setChronicles] = useState([]);

  // Fetch waitlist entries from API
  const fetchWaitlistEntries = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: pagination.limit,
        status: statusFilter !== "all" ? statusFilter : undefined,
        chronicleId: chronicleFilter !== "all" ? chronicleFilter : undefined,
        source: sourceFilter !== "all" ? sourceFilter : undefined,
        search: searchTerm || undefined,
      };

      const response = await adminWaitlistAPI.getWaitlistEntries(params);
      setWaitlistEntries(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        total: response.data.total,
        totalPages: response.data.pagination.totalPages,
      });
    } catch (error) {
      console.error("Error fetching waitlist entries:", error);
      toast.error("Failed to load waitlist entries");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await adminWaitlistAPI.getWaitlistStats();
      setStats(response.data.data);
      // Extract unique chronicles for filter
      if (response.data.data.byChronicle) {
        const chronicleList = Object.keys(response.data.data.byChronicle).map(
          (id) => ({
            _id: id,
            name: response.data.data.byChronicle[id].name,
            count: response.data.data.byChronicle[id].count,
          })
        );
        setChronicles(chronicleList);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchWaitlistEntries(1);
    fetchStats();
  }, []);

  // Apply filters when they change
  useEffect(() => {
    fetchWaitlistEntries(1);
  }, [statusFilter, chronicleFilter, sourceFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchWaitlistEntries(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSelectAll = () => {
    if (selectedItems.length === waitlistEntries.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(waitlistEntries.map((item) => item._id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleViewEntry = (entry) => {
    setSelectedEntry(entry);
    setShowDetailsModal(true);
  };

  const handleNotifyEntry = (entry) => {
    setSelectedEntry(entry);
    setShowNotifyModal(true);
  };

  const handleDeleteEntry = (entry) => {
    setSelectedEntry(entry);
    setShowDeleteModal(true);
  };

  const handleBulkAction = async (action) => {
    if (selectedItems.length === 0) {
      toast.error("Please select entries first");
      return;
    }

    try {
      switch (action) {
        case "notify":
          // Show notification modal for bulk notify
          setShowNotifyModal(true);
          break;
        case "export":
          const exportData = waitlistEntries.filter((item) =>
            selectedItems.includes(item._id)
          );
          const dataStr = JSON.stringify(exportData, null, 2);
          const dataBlob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(dataBlob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `waitlist-export-${
            new Date().toISOString().split("T")[0]
          }.json`;
          link.click();
          toast.success(`Exported ${selectedItems.length} entries`);
          break;
        case "delete":
          setShowDeleteModal(true);
          break;
      }
    } catch (error) {
      console.error(`Error performing bulk ${action}:`, error);
      toast.error(`Failed to ${action} entries`);
    }
  };

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedItems.map((id) => adminWaitlistAPI.deleteWaitlistEntry(id))
      );
      toast.success(
        `${selectedItems.length} waitlist entries deleted successfully`
      );
      setShowDeleteModal(false);
      setSelectedItems([]);
      fetchWaitlistEntries(1);
      fetchStats();
    } catch (error) {
      console.error("Error deleting entries:", error);
      toast.error(error.response?.data?.message || "Failed to delete entries");
    }
  };

  const handleSingleDelete = async () => {
    try {
      await adminWaitlistAPI.deleteWaitlistEntry(selectedEntry._id);
      toast.success(`Waitlist entry deleted successfully`);
      setShowDeleteModal(false);
      setSelectedEntry(null);
      fetchWaitlistEntries(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error(error.response?.data?.message || "Failed to delete entry");
    }
  };

  const handleSendNotification = async (notificationData) => {
    try {
      const entryIds =
        selectedItems.length > 0 ? selectedItems : [selectedEntry._id];
      await adminWaitlistAPI.notifyWaitlist({
        entryIds,
        ...notificationData,
      });
      toast.success(`Notification sent to ${entryIds.length} users`);
      setShowNotifyModal(false);
      setSelectedEntry(null);
      setSelectedItems([]);
      fetchWaitlistEntries(pagination.page);
      fetchStats();
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error(
        error.response?.data?.message || "Failed to send notification"
      );
    }
  };

  const handleClearWaitlist = async (chronicleId) => {
    if (
      !window.confirm(
        "Are you sure you want to clear all waitlist entries for this chronicle?"
      )
    ) {
      return;
    }

    try {
      await adminWaitlistAPI.clearWaitlist(chronicleId);
      toast.success("Waitlist cleared successfully");
      fetchWaitlistEntries(1);
      fetchStats();
    } catch (error) {
      console.error("Error clearing waitlist:", error);
      toast.error("Failed to clear waitlist");
    }
  };

  const renderListView = () => {
    if (waitlistEntries.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No waitlist entries found</p>
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
                      selectedItems.length === waitlistEntries.length &&
                      waitlistEntries.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  User
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Chronicle
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Position
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Status
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Joined
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Preferences
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {waitlistEntries.map((entry) => (
                <WaitlistTableRow
                  key={entry._id}
                  entry={entry}
                  isSelected={selectedItems.includes(entry._id)}
                  onSelect={handleSelectItem}
                  onView={handleViewEntry}
                  onNotify={handleNotifyEntry}
                  onDelete={handleDeleteEntry}
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
              of {pagination.total} entries
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => fetchWaitlistEntries(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() => fetchWaitlistEntries(pagination.page + 1)}
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
    if (waitlistEntries.length === 0) {
      return (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No waitlist entries found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {waitlistEntries.map((entry) => (
          <WaitlistCard
            key={entry._id}
            entry={entry}
            onView={handleViewEntry}
            onNotify={handleNotifyEntry}
            onDelete={handleDeleteEntry}
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
              Waitlist Management
            </h1>
            <p className="text-gray-600">
              Monitor and manage users waiting for chronicles
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                fetchWaitlistEntries(pagination.page);
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
                <p className="text-sm text-gray-600">Active Waitlist</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalActive}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {stats.totalNotified} notified
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fulfilled</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {loading ? "..." : stats.totalFulfilled}
                </p>
                <p className="text-sm text-purple-600 mt-1">
                  {stats.totalExpired} expired
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg. Wait Time</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.averageWaitTime || "2-3"} weeks
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Based on historical data
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sources</p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.bySource?.organic || 0}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {stats.bySource?.referral || 0} referral,{" "}
                  {stats.bySource?.campaign || 0} campaign
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
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
                      placeholder="Search by email or name..."
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
                    <option value="active">Active</option>
                    <option value="notified">Notified</option>
                    <option value="fulfilled">Fulfilled</option>
                    <option value="expired">Expired</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <select
                    value={chronicleFilter}
                    onChange={(e) => setChronicleFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Chronicles</option>
                    {chronicles.map((chronicle) => (
                      <option key={chronicle._id} value={chronicle._id}>
                        {chronicle.name} ({chronicle.count})
                      </option>
                    ))}
                  </select>

                  <select
                    value={sourceFilter}
                    onChange={(e) => setSourceFilter(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  >
                    <option value="all">All Sources</option>
                    <option value="organic">Organic</option>
                    <option value="referral">Referral</option>
                    <option value="campaign">Campaign</option>
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
                  {selectedItems.length} waitlist entr
                  {selectedItems.length !== 1 ? "ies" : "y"} selected
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button size="small" onClick={() => handleBulkAction("notify")}>
                  <Send className="w-4 h-4 mr-2" />
                  Notify
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

        {/* Waitlist Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading waitlist entries...</p>
          </div>
        ) : viewMode === "list" ? (
          renderListView()
        ) : (
          renderGridView()
        )}

        {/* Chronicle Waitlist Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">📊</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-4">
                Waitlist by Chronicle
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(stats.byChronicle || {}).map(([id, data]) => (
                  <div
                    key={id}
                    className="bg-white rounded-xl p-4 border border-blue-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900 truncate max-w-[200px]">
                        {data.name}
                      </h4>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        #{data.count}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                        style={{
                          width: `${(data.count / stats.totalActive) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      {Math.round((data.count / stats.totalActive) * 100)}% of
                      waitlist
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl">💡</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 mb-2">
                Waitlist Management Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Send notifications when fragments become available
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Track waitlist position to estimate availability
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Monitor conversion rates from waitlist to claims
                    </span>
                  </li>
                </ul>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Clear expired entries to maintain accurate counts
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Analyze sources to optimize marketing campaigns</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>
                      Use notification preferences to target engaged users
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && selectedEntry && (
        <WaitlistDetailsModal
          isOpen={showDetailsModal}
          onClose={() => {
            setShowDetailsModal(false);
            setSelectedEntry(null);
          }}
          entry={selectedEntry}
          onNotify={() => {
            setShowDetailsModal(false);
            setShowNotifyModal(true);
          }}
        />
      )}

      {showNotifyModal && (
        <WaitlistNotifyModal
          isOpen={showNotifyModal}
          onClose={() => {
            setShowNotifyModal(false);
            setSelectedEntry(null);
          }}
          entries={
            selectedItems.length > 0
              ? selectedItems
              : selectedEntry
              ? [selectedEntry._id]
              : []
          }
          entryCount={selectedItems.length || 1}
          onSend={handleSendNotification}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmation
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedEntry(null);
          }}
          onConfirm={selectedEntry ? handleSingleDelete : handleBulkDelete}
          title={
            selectedEntry
              ? `Delete Waitlist Entry`
              : `Delete ${selectedItems.length} waitlist entries`
          }
          message={
            selectedEntry
              ? `Are you sure you want to delete this waitlist entry for ${selectedEntry.email}? This action cannot be undone.`
              : `Are you sure you want to delete ${selectedItems.length} selected waitlist entries? This action cannot be undone.`
          }
        />
      )}
    </AdminLayout>
  );
};

export default WaitlistManagement;
