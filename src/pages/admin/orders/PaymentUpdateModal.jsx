// /components/admin/orders/PaymentUpdateModal.js
import React, { useState } from "react";
import { X, DollarSign, CreditCard } from "lucide-react";
import Button from "../../../components/common/Button";
import { adminAPI } from "../../../services/api";
import toast from "react-hot-toast";

const PaymentUpdateModal = ({ isOpen, onClose, order, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [paymentDetails, setPaymentDetails] = useState({
    transactionId: order.paymentDetails?.transactionId || "",
    cardLastFour: order.paymentDetails?.cardLastFour || "",
    mobileProvider: order.paymentDetails?.mobileProvider || "",
    bankName: order.paymentDetails?.bankName || "",
  });
  const [note, setNote] = useState("");

  const paymentStatusOptions = [
    {
      value: "pending",
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    { value: "paid", label: "Paid", color: "bg-green-100 text-green-800" },
    { value: "failed", label: "Failed", color: "bg-red-100 text-red-800" },
    {
      value: "refunded",
      label: "Refunded",
      color: "bg-gray-100 text-gray-800",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      await adminAPI.updatePaymentStatus(order._id, {
        paymentStatus,
        paymentDetails,
        note,
      });
      toast.success("Payment status updated");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error(
        error.response?.data?.message || "Failed to update payment status"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentDetailChange = (field, value) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Update Payment Status
              </h2>
              <p className="text-sm text-gray-600">
                Order #{order.orderNumber} • {order.total.toFixed(3)} DT
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Payment Status */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                {paymentStatusOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPaymentStatus(option.value)}
                    className={`p-3 border-2 rounded-xl text-center transition-all ${
                      paymentStatus === option.value
                        ? "border-green-500 bg-green-50"
                        : "border-gray-200 hover:border-green-300"
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

            {/* Payment Method Info */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method:{" "}
                <span className="font-semibold capitalize">
                  {order.paymentMethod}
                </span>
              </label>

              {order.paymentMethod === "card" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Last 4 Digits
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.cardLastFour}
                    onChange={(e) =>
                      handlePaymentDetailChange("cardLastFour", e.target.value)
                    }
                    placeholder="1234"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                    maxLength="4"
                  />
                </div>
              )}

              {order.paymentMethod === "mobile" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Provider
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.mobileProvider}
                    onChange={(e) =>
                      handlePaymentDetailChange(
                        "mobileProvider",
                        e.target.value
                      )
                    }
                    placeholder="e.g., Flouci, D17"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              {order.paymentMethod === "bank" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={paymentDetails.bankName}
                    onChange={(e) =>
                      handlePaymentDetailChange("bankName", e.target.value)
                    }
                    placeholder="e.g., BIAT, Attijari Bank"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              )}

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID (Optional)
                </label>
                <input
                  type="text"
                  value={paymentDetails.transactionId}
                  onChange={(e) =>
                    handlePaymentDetailChange("transactionId", e.target.value)
                  }
                  placeholder="Transaction reference"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                />
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
                placeholder="Add notes about this payment update..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                rows="3"
              />
            </div>

            {/* Warning for refunds */}
            {paymentStatus === "refunded" &&
              order.paymentStatus !== "refunded" && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-700">
                    ⚠️ Marking as refunded will automatically restore inventory
                    stock.
                  </p>
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
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                Update Payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentUpdateModal;
