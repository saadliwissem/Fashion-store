import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  CreditCard,
  Phone,
  Mail,
  User,
  Download,
  Printer,
  ChevronLeft,
  AlertCircle,
  XCircle,
  Shield,
  ArrowRight,
} from "lucide-react";
import Button from "../common/Button";
import { ordersAPI } from "../../services/api";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getById(id);
      setOrder(response.data.order);
    } catch (error) {
      console.error("Failed to fetch order details:", error);
      toast.error("Failed to load order details");
      navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const fetchTracking = async () => {
    try {
      setTrackingLoading(true);
      const response = await ordersAPI.getTracking(id);
      setTrackingInfo(response.data.order);
    } catch (error) {
      console.error("Failed to fetch tracking:", error);
      toast.error("Failed to load tracking information");
    } finally {
      setTrackingLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case "shipped":
        return <Truck className="w-6 h-6 text-blue-600" />;
      case "processing":
        return <Package className="w-6 h-6 text-yellow-600" />;
      case "cancelled":
        return <XCircle className="w-6 h-6 text-red-600" />;
      case "pending":
        return <Clock className="w-6 h-6 text-orange-600" />;
      default:
        return <AlertCircle className="w-6 h-6 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatPrice = (price) => {
    return price.toFixed(3);
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case "card":
        return <CreditCard className="w-5 h-5 text-purple-600" />;
      case "mobile":
        return "📱";
      case "cod":
        return "💰";
      case "bank":
        return "🏦";
      default:
        return "💳";
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await ordersAPI.cancel(id);
      toast.success("Order cancelled successfully");
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error("Failed to cancel order:", error);
      toast.error(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const handleDownloadInvoice = async () => {
    // In a real app, you would download a PDF invoice
    toast.success("Invoice download started");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Order not found
          </h3>
          <p className="text-gray-600 mb-6">
            The order you're looking for doesn't exist or you don't have access
            to it.
          </p>
          <Button onClick={() => navigate("/orders")}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 print:bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 print:hidden">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/orders")}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back to Orders
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">
              Order #{order.orderNumber}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={handleDownloadInvoice}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Invoice
            </Button>
            <Button
              variant="outline"
              onClick={handlePrintInvoice}
              className="flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Status Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  {getStatusIcon(order.status)}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Order Status
                    </h2>
                    <p className="text-gray-600">
                      Last updated: {formatDate(order.updatedAt)}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full font-semibold border ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              {/* Status Timeline */}
              <div className="space-y-4">
                {[
                  {
                    status: "Order Placed",
                    date: order.createdAt,
                    active: true,
                  },
                  {
                    status: "Payment",
                    date:
                      order.paymentStatus === "paid" ? order.updatedAt : null,
                    active: order.paymentStatus === "paid",
                  },
                  {
                    status: "Processing",
                    date: ["processing", "shipped", "delivered"].includes(
                      order.status
                    )
                      ? order.updatedAt
                      : null,
                    active: ["processing", "shipped", "delivered"].includes(
                      order.status
                    ),
                  },
                  {
                    status: "Shipped",
                    date: order.shippedAt,
                    active: !!order.shippedAt,
                  },
                  {
                    status: "Delivered",
                    date: order.deliveredAt,
                    active: !!order.deliveredAt,
                  },
                ].map((step, index) => (
                  <div key={step.status} className="flex items-center gap-4">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        step.active
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {step.active ? "✓" : index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{step.status}</p>
                      <p className="text-sm text-gray-600">
                        {step.date ? formatDate(step.date) : "Pending"}
                      </p>
                    </div>
                    {index < 4 && (
                      <div
                        className={`h-8 w-0.5 ml-4 ${
                          step.active ? "bg-green-200" : "bg-gray-200"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Estimated Delivery */}
              {order.estimatedDelivery && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="font-medium text-blue-900">
                    Estimated Delivery: {formatDate(order.estimatedDelivery)}
                  </p>
                </div>
              )}

              {/* Cancel Order Button */}
              {["pending", "confirmed", "processing"].includes(
                order.status
              ) && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={handleCancelOrder}
                    className="w-full text-red-600 hover:bg-red-50 border-red-200"
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Items ({order.items.length})
              </h2>

              <div className="space-y-4">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            SKU: {item.sku}
                          </p>
                          {(item.variant?.color || item.variant?.size) && (
                            <div className="flex items-center gap-4 mt-2">
                              {item.variant?.color && (
                                <span className="text-sm text-gray-600">
                                  Color: {item.variant.color}
                                </span>
                              )}
                              {item.variant?.size && (
                                <span className="text-sm text-gray-600">
                                  Size: {item.variant.size}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.total)} DT
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × {formatPrice(item.price)} DT
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Shipping */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(order.subtotal)} DT
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {order.shippingPrice === 0
                      ? "Free"
                      : `${formatPrice(order.shippingPrice)} DT`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (7%)</span>
                  <span className="font-medium">
                    {formatPrice(order.taxAmount)} DT
                  </span>
                </div>

                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>-{formatPrice(order.discountAmount)} DT</span>
                  </div>
                )}

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(order.total)} DT</span>
                  </div>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Payment Information
                </h3>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">
                    {getPaymentMethodIcon(order.paymentMethod)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : order.paymentMethod === "mobile"
                        ? "Mobile Money"
                        : order.paymentMethod === "cod"
                        ? "Cash on Delivery"
                        : "Bank Transfer"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {order.paymentStatus}
                      {order.paymentDetails?.cardLastFour && (
                        <span className="ml-2">
                          (•••• {order.paymentDetails.cardLastFour})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Shipping Information
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.firstName}{" "}
                      {order.shippingAddress.lastName}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      +216 {order.shippingAddress.phone}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {order.shippingAddress.email}
                    </p>
                  </div>
                </div>

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

                {/* Shipping Method */}
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-primary-600" />
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
                    </div>
                  </div>
                </div>

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="font-medium text-blue-900">Tracking Number</p>
                    <p className="text-blue-700 font-mono">
                      {order.trackingNumber}
                    </p>
                    <Button
                      variant="link"
                      size="small"
                      onClick={fetchTracking}
                      loading={trackingLoading}
                      className="mt-2"
                    >
                      Track Package
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Notes */}
            {order.customerNotes && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">Your Notes</h3>
                <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {order.customerNotes}
                </p>
              </div>
            )}

            {/* Need Help */}
            <div className="bg-gradient-to-r from-primary-50 to-neutral-50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
                <h3 className="font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Our support team is here to help with your order.
              </p>
              <div className="space-y-2">
                <Button variant="outline" size="small" className="w-full">
                  Contact Support
                </Button>
                <Button variant="ghost" size="small" className="w-full">
                  View FAQ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
