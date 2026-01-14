import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingBag,
  Trash2,
  Eye,
  Share2,
  Filter,
  Grid,
  List,
} from "lucide-react";
import Button from "../components/common/Button";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Wishlist = () => {
  const { wishlist, removeFromWishlist, clearWishlist, loading } =
    useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState("grid");
  const [selectedItems, setSelectedItems] = useState([]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h1>
            <p className="text-gray-600 mb-8">
              Please sign in to view and manage your wishlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button>Sign In</Button>
              </Link>
              <Link to="/register">
                <Button variant="outline">Create Account</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-screen py-16 fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-neutral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-primary-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Your Wishlist is Empty
            </h1>
            <p className="text-gray-600 mb-8">
              Save items you love to your wishlist. Review them anytime and
              easily move to cart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button>Start Shopping</Button>
              </Link>
              <Link to="/shop?category=new">
                <Button variant="outline">View New Arrivals</Button>
              </Link>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Popular Items You Might Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="group">
                  <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden mb-3">
                    <div className="w-full h-full group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                    Popular Item {i}
                  </h3>
                  <p className="text-gray-600">
                    ${(39.99 + i * 10).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = (product) => {
    addToCart(product);
    toast.success(`Added ${product.name} to cart!`);
  };

  const handleAddSelectedToCart = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to add to cart");
      return;
    }

    selectedItems.forEach((itemId) => {
      const product = wishlist.find((item) => item.id === itemId);
      if (product) {
        addToCart(product);
      }
    });

    toast.success(`Added ${selectedItems.length} items to cart!`);
    setSelectedItems([]);
  };

  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to remove");
      return;
    }

    selectedItems.forEach((itemId) => {
      removeFromWishlist(itemId);
    });

    toast.success(`Removed ${selectedItems.length} items from wishlist`);
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map((item) => item.id));
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  return (
    <div className="min-h-screen py-8 fade-in">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                My Wishlist
              </h1>
              <p className="text-gray-600">
                {wishlist.length} item{wishlist.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={clearWishlist}
                disabled={loading || wishlist.length === 0}
                className="text-rose-600 hover:text-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Clear All
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mb-6 p-4 bg-gradient-to-r from-primary-50 to-neutral-50 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary-600 text-white rounded-lg flex items-center justify-center">
                  {selectedItems.length}
                </div>
                <span className="font-medium text-gray-900">
                  {selectedItems.length} item
                  {selectedItems.length !== 1 ? "s" : ""} selected
                </span>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAddSelectedToCart}
                  size="small"
                  disabled={loading}
                >
                  Add Selected to Cart
                </Button>
                <Button
                  onClick={handleRemoveSelected}
                  variant="outline"
                  size="small"
                  disabled={loading}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50"
                >
                  Remove Selected
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              {/* Sort Options */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">Sort By</h3>
                <div className="space-y-2">
                  {[
                    "Recently Added",
                    "Price: Low to High",
                    "Price: High to Low",
                    "Popularity",
                  ].map((option) => (
                    <button
                      key={option}
                      className="block w-full text-left p-2 rounded-lg hover:bg-gray-50"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* View Mode */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">View</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg ${
                      viewMode === "grid"
                        ? "bg-primary-100 text-primary-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg ${
                      viewMode === "list"
                        ? "bg-primary-100 text-primary-600"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Categories */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                <div className="space-y-2">
                  {[
                    "All",
                    "Men's",
                    "Women's",
                    "Accessories",
                    "New Arrivals",
                  ].map((category) => (
                    <button
                      key={category}
                      className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-gray-50"
                    >
                      <span>{category}</span>
                      <span className="text-sm text-gray-500">
                        ({Math.floor(Math.random() * 20)})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Select All */}
              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-primary-600 hover:text-primary-700"
                >
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === wishlist.length &&
                      wishlist.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  Select All Items
                </button>
              </div>
            </div>
          </div>

          {/* Wishlist Items */}
          <div className="lg:col-span-3">
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-6"
              }
            >
              {wishlist.map((item) => (
                <div
                  key={item.id}
                  className={`group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${
                    selectedItems.includes(item.id)
                      ? "ring-2 ring-primary-500"
                      : ""
                  }`}
                >
                  {/* Item Header */}
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-500">
                          Added {new Date(item.addedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <button
                        onClick={() => removeFromWishlist(item.id)}
                        disabled={loading}
                        className="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Content */}
                  <div className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <Link
                        to={`/product/${item.id}`}
                        className="flex-shrink-0"
                      >
                        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                          )}
                        </div>
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <Link to={`/product/${item.id}`}>
                          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors truncate">
                            {item.name}
                          </h3>
                        </Link>

                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span>Category:</span>
                            <span className="font-medium">
                              {item.category || "General"}
                            </span>
                          </div>
                          {item.rating && (
                            <div className="flex items-center gap-1 text-sm">
                              <span className="text-amber-500">★</span>
                              <span className="font-medium">{item.rating}</span>
                              <span className="text-gray-500">/ 5.0</span>
                            </div>
                          )}
                        </div>

                        {/* Price */}
                        <div className="mt-4 flex items-center justify-between">
                          <div>
                            <span className="text-xl font-bold text-gray-900">
                              ${item.price.toFixed(2)}
                            </span>
                            {item.originalPrice && (
                              <span className="ml-2 text-sm text-gray-400 line-through">
                                ${item.originalPrice.toFixed(2)}
                              </span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex gap-2">
                            <Link to={`/product/${item.id}`}>
                              <button className="p-2 text-gray-600 hover:text-primary-600 hover:bg-purple-50 rounded-lg">
                                <Eye className="w-5 h-5" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleAddToCart(item)}
                              disabled={loading}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg"
                              title="Add to cart"
                            >
                              <ShoppingBag className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Availability Badge */}
                  <div className="px-6 pb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-green-600 font-medium">
                        In Stock
                      </span>
                      <button className="text-primary-600 hover:text-primary-700 font-medium">
                        Notify when on sale
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                  &lt;
                </button>
                {[1].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                      page === 1
                        ? "bg-primary-600 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                  &gt;
                </button>
              </nav>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-primary-50 to-neutral-50 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {wishlist.length}
                    </p>
                    <p className="text-sm text-gray-600">Items in Wishlist</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      $
                      {wishlist
                        .reduce((sum, item) => sum + item.price, 0)
                        .toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">Total Value</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                    <div className="text-2xl">🎁</div>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {wishlist.filter((item) => item.originalPrice).length}
                    </p>
                    <p className="text-sm text-gray-600">Items on Sale</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
