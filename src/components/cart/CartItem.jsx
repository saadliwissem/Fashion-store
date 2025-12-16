import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, Heart, Loader2 } from "lucide-react";

const CartItem = ({
  Globalitem,
  onUpdateQuantity,
  onRemove,
  onMoveToWishlist,
  isUpdating = false,
}) => {
  // Extract data from Globalitem based on your cart structure
  const item = Globalitem.product || Globalitem;
  const itemId = Globalitem._id || Globalitem.id; // This is the cart item ID
  const productId = item._id || item.id; // This is the product ID
  const quantity = Globalitem.quantity || 1;
  const selectedSize = Globalitem.selectedSize || item.size;
  const selectedColor = Globalitem.selectedColor || item.color;

  const price = item.price || 0;
  const itemTotal = price * quantity;

  // Handle null/undefined values
  if (!item) {
    return (
      <div className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
        <div className="text-center text-gray-500 py-4">
          Item information unavailable
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
      {/* {isUpdating && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
        </div>
      )} */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-5">
          <div className="flex gap-4">
            <Link to={`/product/${productId}`} className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                {item.images && item.images[0] ? (
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
            </Link>

            <div className="flex-1">
              <Link to={`/product/${productId}`}>
                <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                  {item.name || "Unnamed Product"}
                </h3>
              </Link>

              <div className="mt-2 space-y-1">
                {selectedSize && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Size:</span>
                    <span className="font-medium">{selectedSize}</span>
                  </div>
                )}
                {selectedColor && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Color:</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            typeof selectedColor === "string" &&
                            selectedColor.startsWith("#")
                              ? selectedColor
                              : "#ccc",
                        }}
                      />
                      <span className="font-medium">{selectedColor}</span>
                    </div>
                  </div>
                )}
                {item.inStock === false && (
                  <div className="text-sm text-amber-600">⚠️ Out of stock</div>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center gap-4 mt-4 md:hidden">
                <div className="text-lg font-bold text-gray-900">
                  ${itemTotal.toFixed(2)}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      onMoveToWishlist && onMoveToWishlist(Globalitem)
                    }
                    className="p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                    title="Move to wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemove && onRemove(itemId)}
                    className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price - Desktop */}
        <div className="hidden md:block col-span-2 text-center">
          <span className="text-gray-900 font-medium">${price.toFixed(2)}</span>
          {item.originalPrice && (
            <div className="text-sm text-gray-400 line-through">
              ${item.originalPrice.toFixed(2)}
            </div>
          )}
        </div>

        {/* Quantity */}
        <div className="col-span-3">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center border border-gray-300 rounded-xl">
              <button
                onClick={() =>
                  !isUpdating &&
                  onUpdateQuantity &&
                  onUpdateQuantity(itemId, quantity - 1)
                }
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
              </button>
              <span className="w-10 h-10 flex items-center justify-center font-semibold">
                {quantity}
              </span>
              <button
                onClick={() =>
                  !isUpdating &&
                  onUpdateQuantity &&
                  onUpdateQuantity(itemId, quantity + 1)
                }
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-purple-600"
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Wishlist Button - Desktop */}
            <button
              onClick={() =>
                !isUpdating && onMoveToWishlist && onMoveToWishlist(Globalitem)
              }
              className="hidden md:block p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
              title="Move to wishlist"
              disabled={isUpdating}
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {item.inStock === false && (
            <div className="mt-2 text-center">
              <span className="text-sm text-amber-600 bg-amber-50 px-2 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Total - Desktop */}
        <div className="hidden md:block col-span-2 text-center">
          <span className="text-xl font-bold text-gray-900">
            ${itemTotal.toFixed(2)}
          </span>
          {quantity > 1 && (
            <div className="text-sm text-gray-500">
              ${price.toFixed(2)} × {quantity}
            </div>
          )}
        </div>

        {/* Remove - Desktop */}
        <div className="hidden md:block col-span-1 text-center">
          <button
            onClick={() => !isUpdating && onRemove && onRemove(itemId)}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove item"
            disabled={isUpdating}
          >
            {isUpdating ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
