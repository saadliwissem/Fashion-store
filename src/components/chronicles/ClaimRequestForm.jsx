import React, { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Size,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle,
  X,
  Loader,
  Key,
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
    country: "US",

    // Fragment Details
    size: "M",
    customization: "",
    specialRequests: "",

    // Payment
    paymentMethod: "card",
    cardNumber: "",
    cardExpiry: "",
    cardCvc: "",
    cardName: "",

    // Terms
    acceptTerms: false,
    acceptUpdates: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionSuccess(true);

      if (onSubmit) {
        onSubmit({
          fragment,
          userData: formData,
          timestamp: new Date().toISOString(),
          claimId: `CLAIM-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
        });
      }
    }, 2000);
  };

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];
  const countryOptions = ["US", "UK", "CA", "AU", "DE", "FR", "JP"];

  const totalAmount = fragment ? fragment.price : 0;
  const taxAmount = totalAmount * 0.1; // 10% tax
  const shippingAmount = 25.0;
  const grandTotal = totalAmount + taxAmount + shippingAmount;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                stepNumber === step
                  ? "bg-primary-500 border-primary-500 text-white"
                  : stepNumber < step
                  ? "bg-green-500 border-green-500 text-white"
                  : "bg-gray-800 border-gray-700 text-gray-400"
              }`}
            >
              {stepNumber < step ? (
                <CheckCircle className="w-5 h-5" />
              ) : (
                <span className="font-bold">{stepNumber}</span>
              )}
            </div>
            <span className="text-xs mt-2 text-gray-400">
              {stepNumber === 1 && "Personal"}
              {stepNumber === 2 && "Shipping"}
              {stepNumber === 3 && "Payment"}
              {stepNumber === 4 && "Confirm"}
            </span>
          </div>

          {stepNumber < 4 && (
            <div
              className={`w-16 h-0.5 mx-2 ${
                stepNumber < step ? "bg-green-500" : "bg-gray-700"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Personal Information</h3>
              <p className="text-gray-400">
                Enter your details to become a fragment guardian
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.fullName ? "border-red-500" : "border-gray-700"
                  } bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400">{errors.fullName}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email ? "border-red-500" : "border-gray-700"
                    } bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Phone className="w-4 h-4 inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.phone ? "border-red-500" : "border-gray-700"
                    } bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-400">{errors.phone}</p>
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
              <h3 className="text-2xl font-bold mb-2">Shipping Details</h3>
              <p className="text-gray-400">
                Where should we deliver your fragment?
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  Street Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.address ? "border-red-500" : "border-gray-700"
                  } bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                  placeholder="123 Main Street"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-400">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.city ? "border-red-500" : "border-gray-700"
                    } bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                    placeholder="New York"
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-400">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.state ? "border-red-500" : "border-gray-700"
                    } bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                    placeholder="NY"
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-400">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.postalCode ? "border-red-500" : "border-gray-700"
                    } bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all`}
                    placeholder="10001"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-400">
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                >
                  {countryOptions.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold mb-2">Payment Information</h3>
              <p className="text-gray-400">
                Complete your claim with secure payment
              </p>
            </div>

            <div className="space-y-4">
              {/* Fragment Summary */}
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700">
                <h4 className="font-bold mb-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-primary-400" />
                  Fragment Summary
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">
                      Fragment #{fragment?.number}
                    </span>
                    <span className="font-bold">
                      ${fragment?.price?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Size: {formData.size}</span>
                    <span className="text-gray-400">Included</span>
                  </div>
                  <div className="border-t border-gray-700 pt-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Tax</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Shipping</span>
                      <span>${shippingAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold mt-3 pt-3 border-t border-gray-700">
                      <span>Total</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Size Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Size className="w-4 h-4 inline mr-2" />
                  Select Size
                </label>
                <div className="flex flex-wrap gap-2">
                  {sizeOptions.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, size }))}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        formData.size === size
                          ? "bg-primary-500 text-white"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Customization */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Customization Requests (Optional)
                </label>
                <textarea
                  name="customization"
                  value={formData.customization}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-800/50 text-white focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="Any special customization requests..."
                />
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
                    className="mt-1"
                  />
                  <label
                    htmlFor="acceptTerms"
                    className="text-sm text-gray-300"
                  >
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="text-primary-400 hover:text-primary-300"
                    >
                      Terms & Conditions
                    </a>{" "}
                    and understand that this is a pre-order. Production will
                    begin only when all required fragments are claimed.
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="text-sm text-red-400">{errors.acceptTerms}</p>
                )}

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="acceptUpdates"
                    name="acceptUpdates"
                    checked={formData.acceptUpdates}
                    onChange={handleInputChange}
                    className="mt-1"
                  />
                  <label
                    htmlFor="acceptUpdates"
                    className="text-sm text-gray-300"
                  >
                    I want to receive updates about this fragment's production
                    progress and puzzle clues.
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center py-8">
            {submissionSuccess ? (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Claim Successful!</h3>
                  <p className="text-gray-400 mb-6">
                    You are now a guardian of Fragment #{fragment?.number}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700 max-w-md mx-auto">
                  <div className="text-sm text-gray-400 mb-2">Claim ID</div>
                  <div className="font-mono text-lg font-bold text-primary-300">
                    CLAIM-{Date.now().toString().slice(-8)}
                  </div>
                  <div className="mt-4 text-sm text-gray-300">
                    You will receive a confirmation email with next steps.
                  </div>
                </div>
                <button onClick={onClose} className="btn-primary px-8 py-3">
                  Return to Chronicle
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">
                    Confirm Your Claim
                  </h3>
                  <p className="text-gray-400">
                    Review your details before submitting
                  </p>
                </div>
                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-xl p-6 border border-gray-700 text-left">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Fragment:</span>
                      <span className="font-bold">#{fragment?.number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Amount:</span>
                      <span className="font-bold">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delivery to:</span>
                      <span className="font-bold">
                        {formData.city}, {formData.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black rounded-3xl border border-gray-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900/90 backdrop-blur-sm border-b border-gray-700 p-6 rounded-t-3xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">
                Claim Fragment #{fragment?.number}
              </h2>
              <p className="text-gray-400">{fragment?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {step < 4 && renderStepIndicator()}
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            {/* Navigation Buttons */}
            {step < 4 && !submissionSuccess && (
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-700">
                <div>
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                      Back
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm text-gray-400">Total</div>
                    <div className="text-2xl font-bold">
                      ${grandTotal.toFixed(2)}
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
                          Complete Payment
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
          <div className="p-6 border-t border-gray-700">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <Shield className="w-4 h-4" />
              <span>Secure payment processed by Stripe</span>
              <span>•</span>
              <span>256-bit encryption</span>
              <span>•</span>
              <span>PCI DSS compliant</span>
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
    name: "Fragment #4 - The Navigator",
    price: 299.99,
  },
  onClose: () => {},
  onSubmit: (data) => console.log("Claim submitted:", data),
};

export default ClaimRequestForm;
