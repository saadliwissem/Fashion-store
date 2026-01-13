import React, { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import logo from "../../assets/images/logo.webp";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [featuredCategories, setFeaturedCategories] = useState([]);
  const navigate = useNavigate();

  const { user, logout, isAuthenticated } = useAuth();
  const { cart, cartTotal } = useCart();
  const { getWishlistCount } = useWishlist();

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchFeaturedCategories();
  }, []);

  const fetchCategories = async () => {
    setLoadingCategories(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      // Transform categories for the dropdown
      const transformedCategories = response.data.categories.map(
        (category) => ({
          id: category._id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          productCount: category.productCount || 0,
          icon: category.icon || getCategoryIcon(category.name),
        })
      );

      setCategories(transformedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Fallback to static categories if API fails
      setCategories(getStaticCategories());
    } finally {
      setLoadingCategories(false);
    }
  };

  const fetchFeaturedCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories/featured`);
      // Transform featured categories for the mobile menu
      const transformedFeatured = response.data.categories.map((category) => ({
        id: category._id,
        name: category.name,
        slug: category.slug,
        productCount: category.productCount || 0,
      }));

      setFeaturedCategories(transformedFeatured);
    } catch (err) {
      console.error("Error fetching featured categories:", err);
      // Use regular categories as fallback for featured
      if (categories.length > 0) {
        setFeaturedCategories(categories.slice(0, 4));
      }
    }
  };

  // Helper function to get category icon based on name
  const getCategoryIcon = (categoryName) => {
    const icons = {
      men: "👔",
      women: "👗",
      kids: "👶",
      accessories: "💎",
      electronics: "📱",
      home: "🏠",
      sports: "⚽",
      beauty: "💄",
    };

    const lowerName = categoryName.toLowerCase();
    for (const [key, icon] of Object.entries(icons)) {
      if (lowerName.includes(key)) return icon;
    }
    return "🛒";
  };

  // Static fallback categories
  const getStaticCategories = () => {
    return [
      {
        id: "new",
        name: "New Arrivals",
        slug: "new",
        productCount: 0,
        icon: "🆕",
      },
      { id: "men", name: "Men's", slug: "men", productCount: 0, icon: "👔" },
      {
        id: "women",
        name: "Women's",
        slug: "women",
        productCount: 0,
        icon: "👗",
      },
      { id: "kids", name: "Kids", slug: "kids", productCount: 0, icon: "👶" },
      {
        id: "accessories",
        name: "Accessories",
        slug: "accessories",
        productCount: 0,
        icon: "💎",
      },
    ];
  };

  // Calculate total items in cart
  const getTotalCartItems = () => {
    if (!cart || !Array.isArray(cart) || cart.length === 0) return 0;

    // If cartTotal has quantity already calculated, use it
    if (cartTotal && cartTotal.quantity !== undefined) {
      return cartTotal.quantity;
    }

    // Otherwise calculate manually
    return cart.reduce((total, item) => {
      return total + (item.quantity || 1);
    }, 0);
  };

  // Handle category click
  const handleCategoryClick = (categorySlug) => {
    if (categorySlug === "new") {
      navigate("/shop?sort=newest");
    } else {
      navigate(`/shop?category=${categorySlug}`);
    }
    setIsMenuOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Loading state for categories dropdown
  const renderCategoriesDropdown = () => (
    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 max-h-96 overflow-y-auto">
      {loadingCategories ? (
        <div className="px-6 py-8 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-[#C9A24D] animate-spin" />
          <span className="ml-2 text-gray-600">Loading categories...</span>
        </div>
      ) : categories.length === 0 ? (
        <div className="px-6 py-4 text-gray-500 text-center">
          No categories found
        </div>
      ) : (
        <>
          {/* All Products */}
          <Link
            to="/shop"
            className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors first:rounded-t-2xl border-b border-gray-100"
            onClick={() => setIsUserDropdownOpen(false)}
          >
            <span className="text-xl">🛍️</span>
            <div className="flex-1">
              <span className="font-medium">All Products</span>
              <p className="text-xs text-gray-500 mt-1">
                Browse our entire collection
              </p>
            </div>
          </Link>

          {/* Dynamic Categories */}
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/shop?category=${category.slug}`}
              className="flex items-center gap-3 px-6 py-4 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors last:rounded-b-2xl"
              onClick={() => setIsUserDropdownOpen(false)}
            >
              <span className="text-xl">{category.icon}</span>
              <div className="flex-1">
                <span className="font-medium">{category.name}</span>
                {category.productCount > 0 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {category.productCount} products
                  </p>
                )}
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Link>
          ))}
        </>
      )}
    </div>
  );

  // Mobile categories list
  const renderMobileCategories = () => {
    const categoriesToShow =
      featuredCategories.length > 0
        ? featuredCategories
        : categories.slice(0, 6);

    return (
      <div className="space-y-2">
        <p className="font-semibold text-gray-700 mb-2">Categories</p>
        {loadingCategories ? (
          <div className="flex items-center justify-center py-4">
            <Loader2 className="w-5 h-5 text-[#C9A24D] animate-spin" />
          </div>
        ) : (
          <>
            <Link
              to="/shop"
              className="flex items-center gap-2 py-3 text-gray-600 hover:text-[#C9A24D] transition-colors border-b border-gray-100"
              onClick={() => setIsMenuOpen(false)}
            >
              <span>🛍️</span>
              <span>All Products</span>
            </Link>

            {categoriesToShow.map((category) => (
              <Link
                key={category.id}
                to={`/shop?category=${category.slug}`}
                className="flex items-center gap-2 py-3 text-gray-600 hover:text-[#C9A24D] transition-colors border-b border-gray-100 last:border-b-0"
                onClick={() => setIsMenuOpen(false)}
              >
                <span>{getCategoryIcon(category.name)}</span>
                <span>{category.name}</span>
                {category.productCount > 0 && (
                  <span className="ml-auto text-xs text-gray-500">
                    ({category.productCount})
                  </span>
                )}
              </Link>
            ))}

            {categories.length > 6 && (
              <Link
                to="/categories"
                className="block py-3 text-[#C9A24D] hover:text-[#C9A24D] transition-colors font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                View All Categories →
              </Link>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-20 h-20 rounded-xl overflow-hidden flex items-center justify-center">
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
              {renderCategoriesDropdown()}
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
                className="nav-link text-[#C9A24D] font-semibold"
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
                <span className="absolute -top-1 -right-1 bg-[#FAF6E8] text-white text-xs min-w-5 h-5 rounded-full flex items-center justify-center px-1">
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
                        className="block px-6 py-3 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors"
                      >
                        Profile
                      </Link>
                      <Link
                        to="/orders"
                        className="block px-6 py-3 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors"
                      >
                        My Orders
                      </Link>
                      <Link
                        to="/wishlist"
                        className="block px-6 py-3 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors"
                      >
                        Wishlist ({getWishlistCount()})
                      </Link>
                      <Link
                        to="/cart"
                        className="block px-6 py-3 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors"
                      >
                        Cart ({getTotalCartItems()})
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
                        className="block px-6 py-3 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors"
                        onClick={() => setIsUserDropdownOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block px-6 py-3 text-gray-700 hover:bg-[#FAF6E8] hover:text-[#C9A24D] transition-colors"
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
                className="nav-link py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/shop"
                className="nav-link py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop All
              </Link>

              {renderMobileCategories()}

              <Link
                to="/about"
                className="nav-link py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="nav-link py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>

              {user?.role === "admin" && (
                <Link
                  to="/admin"
                  className="nav-link py-2 text-[#C9A24D] font-semibold"
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
