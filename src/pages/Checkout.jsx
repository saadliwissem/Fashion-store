import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Shield, Truck } from "lucide-react";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import AddressForm from "../components/checkout/AddressForm";
import PaymentForm from "../components/checkout/PaymentForm";
import OrderSummary from "../components/checkout/OrderSummary";
import Button from "../components/common/Button";
import toast from "react-hot-toast";

// Tunisian governorates
const TUNISIAN_GOVERNORATES = [
  "Ariana",
  "Béja",
  "Ben Arous",
  "Bizerte",
  "Gabès",
  "Gafsa",
  "Jendouba",
  "Kairouan",
  "Kasserine",
  "Kébili",
  "La Manouba",
  "Le Kef",
  "Mahdia",
  "Médenine",
  "Monastir",
  "Nabeul",
  "Sfax",
  "Sidi Bouzid",
  "Siliana",
  "Sousse",
  "Tataouine",
  "Tozeur",
  "Tunis",
  "Zaghouan",
];

const Checkout = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Address Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    governorate: "",
    city: "",
    zipCode: "",
    address: "",
    address2: "",
    saveAddress: true,

    // Shipping Method
    shippingMethod: "standard", // standard, express

    // Payment Information
    cardName: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
    saveCard: false,

    // Order Notes
    notes: "",
  });

  const steps = [
    { id: 1, name: "Address", description: "Shipping information" },
    { id: 2, name: "Shipping", description: "Delivery method" },
    { id: 3, name: "Payment", description: "Payment details" },
    { id: 4, name: "Review", description: "Order review" },
  ];

  const shippingMethods = [
    {
      id: "standard",
      name: "Standard Delivery",
      description: "3-5 business days",
      price: 7.0,
      icon: "🚚",
    },
    {
      id: "express",
      name: "Express Delivery",
      description: "1-2 business days",
      price: 15.0,
      icon: "⚡",
    },
    {
      id: "pickup",
      name: "Store Pickup",
      description: "Pick up from our Tunis store",
      price: 0.0,
      icon: "🏪",
    },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = () => {
    // In a real app, you would process the order here
    toast.success("Commande passée avec succès! Merci pour votre achat.");

    // Redirect to order confirmation
    setTimeout(() => {
      navigate("/orders");
    }, 2000);
  };

  // Sample cart items for order summary
  const cartItems = [
    {
      id: 1,
      name: "Premium Cotton T-Shirt",
      price: 29.99,
      quantity: 2,
      image:
        "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    },
    {
      id: 2,
      name: "Designer Denim Jacket",
      price: 89.99,
      quantity: 1,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    },
  ];

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shippingPrice =
    shippingMethods.find((m) => m.id === formData.shippingMethod)?.price || 0;
  const tax = subtotal * 0.07; // 7% TVA in Tunisia
  const total = subtotal + shippingPrice + tax;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressForm
            formData={formData}
            handleInputChange={handleInputChange}
            governorates={TUNISIAN_GOVERNORATES}
          />
        );
      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Select Shipping Method
            </h3>
            <div className="space-y-4">
              {shippingMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.shippingMethod === method.id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() =>
                    setFormData({ ...formData, shippingMethod: method.id })
                  }
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{method.icon}</span>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {method.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-lg font-semibold">
                      {method.price === 0 ? "Free" : `${method.price} DT`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <PaymentForm
            formData={formData}
            handleInputChange={handleInputChange}
          />
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">
                    Secure Checkout
                  </h3>
                  <p className="text-green-700 text-sm">
                    Your information is protected with 256-bit SSL encryption
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h3>
              <div className="bg-gray-50 rounded-xl p-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      {subtotal.toFixed(3)} DT
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingPrice === 0 ? "Free" : `${shippingPrice} DT`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">TVA (7%)</span>
                    <span className="font-medium">{tax.toFixed(3)} DT</span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>{total.toFixed(3)} DT</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Notes */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Additional Notes
              </h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add special instructions for your order..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-200 focus:border-purple-500 focus:outline-none"
                rows="3"
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1" required />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the Terms & Conditions and Privacy Policy. I
                understand that my order is subject to availability and
                confirmation. By placing this order, I authorize the charge to
                my payment method.
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Checkout</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your purchase securely with our encrypted checkout process
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Checkout Steps */}
          <CheckoutSteps steps={steps} currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            {/* Left Column - Forms */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                {/* Step Indicator */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {steps[currentStep - 1].name}
                  </h2>
                  <p className="text-gray-600">
                    {steps[currentStep - 1].description}
                  </p>
                </div>

                {/* Step Content */}
                {renderStepContent()}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <Button variant="outline" onClick={handlePrevStep}>
                      Back
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={() => navigate("/cart")}>
                      Return to Cart
                    </Button>
                  )}

                  {currentStep < 4 ? (
                    <Button onClick={handleNextStep}>
                      Continue to {steps[currentStep].name}
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitOrder}>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Place Order
                      </div>
                    </Button>
                  )}
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className="text-2xl mb-2">🔒</div>
                  <p className="text-sm font-medium">SSL Secure</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className="text-2xl mb-2">💳</div>
                  <p className="text-sm font-medium">Secure Payment</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <Truck className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="text-sm font-medium">Fast Delivery</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <p className="text-sm font-medium">Support 24/7</p>
                </div>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:col-span-1">
              <OrderSummary
                items={cartItems}
                subtotal={subtotal}
                shipping={shippingPrice}
                tax={tax}
                total={total}
                shippingMethod={formData.shippingMethod}
              />
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Need Help?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="font-medium text-gray-900 mb-1">Contact Us</p>
                <p className="text-gray-600 text-sm">+216 70 000 000</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Email Support</p>
                <p className="text-gray-600 text-sm">support@fashionstore.tn</p>
              </div>
              <div>
                <p className="font-medium text-gray-900 mb-1">Return Policy</p>
                <p className="text-gray-600 text-sm">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
