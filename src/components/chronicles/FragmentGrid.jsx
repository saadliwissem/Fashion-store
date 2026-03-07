import React, { useState, useEffect, useRef } from "react";
import {
  Lock,
  CheckCircle,
  Eye,
  Users,
  Sparkles,
  Filter,
  Search,
  AlertCircle,
  Crown,
  Grid,
  List,
  ChevronDown,
  X,
  SlidersHorizontal,
  ArrowUpDown,
} from "lucide-react";
import FragmentCard from "./FragmentCard";

const FragmentGrid = ({ fragments = [], onFragmentSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("number");
  const [viewMode, setViewMode] = useState("grid");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const filterRef = useRef(null);

  // Safe sample data creation with guaranteed properties
  const createSampleFragments = () => {
    return Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      number: i + 1,
      name: `Fragment #${i + 1}`,
      description: `Represents crew member ${i + 1} with unique hidden clues`,
      status: i < 3 ? "claimed" : "available",
      claimedBy: i < 3 ? `Keeper_${String.fromCharCode(65 + i)}` : null,
      price: 299.99 + i * 50,
      rarity: i === 0 ? "legendary" : i < 3 ? "rare" : "common",
      features: [
        "Hidden QR code",
        "UV-reactive ink",
        "Embossed symbol",
        "Numbered certificate",
      ],
      estimatedDelivery: "6-8 weeks",
      imageUrl: `https://images.unsplash.com/photo-${
        1635805737700 + i
      }?auto=format&fit=crop&w=400&h=300&q=80`,
      cluesRevealed: i < 3 ? Math.floor(Math.random() * 3) + 1 : 0,
      totalClues: 5,
      isFeatured: i === 4,
    }));
  };

  // Ensure we always have an array
  const fragmentData =
    Array.isArray(fragments) && fragments.length > 0
      ? fragments
      : createSampleFragments();

  // Close mobile filter when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsMobileFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Safe filter function with null checks
  const filteredFragments = fragmentData.filter((fragment) => {
    if (!fragment) return false;

    const matchesSearch =
      !searchTerm ||
      fragment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fragment.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (fragment.claimedBy &&
        fragment.claimedBy.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (fragment.rarity &&
        fragment.rarity.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filter === "all") return matchesSearch;
    if (filter === "available")
      return matchesSearch && fragment.status === "available";
    if (filter === "claimed")
      return matchesSearch && fragment.status === "claimed";
    if (filter === "featured")
      return matchesSearch && fragment.isFeatured === true;
    return matchesSearch;
  });

  // Safe sort function
  const sortedFragments = [...filteredFragments].sort((a, b) => {
    if (!a || !b) return 0;

    switch (sortBy) {
      case "price-low":
        return (a.price || 0) - (b.price || 0);
      case "price-high":
        return (b.price || 0) - (a.price || 0);
      case "popularity":
        return (b.cluesRevealed || 0) - (a.cluesRevealed || 0);
      case "number":
      default:
        return (a.number || 0) - (b.number || 0);
    }
  });

  // Safe stats calculation
  const stats = {
    total: fragmentData.length,
    available: fragmentData.filter((f) => f?.status === "available").length,
    claimed: fragmentData.filter((f) => f?.status === "claimed").length,
    featured: fragmentData.filter((f) => f?.isFeatured === true).length,
  };

  const handleFragmentClick = (fragment) => {
    if (fragment?.status === "available" && onFragmentSelect) {
      onFragmentSelect(fragment);
    }
  };

  const getSortLabel = (value) => {
    const labels = {
      number: "Number",
      "price-low": "Price: Low to High",
      "price-high": "Price: High to Low",
      popularity: "Popularity",
    };
    return labels[value] || value;
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 shadow-soft overflow-hidden">
      {/* Header - More compact for this layout */}
      <div className="p-4 sm:p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">
              Fragments
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {stats.available} of {stats.total} available
            </p>
          </div>

          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200"
              aria-label="Toggle filters"
            >
              <SlidersHorizontal className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter</span>
              {(searchTerm || filter !== "all" || sortBy !== "number") && (
                <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Search - Always visible */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search fragments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all"
              aria-label="Search fragments"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Desktop Filters - Hidden on mobile */}
        <div className="hidden lg:flex items-center gap-3 mt-4">
          <div className="flex-1 flex items-center gap-2">
            {/* Filter Buttons */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              {["all", "available", "claimed", "featured"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                    filter === f
                      ? "bg-white text-primary-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="pl-8 pr-8 py-1.5 text-xs rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 appearance-none cursor-pointer"
                aria-label="Sort fragments"
              >
                <option value="number">Sort by Number</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="popularity">Popularity</option>
              </select>
              <ArrowUpDown className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-white shadow-sm text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="Grid view"
              aria-pressed={viewMode === "grid"}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === "list"
                  ? "bg-white shadow-sm text-primary-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              aria-label="List view"
              aria-pressed={viewMode === "list"}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Filter Panel */}
        {isMobileFilterOpen && (
          <div
            ref={filterRef}
            className="lg:hidden absolute left-0 right-0 mt-2 mx-4 p-4 bg-white rounded-xl border border-gray-200 shadow-lg z-50"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-gray-900">Filter Fragments</h4>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 hover:bg-gray-100 rounded"
                aria-label="Close filters"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {["all", "available", "claimed", "featured"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all capitalize ${
                        filter === f
                          ? "bg-primary-50 border-primary-300 text-primary-700"
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-gray-300 bg-white text-gray-900 focus:outline-none focus:border-primary-500"
                  aria-label="Sort options"
                >
                  <option value="number">Number</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popularity">Popularity</option>
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  View Mode
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${
                      viewMode === "grid"
                        ? "bg-primary-50 border-primary-300 text-primary-700"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <Grid className="w-4 h-4" />
                    <span className="text-sm">Grid</span>
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border ${
                      viewMode === "list"
                        ? "bg-primary-50 border-primary-300 text-primary-700"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    <span className="text-sm">List</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
        <p className="text-xs sm:text-sm text-gray-600">
          Showing{" "}
          <span className="font-medium text-gray-900">
            {sortedFragments.length}
          </span>{" "}
          results
          {searchTerm && (
            <span>
              {" "}
              for "<span className="text-primary-600">{searchTerm}</span>"
            </span>
          )}
        </p>
        <div className="lg:hidden text-xs text-gray-500">
          Sorted by: {getSortLabel(sortBy)}
        </div>
      </div>

      {/* Fragment Grid/List */}
      <div className="p-4 sm:p-6">
        {sortedFragments.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-base font-medium text-gray-900 mb-1">
              No Fragments Found
            </h4>
            <p className="text-sm text-gray-600 max-w-sm mx-auto">
              {searchTerm
                ? `No matches for "${searchTerm}"`
                : "No fragments match the selected filter"}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="mt-4 px-4 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                : "space-y-3"
            }
          >
            {sortedFragments.map((fragment) => (
              <FragmentCard
                key={fragment?.id || Math.random()}
                fragment={fragment}
                onClick={() => handleFragmentClick(fragment)}
                viewMode={viewMode}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="px-4 sm:px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-gray-600">{stats.available} Available</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span>
              <span className="text-gray-600">{stats.claimed} Claimed</span>
            </div>
          </div>
          {stats.featured > 0 && (
            <div className="flex items-center gap-1 text-yellow-600">
              <Crown className="w-3.5 h-3.5" />
              <span className="text-xs">{stats.featured} Featured</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FragmentGrid;
