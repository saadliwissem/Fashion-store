// /components/admin/orders/StatusUpdateModal.js
import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import Button from "../../../components/common/Button";
import { adminAPI } from "../../../services/api";
import toast from "react-hot-toast";

const StatusUpdateModal = ({ isOpen, onClose, order, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(order.status);
  const [note, setNote] = useState("");

  const statusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "confirmed",
      label: "Confirmed",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "processing",
      label: "Processing",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "shipped", label: "Shipped", color: "bg-blue-100 text-blue-800" },
    {
      value: "delivered",
      label: "Delivered",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "cancelled",
      label: "Cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (status === order.status && !note) {
      toast.error("No changes made");
      return;
    }

    setLoading(true);
    try {
      await adminAPI.updateOrderStatus(order._id, { status, note });
      toast.success(`Order status updated to ${status}`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Update Order Status
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-600 mb-2">
              Order: <span className="font-semibold">#{order.orderNumber}</span>
            </p>
            <p className="text-gray-600">
              Customer:{" "}
              <span className="font-semibold">
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Status Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                New Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setStatus(option.value)}
                    className={`p-3 border-2 rounded-xl text-center transition-all ${
                      status === option.value
                        ? "border-purple-500 bg-purple-50"
                        : "border-gray-200 hover:border-purple-300"
                    }`}
                  >
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${option.color}`}
                    >
                      {option.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note about this status change..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                rows="3"
              />
            </div>

            {/* Warning for certain status changes */}
            {["cancelled", "delivered"].includes(status) &&
              status !== order.status && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Important Notice
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {status === "cancelled"
                          ? "Cancelling this order will automatically update inventory stock and may trigger refunds if payment was processed."
                          : "Marking as delivered completes the order process and cannot be reversed."}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                Update Status
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StatusUpdateModal;
