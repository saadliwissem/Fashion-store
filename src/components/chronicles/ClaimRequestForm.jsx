import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Maximize2,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Loader,
  Key,
  Smartphone,
  Building,
} from "lucide-react";

const ClaimRequestForm = ({ fragment, onClose, onSubmit }) => {
  const [step, setStep] = useState(1); // 1: Personal, 2: Shipping, 3: Payment, 4: Confirmation
  const [formData, setFormData] = useState({
    // Personal Info
    fullName: "",
    email: "",
    phone: "",

    // Shipping Info
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "TN", // Default to Tunisia

    // Fragment Details
    size: "M",
    customization: "",
    specialRequests: "",

    // Payment
    paymentMethod: "card", // card, edinar, cash_on_delivery
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",

    // E-Dinar (Tunisian digital payment)
    edinarPhone: "",
    edinarCode: "",

    // Terms
    acceptTerms: false,
    acceptUpdates: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [paymentSimulation, setPaymentSimulation] = useState(null);

  const validateStep = (stepNumber) => {
    const newErrors = {};

    if (stepNumber === 1) {
      if (!formData.fullName.trim())
        newErrors.fullName = "Full name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid email";
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    if (stepNumber === 2) {
      if (!formData.address.trim()) newErrors.address = "Address is required";
      if (!formData.city.trim()) newErrors.city = "City is required";
      if (!formData.state.trim()) newErrors.state = "State is required";
      if (!formData.postalCode.trim())
        newErrors.postalCode = "Postal code is required";
    }

    if (stepNumber === 3) {
      if (formData.paymentMethod === "card") {
        if (!formData.cardName.trim())
          newErrors.cardName = "Cardholder name is required";
        if (!formData.cardNumber.trim())
          newErrors.cardNumber = "Card number is required";
        if (!formData.cardExpiry.trim())
          newErrors.cardExpiry = "Expiry date is required";
        if (!formData.cardCvc.trim()) newErrors.cardCvc = "CVC is required";
      } else if (formData.paymentMethod === "edinar") {
        if (!formData.edinarPhone.trim())
          newErrors.edinarPhone = "E-Dinar phone number is required";
        if (!formData.edinarCode.trim())
          newErrors.edinarCode = "Confirmation code is required";
      }

      if (!formData.acceptTerms) {
        newErrors.acceptTerms = "You must accept the terms and conditions";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  // Simulate payment processing
  const simulatePayment = async () => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate random success (90% success rate for simulation)
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
        message: "Payment processed successfully",
      };
    } else {
      return {
        success: false,
        message:
          "Payment failed. Please try again or use another payment method.",
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setIsSubmitting(true);
    setPaymentSimulation({
      status: "processing",
      message: "Processing payment...",
    });

    // Simulate payment processing
    const paymentResult = await simulatePayment();

    if (paymentResult.success) {
      setPaymentSimulation({
        status: "success",
        message: "Payment successful!",
      });

      setTimeout(() => {
        setIsSubmitting(false);
        setSubmissionSuccess(true);

        // Generate claim ID
        const claimId = `CLM-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 6)
          .toUpperCase()}`;

        // In ClaimRequestForm.jsx - around line 180-200
        if (onSubmit) {
          onSubmit({
            fragment: fragment,
            userData: {
              fullName: formData.fullName,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
              city: formData.city,
              state: formData.state,
              postalCode: formData.postalCode,
              country: formData.country,
              size: formData.size,
              customization: formData.customization,
              specialRequests: formData.specialRequests,
              acceptTerms: formData.acceptTerms,
              acceptUpdates: formData.acceptUpdates,
            },
            paymentMethod: formData.paymentMethod, // ← CRITICAL: Send at root level
            size: formData.size,
            customization: formData.customization,
            paymentDetails: {
              method: formData.paymentMethod,
              transactionId: paymentResult.transactionId,
              amount: grandTotal,
              currency: "TND",
            },
            timestamp: new Date().toISOString(),
            claimId: claimId,
          });
        }
      }, 1000);
    } else {
      setPaymentSimulation({
        status: "failed",
        message: paymentResult.message,
      });
      setIsSubmitting(false);
    }
  };

  const retryPayment = () => {
    setPaymentSimulation(null);
    // Reset payment fields
    setFormData((prev) => ({
      ...prev,
      cardNumber: "",
      cardExpiry: "",
      cardCvc: "",
      edinarPhone: "",
      edinarCode: "",
    }));
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  // Tunisian cities for autocomplete (optional)
  const tunisianCities = [
    "Tunis",
    "Sfax",
    "Sousse",
    "Ettadhamen",
    "Kairouan",
    "Bizerte",
    "Gabès",
    "Ariana",
    "Gafsa",
    "La Marsa",
    "Monastir",
    "Zarzis",
    "Ben Arous",
    "Manouba",
    "Medenine",
    "Nabeul",
    "Tataouine",
    "Tozeur",
  ];

  const totalAmount = fragment ? fragment.price : 0;
  const taxAmount = totalAmount * 0.19; // 19% TVA in Tunisia
  const shippingAmount = 15.0; // Fixed shipping in TND
  const grandTotal = totalAmount + taxAmount + shippingAmount;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all shadow-sm ${
                stepNumber === step
                  ? "bg-primary-500 border-primary-500 text-white"
                  : stepNumber < step
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-gray-100 border-gray-300 text-gray-600"
              }`}
            >
              {stepNumber < step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-bold">{stepNumber}</span>
              )}
            </div>
            <span className="text-xs mt-2 text-gray-600">
              {stepNumber === 1 && "Personal"}
              {stepNumber === 2 && "Shipping"}
              {stepNumber === 3 && "Payment"}
              {stepNumber === 4 && "Confirm"}
            </span>
          </div>

          {stepNumber < 4 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                stepNumber < step ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderPaymentSimulation = () => {
    if (paymentSimulation?.status === "processing") {
      return (
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-center gap-3">
            <Loader className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <p className="text-blue-800 font-medium">Processing Payment</p>
              <p className="text-blue-600 text-sm">
                Please don't close this window...
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (paymentSimulation?.status === "failed") {
      return (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">Payment Failed</p>
              <p className="text-red-600 text-sm">
                {paymentSimulation.message}
              </p>
              <button
                type="button"
                onClick={retryPayment}
                className="mt-2 text-sm text-red-700 underline hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                Personal Information
              </h3>
              <p className="text-gray-600">
                Enter your details to become a fragment guardian
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  } bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-red-500" : "border-gray-300"
                    } bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    } bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm`}
                    placeholder="+216 XX XXX XXX"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                Shipping Details
              </h3>
              <p className="text-gray-600">
                Where should we deliver your fragment?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  } bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    list="tunisian-cities"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    } bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm`}
                    placeholder="Tunis"
                  />
                  <datalist id="tunisian-cities">
                    {tunisianCities.map((city) => (
                      <option key={city} value={city} />
                    ))}
                  </datalist>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Governorate
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    } bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm`}
                    placeholder="Tunis"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    } bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm`}
                    placeholder="1000"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm"
                >
                  <option value="TN">Tunisia</option>
                  <option value="DZ">Algeria</option>
                  <option value="MA">Morocco</option>
                  <option value="LY">Libya</option>
                  <option value="FR">France</option>
                  <option value="IT">Italy</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2 text-gray-900">
                Payment Information
              </h3>
              <p className="text-gray-600">
                Choose your payment method (All prices in TND)
              </p>
            </div>

            <div className="space-y-4">
              {/* Fragment Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-soft">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <Key className="w-5 h-5 text-primary-600" />
                  Order Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Fragment #{fragment?.number} - {fragment?.name}
                    </span>
                    <span className="font-bold text-gray-900">
                      {totalAmount.toFixed(2)} TND
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Size: {formData.size}</span>
                    <span className="text-gray-600">Included</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">TVA (19%)</span>
                      <span className="text-gray-900">
                        {taxAmount.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="text-gray-900">
                        {shippingAmount.toFixed(2)} TND
                      </span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-200">
                      <span className="text-gray-900">Total</span>
                      <span className="text-primary-600">
                        {grandTotal.toFixed(2)} TND
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Maximize2 className="w-4 h-4 inline mr-2" />
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, size }))}
                      className={`px-4 py-2 rounded-lg transition-all shadow-sm ${
                        formData.size === size
                          ? "bg-primary-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customization Requests (Optional)
                </label>
                <textarea
                  name="customization"
                  value={formData.customization}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all shadow-sm"
                  placeholder="Any special customization requests..."
                />
              </div>

              {/* Payment Method Selection */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-soft">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-gray-900">
                  <CreditCard className="w-5 h-5 text-primary-600" />
                  Payment Method
                </h4>

                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleInputChange}
                      className="text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Credit / Debit Card
                      </div>
                      <div className="text-sm text-gray-500">
                        Visa, Mastercard, CIB, BIAT, UIB
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <span className="text-xl">💳</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="edinar"
                      checked={formData.paymentMethod === "edinar"}
                      onChange={handleInputChange}
                      className="text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">E-Dinar</div>
                      <div className="text-sm text-gray-500">
                        Tunisian digital payment
                      </div>
                    </div>
                    <Smartphone className="w-5 h-5 text-gray-400" />
                  </label>

                  <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cash_on_delivery"
                      checked={formData.paymentMethod === "cash_on_delivery"}
                      onChange={handleInputChange}
                      className="text-primary-600"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        Cash on Delivery
                      </div>
                      <div className="text-sm text-gray-500">
                        Pay when you receive
                      </div>
                    </div>
                    <Building className="w-5 h-5 text-gray-400" />
                  </label>
                </div>

                {/* Payment Details based on method */}
                {formData.paymentMethod === "card" && (
                  <div className="mt-6 space-y-4 border-t pt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Name on card"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="1234 5678 9012 3456"
                        maxLength="19"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="cardExpiry"
                          value={formData.cardExpiry}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          CVC
                        </label>
                        <input
                          type="text"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                          placeholder="123"
                          maxLength="4"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-800">
                        🔒 Test Mode: Use any valid-looking card number (e.g.,
                        4242 4242 4242 4242) for testing. No real charges will
                        be made.
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "edinar" && (
                  <div className="mt-6 space-y-4 border-t pt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-Dinar Phone Number
                      </label>
                      <input
                        type="tel"
                        name="edinarPhone"
                        value={formData.edinarPhone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="+216 XX XXX XXX"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirmation Code
                      </label>
                      <input
                        type="text"
                        name="edinarCode"
                        value={formData.edinarCode}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200"
                        placeholder="Enter code from SMS"
                      />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-800">
                        🔒 Test Mode: Enter any 6-digit code (e.g., 123456) for
                        testing.
                      </p>
                    </div>
                  </div>
                )}

                {formData.paymentMethod === "cash_on_delivery" && (
                  <div className="mt-6 border-t pt-6">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800">
                        💰 You will pay {grandTotal.toFixed(2)} TND in cash when
                        your fragment is delivered.
                      </p>
                      <p className="text-xs text-green-700 mt-2">
                        A confirmation will be sent to your email with tracking
                        information.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleInputChange}
                    className="mt-1 text-primary-600 focus:ring-primary-200"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-700"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and understand that this is a pre-order. Production will
                    begin only when all required fragments are claimed.
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-600">{errors.acceptTerms}</p>
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptUpdates"
                    name="acceptUpdates"
                    checked={formData.acceptUpdates}
                    onChange={handleInputChange}
                    className="mt-1 text-primary-600 focus:ring-primary-200"
                  />
                  <label
                    htmlFor="acceptUpdates"
                    className="text-sm text-gray-700"
                  >
                    I want to receive updates about this fragment's production
                    progress and puzzle clues.
                  </label>
                </div>
              </div>
            </div>

            {renderPaymentSimulation()}
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            {submissionSuccess ? (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">
                    Claim Successful!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    You are now a guardian of {fragment?.name}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 max-w-md mx-auto shadow-soft">
                  <div className="text-sm text-gray-600 mb-2">Claim ID</div>
                  <div className="font-mono text-lg font-bold text-primary-600">
                    {`CLM-${Date.now().toString().slice(-8)}`}
                  </div>
                  <div className="mt-4 text-sm text-gray-700">
                    You will receive a confirmation email with next steps.
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-left text-sm">
                      <p className="font-medium text-gray-900 mb-2">
                        Next Steps:
                      </p>
                      <ul className="text-gray-600 space-y-1">
                        <li>✓ Confirmation email sent to {formData.email}</li>
                        <li>
                          ✓ Production will begin when all fragments are sold
                        </li>
                        <li>✓ You'll be notified when manufacturing starts</li>
                        <li>✓ Track progress in your dashboard</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="btn-primary px-8 py-3">
                  Return to Chronicle
                </button>
              </div>
            ) : null}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-6 rounded-t-2xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Claim {fragment?.name}
              </h2>
              <p className="text-gray-600">{fragment?.description}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600 hover:text-gray-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step < 4 && !submissionSuccess && renderStepIndicator()}
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            {/* Navigation Buttons */}
            {step < 4 &&
              !submissionSuccess &&
              paymentSimulation?.status !== "processing" && (
                <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                  <div>
                    {step > 1 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
                      >
                        Back
                      </button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Total</div>
                      <div className="text-2xl font-bold text-primary-600">
                        {grandTotal.toFixed(2)} TND
                      </div>
                    </div>

                    {step < 3 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        className="btn-primary px-8 py-3"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-primary px-8 py-3 flex items-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-5 h-5" />
                            {formData.paymentMethod === "cash_on_delivery"
                              ? "Place Order"
                              : "Complete Payment"}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
          </form>
        </div>

        {/* Security Footer */}
        {step < 4 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure payment processing</span>
              <span>•</span>
              <span>256-bit encryption</span>
              <span>•</span>
              <span>PCI DSS compliant</span>
              <span>•</span>
              <span>Free delivery in Tunisia</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

ClaimRequestForm.defaultProps = {
  fragment: {
    id: 1,
    number: 4,
    name: "The Navigator",
    description: "A rare fragment featuring the navigator's compass",
    price: 299.99,
  },
  onClose: () => {},
  onSubmit: (data) => console.log("Claim submitted:", data),
};

export default ClaimRequestForm;
