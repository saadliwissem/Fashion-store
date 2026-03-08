import React, { useState } from "react";
import {
  X,
  Save,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  AlertCircle,
  Send,
  Mail,
  Bell,
  FileText,
  Edit,
  Calendar,
  User,
  MessageSquare,
  CheckSquare,
  AlertTriangle,
} from "lucide-react";
import Button from "../../../components/common/Button";
import toast from "react-hot-toast";

const ClaimStatusModal = ({ isOpen, onClose, claim, onUpdateStatus }) => {
  const [statusData, setStatusData] = useState({
    status: claim?.status || "",
    notes: "",
    notifyCustomer: true,
    sendEmail: true,
    estimatedCompletion: "",
  });
  const [saving, setSaving] = useState(false);
  const [selectedTab, setSelectedTab] = useState("status");

  if (!isOpen || !claim) return null;

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

  const getStatusDescription = (status) => {
    switch (status) {
      case "pending":
        return "Claim has been submitted but payment is not yet confirmed";
      case "confirmed":
        return "Payment confirmed, order is being prepared for processing";
      case "processing":
        return "Fragment is being prepared for production or shipping";
      case "shipped":
        return "Fragment has been shipped and is in transit";
      case "delivered":
        return "Fragment has been delivered to the customer";
      case "cancelled":
        return "Claim has been cancelled (refund may be applicable)";
      default:
        return "";
    }
  };

  const getNextStatusOptions = (currentStatus) => {
    const options = {
      pending: [
        {
          value: "confirmed",
          label: "Confirm Payment",
          icon: CheckCircle,
          color: "bg-blue-100 text-blue-700",
        },
        {
          value: "cancelled",
          label: "Cancel Claim",
          icon: XCircle,
          color: "bg-red-100 text-red-700",
        },
      ],
      confirmed: [
        {
          value: "processing",
          label: "Start Processing",
          icon: Loader,
          color: "bg-purple-100 text-purple-700",
        },
        {
          value: "cancelled",
          label: "Cancel Claim",
          icon: XCircle,
          color: "bg-red-100 text-red-700",
        },
      ],
      processing: [
        {
          value: "shipped",
          label: "Mark as Shipped",
          icon: Package,
          color: "bg-cyan-100 text-cyan-700",
        },
        {
          value: "cancelled",
          label: "Cancel Claim",
          icon: XCircle,
          color: "bg-red-100 text-red-700",
        },
      ],
      shipped: [
        {
          value: "delivered",
          label: "Mark as Delivered",
          icon: Truck,
          color: "bg-green-100 text-green-700",
        },
        {
          value: "cancelled",
          label: "Cancel Claim",
          icon: XCircle,
          color: "bg-red-100 text-red-700",
        },
      ],
      delivered: [
        {
          value: "cancelled",
          label: "Cancel Claim",
          icon: XCircle,
          color: "bg-red-100 text-red-700",
        },
      ],
      cancelled: [
        {
          value: "pending",
          label: "Reactivate Claim",
          icon: Clock,
          color: "bg-yellow-100 text-yellow-700",
        },
      ],
    };
    return options[currentStatus] || [];
  };

  const getStatusRequirements = (status) => {
    const requirements = {
      shipped: [
        { field: "trackingNumber", label: "Tracking Number", required: true },
        { field: "carrier", label: "Carrier", required: true },
      ],
      delivered: [
        {
          field: "deliveryConfirmation",
          label: "Delivery Confirmation",
          required: false,
        },
      ],
      cancelled: [
        { field: "refundReason", label: "Refund Reason", required: true },
      ],
    };
    return requirements[status] || [];
  };

  const handleSubmit = async () => {
    // Validate if there are any special requirements for this status
    const requirements = getStatusRequirements(statusData.status);
    const missingFields = requirements.filter(
      (req) => req.required && !statusData[req.field]
    );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill in: ${missingFields.map((f) => f.label).join(", ")}`
      );
      return;
    }

    try {
      setSaving(true);
      await onUpdateStatus(claim._id, statusData);
      toast.success(`Status updated to ${statusData.status}`);
      onClose();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setSaving(false);
    }
  };

  const statusTabs = [
    { id: "status", label: "Status Update", icon: Edit },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "requirements", label: "Requirements", icon: CheckSquare },
    { id: "history", label: "Status History", icon: Clock },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  Update Claim Status
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(
                    claim.status
                  )}`}
                >
                  {getStatusIcon(claim.status)}
                  Current: {claim.status}
                </span>
              </div>
              <p className="text-gray-600">
                Claim {claim.claimId} • {claim.userData?.fullName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            {statusTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    selectedTab === tab.id
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
          {/* Status Update Tab */}
          {selectedTab === "status" && (
            <div className="space-y-6">
              {/* Current Status Info */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Current Status: {claim.status}
                    </p>
                    <p className="text-sm text-blue-600 mt-1">
                      {getStatusDescription(claim.status)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Status Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select New Status
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {getNextStatusOptions(claim.status).map((option) => {
                    const Icon = option.icon;
                    const isSelected = statusData.status === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setStatusData({ ...statusData, status: option.value })
                        }
                        className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                          isSelected
                            ? "border-purple-500 bg-purple-50"
                            : "border-gray-200 hover:border-purple-300 hover:bg-gray-50"
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${option.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-gray-900">
                            {option.label}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {getStatusDescription(option.value).substring(
                              0,
                              60
                            )}
                            ...
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" />
                    Status Update Notes
                  </div>
                </label>
                <textarea
                  value={statusData.notes}
                  onChange={(e) =>
                    setStatusData({ ...statusData, notes: e.target.value })
                  }
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  placeholder="Add notes about this status change (reason, details, etc.)..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  These notes will be visible in the claim history
                </p>
              </div>

              {/* Estimated Completion (for certain statuses) */}
              {["processing", "shipped"].includes(statusData.status) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Estimated Completion Date
                    </div>
                  </label>
                  <input
                    type="date"
                    value={statusData.estimatedCompletion}
                    onChange={(e) =>
                      setStatusData({
                        ...statusData,
                        estimatedCompletion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Notifications Tab */}
          {selectedTab === "notifications" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Customer Notifications
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Bell className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          Notify Customer
                        </p>
                        <p className="text-sm text-gray-500">
                          Send a notification about this status change
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statusData.notifyCustomer}
                        onChange={(e) =>
                          setStatusData({
                            ...statusData,
                            notifyCustomer: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Send Email</p>
                        <p className="text-sm text-gray-500">
                          Send email to {claim.userData?.email}
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={statusData.sendEmail}
                        onChange={(e) =>
                          setStatusData({
                            ...statusData,
                            sendEmail: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>

                  {/* Preview Message */}
                  {statusData.notifyCustomer && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Email Preview:
                      </p>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-800">
                          <strong>Subject:</strong> Your claim {claim.claimId}{" "}
                          has been updated to{" "}
                          {statusData.status || claim.status}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Dear {claim.userData?.fullName},
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Your claim for {claim.fragment?.name} has been updated
                          to "{statusData.status || claim.status}".
                        </p>
                        {statusData.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            Notes: {statusData.notes}
                          </p>
                        )}
                        {statusData.estimatedCompletion && (
                          <p className="text-sm text-gray-600 mt-2">
                            Estimated completion:{" "}
                            {new Date(
                              statusData.estimatedCompletion
                            ).toLocaleDateString()}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 mt-4">
                          You can track your claim status in your account
                          dashboard.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Requirements Tab */}
          {selectedTab === "requirements" && (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-amber-600" />
                  Status Requirements
                </h3>

                {statusData.status ? (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-700">
                      Requirements for status:{" "}
                      <span className="font-bold capitalize">
                        {statusData.status}
                      </span>
                    </p>

                    {getStatusRequirements(statusData.status).map(
                      (req, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white rounded-lg border border-gray-200"
                        >
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            {req.label}{" "}
                            {req.required && (
                              <span className="text-red-500">*</span>
                            )}
                          </label>

                          {req.field === "trackingNumber" && (
                            <input
                              type="text"
                              value={statusData[req.field] || ""}
                              onChange={(e) =>
                                setStatusData({
                                  ...statusData,
                                  [req.field]: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                              placeholder="Enter tracking number"
                              required={req.required}
                            />
                          )}

                          {req.field === "carrier" && (
                            <select
                              value={statusData[req.field] || ""}
                              onChange={(e) =>
                                setStatusData({
                                  ...statusData,
                                  [req.field]: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                              required={req.required}
                            >
                              <option value="">Select Carrier</option>
                              <option value="UPS">UPS</option>
                              <option value="FedEx">FedEx</option>
                              <option value="DHL">DHL</option>
                              <option value="USPS">USPS</option>
                              <option value="Other">Other</option>
                            </select>
                          )}

                          {req.field === "refundReason" && (
                            <textarea
                              value={statusData[req.field] || ""}
                              onChange={(e) =>
                                setStatusData({
                                  ...statusData,
                                  [req.field]: e.target.value,
                                })
                              }
                              rows="3"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                              placeholder="Reason for cancellation/refund"
                              required={req.required}
                            />
                          )}

                          {req.field === "deliveryConfirmation" && (
                            <input
                              type="text"
                              value={statusData[req.field] || ""}
                              onChange={(e) =>
                                setStatusData({
                                  ...statusData,
                                  [req.field]: e.target.value,
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                              placeholder="Delivery confirmation number (optional)"
                            />
                          )}
                        </div>
                      )
                    )}

                    {getStatusRequirements(statusData.status).length === 0 && (
                      <div className="text-center py-8">
                        <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                        <p className="text-gray-600">
                          No special requirements for this status
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-3" />
                    <p className="text-gray-600">
                      Please select a status first
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* History Tab */}
          {selectedTab === "history" && (
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-600" />
                  Previous Status Changes
                </h3>

                {claim.adminNotes && claim.adminNotes.length > 0 ? (
                  <div className="space-y-4">
                    {claim.adminNotes.map((note, index) => (
                      <div
                        key={index}
                        className="relative pl-8 pb-4 border-l-2 border-gray-200 last:border-0"
                      >
                        <div className="absolute left-[-9px] top-0 w-4 h-4 bg-purple-100 rounded-full border-2 border-purple-500"></div>
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-gray-900">
                              {note.text}
                            </p>
                            <span className="text-xs text-gray-500">
                              {new Date(note.addedAt).toLocaleString()}
                            </span>
                          </div>
                          {note.addedBy && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <User className="w-3 h-3" />
                              By: {note.addedBy.firstName}{" "}
                              {note.addedBy.lastName}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">No status history available</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-gray-200 p-6 rounded-b-2xl">
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={saving || !statusData.status}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Update Status
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClaimStatusModal;
