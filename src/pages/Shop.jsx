import React, { useState, useEffect, useCallback } from "react";
import { Filter, Grid, List, ChevronDown, Loader2 } from "lucide-react";
import ProductCard from "../components/products/ProductCard";
import ProductFilter from "../components/products/ProductFilter";
import Button from "../components/common/Button";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Shop = () => {
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);

  // State for API data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);

  // Fetch categories and filters on component mount
  useEffect(() => {
    fetchCategories();
    fetchCategoryFilters();
  }, []);

  // Fetch products when filters or page change
  useEffect(() => {
    fetchProducts();
  }, [
    selectedCategory,
    sortBy,
    currentPage,
    priceRange,
    selectedSizes,
    selectedColors,
    minRating,
  ]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/categories`);
      // Transform categories for the filter component
      const transformedCategories = response.data.categories.map(
        (category) => ({
          id: category._id || category.slug,
          name: category.name,
          count: category.productCount || 0,
          slug: category.slug,
        })
      );

      // Add "All Products" option
      setCategories([
        { id: "all", name: "All Products", count: totalProducts, slug: "all" },
        ...transformedCategories,
      ]);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories");
    }
  };

  const fetchCategoryFilters = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/products/filters/categories`
      );
      if (response.data) {
        // Extract available sizes and colors from filters
        if (response.data.sizes) {
          setAvailableSizes(response.data.sizes);
        }
        if (response.data.colors) {
          setAvailableColors(response.data.colors);
        }
        if (response.data.maxPrice) {
          setMaxPrice(response.data.maxPrice);
          setPriceRange([0, response.data.maxPrice]);
        }
      }
    } catch (err) {
      console.error("Error fetching filters:", err);
      // Use default values if API fails
      setAvailableSizes(["XS", "S", "M", "L", "XL", "XXL"]);
      setAvailableColors([
        { name: "Black", value: "#000000" },
        { name: "White", value: "#FFFFFF" },
        { name: "Gray", value: "#6B7280" },
        { name: "Blue", value: "#3B82F6" },
        { name: "Red", value: "#EF4444" },
        { name: "Green", value: "#10B981" },
        { name: "Purple", value: "#f0b100" },
      ]);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `${API_BASE_URL}/products`;
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        sort: getSortValue(sortBy),
      };

      // Add category filter if not "all"
      if (selectedCategory !== "all") {
        const selectedCat = categories.find(
          (cat) => cat.id === selectedCategory
        );
        if (selectedCat) {
          params.category = selectedCat.slug;
        }
      }

      // Add price filter
      if (priceRange[0] > 0 || priceRange[1] < maxPrice) {
        params.minPrice = priceRange[0];
        params.maxPrice = priceRange[1];
      }

      // Add size filter
      if (selectedSizes.length > 0) {
        params.sizes = selectedSizes.join(",");
      }

      // Add color filter
      if (selectedColors.length > 0) {
        params.colors = selectedColors.join(",");
      }

      // Add rating filter
      if (minRating > 0) {
        params.minRating = minRating;
      }

      // Make API call
      const response = await axios.get(url, { params });

      setProducts(response.data.products || response.data);
      setTotalProducts(
        response.data.total || response.data.count || response.data.length || 0
      );
      setTotalPages(
        response.data.pages ||
          Math.ceil((response.data.total || 0) / itemsPerPage)
      );

      // Update categories count with actual product counts from this query
      if (response.data.total !== undefined) {
        setCategories((prev) =>
          prev.map((cat) =>
            cat.id === "all" ? { ...cat, count: response.data.total } : cat
          )
        );
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.response?.data?.message || "Failed to load products");

      // Fallback to empty array
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setLoading(false);
    }
  };

  const getSortValue = (sortId) => {
    const sortMap = {
      featured: "-createdAt",
      "price-low": "price",
      "price-high": "-price",
      newest: "-createdAt",
      rating: "-averageRating",
    };
    return sortMap[sortId] || "-createdAt";
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setCurrentPage(1); // Reset to first page on sort change
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1); // Reset to first page on category change
  };

  const handlePriceChange = (range) => {
    setPriceRange(range);
    setCurrentPage(1); // Reset to first page on price change
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  const handleRatingChange = (rating) => {
    setMinRating(rating);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setPriceRange([0, maxPrice]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating(0);
    setSortBy("featured");
    setCurrentPage(1);
  };

  const sortOptions = [
    { id: "featured", name: "Featured" },
    { id: "price-low", name: "Price: Low to High" },
    { id: "price-high", name: "Price: High to Low" },
    { id: "newest", name: "Newest" },
    { id: "rating", name: "Highest Rated" },
  ];

  // Generate pagination numbers
  const getPaginationNumbers = () => {
    const numbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        numbers.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);

      if (end - start + 1 < maxVisiblePages) {
        start = end - maxVisiblePages + 1;
      }

      for (let i = start; i <= end; i++) {
        numbers.push(i);
      }
    }

    return numbers;
  };

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
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={handlePriceChange}
              maxPrice={maxPrice}
              availableSizes={availableSizes}
              selectedSizes={selectedSizes}
              onSizeChange={handleSizeChange}
              availableColors={availableColors}
              selectedColors={selectedColors}
              onColorChange={handleColorChange}
              minRating={minRating}
              onRatingChange={handleRatingChange}
              onClose={() => setShowFilters(false)}
              onClearFilters={clearFilters}
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

                  <div className="text-gray-600">
                    {loading ? (
                      "Loading products..."
                    ) : (
                      <>
                        Showing{" "}
                        <span className="font-semibold">
                          {Math.min(itemsPerPage, products.length)} of{" "}
                          {totalProducts}
                        </span>{" "}
                        products
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      disabled={loading}
                      className="appearance-none bg-gray-100 border-none rounded-lg pl-4 pr-10 py-2 focus:ring-2 focus:ring-primary-100 focus:outline-none disabled:opacity-50"
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

            {/* Active Filters */}
            {(selectedCategory !== "all" ||
              priceRange[0] > 0 ||
              priceRange[1] < maxPrice ||
              selectedSizes.length > 0 ||
              selectedColors.length > 0 ||
              minRating > 0) && (
              <div className="mb-6 flex flex-wrap gap-2">
                <span className="text-gray-600">Active filters:</span>
                {selectedCategory !== "all" && (
                  <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                  </span>
                )}
                {(priceRange[0] > 0 || priceRange[1] < maxPrice) && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    ${priceRange[0]} - ${priceRange[1]}
                  </span>
                )}
                {selectedSizes.map((size) => (
                  <span
                    key={size}
                    className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm"
                  >
                    Size: {size}
                  </span>
                ))}
                {selectedColors.map((color) => (
                  <span
                    key={color}
                    className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm"
                  >
                    Color: {color}
                  </span>
                ))}
                {minRating > 0 && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                    Rating: {minRating}+
                  </span>
                )}
                <button
                  onClick={clearFilters}
                  className="px-3 py-1 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-full text-sm"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Filter className="w-12 h-12 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Error loading products
                </h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <Button onClick={fetchProducts}>Retry</Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && products.length > 0 ? (
              <>
                <div
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "flex flex-col gap-6"
                  }
                >
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        originalPrice: product.originalPrice,
                        image: product.images?.[0] || product.image,
                        category: product.category?.name || product.category,
                        rating: product.rating || product.averageRating || 0,
                        isNew: product.isNewArrival || product.isNew,
                        isSale: product.onSale,
                        tags: product.tags,
                        slug: product.slug,
                        description: product.description,
                        stock: product.stock,
                      }}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center gap-2">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &lt;
                      </button>

                      {getPaginationNumbers().map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg font-medium ${
                            page === currentPage
                              ? "bg-primary-600 text-white"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {page}
                        </button>
                      ))}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        &gt;
                      </button>
                    </nav>
                  </div>
                )}
              </>
            ) : (
              !loading &&
              !error && (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Filter className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your filters or check back later
                  </p>
                  <Button onClick={clearFilters}>Clear Filters</Button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
