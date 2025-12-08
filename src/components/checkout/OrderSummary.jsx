import React from "react";
import { Truck, Package, Shield } from "lucide-react";
import Button from "../common/Button";

const OrderSummary = ({
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingMethod,
}) => {
  const getShippingMethodName = (method) => {
    switch (method) {
      case "standard":
        return "Standard Delivery (3-5 days)";
      case "express":
        return "Express Delivery (1-2 days)";
      case "pickup":
        return "Store Pickup";
      default:
        return "Standard Delivery";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Items List */}
      <div className="space-y-4 mb-6">
        <h3 className="font-semibold text-gray-900">Items ({items.length})</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {item.name}
                </p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <div className="font-semibold text-gray-900">
                {(item.price * item.quantity).toFixed(3)} DT
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{subtotal.toFixed(3)} DT</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span
            className={
              shipping === 0 ? "text-green-600 font-medium" : "font-medium"
            }
          >
            {shipping === 0 ? "Free" : `${shipping} DT`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">TVA (7%)</span>
          <span className="font-medium">{tax.toFixed(3)} DT</span>
        </div>
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{total.toFixed(3)} DT</span>
        </div>
        <p className="text-sm text-gray-600 text-right mt-1">
          Includes all taxes and fees
        </p>
      </div>

      {/* Shipping Info */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-900 mb-3">Shipping Method</h3>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <Truck className="w-5 h-5 text-purple-600" />
          <div>
            <p className="font-medium">
              {getShippingMethodName(shippingMethod)}
            </p>
            <p className="text-sm text-gray-600">
              {shippingMethod === "express"
                ? "1-2 business days"
                : shippingMethod === "pickup"
                ? "Ready for pickup in 2 hours"
                : "3-5 business days"}
            </p>
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">30-Day Returns</p>
            <p className="text-sm text-gray-600">Free returns within Tunisia</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Quality Guarantee</p>
            <p className="text-sm text-gray-600">Authentic products only</p>
          </div>
        </div>
      </div>

      {/* Help */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600 mb-2">Need help with your order?</p>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="small" className="text-sm">
            Contact Support
          </Button>
          <Button variant="ghost" size="small" className="text-sm">
            FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
