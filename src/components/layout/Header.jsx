import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  ShoppingBag,
  User,
  Heart,
  Search,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import logo from "../../assets/images/logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout, isAuthenticated } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const { getWishlistCount } = useWishlist();

  // Helper function to check if a link is active
  const isActiveLink = (path) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  // Helper function to get the appropriate class for nav links
  const getNavLinkClass = (path) => {
    const isActive = isActiveLink(path);
    return `nav-link transition-colors ${
      isActive
        ? "text-[#C9A24D] font-semibold"
        : "text-gray-700 hover:text-[#C9A24D]"
    }`;
  };

  // Calculate total items in cart
  const getTotalCartItems = () => {
    if (!cart || !Array.isArray(cart) || cart.length === 0) return 0;

    if (cartTotal && cartTotal.quantity !== undefined) {
      return cartTotal.quantity;
    }

    return cart.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center">
              <img
                src={logo}
                alt="Dar Ennar Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-black to-[#C9A24D] bg-clip-text text-transparent">
              Puzzle
            </span>
          </Link>

          {/* Desktop Navigation - Removed Shop dropdown with categories */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getNavLinkClass("/")}>
              Home
            </Link>
            <Link to="/shop" className={getNavLinkClass("/shop")}>
              Shop
            </Link>
            <Link to="/mysteries" className={getNavLinkClass("/mysteries")}>
              Mysteries
            </Link>
            <Link to="/about" className={getNavLinkClass("/about")}>
              About
            </Link>
            <Link to="/contact" className={getNavLinkClass("/contact")}>
              Contact
            </Link>
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className={`nav-link transition-colors ${
                  isActiveLink("/admin")
                    ? "text-[#C9A24D] font-semibold"
                    : "text-[#C9A24D] hover:text-[#C9A24D]"
                }`}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.target.value.trim()) {
                  navigate(
                    `/search?q=${encodeURIComponent(e.target.value.trim())}`
                  );
                }
              }}
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <Heart className="w-6 h-6 text-gray-700 hover:text-rose-500 transition-colors" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {getWishlistCount() > 99 ? "99+" : getWishlistCount()}
                </span>
              )}
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="p-2 hover:bg-gray-100 rounded-xl transition-colors relative"
            >
              <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-[#C9A24D] transition-colors" />
              {getTotalCartItems() > 0 && (
                <span className="absolute -top-1 -right-1 bg-gray-200 text-red-600 text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1">
                  {getTotalCartItems() > 99 ? "99+" : getTotalCartItems()}
                </span>
              )}
            </button>

            {/* User Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors flex items-center space-x-2"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-black to-[#C9A24D] rounded-full flex items-center justify-center">
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
                        to="/profile"
                        className={`block px-6 py-3 transition-colors ${
                          isActiveLink("/profile")
                            ? "bg-[#FAF6E8] text-[#C9A24D]"
                            : "text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D]"
                        }`}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className={`block px-6 py-3 transition-colors ${
                          isActiveLink("/orders")
                            ? "bg-[#FAF6E8] text-[#C9A24D]"
                            : "text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D]"
                        }`}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className={`block px-6 py-3 transition-colors ${
                          isActiveLink("/wishlist")
                            ? "bg-[#FAF6E8] text-[#C9A24D]"
                            : "text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D]"
                        }`}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Wishlist ({getWishlistCount()})
                      </Link>
                      <Link
                        to="/cart"
                        className={`block px-6 py-3 transition-colors ${
                          isActiveLink("/cart")
                            ? "bg-[#FAF6E8] text-[#C9A24D]"
                            : "text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D]"
                        }`}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Cart ({getTotalCartItems()})
                      </Link>
                      <div className="border-t my-2"></div>
                      <button
                        onClick={() => {
                          logout();
                          clearCart();
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
                        className={`block px-6 py-3 transition-colors ${
                          isActiveLink("/login")
                            ? "bg-[#FAF6E8] text-[#C9A24D]"
                            : "text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D]"
                        }`}
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className={`block px-6 py-3 transition-colors ${
                          isActiveLink("/register")
                            ? "bg-[#FAF6E8] text-[#C9A24D]"
                            : "text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D]"
                        }`}
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

        {/* Mobile Menu - Removed categories section */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-100 slide-up">
            <div className="flex flex-col space-y-6">
              <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  className="ml-2 bg-transparent border-none outline-none w-full text-gray-700 placeholder-gray-400"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      navigate(
                        `/search?q=${encodeURIComponent(e.target.value.trim())}`
                      );
                      setIsMenuOpen(false);
                    }
                  }}
                />
              </div>

              <Link
                to="/"
                className={`nav-link py-2 transition-colors ${
                  isActiveLink("/")
                    ? "text-[#C9A24D] font-semibold"
                    : "text-gray-700 hover:text-[#C9A24D]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className={`nav-link py-2 transition-colors ${
                  isActiveLink("/shop")
                    ? "text-[#C9A24D] font-semibold"
                    : "text-gray-700 hover:text-[#C9A24D]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/mysteries"
                className={`nav-link py-2 transition-colors ${
                  isActiveLink("/mysteries")
                    ? "text-[#C9A24D] font-semibold"
                    : "text-gray-700 hover:text-[#C9A24D]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Mysteries
              </Link>
              <Link
                to="/about"
                className={`nav-link py-2 transition-colors ${
                  isActiveLink("/about")
                    ? "text-[#C9A24D] font-semibold"
                    : "text-gray-700 hover:text-[#C9A24D]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`nav-link py-2 transition-colors ${
                  isActiveLink("/contact")
                    ? "text-[#C9A24D] font-semibold"
                    : "text-gray-700 hover:text-[#C9A24D]"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`nav-link py-2 transition-colors ${
                    isActiveLink("/admin")
                      ? "text-[#C9A24D] font-semibold"
                      : "text-[#C9A24D] hover:text-[#C9A24D]"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
