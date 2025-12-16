// /components/admin/orders/OrderDetailsModal.js
import React from "react";
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  Truck,
  Package,
  DollarSign,
  CreditCard,
  Calendar,
  CheckCircle,
} from "lucide-react";
import Button from "../../../components/common/Button";

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h2>
            <p className="text-gray-600">
              Placed on {formatDate(order.createdAt)}
            </p>
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Order Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      Order Status
                    </h3>
                    <span
                      className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">
                      {order.total.toFixed(3)} DT
                    </p>
                    <p className="text-gray-600">Total Amount</p>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">
                    Order Timeline
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Order Placed", date: order.createdAt },
                      {
                        label: "Payment",
                        date:
                          order.paymentStatus === "paid"
                            ? order.updatedAt
                            : null,
                      },
                      {
                        label: "Processing",
                        date:
                          order.status !== "pending" ? order.updatedAt : null,
                      },
                      { label: "Shipped", date: order.shippedAt },
                      { label: "Delivered", date: order.deliveredAt },
                    ].map((step, index) => (
                      <div key={step.label} className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            step.date
                              ? "bg-green-100 text-green-600"
                              : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {step.date ? "✓" : index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {step.label}
                          </p>
                          <p className="text-sm text-gray-600">
                            {step.date ? formatDate(step.date) : "Pending"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-6">
                  Order Items ({order.items.length})
                </h3>
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            SKU: {item.sku}
                          </p>
                          {(item.variant?.color || item.variant?.size) && (
                            <div className="flex items-center gap-3 mt-1">
                              {item.variant?.color && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  Color: {item.variant.color}
                                </span>
                              )}
                              {item.variant?.size && (
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  Size: {item.variant.size}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          {item.total.toFixed(3)} DT
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} × {item.price.toFixed(3)} DT
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">
                        {order.subtotal.toFixed(3)} DT
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {order.shippingPrice === 0
                          ? "Free"
                          : `${order.shippingPrice.toFixed(3)} DT`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax (7%)</span>
                      <span className="font-medium">
                        {order.taxAmount.toFixed(3)} DT
                      </span>
                    </div>
                    {order.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount</span>
                        <span>-{order.discountAmount.toFixed(3)} DT</span>
                      </div>
                    )}
                    <div className="pt-3 border-t">
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{order.total.toFixed(3)} DT</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Customer & Shipping Info */}
            <div className="space-y-6">
              {/* Customer Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Customer Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
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
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      <Phone className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        +216 {order.shippingAddress.phone}
                      </p>
                      <p className="text-sm text-gray-600">Phone</p>
                    </div>
                  </div>
                  {order.user && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        Registered Customer
                      </p>
                      <p className="font-medium text-gray-900">
                        {order.user.firstName} {order.user.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.user.email}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Shipping Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingAddress.address}
                      </p>
                      {order.shippingAddress.address2 && (
                        <p className="text-gray-600">
                          {order.shippingAddress.address2}
                        </p>
                      )}
                      <p className="text-gray-600">
                        {order.shippingAddress.city},{" "}
                        {order.shippingAddress.governorate}
                      </p>
                      <p className="text-gray-600">
                        Postal Code: {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Truck className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-gray-900">
                        {order.shippingMethod === "express"
                          ? "Express Delivery"
                          : order.shippingMethod === "pickup"
                          ? "Store Pickup"
                          : "Standard Delivery"}
                      </p>
                      <p className="text-sm text-gray-600">
                        {order.shippingMethod === "express"
                          ? "1-2 business days"
                          : order.shippingMethod === "pickup"
                          ? "Pick up from store"
                          : "3-5 business days"}
                      </p>
                      {order.trackingNumber && (
                        <p className="text-sm text-blue-600 mt-1">
                          Tracking: {order.trackingNumber}
                        </p>
                      )}
                    </div>
                  </div>
                  {order.estimatedDelivery && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">
                          Estimated Delivery
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(order.estimatedDelivery)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="font-bold text-gray-900 text-lg mb-6 flex items-center gap-2">
                  <DollarSign className="w-5 h-5" />
                  Payment Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium capitalize">
                      {order.paymentMethod.replace("-", " ")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
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
                  </div>
                  {order.paymentDetails?.transactionId && (
                    <div>
                      <p className="text-sm text-gray-600">Transaction ID</p>
                      <p className="font-medium text-gray-900">
                        {order.paymentDetails.transactionId}
                      </p>
                    </div>
                  )}
                  {order.paymentDetails?.cardLastFour && (
                    <div>
                      <p className="text-sm text-gray-600">Card</p>
                      <p className="font-medium text-gray-900">
                        **** **** **** {order.paymentDetails.cardLastFour}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Notes */}
              {(order.customerNotes || order.adminNotes) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h3 className="font-bold text-gray-900 text-lg mb-6">
                    Order Notes
                  </h3>
                  <div className="space-y-4">
                    {order.customerNotes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Customer Notes
                        </p>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                          {order.customerNotes}
                        </p>
                      </div>
                    )}
                    {order.adminNotes && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Admin Notes
                        </p>
                        <p className="text-gray-600 bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                          {order.adminNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.print()}
                >
                  Print Order
                </Button>
                <Button className="w-full" onClick={onClose}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
