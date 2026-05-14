// pages/ClaimDetailsPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Package,
  ArrowLeft,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  DollarSign,
  MapPin,
  User,
  Mail,
  Phone,
  CreditCard,
  Hash,
  AlertCircle,
  Loader,
  Download,
  Share2,
  MessageCircle,
} from "lucide-react";
import Button from "../components/common/Button";
import { claimAPI } from "../services/api";
import toast from "react-hot-toast";

const ClaimDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClaimDetails();
  }, [id]);

  const fetchClaimDetails = async () => {
    try {
      setLoading(true);
      const response = await claimAPI.getOne(id);

      // Extract claim data safely
      let claimData = response.data?.data || response.data;
      setClaim(claimData);
    } catch (error) {
      console.error("Failed to fetch claim details:", error);
      setError(error.response?.data?.message || "Failed to load claim details");
      toast.error("Failed to load claim details");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "bg-yellow-100 text-yellow-700",
        border: "border-yellow-200",
        label: "Pending Confirmation",
        description:
          "Your claim is being processed. You'll receive an email confirmation soon.",
      },
      confirmed: {
        icon: CheckCircle,
        color: "bg-purple-100 text-purple-700",
        border: "border-purple-200",
        label: "Confirmed",
        description:
          "Your claim has been confirmed. Production will begin when all fragments are sold.",
      },
      processing: {
        icon: Clock,
        color: "bg-blue-100 text-blue-700",
        border: "border-blue-200",
        label: "Processing",
        description: "Your fragment is being prepared for shipping.",
      },
      shipped: {
        icon: Truck,
        color: "bg-indigo-100 text-indigo-700",
        border: "border-indigo-200",
        label: "Shipped",
        description: "Your fragment is on the way!",
      },
      delivered: {
        icon: CheckCircle,
        color: "bg-green-100 text-green-700",
        border: "border-green-200",
        label: "Delivered",
        description:
          "Your fragment has been delivered. Enjoy your unique piece!",
      },
      cancelled: {
        icon: XCircle,
        color: "bg-red-100 text-red-700",
        border: "border-red-200",
        label: "Cancelled",
        description: "This claim has been cancelled.",
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: "text-yellow-600",
        label: "Pending Payment",
      },
      pending_cod: {
        icon: DollarSign,
        color: "text-blue-600",
        label: "Cash on Delivery",
      },
      completed: { icon: CheckCircle, color: "text-green-600", label: "Paid" },
      failed: {
        icon: AlertCircle,
        color: "text-red-600",
        label: "Payment Failed",
      },
      refunded: { icon: RefreshCw, color: "text-gray-600", label: "Refunded" },
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimelineSteps = () => {
    const steps = [];
    const statusOrder = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(claim?.status);

    statusOrder.forEach((status, index) => {
      const isCompleted = index <= currentIndex;
      const isCurrent = index === currentIndex;
      const config = getStatusConfig(status);

      steps.push({
        status,
        label: config.label,
        isCompleted,
        isCurrent,
        date: claim?.trackingInfo?.[`${status}At`] || claim?.createdAt,
      });
    });

    return steps;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading claim details...</p>
        </div>
      </div>
    );
  }

  if (error || !claim) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-200">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Claim Not Found
              </h2>
              <p className="text-gray-600 mb-6">
                {error || "The claim you're looking for doesn't exist."}
              </p>
              <Link to="/claims">
                <Button>View All Claims</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(claim.status);
  const StatusIcon = statusConfig.icon;
  const paymentConfig = getPaymentStatusConfig(claim.payment?.status);
  const PaymentIcon = paymentConfig.icon;
  const timelineSteps = getTimelineSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="/claims"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Claims
          </Link>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Claim Details
              </h1>
              <p className="text-gray-600 mt-1">Claim ID: {claim.claimId}</p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="small"
                className="flex items-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button
                variant="outline"
                size="small"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Receipt
              </Button>
            </div>
          </div>
        </div>

        {/* Status Banner */}
        <div
          className={`bg-white rounded-xl shadow-sm p-6 mb-6 border-l-4 ${statusConfig.border.replace(
            "border",
            "border-l"
          )}`}
        >
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-full ${statusConfig.color
                .replace("text", "bg")
                .replace("700", "100")}`}
            >
              <StatusIcon className={`w-6 h-6 ${statusConfig.color}`} />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-1">
                {statusConfig.label}
              </h2>
              <p className="text-gray-600">{statusConfig.description}</p>
              {claim.trackingInfo?.estimatedDelivery &&
                claim.status === "shipped" && (
                  <p className="text-sm text-purple-600 mt-2">
                    Estimated delivery:{" "}
                    {formatDate(claim.trackingInfo.estimatedDelivery)}
                  </p>
                )}
            </div>
          </div>
        </div>

        {/* Fragment Info */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-600" />
            Fragment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Fragment Name</p>
              <p className="font-medium text-gray-900">
                {claim.fragment?.name || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fragment Number</p>
              <p className="font-medium text-gray-900">
                #{claim.fragment?.number || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Rarity</p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                  claim.fragment?.rarity === "legendary"
                    ? "bg-yellow-100 text-yellow-700"
                    : claim.fragment?.rarity === "rare"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {claim.fragment?.rarity?.toUpperCase() || "COMMON"}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Size</p>
              <p className="font-medium text-gray-900">
                {claim.userData?.size || "Not specified"}
              </p>
            </div>
            {claim.userData?.customization && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Customization</p>
                <p className="font-medium text-gray-900">
                  {claim.userData.customization}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Order Timeline
          </h3>
          <div className="relative">
            {timelineSteps.map((step, index) => (
              <div
                key={step.status}
                className="relative flex items-start mb-6 last:mb-0"
              >
                {/* Line connector */}
                {index < timelineSteps.length - 1 && (
                  <div
                    className={`absolute left-4 top-8 w-0.5 h-12 ${
                      step.isCompleted ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                )}

                {/* Icon */}
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    step.isCompleted
                      ? "bg-green-500"
                      : step.isCurrent
                      ? "bg-purple-600"
                      : "bg-gray-300"
                  }`}
                >
                  {step.isCompleted ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <div
                      className={`w-2 h-2 rounded-full ${
                        step.isCurrent ? "bg-white" : "bg-gray-500"
                      }`}
                    />
                  )}
                </div>

                {/* Content */}
                <div className="ml-4 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                      <p
                        className={`font-semibold ${
                          step.isCompleted
                            ? "text-green-700"
                            : step.isCurrent
                            ? "text-purple-700"
                            : "text-gray-500"
                        }`}
                      >
                        {step.label}
                      </p>
                      {step.date && (
                        <p className="text-sm text-gray-500">
                          {formatDate(step.date)}
                        </p>
                      )}
                    </div>
                    {step.isCurrent && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        Current Step
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-purple-600" />
            Shipping Address
          </h3>
          {claim.userData?.shippingAddress ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Recipient</p>
                <p className="font-medium text-gray-900">
                  {claim.userData.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium text-gray-900">
                  {claim.userData.phone || "Not provided"}
                </p>
              </div>
              <div className="md:col-span-2">
                <p className="text-sm text-gray-500">Address</p>
                <p className="font-medium text-gray-900">
                  {claim.userData.shippingAddress.address}
                  <br />
                  {claim.userData.shippingAddress.city},{" "}
                  {claim.userData.shippingAddress.state}{" "}
                  {claim.userData.shippingAddress.postalCode}
                  <br />
                  {claim.userData.shippingAddress.country}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No shipping address provided</p>
          )}
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-purple-600" />
            Payment Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Payment Method</p>
              <p className="font-medium text-gray-900 capitalize">
                {claim.payment?.method || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Payment Status</p>
              <div className="flex items-center gap-2">
                <PaymentIcon className={`w-4 h-4 ${paymentConfig.color}`} />
                <span className={`font-medium ${paymentConfig.color}`}>
                  {paymentConfig.label}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-medium text-gray-900">
                {claim.payment?.amount} {claim.payment?.currency || "TND"}
              </p>
            </div>
            {claim.payment?.transactionId && (
              <div>
                <p className="text-sm text-gray-500">Transaction ID</p>
                <p className="font-medium text-gray-900 text-sm">
                  {claim.payment.transactionId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Tracking Info (if shipped) */}
        {claim.trackingInfo?.trackingNumber && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Truck className="w-5 h-5 text-purple-600" />
              Tracking Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Carrier</p>
                <p className="font-medium text-gray-900">
                  {claim.trackingInfo.carrier || "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tracking Number</p>
                <p className="font-medium text-gray-900">
                  {claim.trackingInfo.trackingNumber}
                </p>
              </div>
              {claim.trackingInfo.shippedAt && (
                <div>
                  <p className="text-sm text-gray-500">Shipped Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(claim.trackingInfo.shippedAt)}
                  </p>
                </div>
              )}
              {claim.trackingInfo.deliveredAt && (
                <div>
                  <p className="text-sm text-gray-500">Delivered Date</p>
                  <p className="font-medium text-gray-900">
                    {formatDate(claim.trackingInfo.deliveredAt)}
                  </p>
                </div>
              )}
            </div>
            {claim.trackingInfo.trackingNumber && (
              <div className="mt-4">
                <Button variant="outline" className="w-full md:w-auto">
                  Track Package
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Need Help */}
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-purple-900 mb-1">Need Help?</h3>
              <p className="text-purple-700 text-sm">
                Have questions about your claim? Our support team is here to
                help.
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/contact">
                <Button
                  variant="outline"
                  className="border-purple-300 text-purple-700 hover:bg-purple-100"
                >
                  Contact Support
                </Button>
              </Link>
              <Button className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add RefreshCw icon if not imported
const RefreshCw = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M23 4v6h-6M1 20v-6h6" />
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

export default ClaimDetailsPage;
