import React from "react";
import { Truck, Shield, CreditCard } from "lucide-react";
import Button from "../common/Button";

const CartSummary = ({
  items = [],
  subtotal,
  shipping,
  tax,
  total,
  onCheckout,
  isLoading = false,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

      {/* Items List */}
      {items.length > 0 && (
        <div className="space-y-4 mb-6">
          <h3 className="font-semibold text-gray-900">
            Items ({items.length})
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Qty: {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(3)} DT</span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span
            className={
              shipping === 0 ? "text-green-600 font-medium" : "font-medium"
            }
          >
            {shipping === 0 ? "FREE" : `${shipping} DT`}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-gray-600">TVA (7%)</span>
          <span className="font-medium">${tax.toFixed(3)} DT</span>
        </div>

        {shipping > 0 && subtotal > 0 && (
          <div className="p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
            <p className="text-sm text-purple-700 text-center">
              Add ${(99 - subtotal).toFixed(3)} more for free shipping!
            </p>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(3)} DT</span>
        </div>
        <p className="text-sm text-gray-600 text-right mt-1">
          Includes all taxes and fees
        </p>
      </div>

      {/* Checkout Button */}
      <Button
        onClick={onCheckout}
        fullWidth
        size="large"
        className="mb-6"
        disabled={isLoading || items.length === 0}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          "Proceed to Checkout"
        )}
      </Button>

      {/* Payment Methods */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-3">We accept</p>
        <div className="flex gap-2">
          <div className="flex-1 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-gray-400" />
          </div>
          <div className="flex-1 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="font-bold text-gray-700">VISA</span>
          </div>
          <div className="flex-1 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="font-bold text-gray-700">MC</span>
          </div>
          <div className="flex-1 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
            <span className="font-bold text-gray-700">PP</span>
          </div>
        </div>
      </div>

      {/* Guarantees */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
            <Truck className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Free Shipping</p>
            <p className="text-sm text-gray-600">On orders over 99 DT</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-lg flex items-center justify-center">
            <Shield className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Secure Payment</p>
            <p className="text-sm text-gray-600">100% secure encryption</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
