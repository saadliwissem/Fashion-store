import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star,
  Heart,
  Share2,
  Truck,
  Shield,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../components/common/Button";
import toast from "react-hot-toast";
import { useWishlist } from "../context/WishlistContext";
const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("blue");
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mock product data - in real app, fetch from API
  const product = {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    description:
      "Experience ultimate comfort with our premium cotton t-shirt. Made from 100% organic cotton, this t-shirt offers exceptional softness and breathability. Perfect for everyday wear or casual outings.",
    category: "men",
    rating: 4.8,
    reviewCount: 124,
    tags: ["cotton", "organic", "casual", "best-seller"],
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=1000&fit=crop",
    ],
    colors: [
      { name: "Navy Blue", value: "#1e3a8a" },
      { name: "Charcoal Gray", value: "#374151" },
      { name: "Forest Green", value: "#065f46" },
      { name: "Burgundy", value: "#7f1d1d" },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    details: [
      "100% Organic Cotton",
      "Machine washable",
      "Slim fit design",
      "Made with sustainable materials",
      "Ethically produced",
    ],
  };

  const handleAddToCart = () => {
    toast.success(`Added ${quantity} ${product.name} to cart!`);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/cart");
  };
  const handleAddToWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.success("Removed from wishlist");
    } else {
      addToWishlist(product);
    }
  };
  const relatedProducts = [
    {
      id: 2,
      name: "Classic Polo Shirt",
      price: 34.99,
      image:
        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop",
    },
    {
      id: 3,
      name: "Casual Hoodie",
      price: 49.99,
      image:
        "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    },
    {
      id: 4,
      name: "Slim Fit Jeans",
      price: 59.99,
      image:
        "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    },
  ];

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
          <span>/</span>
          <button
            onClick={() => navigate(`/shop?category=${product.category}`)}
            className="hover:text-purple-600"
          >
            {product.category === "men" ? "Men's" : "Women's"}
          </button>
          <span>/</span>
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            <div className="relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-auto object-cover"
              />
              <button
                onClick={handleAddToWishlist}
                className={`absolute top-4 right-4 p-2 rounded-full transition-colors ${
                  isInWishlist(product.id)
                    ? "bg-rose-50 text-rose-500"
                    : "bg-white/80 backdrop-blur-sm hover:bg-white"
                }`}
              >
                <Heart
                  className={`w-5 h-5 ${
                    isInWishlist(product.id) ? "fill-current" : ""
                  }`}
                />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4">
              {product.images.map((img, index) => (
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
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full"
                  >
                    {tag}
                  </span>
                ))}
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
                        i < Math.floor(product.rating)
                          ? "text-amber-400 fill-amber-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviewCount} reviews)
                  </span>
                </div>
                <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <span className="text-4xl font-bold text-gray-900">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-400 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
                {product.originalPrice && (
                  <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-sm font-semibold rounded-full">
                    Save{" "}
                    {(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                      100
                    ).toFixed(0)}
                    %
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Color Selection */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Color</h3>
              <div className="flex gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name.toLowerCase())}
                    className={`flex flex-col items-center gap-2 p-2 rounded-lg ${
                      selectedColor === color.name.toLowerCase()
                        ? "bg-gray-100"
                        : ""
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full border border-gray-300"
                      style={{ backgroundColor: color.value }}
                    />
                    <span className="text-sm text-gray-600">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Size</h3>
                <button className="text-sm text-purple-600 hover:text-purple-700">
                  Size Guide
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-16 h-12 flex items-center justify-center border rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? "border-purple-600 bg-purple-50 text-purple-700"
                        : "border-gray-300 hover:border-purple-500"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-gray-300 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-purple-600"
                  >
                    -
                  </button>
                  <span className="w-12 h-12 flex items-center justify-center font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 hover:text-purple-600"
                  >
                    +
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <Button onClick={handleAddToCart} className="flex-1">
                    Add to Cart
                  </Button>
                  <Button
                    onClick={handleBuyNow}
                    variant="secondary"
                    className="flex-1"
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
                {product.details.map((detail, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-gray-600"
                  >
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16 pt-12 border-t border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Related Products
            </h2>
            <button className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              View All
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price.toFixed(2)}
                    </span>
                    <button className="p-2 bg-gray-100 hover:bg-purple-600 hover:text-white rounded-lg transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
