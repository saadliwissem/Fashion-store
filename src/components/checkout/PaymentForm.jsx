import React, { useState } from "react";
import { CreditCard, Smartphone, Store } from "lucide-react";

const PaymentForm = ({ formData, handleInputChange }) => {
  const [selectedMethod, setSelectedMethod] = useState("card");

  const paymentMethods = [
    {
      id: "card",
      name: "Credit/Debit Card",
      icon: CreditCard,
      description: "Pay with Visa, Mastercard, or Carte Bleue",
      popular: true,
    },
    {
      id: "mobile",
      name: "Mobile Money",
      icon: Smartphone,
      description: "Pay via Flouci, D17, or other mobile wallets",
    },
    {
      id: "cod",
      name: "Cash on Delivery",
      icon: Store,
      description: "Pay when you receive your order",
    },
    {
      id: "bank",
      name: "Bank Transfer",
      description: "Transfer to our Tunisian bank account",
    },
  ];

  const tunisianBanks = [
    "BIAT",
    "Attijari Bank",
    "Amen Bank",
    "STB",
    "BNA",
    "UBCI",
    "BT",
    "BH",
    "BTS",
    "ATB",
  ];

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
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-purple-300"
              }`}
              onClick={() => setSelectedMethod(method.id)}
            >
              <div className="flex items-center gap-3 mb-2">
                {method.icon && (
                  <method.icon className="w-5 h-5 text-purple-600" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">{method.name}</p>
                  {method.popular && (
                    <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-1 rounded-full">
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
              value={formData.cardName}
              onChange={handleInputChange}
              required
              className="input-modern"
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
              value={formData.cardNumber}
              onChange={handleInputChange}
              required
              className="input-modern"
              placeholder="4242 4242 4242 4242"
              maxLength="19"
              pattern="[0-9\s]{13,19}"
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
                value={formData.cardExpiry}
                onChange={handleInputChange}
                required
                className="input-modern"
                placeholder="MM/YY"
                maxLength="5"
                pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CVC *
              </label>
              <input
                type="text"
                name="cardCVC"
                value={formData.cardCVC}
                onChange={handleInputChange}
                required
                className="input-modern"
                placeholder="123"
                maxLength="3"
                pattern="[0-9]{3}"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="saveCard"
              name="saveCard"
              checked={formData.saveCard}
              onChange={handleInputChange}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="saveCard" className="text-sm text-gray-600">
              Save card for future purchases
            </label>
          </div>
        </div>
      )}

      {/* Mobile Money Payment */}
      {selectedMethod === "mobile" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Mobile Money Payment
            </h4>
            <p className="text-sm text-gray-600 mb-4">
              Complete your payment using one of these mobile money services:
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg text-center border">
                <div className="text-2xl mb-2">📱</div>
                <p className="font-medium">Flouci</p>
              </div>
              <div className="bg-white p-4 rounded-lg text-center border">
                <div className="text-2xl mb-2">💸</div>
                <p className="font-medium">D17</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              You will be redirected to your mobile money app to complete the
              payment.
            </p>
          </div>
        </div>
      )}

      {/* Bank Transfer */}
      {selectedMethod === "bank" && (
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h4 className="font-semibold text-gray-900 mb-3">
              Bank Transfer Details
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Bank
                </label>
                <select className="input-modern">
                  <option value="">Choose your bank</option>
                  {tunisianBanks.map((bank) => (
                    <option key={bank} value={bank}>
                      {bank}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">
                  Our Account Details:
                </p>
                <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                  <p>
                    <strong>Bank:</strong> BIAT
                  </p>
                  <p>
                    <strong>Account Name:</strong> FashionStore SARL
                  </p>
                  <p>
                    <strong>RIB:</strong> 04 018 123456789123 89
                  </p>
                  <p>
                    <strong>IBAN:</strong> TN59 0400 1812 3456 7891 2389
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Please include your order number in the transfer reference. Your
                order will be processed once the transfer is confirmed (1-2
                business days).
              </p>
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

export default PaymentForm;
