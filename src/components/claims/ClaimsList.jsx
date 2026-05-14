import React from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ChevronLeft,
  Filter,
  Search,
  Eye,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  Hash,
  User,
} from "lucide-react";
import Button from "../common/Button";

const ClaimsList = ({
  claims,
  loading,
  onBack,
  filter,
  setFilter,
  search,
  setSearch,
  isFullPage = false,
}) => {
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-700",
        label: "Pending",
      },
      confirmed: {
        icon: CheckCircle,
        color: "bg-purple-100 text-purple-700",
        label: "Confirmed",
      },
      processing: {
        icon: Clock,
        color: "bg-blue-100 text-blue-700",
        label: "Processing",
      },
      shipped: {
        icon: Truck,
        color: "bg-indigo-100 text-indigo-700",
        label: "Shipped",
      },
      delivered: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700",
        label: "Delivered",
      },
      cancelled: {
        icon: XCircle,
        color: "bg-red-100 text-red-700",
        label: "Cancelled",
      },
    };
    const config = statusConfig[status] || statusConfig.pending;
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status) => {
    if (status === "pending_cod") {
      return <span className="text-xs text-blue-600">Cash on Delivery</span>;
    }
    if (status === "completed") {
      return <span className="text-xs text-green-600">Paid</span>;
    }
    if (status === "failed") {
      return <span className="text-xs text-red-600">Payment Failed</span>;
    }
    return <span className="text-xs text-yellow-600">Pending Payment</span>;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <span className="ml-3 text-gray-600">Loading claims...</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${!isFullPage ? "bg-white rounded-xl shadow-sm p-6" : ""}`}
    >
      {/* Header with Back Button */}
      {!isFullPage && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h3 className="text-xl font-bold text-gray-900">
              All Fragment Claims
            </h3>
          </div>
          <span className="text-sm text-gray-500">
            {claims.length} claim{claims.length !== 1 ? "s" : ""}
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by fragment name or claim ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "all"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "pending"
                ? "bg-yellow-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter("confirmed")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "confirmed"
                ? "bg-purple-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Confirmed
          </button>
          <button
            onClick={() => setFilter("processing")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "processing"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Processing
          </button>
          <button
            onClick={() => setFilter("shipped")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "shipped"
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Shipped
          </button>
          <button
            onClick={() => setFilter("delivered")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "delivered"
                ? "bg-green-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Delivered
          </button>
          <button
            onClick={() => setFilter("cancelled")}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              filter === "cancelled"
                ? "bg-red-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Claims List */}
      {claims.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Claims Found
          </h3>
          <p className="text-gray-600 mb-6">
            {search
              ? `No claims match "${search}". Try a different search.`
              : filter !== "all"
              ? `You don't have any ${filter} claims.`
              : "You haven't claimed any fragments yet."}
          </p>
          {search && (
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear Search
            </Button>
          )}
          {!search && filter === "all" && (
            <Link to="/mysteries">
              <Button>Explore Mysteries</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div
              key={claim._id}
              className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                {/* Left side - Fragment Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-gray-900">
                      {claim.fragment?.name || "Fragment"}
                    </h4>
                    {getStatusBadge(claim.status)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Hash className="w-4 h-4" />
                      <span>Claim ID: {claim.claimId}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Claimed:{" "}
                        {new Date(claim.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Amount: {claim.payment?.amount} TND</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <User className="w-4 h-4" />
                      <span>
                        Size: {claim.userData?.size || "Not specified"}
                      </span>
                    </div>
                  </div>

                  {/* Shipping Address */}
                  {claim.userData?.shippingAddress && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        📦 Shipping to: {claim.userData.shippingAddress.address}
                        , {claim.userData.shippingAddress.city}
                      </p>
                    </div>
                  )}
                </div>

                {/* Right side - Action */}
                <div className="flex flex-col items-end gap-2">
                  {getPaymentStatusBadge(claim.payment?.status)}
                  <Link to={`/claims/${claim._id}`}>
                    <Button
                      variant="outline"
                      size="small"
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Tracking Info (if shipped) */}
              {claim.trackingInfo?.trackingNumber && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    📬 Tracking: {claim.trackingInfo.carrier} -{" "}
                    {claim.trackingInfo.trackingNumber}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClaimsList;
