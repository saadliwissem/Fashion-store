// pages/Cart.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Heart,
  Truck,
  Shield,
  Package,
  Loader2,
  X,
} from "lucide-react";
import Button from "../components/common/Button";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
import { productsAPI } from "../services/api";

const Cart = () => {
  const navigate = useNavigate();
  const { addToWishlist } = useWishlist();
  const {
    cart,
    cartTotal,
    removeItem,
    updateQuantity,
    clearCart,
    loading,
    initialized,
    updatingItems,
    addItem, // Assuming you have this in your cart context
  } = useCart();
  const { isAuthenticated } = useAuth();

  // State for recommended products
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationSource, setRecommendationSource] = useState("popular");
  const [addingToCart, setAddingToCart] = useState({});

  // Fetch recommendations when cart changes
  useEffect(() => {
    fetchRecommendations();
  }, [cart]);

  const fetchRecommendations = async () => {
    if (!cart || cart.length === 0) {
      setRecommendedProducts([]);
      return;
    }

    setLoadingRecommendations(true);
    try {
      const productIds = cart
        .map((item) => item.product?._id || item.productId || item._id)
        .filter(Boolean);

      const response = await productsAPI.getFrequentlyBoughtTogether(
        productIds
      );
      setRecommendedProducts(response.data || []);
      setRecommendationSource(response.source || "popular");
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setRecommendedProducts([]);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Handle move to wishlist
  const handleMoveToWishlist = (item) => {
    if (!item) return;

    const productData = item.product || item;

    addToWishlist({
      id: productData._id || productData.id,
      name: productData.name,
      price: productData.price,
      originalPrice: productData.originalPrice,
      image: productData.image || productData.images?.[0],
      category: productData.category,
    });

    removeItem(item._id || item.id);
    toast.success("Moved to wishlist!");
  };

  const handleUpdateQuantity = (id, newQuantity) => {
    if (!id || newQuantity < 1) return;
    updateQuantity(id, newQuantity);
  };

  const handleRemoveItem = (id) => {
    if (!id) return;
    removeItem(id);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
      toast.success("Cart cleared");
    }
  };

  const handleProceedToCheckout = () => {
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (!isAuthenticated) {
      toast("Please login to continue", {
        icon: "🔒",
        duration: 4000,
      });
      navigate("/login", { state: { from: "/checkout" } });
      return;
    }

    navigate("/checkout");
  };

  // Handle adding recommended product to cart
  const handleAddRecommendedToCart = async (product) => {
    if (!product) return;

    try {
      setAddingToCart((prev) => ({ ...prev, [product._id]: true }));

      // Check if product is already in cart
      const existingItem = cart.find(
        (item) =>
          item.product?._id === product._id || item.productId === product._id
      );

      if (existingItem) {
        toast.info(`${product.name} is already in your cart`);
        // Remove from recommendations
        setRecommendedProducts((prev) =>
          prev.filter((p) => p._id !== product._id)
        );
        return;
      }

      // Add to cart - you'll need to implement addItem in your cart context
      await addItem(product._id, 1);
      toast.success(`${product.name} added to cart!`);

      // Remove from recommendations
      setRecommendedProducts((prev) =>
        prev.filter((p) => p._id !== product._id)
      );

      // Refresh recommendations
      setTimeout(() => fetchRecommendations(), 500);
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setAddingToCart((prev) => ({ ...prev, [product._id]: false }));
    }
  };

  // Show loading state
  if (loading || !initialized) {
    return (
      <div className="min-h-screen py-16 fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-neutral-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Loading your cart...
            </h1>
            <p className="text-gray-600 mb-8">
              Please wait while we load your shopping cart.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isCartEmpty = !cart || !Array.isArray(cart) || cart.length === 0;

  if (isCartEmpty) {
    return (
      <div className="min-h-screen py-16 fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any items to your cart yet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={() => navigate("/shop")}>Start Shopping</Button>
              <Button variant="outline" onClick={() => navigate("/")}>
                Continue Shopping
              </Button>
            </div>
          </div>

          {/* Popular Products when cart is empty */}
          {recommendedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                You might also like
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <div
                    key={product._id}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/product/${product._id}`)}
                  >
                    <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-3">
                      {product.images?.[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary-600 line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-gray-600">
                      {product.price?.toFixed(3) || "0.000"} DT
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const safeCartTotal = {
    subtotal: cartTotal?.subtotal || 0,
    shipping: cartTotal?.shipping || 0,
    tax: cartTotal?.tax || 0,
    total: cartTotal?.total || 0,
  };

  return (
    <div className="min-h-screen py-8 fade-in">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Shopping Cart
              </h1>
              <div className="flex items-center gap-4 text-gray-600">
                <p>
                  {cart.length} item{cart.length !== 1 ? "s" : ""} in your cart
                </p>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <p>
                  Total:{" "}
                  <span className="font-bold text-primary-600">
                    {safeCartTotal.total.toFixed(3)} DT
                  </span>
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => navigate("/shop")}
              className="flex items-center gap-2"
              disabled={loading}
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Desktop Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-200 bg-gray-50">
                <div className="col-span-5">
                  <span className="font-semibold text-gray-700">Product</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-semibold text-gray-700">Price</span>
                </div>
                <div className="col-span-3 text-center">
                  <span className="font-semibold text-gray-700">Quantity</span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="font-semibold text-gray-700">Total</span>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-100">
                {cart.map((item) => (
                  <CartItem
                    key={item._id}
                    Globalitem={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                    onMoveToWishlist={() => handleMoveToWishlist(item)}
                    isUpdating={updatingItems[item._id]}
                  />
                ))}
              </div>

              {/* Cart Actions */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <Button
                    variant="ghost"
                    onClick={handleClearCart}
                    disabled={loading}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Cart
                  </Button>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => {
                        toast.success("Cart saved for later");
                      }}
                      disabled={loading}
                    >
                      Save for Later
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Promo Code */}
            {/* <div className="mt-8 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-2xl p-6 border border-primary-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Have a promo code?
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="input-modern flex-1"
                  disabled={loading}
                />
                <Button variant="outline" disabled={loading}>
                  Apply
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Available codes: SUMMER25, NEW10, FREESHIP
              </p>
            </div> */}

            {/* Shipping Progress */}
            {safeCartTotal.subtotal < 99 && (
              <div className="mt-8 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl flex items-center justify-center">
                    <Truck className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Get Free Shipping!
                    </h3>
                    <p className="text-sm text-gray-600">
                      Add {(99 - safeCartTotal.subtotal).toFixed(3)} DT more to
                      qualify for free shipping
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Your progress</span>
                    <span className="font-medium">
                      {Math.min(
                        (safeCartTotal.subtotal / 99) * 100,
                        100
                      ).toFixed(0)}
                      %
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (safeCartTotal.subtotal / 99) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              items={cart}
              subtotal={safeCartTotal.subtotal}
              shipping={safeCartTotal.shipping}
              tax={safeCartTotal.tax}
              total={safeCartTotal.total}
              onCheckout={handleProceedToCheckout}
              isLoading={loading}
            />

            {/* Security Badges */}
            <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Secure Shopping
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl">🔒</div>
                  <p className="text-sm font-medium mt-2">SSL Secure</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl">💳</div>
                  <p className="text-sm font-medium mt-2">Safe Payment</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl">🔄</div>
                  <p className="text-sm font-medium mt-2">Easy Returns</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-2xl">📞</div>
                  <p className="text-sm font-medium mt-2">24/7 Support</p>
                </div>
              </div>
            </div>

            {/* Customer Support */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Need Help?</h3>
                  <p className="text-sm text-gray-600">
                    Our team is here for you
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      30-Day Returns
                    </p>
                    <p className="text-xs text-gray-600">Hassle-free returns</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Fast Shipping
                    </p>
                    <p className="text-xs text-gray-600">Across Tunisia</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" fullWidth className="mt-6">
                Contact Support
              </Button>
            </div>
          </div>
        </div>

        {/* Recommended Products - DYNAMIC */}
        {!loadingRecommendations && recommendedProducts.length > 0 && (
          <div className="mt-12 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {recommendationSource === "frequently_bought"
                    ? "🔄 Frequently Bought Together"
                    : "⭐ You Might Also Like"}
                </h2>
                <p className="text-gray-600">
                  {recommendationSource === "frequently_bought"
                    ? "Customers who bought these items also bought:"
                    : "Popular items you might be interested in:"}
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/shop")}>
                View All
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendedProducts.map((product) => {
                // Check if product is already in cart
                const isInCart = cart.some(
                  (item) =>
                    item.product?._id === product._id ||
                    item.productId === product._id
                );

                return (
                  <div
                    key={product._id}
                    className="group bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all hover:-translate-y-1 relative"
                  >
                    {isInCart && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full">
                        In Cart
                      </div>
                    )}
                    <Link to={`/product/${product._id}`}>
                      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="w-12 h-12" />
                          </div>
                        )}
                      </div>
                    </Link>
                    <Link to={`/product/${product._id}`}>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-600 line-clamp-1">
                      {product.category?.name || "Clothing"}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-lg font-bold text-gray-900">
                        {product.price?.toFixed(3) || "0.000"} DT
                      </span>
                      {!isInCart ? (
                        <Button
                          size="small"
                          variant="outline"
                          onClick={() => handleAddRecommendedToCart(product)}
                          disabled={addingToCart[product._id]}
                          className="flex items-center gap-1"
                        >
                          {addingToCart[product._id] ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                          Add
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="ghost"
                          onClick={() => navigate("/cart")}
                          className="text-green-600"
                        >
                          View in Cart
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Loading state for recommendations */}
        {loadingRecommendations && cart.length > 0 && (
          <div className="mt-12 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <span className="ml-3 text-gray-600">
                Finding recommendations...
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
