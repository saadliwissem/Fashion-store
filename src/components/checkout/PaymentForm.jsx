import React from "react";
import { CreditCard, Store } from "lucide-react";

const PaymentForm = ({
  formData,
  handleInputChange,
  selectedMethod,
  onMethodChange,
}) => {
  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or Carte Bleue",
      popular: true,
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: Store,
      description: "Pay when you receive your order",
    },
  ];

  // Helper function to format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Enhanced change handler for card number formatting
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    handleInputChange({
      target: {
        name: e.target.name,
        value: formatted,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Select Payment Method
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                selectedMethod === method.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-blue-300"
              }`}
              onClick={() => onMethodChange(method.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                {method.icon && (
                  <method.icon className="w-5 h-5 text-blue-600" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  {method.popular && (
                    <span className="text-xs bg-gradient-to-r from-blue-100 to-neutral-100 text-blue-700 px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-600">{method.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Card Payment Form */}
      {selectedMethod === "card" && (
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-900">Card Details</h4>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name on Card *
            </label>
            <input
              type="text"
              name="cardName"
              value={formData.cardName || ""}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="AHMED BEN ALI"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Number *
            </label>
            <input
              type="text"
              name="cardNumber"
              value={formData.cardNumber || ""}
              onChange={handleCardNumberChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="4242 4242 4242 4242"
              maxLength="19"
            />
            <div className="flex gap-2 mt-2">
              <div className="w-10 h-6 bg-gray-100 rounded"></div>
              <div className="w-10 h-6 bg-gray-100 rounded"></div>
              <div className="w-10 h-6 bg-gray-100 rounded"></div>
              <div className="w-10 h-6 bg-gray-100 rounded"></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Date *
              </label>
              <input
                type="text"
                name="cardExpiry"
                value={formData.cardExpiry || ""}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="MM/YY"
                maxLength="5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC *
              </label>
              <input
                type="password"
                name="cardCVC"
                value={formData.cardCVC || ""}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="123"
                maxLength="3"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              checked={formData.saveCard || false}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="saveCard" className="text-sm text-gray-600">
              Save card for future purchases
            </label>
          </div>
        </div>
      )}

      {/* Cash on Delivery Form */}
      {selectedMethod === "cod" && (
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <p className="font-medium text-yellow-800">Cash on Delivery</p>
                <p className="text-sm text-yellow-700 mt-1">
                  Pay with cash when your order arrives at your doorstep. Please
                  have the exact amount ready for the delivery person.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🔒</div>
          <div>
            <p className="font-medium text-gray-900">Secure Payment</p>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and secure. We never store
              your full card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Default props to ensure formData exists and prevent errors
PaymentForm.defaultProps = {
  formData: {
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    saveCard: false,
  },
  handleInputChange: () => {},
  selectedMethod: "card",
  onMethodChange: () => {},
};

export default PaymentForm;
