// pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Shield, Truck, Loader } from "lucide-react";
import CheckoutSteps from "../components/checkout/CheckoutSteps";
import AddressForm from "../components/checkout/AddressForm";
import PaymentForm from "../components/checkout/PaymentForm";
import OrderSummary from "../components/checkout/OrderSummary";
import Button from "../components/common/Button";
import toast from "react-hot-toast";
import { cartAPI, ordersAPI, authAPI } from "../services/api"; // ✅ Changed: Added authAPI
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

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
  const { isAuthenticated, user } = useAuth(); // ✅ Added: get user from auth
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState(null);
  const [cartLoading, setCartLoading] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("card");
  const { clearCart } = useCart();

  // State for saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(false);

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
    addressLabel: "Home",
    saveAddress: true,
    setDefault: false,

    // Shipping Method
    shippingMethod: "standard",

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
      name: "Delivery",
      description: "3-5 business days",
      price: 7.0,
      icon: "🚚",
    },
    {
      id: "pickup",
      name: "Store Pickup",
      description: "Pick up from our Tunis store",
      price: 0.0,
      icon: "🏪",
    },
  ];

  useEffect(() => {
    fetchCart();
    if (isAuthenticated) {
      loadSavedAddresses();
    }
  }, [isAuthenticated]);

  const fetchCart = async () => {
    try {
      setCartLoading(true);
      const response = await cartAPI.getCart();
      setCart(response.data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      toast.error("Failed to load cart. Please try again.");
    } finally {
      setCartLoading(false);
    }
  };

  // Load saved addresses from authAPI
  const loadSavedAddresses = async () => {
    try {
      setLoadingAddresses(true);
      // Get user profile which includes addresses
      const response = await authAPI.getProfile();
      const userData = response.data.user;

      // Extract addresses from user profile
      const addresses = userData?.addresses || [];
      setSavedAddresses(addresses);

      // If there's a default address, select it
      const defaultAddress = addresses.find((addr) => addr.isDefault);
      if (defaultAddress) {
        handleSelectSavedAddress(defaultAddress);
      }

      // Also pre-fill user's name and email from profile
      setFormData((prev) => ({
        ...prev,
        firstName: userData?.firstName || prev.firstName,
        lastName: userData?.lastName || prev.lastName,
        email: userData?.email || prev.email,
        phone: userData?.phone || prev.phone,
      }));
    } catch (error) {
      console.error("Failed to load addresses:", error);
      setSavedAddresses([]);
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Handle selecting a saved address
  const handleSelectSavedAddress = (address) => {
    setFormData((prev) => ({
      ...prev,
      firstName: address.firstName || "",
      lastName: address.lastName || "",
      phone: address.phone || "",
      governorate: address.governorate || "",
      city: address.city || "",
      zipCode: address.zipCode || "",
      address: address.address || "",
      address2: address.address2 || "",
      addressLabel: address.label || "Home",
      saveAddress: false,
      setDefault: false,
    }));
  };

  // Handle using a new address
  const handleUseNewAddress = () => {
    setFormData((prev) => ({
      ...prev,
      governorate: "",
      city: "",
      zipCode: "",
      address: "",
      address2: "",
      addressLabel: "Home",
      saveAddress: true,
      setDefault: false,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Address validation
        const requiredFields = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "governorate",
          "city",
          "address",
        ];
        for (const field of requiredFields) {
          if (!formData[field]?.trim()) {
            toast.error(
              `Please fill in ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`
            );
            return false;
          }
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          toast.error("Please enter a valid email address");
          return false;
        }

        // Phone validation (Tunisian format)
        const phoneRegex = /^[2-9][0-9]{7}$/;
        const cleanPhone = formData.phone.replace(/\D/g, "");
        if (!phoneRegex.test(cleanPhone)) {
          toast.error(
            "Please enter a valid Tunisian phone number (8 digits starting with 2-9)"
          );
          return false;
        }
        return true;

      case 2: // Shipping method validation
        if (!formData.shippingMethod) {
          toast.error("Please select a shipping method");
          return false;
        }
        return true;

      case 3: // Payment method validation
        if (!selectedPaymentMethod) {
          toast.error("Please select a payment method");
          return false;
        }

        if (selectedPaymentMethod === "card") {
          const cardFields = [
            "cardName",
            "cardNumber",
            "cardExpiry",
            "cardCVC",
          ];
          for (const field of cardFields) {
            if (!formData[field]?.trim()) {
              toast.error("Please fill in all card details");
              return false;
            }
          }

          const cardNumber = formData.cardNumber.replace(/\s/g, "");
          if (cardNumber.length < 16) {
            toast.error("Please enter a valid 16-digit card number");
            return false;
          }

          const [month, year] = formData.cardExpiry.split("/");
          if (!month || !year || month.length !== 2 || year.length !== 2) {
            toast.error("Please enter expiry date in MM/YY format");
            return false;
          }

          if (formData.cardCVC.length < 3) {
            toast.error("Please enter a valid 3-digit CVC");
            return false;
          }
        }
        return true;
      case 4: // Terms validation
        if (!document.getElementById("terms")?.checked) {
          toast.error("Please agree to the terms and conditions");
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitOrder = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (!cart || cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        shippingAddress: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.replace(/\D/g, ""),
          governorate: formData.governorate,
          city: formData.city.trim(),
          zipCode: formData.zipCode.trim(),
          address: formData.address.trim(),
          address2: formData.address2?.trim() || "",
        },
        paymentMethod: selectedPaymentMethod,
        shippingMethod: formData.shippingMethod,
        customerNotes: formData.notes?.trim() || "",
        saveAddress: formData.saveAddress,
        addressLabel: formData.addressLabel,
        setDefault: formData.setDefault,
      };

      if (selectedPaymentMethod === "card") {
        orderData.paymentDetails = {
          cardLastFour: formData.cardNumber.slice(-4),
          cardName: formData.cardName,
        };
      }

      const response = await ordersAPI.create(orderData);

      toast.success("Commande passée avec succès! Merci pour votre achat.");
      clearCart();
      setTimeout(() => {
        navigate(`/orders/${response.data.order._id}`);
      }, 1500);
    } catch (error) {
      console.error("Order error:", error);
      const errorMessage =
        error.response?.data?.message || "Failed to place order";

      if (error.response?.status === 400) {
        if (errorMessage.includes("stock")) {
          toast.error("Some items are out of stock. Please update your cart.");
          fetchCart();
        } else if (errorMessage.includes("Cart is empty")) {
          toast.error("Your cart is empty");
          navigate("/cart");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.response?.status === 401) {
        toast.error("Please login to continue");
        navigate("/login");
      } else {
        toast.error(errorMessage || "An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateCartSummary = () => {
    if (!cart || !cart.items) {
      return {
        subtotal: 0,
        shipping: 0,
        tax: 0,
        total: 0,
        itemCount: 0,
        totalItems: 0,
      };
    }

    if (cart.summary) {
      const subtotal = cart.summary.subtotal || 0;
      const shippingPrice =
        shippingMethods.find((m) => m.id === formData.shippingMethod)?.price ||
        0;
      const tax = subtotal * 0.19;
      const total = subtotal + shippingPrice + tax;

      return {
        subtotal,
        shipping: shippingPrice,
        tax,
        total,
        itemCount: cart.summary.itemCount || 0,
        totalItems: cart.summary.totalItems || 0,
      };
    } else {
      const subtotal = cart.items.reduce(
        (sum, item) => sum + (item.product?.price || 0) * item.quantity,
        0
      );
      const shippingPrice =
        shippingMethods.find((m) => m.id === formData.shippingMethod)?.price ||
        0;
      const tax = subtotal * 0.19;
      const total = subtotal + shippingPrice + tax;
      const itemCount = cart.items.length;
      const totalItems = cart.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      return {
        subtotal,
        shipping: shippingPrice,
        tax,
        total,
        itemCount,
        totalItems,
      };
    }
  };

  const { subtotal, shipping, tax, total, itemCount, totalItems } =
    calculateCartSummary();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AddressForm
            formData={formData}
            handleInputChange={handleInputChange}
            governorates={TUNISIAN_GOVERNORATES}
            savedAddresses={savedAddresses}
            onSelectSavedAddress={handleSelectSavedAddress}
            onUseNewAddress={handleUseNewAddress}
            loadingAddresses={loadingAddresses}
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
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-200 hover:border-primary-300"
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
                      {method.price === 0
                        ? "Free"
                        : `${method.price.toFixed(3)} DT`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <PaymentForm
              formData={formData}
              handleInputChange={handleInputChange}
              selectedMethod={selectedPaymentMethod}
              onMethodChange={setSelectedPaymentMethod}
            />
          </div>
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

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Additional Notes
              </h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Add special instructions for your order..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-200 focus:border-primary-500 focus:outline-none"
                rows="3"
              />
            </div>

            <div className="flex items-start gap-3">
              <input type="checkbox" id="terms" className="mt-1" required />
              <div className="text-sm text-gray-600">
                <label htmlFor="terms">
                  I agree to the{" "}
                  <Link
                    to="/termsandconditions"
                    className="font-medium text-primary-600 hover:text-primary-500 underline"
                    target="_blank"
                  >
                    Terms & Conditions and Privacy Policy.
                  </Link>{" "}
                  I understand that my order is subject to availability and
                  confirmation. By placing this order, I authorize the charge to
                  my payment method.
                </label>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  if (cartLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin text-primary-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen py-16 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to proceed to checkout
          </p>
          <Button onClick={() => navigate("/")}>Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Checkout</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Complete your purchase securely with our encrypted checkout process
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <CheckoutSteps steps={steps} currentStep={currentStep} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {steps[currentStep - 1].name}
                  </h2>
                  <p className="text-gray-600">
                    {steps[currentStep - 1].description}
                  </p>
                </div>

                {renderStepContent()}

                <div className="flex justify-between mt-8 pt-8 border-t border-gray-200">
                  {currentStep > 1 ? (
                    <Button
                      variant="outline"
                      onClick={handlePrevStep}
                      disabled={loading}
                    >
                      Back
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => navigate("/cart")}
                      disabled={loading}
                    >
                      Return to Cart
                    </Button>
                  )}

                  {currentStep < 4 ? (
                    <Button onClick={handleNextStep} disabled={loading}>
                      Continue to {steps[currentStep].name}
                    </Button>
                  ) : (
                    <Button onClick={handleSubmitOrder} disabled={loading}>
                      <div className="flex items-center gap-2">
                        {loading ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Lock className="w-4 h-4" />
                        )}
                        {loading ? "Processing..." : "Place Order"}
                      </div>
                    </Button>
                  )}
                </div>
              </div>

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
                  <Truck className="w-8 h-8 mx-auto mb-2 text-primary-600" />
                  <p className="text-sm font-medium">Fast Delivery</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center">
                  <div className="text-2xl mb-2">📞</div>
                  <p className="text-sm font-medium">Support 24/7</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <OrderSummary
                items={cart.items || []}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                shippingMethod={formData.shippingMethod}
                shippingMethods={shippingMethods}
                itemCount={itemCount}
                totalItems={totalItems}
              />
            </div>
          </div>

          <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-2xl">
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
                <p className="text-gray-600 text-sm">support@DAR ENNAR.tn</p>
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
