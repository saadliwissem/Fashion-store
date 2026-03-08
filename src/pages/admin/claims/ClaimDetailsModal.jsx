import React, { useState } from "react";
import {
  X,
  Save,
  Package,
  Truck,
  Clock,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  DollarSign,
  FileText,
  Edit,
  Copy,
  CheckCircle,
  XCircle,
  Loader,
  AlertCircle,
  ShoppingBag,
  Hash,
  Tag,
  Eye,
  Send,
  Printer,
  Download,
  History,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";
import { formatDate, formatPrice } from "../../../utils/formatters";

const ClaimDetailsModal = ({
  isOpen,
  onClose,
  claim,
  onUpdateStatus,
  onAddTracking,
}) => {
  const [activeTab, setActiveTab] = useState("details");
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isAddingTracking, setIsAddingTracking] = useState(false);
  const [statusData, setStatusData] = useState({
    status: claim?.status || "",
    notes: "",
  });
  const [trackingData, setTrackingData] = useState({
    carrier: "",
    trackingNumber: "",
    estimatedDelivery: "",
  });
  const [saving, setSaving] = useState(false);

  if (!isOpen || !claim) return null;

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

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "stripe":
        return "💳";
      case "paypal":
        return "🅿️";
      case "crypto":
        return "₿";
      default:
        return "💰";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5" />;
      case "processing":
        return <Loader className="w-5 h-5" />;
      case "shipped":
        return <Package className="w-5 h-5" />;
      case "delivered":
        return <Truck className="w-5 h-5" />;
      case "cancelled":
        return <XCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const handleStatusUpdate = async () => {
    try {
      setSaving(true);
      await onUpdateStatus(claim._id, statusData);
      setIsEditingStatus(false);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTracking = async () => {
    if (!trackingData.carrier || !trackingData.trackingNumber) {
      toast.error("Please fill in carrier and tracking number");
      return;
    }

    try {
      setSaving(true);
      await onAddTracking(claim._id, trackingData);
      setIsAddingTracking(false);
      setTrackingData({
        carrier: "",
        trackingNumber: "",
        estimatedDelivery: "",
      });
      toast.success("Tracking information added");
    } catch (error) {
      console.error("Error adding tracking:", error);
      toast.error("Failed to add tracking");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const tabs = [
    { id: "details", label: "Claim Details", icon: FileText },
    { id: "customer", label: "Customer Info", icon: User },
    { id: "fragment", label: "Fragment Details", icon: ShoppingBag },
    { id: "payment", label: "Payment Info", icon: CreditCard },
    { id: "shipping", label: "Shipping Info", icon: Truck },
    { id: "history", label: "History", icon: History },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Claim Details
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                    claim.status
                  )}`}
                >
                  {getStatusIcon(claim.status)}
                  {claim.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-600 font-mono">{claim.claimId}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  Created: {formatDate(claim.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCopyToClipboard(claim.claimId, "Claim ID")}
                className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                title="Copy Claim ID"
              >
                <Copy className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
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
        <div className="p-6">
          {/* Claim Details Tab */}
          {activeTab === "details" && (
            <div className="space-y-6">
              {/* Status Update Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5 text-purple-600" />
                    Claim Status
                  </h3>
                  {!isEditingStatus && (
                    <button
                      onClick={() => {
                        setStatusData({ status: claim.status, notes: "" });
                        setIsEditingStatus(true);
                      }}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Update Status
                    </button>
                  )}
                </div>

                {isEditingStatus ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Status
                      </label>
                      <select
                        value={statusData.status}
                        onChange={(e) =>
                          setStatusData({
                            ...statusData,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notes (Optional)
                      </label>
                      <textarea
                        value={statusData.notes}
                        onChange={(e) =>
                          setStatusData({
                            ...statusData,
                            notes: e.target.value,
                          })
                        }
                        rows="3"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        placeholder="Add any notes about this status change..."
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleStatusUpdate}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Update Status
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsEditingStatus(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">
                        Current Status
                      </p>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(claim.status)}
                        <span className="font-medium text-gray-900 capitalize">
                          {claim.status}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Last Updated</p>
                      <p className="font-medium text-gray-900">
                        {formatDate(claim.updatedAt)}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Admin Notes</p>
                      <p className="text-sm text-gray-700">
                        {claim.adminNotes?.length > 0
                          ? claim.adminNotes[claim.adminNotes.length - 1].text
                          : "No notes"}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Tracking Section */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-purple-600" />
                    Tracking Information
                  </h3>
                  {!isAddingTracking && !claim.trackingInfo?.trackingNumber && (
                    <button
                      onClick={() => setIsAddingTracking(true)}
                      className="flex items-center gap-2 px-3 py-1.5 text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
                    >
                      <Package className="w-4 h-4" />
                      Add Tracking
                    </button>
                  )}
                </div>

                {isAddingTracking ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Carrier
                        </label>
                        <select
                          value={trackingData.carrier}
                          onChange={(e) =>
                            setTrackingData({
                              ...trackingData,
                              carrier: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                        >
                          <option value="">Select Carrier</option>
                          <option value="UPS">UPS</option>
                          <option value="FedEx">FedEx</option>
                          <option value="DHL">DHL</option>
                          <option value="USPS">USPS</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tracking Number
                        </label>
                        <input
                          type="text"
                          value={trackingData.trackingNumber}
                          onChange={(e) =>
                            setTrackingData({
                              ...trackingData,
                              trackingNumber: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                          placeholder="Enter tracking number"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Estimated Delivery
                      </label>
                      <input
                        type="date"
                        value={trackingData.estimatedDelivery}
                        onChange={(e) =>
                          setTrackingData({
                            ...trackingData,
                            estimatedDelivery: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        onClick={handleAddTracking}
                        disabled={saving}
                        className="flex items-center gap-2"
                      >
                        {saving ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            Adding...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" />
                            Add Tracking
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingTracking(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {claim.trackingInfo?.trackingNumber ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Carrier</p>
                          <p className="font-medium text-gray-900">
                            {claim.trackingInfo.carrier}
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">
                            Tracking Number
                          </p>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 font-mono">
                              {claim.trackingInfo.trackingNumber}
                            </p>
                            <button
                              onClick={() =>
                                handleCopyToClipboard(
                                  claim.trackingInfo.trackingNumber,
                                  "Tracking number"
                                )
                              }
                              className="text-gray-400 hover:text-purple-600"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        {claim.trackingInfo.estimatedDelivery && (
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">
                              Estimated Delivery
                            </p>
                            <p className="font-medium text-gray-900">
                              {formatDate(claim.trackingInfo.estimatedDelivery)}
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">
                        No tracking information added yet
                      </p>
                    )}
                  </>
                )}
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-purple-600" />
                    Payment Summary
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">
                        ${claim.payment?.amount?.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax:</span>
                      <span className="font-medium">
                        ${((claim.payment?.amount || 0) * 0.1).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">$25.00</span>
                    </div>
                    <div className="border-t border-purple-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold">
                        <span className="text-gray-900">Total:</span>
                        <span className="text-purple-600">
                          $
                          {((claim.payment?.amount || 0) * 1.1 + 25).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    Timeline
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Created:</span>
                      <span className="font-medium">
                        {formatDate(claim.createdAt)}
                      </span>
                    </div>
                    {claim.payment?.paidAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Payment:</span>
                        <span className="font-medium">
                          {formatDate(claim.payment.paidAt)}
                        </span>
                      </div>
                    )}
                    {claim.trackingInfo?.shippedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shipped:</span>
                        <span className="font-medium">
                          {formatDate(claim.trackingInfo.shippedAt)}
                        </span>
                      </div>
                    )}
                    {claim.trackingInfo?.deliveredAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Delivered:</span>
                        <span className="font-medium">
                          {formatDate(claim.trackingInfo.deliveredAt)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Customer Info Tab */}
          {activeTab === "customer" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Full Name</p>
                    <p className="font-medium text-gray-900">
                      {claim.userData?.fullName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${claim.userData?.email}`}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {claim.userData?.email}
                      </a>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(claim.userData?.email, "Email")
                        }
                        className="text-gray-400 hover:text-purple-600"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${claim.userData?.phone}`}
                        className="text-purple-600 hover:text-purple-700"
                      >
                        {claim.userData?.phone || "Not provided"}
                      </a>
                      {claim.userData?.phone && (
                        <button
                          onClick={() =>
                            handleCopyToClipboard(
                              claim.userData?.phone,
                              "Phone"
                            )
                          }
                          className="text-gray-400 hover:text-purple-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Size</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {claim.userData?.size || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-purple-600" />
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="font-medium text-gray-900">
                    {claim.userData?.shippingAddress?.address}
                  </p>
                  {claim.userData?.shippingAddress?.address2 && (
                    <p className="text-gray-700">
                      {claim.userData.shippingAddress.address2}
                    </p>
                  )}
                  <p className="text-gray-700">
                    {claim.userData?.shippingAddress?.city},{" "}
                    {claim.userData?.shippingAddress?.state}{" "}
                    {claim.userData?.shippingAddress?.postalCode}
                  </p>
                  <p className="text-gray-700">
                    {claim.userData?.shippingAddress?.country}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  Preferences
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        claim.userData?.acceptUpdates
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    />
                    <span className="text-gray-700">
                      {claim.userData?.acceptUpdates
                        ? "Accepts"
                        : "Does not accept"}{" "}
                      updates
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        claim.userData?.acceptTerms
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="text-gray-700">Terms accepted</span>
                  </div>
                </div>
              </div>

              {claim.customization && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-purple-600" />
                    Customization Requests
                  </h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {claim.customization}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Fragment Details Tab */}
          {activeTab === "fragment" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-purple-600" />
                  Fragment Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fragment</p>
                    <p className="font-medium text-gray-900">
                      #{claim.fragment?.number} - {claim.fragment?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Chronicle</p>
                    <p className="font-medium text-gray-900">
                      {claim.fragment?.chronicle?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Enigma</p>
                    <p className="font-medium text-gray-900">
                      {claim.fragment?.chronicle?.enigma?.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Rarity</p>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                        claim.fragment?.rarity === "legendary"
                          ? "bg-yellow-100 text-yellow-800"
                          : claim.fragment?.rarity === "rare"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {claim.fragment?.rarity}
                    </span>
                  </div>
                </div>
              </div>

              {claim.fragment?.description && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    Description
                  </h3>
                  <p className="text-gray-700">{claim.fragment.description}</p>
                </div>
              )}

              {claim.fragment?.features &&
                claim.fragment.features.length > 0 && (
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Tag className="w-5 h-5 text-purple-600" />
                      Features
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {claim.fragment.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {claim.fragment?.clues && claim.fragment.clues.total > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-5 h-5 text-purple-600" />
                    Clues
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium">
                        {claim.fragment.clues.revealed || 0}/
                        {claim.fragment.clues.total}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all"
                        style={{
                          width: `${
                            ((claim.fragment.clues.revealed || 0) /
                              claim.fragment.clues.total) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Payment Info Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Payment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm text-gray-900">
                        {claim.payment?.transactionId || "N/A"}
                      </p>
                      {claim.payment?.transactionId && (
                        <button
                          onClick={() =>
                            handleCopyToClipboard(
                              claim.payment.transactionId,
                              "Transaction ID"
                            )
                          }
                          className="text-gray-400 hover:text-purple-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <span>{getPaymentMethodIcon(claim.payment?.method)}</span>
                      <span className="capitalize">
                        {claim.payment?.method}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Amount</p>
                    <p className="text-xl font-bold text-purple-600">
                      ${claim.payment?.amount?.toFixed(2)}{" "}
                      {claim.payment?.currency}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Status</p>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(
                        claim.payment?.status
                      )}`}
                    >
                      {claim.payment?.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Paid At</p>
                    <p className="font-medium text-gray-900">
                      {claim.payment?.paidAt
                        ? formatDate(claim.payment.paidAt)
                        : "Not paid yet"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h4 className="font-semibold text-gray-900 mb-4">
                  Payment Breakdown
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fragment Price:</span>
                    <span className="font-medium">
                      ${claim.payment?.amount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax (10%):</span>
                    <span className="font-medium">
                      ${((claim.payment?.amount || 0) * 0.1).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping:</span>
                    <span className="font-medium">$25.00</span>
                  </div>
                  <div className="border-t border-purple-200 pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span className="text-gray-900">Total Charged:</span>
                      <span className="text-purple-600">
                        ${((claim.payment?.amount || 0) * 1.1 + 25).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Info Tab */}
          {activeTab === "shipping" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-purple-600" />
                  Shipping Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Shipping Address
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <p className="font-medium text-gray-900">
                        {claim.userData?.shippingAddress?.address}
                      </p>
                      {claim.userData?.shippingAddress?.address2 && (
                        <p className="text-gray-700">
                          {claim.userData.shippingAddress.address2}
                        </p>
                      )}
                      <p className="text-gray-700">
                        {claim.userData?.shippingAddress?.city},{" "}
                        {claim.userData?.shippingAddress?.state}{" "}
                        {claim.userData?.shippingAddress?.postalCode}
                      </p>
                      <p className="text-gray-700">
                        {claim.userData?.shippingAddress?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-purple-600" />
                  Tracking Information
                </h3>
                {claim.trackingInfo?.trackingNumber ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Carrier</p>
                      <p className="font-medium text-gray-900">
                        {claim.trackingInfo.carrier}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Tracking Number
                      </p>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 font-mono">
                          {claim.trackingInfo.trackingNumber}
                        </p>
                        <button
                          onClick={() =>
                            handleCopyToClipboard(
                              claim.trackingInfo.trackingNumber,
                              "Tracking number"
                            )
                          }
                          className="text-gray-400 hover:text-purple-600"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        Estimated Delivery
                      </p>
                      <p className="font-medium text-gray-900">
                        {claim.trackingInfo.estimatedDelivery
                          ? formatDate(claim.trackingInfo.estimatedDelivery)
                          : "Not set"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Shipped At</p>
                      <p className="font-medium text-gray-900">
                        {claim.trackingInfo.shippedAt
                          ? formatDate(claim.trackingInfo.shippedAt)
                          : "Not shipped"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Delivered At</p>
                      <p className="font-medium text-gray-900">
                        {claim.trackingInfo.deliveredAt
                          ? formatDate(claim.trackingInfo.deliveredAt)
                          : "Not delivered"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No tracking information available
                  </p>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <History className="w-5 h-5 text-purple-600" />
                  Claim Timeline
                </h3>

                <div className="relative">
                  {/* Timeline line */}
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                  <div className="space-y-6">
                    {/* Created Event */}
                    <div className="relative pl-12">
                      <div className="absolute left-2 top-1 w-5 h-5 bg-purple-100 rounded-full border-2 border-purple-500 flex items-center justify-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Claim Created
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(claim.createdAt)}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Claim {claim.claimId} was initiated by{" "}
                          {claim.userData?.fullName}
                        </p>
                      </div>
                    </div>

                    {/* Payment Event */}
                    {claim.payment?.paidAt && (
                      <div className="relative pl-12">
                        <div className="absolute left-2 top-1 w-5 h-5 bg-green-100 rounded-full border-2 border-green-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Payment Completed
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(claim.payment.paidAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Payment of ${claim.payment?.amount} via{" "}
                            {claim.payment?.method} was processed
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Status Changes */}
                    {claim.adminNotes?.map((note, index) => (
                      <div key={index} className="relative pl-12">
                        <div className="absolute left-2 top-1 w-5 h-5 bg-blue-100 rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Status Update
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(note.addedAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {note.text}
                          </p>
                          {note.addedBy && (
                            <p className="text-xs text-gray-400 mt-1">
                              By: {note.addedBy.firstName}{" "}
                              {note.addedBy.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Tracking Added */}
                    {claim.trackingInfo?.shippedAt && (
                      <div className="relative pl-12">
                        <div className="absolute left-2 top-1 w-5 h-5 bg-cyan-100 rounded-full border-2 border-cyan-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Item Shipped
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(claim.trackingInfo.shippedAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Shipped via {claim.trackingInfo.carrier} -{" "}
                            {claim.trackingInfo.trackingNumber}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Delivered */}
                    {claim.trackingInfo?.deliveredAt && (
                      <div className="relative pl-12">
                        <div className="absolute left-2 top-1 w-5 h-5 bg-green-100 rounded-full border-2 border-green-500 flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            Item Delivered
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(claim.trackingInfo.deliveredAt)}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            Package was delivered successfully
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => window.print()}
                className="flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const dataStr = JSON.stringify(claim, null, 2);
                  const dataBlob = new Blob([dataStr], {
                    type: "application/json",
                  });
                  const url = URL.createObjectURL(dataBlob);
                  const link = document.createElement("a");
                  link.href = url;
                  link.download = `claim-${claim.claimId}.json`;
                  link.click();
                }}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimDetailsModal;
