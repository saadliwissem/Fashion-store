// /components/admin/orders/TrackingUpdateModal.js
import React, { useState } from "react";
import { X, Truck } from "lucide-react";
import Button from "../../../components/common/Button";
import { adminAPI } from "../../../services/api";
import toast from "react-hot-toast";

const TrackingUpdateModal = ({ isOpen, onClose, order, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState(
    order.trackingNumber || ""
  );
  const [shippingCarrier, setShippingCarrier] = useState(
    order.shippingCarrier || ""
  );
  const [note, setNote] = useState("");

  const shippingCarriers = [
    "Tunisie Poste",
    "DHL Tunisia",
    "UPS Tunisia",
    "FedEx Tunisia",
    "Aramex Tunisia",
    "Private Courier",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!trackingNumber.trim()) {
      toast.error("Please enter a tracking number");
      return;
    }

    setLoading(true);
    try {
      await adminAPI.updateTracking(order._id, {
        trackingNumber,
        shippingCarrier,
        note,
      });
      toast.success("Tracking information updated");
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating tracking:", error);
      toast.error(error.response?.data?.message || "Failed to update tracking");
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
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Truck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Update Tracking
              </h2>
              <p className="text-sm text-gray-600">
                Order #{order.orderNumber}
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
            {/* Tracking Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tracking Number *
              </label>
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Enter tracking number..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                required
              />
            </div>

            {/* Shipping Carrier */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shipping Carrier
              </label>
              <div className="grid grid-cols-2 gap-3">
                {shippingCarriers.map((carrier) => (
                  <button
                    key={carrier}
                    type="button"
                    onClick={() => setShippingCarrier(carrier)}
                    className={`p-3 border-2 rounded-xl text-center transition-all ${
                      shippingCarrier === carrier
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-900">
                      {carrier}
                    </span>
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={shippingCarrier}
                onChange={(e) => setShippingCarrier(e.target.value)}
                placeholder="Or enter custom carrier..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none mt-3"
              />
            </div>

            {/* Note */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Note (Optional)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add any additional shipping notes..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                rows="3"
              />
            </div>

            {/* Customer Notification */}
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-700">
                📧 The customer will receive an email notification with the
                tracking information.
              </p>
            </div>

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
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                Update Tracking
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrackingUpdateModal;
