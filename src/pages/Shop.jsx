import React, { useState } from "react";
import { Filter, Grid, List, ChevronDown, X } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import ProductFilter from "../components/products/ProductFilter";
import Button from "../components/common/Button";

// Mock products data
const products = [
  {
    id: 1,
    name: "Premium Cotton T-Shirt",
    price: 29.99,
    originalPrice: 39.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
    category: "men",
    rating: 4.8,
    isNew: true,
    tags: ["best-seller", "cotton"],
  },
  {
    id: 2,
    name: "Elegant Summer Dress",
    price: 59.99,
    originalPrice: 79.99,
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=500&fit=crop",
    category: "women",
    rating: 4.9,
    isSale: true,
    tags: ["dress", "summer"],
  },
  {
    id: 3,
    name: "Designer Denim Jacket",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
    category: "women",
    rating: 4.7,
    tags: ["jacket", "denim"],
  },
  {
    id: 4,
    name: "Classic Polo Shirt",
    price: 34.99,
    originalPrice: 44.99,
    image:
      "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400&h=500&fit=crop",
    category: "men",
    rating: 4.6,
    isNew: true,
    tags: ["polo", "casual"],
  },
  {
    id: 5,
    name: "Casual Hoodie",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop",
    category: "men",
    rating: 4.5,
    tags: ["hoodie", "winter"],
  },
  {
    id: 6,
    name: "Floral Maxi Dress",
    price: 69.99,
    image:
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400&h=500&fit=crop",
    category: "women",
    rating: 4.8,
    tags: ["dress", "floral"],
  },
  {
    id: 7,
    name: "Slim Fit Jeans",
    price: 59.99,
    originalPrice: 69.99,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
    category: "men",
    rating: 4.4,
    isSale: true,
    tags: ["jeans", "denim"],
  },
  {
    id: 8,
    name: "Knit Sweater",
    price: 45.99,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=500&fit=crop",
    category: "women",
    rating: 4.7,
    tags: ["sweater", "winter"],
  },
];

const Shop = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [sortBy, setSortBy] = useState("featured");

  const categories = [
    { id: "all", name: "All Products", count: 50 },
    { id: "men", name: "Men's", count: 20 },
    { id: "women", name: "Women's", count: 25 },
    { id: "kids", name: "Kids", count: 15 },
    { id: "accessories", name: "Accessories", count: 10 },
  ];

  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "newest", name: "Newest" },
    { id: "rating", name: "Highest Rated" },
  ];

  const filteredProducts = products.filter((product) => {
    if (selectedCategory !== "all" && product.category !== selectedCategory) {
      return false;
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-8 fade-in">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shop Collection
          </h1>
          <p className="text-gray-600">
            Discover our premium collection of clothing and accessories
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Mobile/Desktop */}
          <div
            className={`lg:w-1/4 ${showFilters ? "block" : "hidden lg:block"}`}
          >
            <ProductFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onClose={() => setShowFilters(false)}
            />
          </div>

          {/* Products Section */}
          <div className="lg:w-3/4">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <Filter className="w-5 h-5" />
                    Filters
                  </button>

                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-gray-600">View:</span>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-lg ${
                        viewMode === "grid"
                          ? "bg-purple-100 text-purple-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-lg ${
                        viewMode === "list"
                          ? "bg-purple-100 text-purple-600"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-gray-600">
                    Showing{" "}
                    <span className="font-semibold">
                      {filteredProducts.length}
                    </span>{" "}
                    products
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none bg-gray-100 border-none rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-purple-200 focus:outline-none"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "flex flex-col gap-6"
                }
              >
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters</p>
                <Button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceRange([0, 200]);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200">
                  &lt;
                </button>
                {[1, 2, 3, 4, 5].map((page) => (
                  <button
                    key={page}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                      page === 1
                        ? "bg-purple-600 text-white"
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
