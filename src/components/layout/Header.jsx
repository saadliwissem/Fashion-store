import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Heart,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { cartTotal } = useCart();
  const { getWishlistCount } = useWishlist();
  const categories = [
    { name: "New Arrivals", path: "/shop?category=new" },
    { name: "Men", path: "/shop?category=men" },
    { name: "Women", path: "/shop?category=women" },
    { name: "Kids", path: "/shop?category=kids" },
    { name: "Accessories", path: "/shop?category=accessories" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              FashionStore
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="nav-link">
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="flex items-center space-x-1 nav-link">
                <span>Shop</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>

            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                onClick={() => setIsUserDropdownOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex items-center bg-gray-50 rounded-xl px-4 py-2 w-64">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="ml-2 bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/wishlist")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <Heart className="w-6 h-6 text-gray-700 hover:text-rose-500 transition-colors" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getWishlistCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-purple-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                2
              </span>
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-400 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
              </button>

              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl py-2 slide-up">
                  {isAuthenticated ? (
                    <>
                      <div className="px-6 py-3 border-b">
                        <p className="font-semibold text-gray-900">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/dashboard"
                        className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                      >
                        Wishlist
                      </Link>
                      <div className="border-t my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          setIsUserDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-6 py-3 text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-6 py-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Create Account
                      </Link>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100 slide-up">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="nav-link py-2">
                Home
              </Link>
              <Link to="/shop" className="nav-link py-2">
                Shop All
              </Link>
              <div className="space-y-2">
                <p className="font-semibold text-gray-700 mb-2">Categories</p>
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.path}
                    className="block py-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              <Link to="/about" className="nav-link py-2">
                About
              </Link>
              <Link to="/contact" className="nav-link py-2">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
