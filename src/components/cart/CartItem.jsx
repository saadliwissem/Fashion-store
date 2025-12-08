import React from "react";
import { Link } from "react-router-dom";
import { Trash2, Plus, Minus, Heart } from "lucide-react";
const CartItem = ({ item, onUpdateQuantity, onRemove, onMoveToWishlist }) => {
  const itemTotal = item.price * item.quantity;
  return (
    <div className="p-4 md:p-6 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="col-span-5">
          <div className="flex gap-4">
            <Link to={`/product/${item.id}`} className="flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-gray-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                )}
              </div>
            </Link>

            <div className="flex-1">
              <Link to={`/product/${item.id}`}>
                <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                  {item.name}
                </h3>
              </Link>

              <div className="mt-2 space-y-1">
                {item.size && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Size:</span>
                    <span className="font-medium">{item.size}</span>
                  </div>
                )}
                {item.color && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span>Color:</span>
                    <div className="flex items-center gap-1">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="font-medium">{item.color}</span>
                    </div>
                  </div>
                )}
                {!item.inStock && (
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
                    onClick={() => onMoveToWishlist(item)}
                    className="p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
                    title="Move to wishlist"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onRemove(item.id)}
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
          <span className="text-gray-900 font-medium">
            ${item.price.toFixed(2)}
          </span>
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
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={item.quantity <= 1}
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="w-10 h-10 flex items-center justify-center font-semibold">
                {item.quantity}
              </span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-purple-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Wishlist Button - Desktop */}
            <button
              onClick={() => onMoveToWishlist(item)}
              className="hidden md:block p-2 text-gray-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg"
              title="Move to wishlist"
            >
              <Heart className="w-5 h-5" />
            </button>
          </div>

          {!item.inStock && (
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
          {item.quantity > 1 && (
            <div className="text-sm text-gray-500">
              ${item.price.toFixed(2)} × {item.quantity}
            </div>
          )}
        </div>

        {/* Remove - Desktop */}
        <div className="hidden md:block col-span-1 text-center">
          <button
            onClick={() => onRemove(item.id)}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove item"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
