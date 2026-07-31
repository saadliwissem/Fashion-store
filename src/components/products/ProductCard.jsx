// components/products/ProductCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, removeFromCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Fix: Handle different image formats
  const imgSrc =
    product.images?.[0]?.url ||
    product.images?.[0] ||
    product.image?.url ||
    product.image ||
    "/placeholder-image.jpg";

  // Fix: Handle product ID consistently
  const productId = product._id || product.id;

  // Fix: Check if product is in cart/wishlist using the correct ID
  const inCart = isInCart(productId);
  const inWishlist = isInWishlist(productId);

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inWishlist) {
      removeFromWishlist(productId);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCart) {
      // If already in cart, remove it
      removeFromCart(productId);
      toast.success("Removed from cart");
    } else {
      addToCart(product);
      toast.success("Added to cart");
    }
  };

  // Fix: Handle missing category

  const rating = product.rating || product.averageRating || 4.5;
  const price = product.price || 0;
  const originalPrice = product.originalPrice || product.compareAtPrice || 0;

  // List View
  if (viewMode === "list") {
    return (
      <Link
        to={`/product/${productId}`}
        className="group flex flex-col md:flex-row gap-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
      >
        {/* Product Image */}
        <div className="flex-shrink-0 w-full md:w-48 h-48 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={imgSrc}
            alt={product.name || "Product"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                {product.isNewArrival && (
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    NEW
                  </span>
                )}
                {product.onSale && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                    SALE
                  </span>
                )}
                {inCart && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                    IN CART
                  </span>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                {product.name || "Product"}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description ||
                  "Premium quality product with excellent design and comfort."}
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center">
                  <span className="ml-1 text-sm font-medium">
                    {rating.toFixed(1)}
                  </span>
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Free Shipping</span>
                {product.stock !== undefined && (
                  <>
                    <span className="text-sm text-gray-500">•</span>
                    <span
                      className={`text-sm ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="text-left md:text-right">
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {price.toFixed(3)} TND
                </span>
                {originalPrice > price && (
                  <div className="text-lg text-gray-400 line-through">
                    {originalPrice.toFixed(3)} TND
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-start md:justify-end">
                <button
                  onClick={handleAddToWishlist}
                  className={`p-2 rounded-lg transition-colors ${
                    inWishlist
                      ? "bg-rose-50 text-rose-500"
                      : "text-gray-600 hover:bg-rose-50 hover:text-rose-500"
                  }`}
                  title={
                    inWishlist ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`}
                  />
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`p-2 rounded-lg transition-colors ${
                    inCart
                      ? "bg-purple-600 text-white"
                      : "bg-gray-100 hover:bg-purple-600 hover:text-white"
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid View (default)
  return (
    <Link
      to={`/product/${productId}`}
      className="group product-card bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-gray-100">
          <img
            src={imgSrc}
            alt={product.name || "Product"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            onError={(e) => {
              e.target.src = "/placeholder-image.jpg";
            }}
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNewArrival && (
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
              NEW
            </span>
          )}
          {product.onSale && (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full shadow-lg">
              SALE
            </span>
          )}
          {inCart && (
            <span className="px-3 py-1 bg-purple-500 text-white text-xs font-bold rounded-full shadow-lg">
              IN CART
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToWishlist}
            className={`p-2.5 bg-white rounded-full shadow-lg transition-colors ${
              inWishlist
                ? "text-rose-500 hover:bg-rose-50"
                : "text-gray-700 hover:text-rose-500 hover:bg-rose-50"
            }`}
            title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
          </button>
          <button
            onClick={handleAddToCart}
            className={`p-2.5 bg-white rounded-full shadow-lg transition-colors ${
              inCart
                ? "text-purple-600 hover:bg-purple-50"
                : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Quick View - Optional */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button className="w-full py-2 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Quick View
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center flex-shrink-0">
            <span className="ml-1 text-sm font-medium text-gray-700">
              {rating.toFixed(1)}
            </span>
            <Star className="w-4 h-4 text-amber-400 fill-current" />
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors line-clamp-1">
          {product.name || "Product"}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {price.toFixed(3)} TND
            </span>
            {originalPrice > price && (
              <span className="text-lg text-gray-400 line-through">
                {originalPrice.toFixed(3)} TND
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2.5 rounded-lg transition-all duration-300 ${
              inCart
                ? "bg-purple-600 text-white hover:bg-purple-700"
                : "bg-gray-100 hover:bg-purple-600 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="mt-3 flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${
                product.stock > 0 ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span
              className={`text-xs ${
                product.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>
        )}

        {/* Wishlist Status */}
        {inWishlist && (
          <div className="mt-2 flex items-center gap-2 text-sm text-rose-600">
            <Heart className="w-4 h-4 fill-current" />
            <span>In your wishlist</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
