import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ChevronRight,
  Loader2,
  ShoppingCart,
} from "lucide-react";
import Button from "../components/common/Button";
import toast from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const ProductDetails = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToCart: addToCartContext } = useCart();
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addingToCart, setAddingToCart] = useState(false);
  const [inventory, setInventory] = useState(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [availableColors, setAvailableColors] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);

  // Fetch product details
  useEffect(() => {
    fetchProductDetails();
  }, [id, slug]);

  useEffect(() => {
    if (product) {
      fetchProductInventory();
    }
  }, [product]);

  useEffect(() => {
    if (inventory?.variants?.length > 0) {
      extractVariantOptions();
      setDefaultSelections();
    }
  }, [inventory]);

  const fetchProductInventory = async () => {
    if (!product?._id) return;

    setInventoryLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/product/${product._id}`
      );
      setInventory(response.data);

      console.log("Inventory loaded:", response.data);
    } catch (err) {
      console.error("Error fetching inventory:", err);
      // If endpoint doesn't exist, use fallback
      setInventory({
        variants: [],
        summary: { totalStock: 0 },
      });
    } finally {
      setInventoryLoading(false);
    }
  };

  const extractVariantOptions = () => {
    if (!inventory?.variants) return;

    const colorsSet = new Set();
    const sizesSet = new Set();

    inventory.variants.forEach((variant) => {
      if (variant.color) colorsSet.add(variant.color);
      if (variant.size) sizesSet.add(variant.size);
    });

    setAvailableColors(Array.from(colorsSet));
    setAvailableSizes(Array.from(sizesSet));
  };

  const setDefaultSelections = () => {
    if (inventory?.variants?.length > 0) {
      const firstVariant = inventory.variants[0];

      if (firstVariant.color && !selectedColor) {
        setSelectedColor(firstVariant.color);
      }
      if (firstVariant.size && !selectedSize) {
        setSelectedSize(firstVariant.size);
      }
    }
  };

  const getSelectedVariant = () => {
    if (!inventory?.variants) return null;

    return inventory.variants.find((variant) => {
      const matchesColor = !selectedColor || variant.color === selectedColor;
      const matchesSize = !selectedSize || variant.size === selectedSize;

      // If both color and size are selected, match both
      if (selectedColor && selectedSize) {
        return variant.color === selectedColor && variant.size === selectedSize;
      }

      // If only color is selected, match color
      if (selectedColor && !selectedSize) {
        return variant.color === selectedColor;
      }

      // If only size is selected, match size
      if (!selectedColor && selectedSize) {
        return variant.size === selectedSize;
      }

      // If neither is selected, return first variant
      return matchesColor && matchesSize;
    });
  };

  const getCurrentStock = () => {
    const variant = getSelectedVariant();

    if (variant) {
      return variant.currentStock || 0;
    }

    // For products without variants
    return inventory?.summary?.totalStock || 0;
  };

  const getStockStatus = () => {
    const stock = getCurrentStock();
    if (stock > 0) {
      const variant = getSelectedVariant();
      return variant?.status || "in-stock";
    }
    return "out-of-stock";
  };

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      let productData;

      // Try to fetch by slug first, then by ID
      if (slug) {
        const response = await axios.get(
          `${API_BASE_URL}/products/slug/${slug}`
        );
        productData = response.data;
      } else if (id) {
        const response = await axios.get(`${API_BASE_URL}/products/${id}`);
        productData = response.data;
      } else {
        throw new Error("No product identifier provided");
      }

      setProduct(productData.product || productData);

      // Fetch reviews
      fetchProductReviews(productData.product?._id || productData._id);

      // Fetch related products (by category)
      const categorySlug =
        productData.product?.category?.slug ||
        productData.category?.slug ||
        productData.category;
      fetchRelatedProducts(categorySlug);
    } catch (err) {
      console.error("Error fetching product details:", err);
      setError(err.response?.data?.message || "Failed to load product details");
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (productId) => {
    if (!productId) return;

    try {
      const response = await axios.get(
        `${API_BASE_URL}/reviews/product/${productId}`
      );
      setReviews(response.data.reviews || response.data || []);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchRelatedProducts = async (category) => {
    if (!category) return;

    try {
      const response = await axios.get(`${API_BASE_URL}/products`, {
        params: {
          category: category,
          limit: 3,
        },
      });
      setRelatedProducts(
        response.data.products || response.data.slice(0, 3) || []
      );
    } catch (err) {
      console.error("Error fetching related products:", err);
    }
  };

  const handleAddToCart = async () => {
    if (!product || !inventory) return;

    const variant = getSelectedVariant();
    const availableStock = getCurrentStock();

    if (availableStock < quantity) {
      toast.error(`Only ${availableStock} units available in stock`);
      return;
    }

    setAddingToCart(true);
    try {
      const cartItem = {
        productId: product._id,
        inventoryId: variant?.id,
        product,
        quantity,
        color: selectedColor,
        size: selectedSize,
      };

      // If using CartContext
      if (addToCartContext) {
        addToCartContext(product, quantity, selectedColor, selectedSize);
        toast.success(`Added ${quantity} ${product.name} to cart!`);
      } else {
        // Direct API call if context not available
        await axios.post(`${API_BASE_URL}/cart/add`, cartItem, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        toast.success(`Added ${quantity} ${product.name} to cart!`);
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      const errorMsg = err.response?.data?.message || "Failed to add to cart";
      toast.error(errorMsg);

      // If unauthorized, redirect to login
      if (err.response?.status === 401) {
        navigate("/login", { state: { from: `/product/${product._id}` } });
      }
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    navigate("/cart");
  };

  const handleAddToWishlist = async () => {
    if (!product) return;

    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        toast.success("Removed from wishlist");
      } else {
        await addToWishlist(product);
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: product?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const calculateDiscountPercentage = () => {
    if (!product?.originalPrice || !product?.price) return 0;
    return Math.round(
      ((product.originalPrice - product.price) / product.originalPrice) * 100
    );
  };

  const renderStockStatus = () => {
    if (inventoryLoading) {
      return (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Checking stock...</span>
        </div>
      );
    }

    const stock = getCurrentStock();
    const status = getStockStatus();

    if (stock <= 0) {
      return (
        <div className="flex items-center gap-2 text-red-600">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span>Out of Stock</span>
        </div>
      );
    }

    if (status === "low-stock") {
      return (
        <div className="flex items-center gap-2 text-amber-600">
          <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
          <span>Low Stock ({stock} available)</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 text-green-600">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>In Stock ({stock} available)</span>
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen py-8 fade-in">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen py-8 fade-in">
        <div className="container mx-auto px-4">
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Product Not Found
            </h3>
            <p className="text-gray-600 mb-6">
              {error || "The product you're looking for doesn't exist."}
            </p>
            <Button onClick={() => navigate("/shop")}>Browse Products</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 fade-in">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => navigate("/")}
            className="hover:text-purple-600"
          >
            Home
          </button>
          <span>/</span>
          <button
            onClick={() => navigate("/shop")}
            className="hover:text-purple-600"
          >
            Shop
          </button>
          {product.category && (
            <>
              <span>/</span>
              <button
                onClick={() =>
                  navigate(
                    `/shop?category=${
                      product.category.slug || product.category
                    }`
                  )
                }
                className="hover:text-purple-600 capitalize"
              >
                {product.category.name || product.category}
              </button>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900 font-medium truncate">
            {product.name}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={
                  product.images?.[selectedImage] ||
                  product.image ||
                  "/placeholder.jpg"
                }
                alt={product.name}
                className="w-full h-auto object-cover"
              />
              <button
                onClick={handleAddToWishlist}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isInWishlist(product._id)
                    ? "bg-rose-50 text-rose-500"
                    : "bg-white/80 backdrop-blur-sm hover:bg-white"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(product._id) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {(product.images || []).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden ${
                    selectedImage === index
                      ? "ring-2 ring-purple-500"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                {product.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full capitalize"
                  >
                    {tag}
                  </span>
                ))}
                {product.isNewArrival && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    New Arrival
                  </span>
                )}
                {product.onSale && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    On Sale
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < (product.averageRating || 0)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.averageRating || 0} ({reviews.length} reviews)
                  </span>
                </div>
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 text-gray-600 hover:text-purple-600"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <>
                      <span className="text-2xl text-gray-400 line-through">
                        ${product.originalPrice.toFixed(2)}
                      </span>
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-full">
                        Save {calculateDiscountPercentage()}%
                      </span>
                    </>
                  )}
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4">Color</h3>
                <div className="flex gap-3">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-colors ${
                        selectedColor === color
                          ? "bg-purple-50 border border-purple-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full border border-gray-300"
                        style={{
                          backgroundColor:
                            color.toLowerCase() === "blue"
                              ? "#3b82f6"
                              : color.toLowerCase() === "red"
                              ? "#ef4444"
                              : color.toLowerCase() === "green"
                              ? "#10b981"
                              : color.toLowerCase() === "black"
                              ? "#000000"
                              : color.toLowerCase() === "white"
                              ? "#ffffff"
                              : "#ccc",
                        }}
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {color}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Size</h3>
                  <button className="text-sm text-purple-600 hover:text-purple-700">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-16 h-12 flex items-center justify-center border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? "border-purple-600 bg-purple-50 text-purple-700"
                          : "border-gray-300 hover:border-purple-500 hover:bg-purple-50"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="mb-6">{renderStockStatus()}</div>

            {/* Quantity & Actions */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-purple-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    disabled={getCurrentStock() <= 0}
                  >
                    -
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() =>
                      setQuantity(Math.min(getCurrentStock(), quantity + 1))
                    }
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-purple-600 disabled:text-gray-400 disabled:cursor-not-allowed"
                    disabled={
                      getCurrentStock() <= 0 || quantity >= getCurrentStock()
                    }
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <Button
                    onClick={handleAddToCart}
                    className="flex-1"
                    disabled={
                      getCurrentStock() <= 0 || addingToCart || inventoryLoading
                    }
                  >
                    {addingToCart ? (
                      <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                    ) : inventoryLoading ? (
                      "Checking Stock..."
                    ) : getCurrentStock() > 0 ? (
                      "Add to Cart"
                    ) : (
                      "Out of Stock"
                    )}
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="secondary"
                    className="flex-1"
                    disabled={
                      getCurrentStock() <= 0 || addingToCart || inventoryLoading
                    }
                  >
                    Buy Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Truck className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold">Free Shipping</p>
                  <p className="text-sm text-gray-600">On orders over $99</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <Shield className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold">2-Year Warranty</p>
                  <p className="text-sm text-gray-600">Quality guarantee</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <RefreshCw className="w-6 h-6 text-purple-600" />
                <div>
                  <p className="font-semibold">Easy Returns</p>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="font-semibold text-gray-900 mb-4">
                Product Details
              </h3>
              <ul className="space-y-2">
                {product.specifications && (
                  <>
                    {product.specifications.material && (
                      <li className="flex items-center gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Material: {product.specifications.material}
                      </li>
                    )}
                    {product.specifications.care && (
                      <li className="flex items-center gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                        Care: {product.specifications.care}
                      </li>
                    )}
                  </>
                )}
                <li className="flex items-center gap-2 text-gray-600">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                  Category: {product.category?.name || product.category}
                </li>
                {product.sku && (
                  <li className="flex items-center gap-2 text-gray-600">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    SKU: {product.sku}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Related Products
              </h2>
              <button
                onClick={() =>
                  navigate(
                    `/shop?category=${
                      product.category?.slug || product.category
                    }`
                  )
                }
                className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <div
                  key={relatedProduct._id}
                  className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer"
                  onClick={() =>
                    navigate(
                      `/product/${relatedProduct.slug || relatedProduct._id}`
                    )
                  }
                >
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={
                        relatedProduct.images?.[0] ||
                        relatedProduct.image ||
                        "/placeholder.jpg"
                      }
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold text-gray-900">
                        ${relatedProduct.price?.toFixed(2) || "0.00"}
                      </span>
                      <button
                        className="p-2 bg-gray-100 hover:bg-purple-600 hover:text-white rounded-lg transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToWishlist();
                        }}
                      >
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
