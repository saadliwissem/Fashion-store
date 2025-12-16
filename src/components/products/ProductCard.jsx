import React from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import toast from "react-hot-toast";

const ProductCard = ({ product, viewMode = "grid" }) => {
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  if (viewMode === "list") {
    return (
      <Link
        to={`/product/${product.id}`}
        className="group flex gap-6 bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300"
      >
        {/* Product Image */}
        <div className="flex-shrink-0 w-48 h-48 rounded-xl overflow-hidden bg-gray-100">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-gray-500 uppercase">
                  {product.category}
                </span>
                {product.isNew && <span className="badge badge-new">NEW</span>}
                {product.isSale && (
                  <span className="badge badge-sale">SALE</span>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-purple-600">
                {product.name}
              </h3>

              <p className="text-gray-600 mb-4 line-clamp-2">
                {product.description ||
                  "Premium quality product with excellent design and comfort."}
              </p>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-amber-400 fill-current" />
                  <span className="ml-1 text-sm font-medium">
                    {product.rating || 4.5}
                  </span>
                </div>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Free Shipping</span>
              </div>
            </div>

            {/* Price & Actions */}
            <div className="text-right">
              <div className="mb-4">
                <span className="text-2xl font-bold text-gray-900">
                  {product.price.toFixed(2)} TND
                </span>
                {product.originalPrice && (
                  <div className="text-lg text-gray-400 line-through">
                    {product.originalPrice.toFixed(2)} TND
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleAddToWishlist}
                  className={`p-2 rounded-lg transition-colors ${
                    isInWishlist(product.id)
                      ? "bg-rose-50 text-rose-500"
                      : "text-gray-600 hover:bg-rose-50 hover:text-rose-500"
                  }`}
                  title={
                    isInWishlist(product.id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`w-5 h-5 ${
                      isInWishlist(product.id) ? "fill-current" : ""
                    }`}
                  />
                </button>
                <button
                  onClick={handleAddToCart}
                  className={`p-2 rounded-lg transition-colors ${
                    isInCart(product.id)
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
    <Link to={`/product/${product.id}`} className="group product-card">
      <div className="relative overflow-hidden">
        {/* Product Image */}
        <div className="aspect-square overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isNew && <span className="badge badge-new">NEW</span>}
          {product.isSale && <span className="badge badge-sale">SALE</span>}
          {isInCart(product.id) && (
            <span className="badge badge-popular">IN CART</span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToWishlist}
            className={`p-2 bg-white rounded-full shadow-lg transition-colors ${
              isInWishlist(product.id)
                ? "text-rose-500 hover:bg-rose-50"
                : "text-gray-700 hover:text-rose-500 hover:bg-rose-50"
            }`}
            title={
              isInWishlist(product.id)
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <Heart
              className={`w-5 h-5 ${
                isInWishlist(product.id) ? "fill-current" : ""
              }`}
            />
          </button>
          <button
            onClick={handleAddToCart}
            className={`p-2 bg-white rounded-full shadow-lg transition-colors ${
              isInCart(product.id)
                ? "text-purple-600 hover:bg-purple-50"
                : "text-gray-700 hover:text-purple-600 hover:bg-purple-50"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
            {product.category}
          </span>
          <div className="flex items-center">
            <Star className="w-4 h-4 text-amber-400 fill-current" />
            <span className="ml-1 text-sm font-medium">
              {product.rating || 4.5}
            </span>
          </div>
        </div>

        <h3 className="text-lg font-semibold mb-2 group-hover:text-purple-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {product.price.toFixed(2)} TND
            </span>
            {product.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                {product.originalPrice.toFixed(2)} TND
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className={`p-2 rounded-lg transition-all duration-300 group-hover:scale-110 ${
              isInCart(product.id)
                ? "bg-purple-600 text-white"
                : "bg-gray-100 hover:bg-purple-600 hover:text-white"
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>

        {/* Wishlist Status */}
        {isInWishlist(product.id) && (
          <div className="mt-3 flex items-center gap-2 text-sm text-rose-600">
            <Heart className="w-4 h-4 fill-current" />
            <span>In your wishlist</span>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
