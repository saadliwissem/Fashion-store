import React from "react";
import { X, DollarSign, Star } from "lucide-react";
import Button from "../common/Button";

const ProductFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  maxPrice = 1000,
  availableSizes = [],
  selectedSizes = [],
  onSizeChange,
  availableColors = [],
  selectedColors = [],
  onColorChange,
  minRating = 0,
  onRatingChange,
  onClose,
  onClearFilters,
}) => {
  const ratings = [5, 4, 3, 2, 1];

  // Format price for display
  const formatPrice = (price) => {
    if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}k`;
    }
    return `${price} TND`;
  };

  // Create price marks dynamically based on maxPrice
  const getPriceMarks = () => {
    const marks = [];
    const step = Math.ceil(maxPrice / 4);
    for (let i = 0; i <= 4; i++) {
      const value = i * step;
      marks.push({
        value,
        label: formatPrice(value),
      });
    }
    return marks;
  };

  const priceMarks = getPriceMarks();

  // Check if a color is selected
  const isColorSelected = (colorValue) => {
    return selectedColors.includes(colorValue);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
      {/* Mobile Close Button */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h2 className="text-xl font-bold text-gray-900">Filters</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Categories */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? "bg-primary-50 text-primary-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">{category.name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category.count || 0}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          Price Range
        </h3>
        <div className="px-2">
          <div className="relative h-2 bg-gray-200 rounded-full mb-4">
            <div
              className="absolute h-2 bg-gradient-to-r from-primary-500 to-black rounded-full"
              style={{
                left: `${(priceRange[0] / maxPrice) * 100}%`,
                right: `${100 - (priceRange[1] / maxPrice) * 100}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[0]}
              onChange={(e) =>
                onPriceChange([parseInt(e.target.value), priceRange[1]])
              }
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max={maxPrice}
              value={priceRange[1]}
              onChange={(e) =>
                onPriceChange([priceRange[0], parseInt(e.target.value)])
              }
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>{formatPrice(priceRange[0])}</span>
            <span>{formatPrice(priceRange[1])}</span>
          </div>
        </div>
      </div>

      {/* Sizes - Only show if available */}
      {availableSizes.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Size</h3>
          <div className="flex flex-wrap gap-2">
            {availableSizes.map((size) => (
              <button
                key={size}
                onClick={() => onSizeChange(size)}
                className={`w-12 h-12 flex items-center justify-center border rounded-lg font-medium transition-colors ${
                  selectedSizes.includes(size)
                    ? "border-primary-600 bg-primary-50 text-primary-700"
                    : "border-gray-300 hover:border-primary-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Colors - Only show if available */}
      {availableColors.length > 0 && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-900 mb-4">Color</h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => {
              const colorName = typeof color === "string" ? color : color.name;
              const colorValue =
                typeof color === "string" ? color : color.value || color;
              const isSelected = isColorSelected(colorName);

              return (
                <button
                  key={colorName}
                  onClick={() => onColorChange(colorName)}
                  className="flex flex-col items-center gap-2 group"
                  title={colorName}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 transition-all ${
                      isSelected
                        ? "border-primary-600 scale-110"
                        : "border-gray-300 group-hover:border-primary-400 group-hover:scale-105"
                    }`}
                    style={{ backgroundColor: colorValue }}
                  />
                  <span
                    className={`text-xs transition-colors ${
                      isSelected
                        ? "text-primary-600 font-medium"
                        : "text-gray-600"
                    }`}
                  >
                    {colorName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Ratings */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Star className="w-4 h-4" />
          Rating
        </h3>
        <div className="space-y-2">
          {ratings.map((rating) => (
            <button
              key={rating}
              onClick={() => onRatingChange(minRating === rating ? 0 : rating)}
              className={`flex items-center gap-2 p-2 w-full rounded-lg transition-colors ${
                minRating === rating
                  ? "bg-amber-50 text-amber-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < rating
                        ? "text-amber-400 fill-amber-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span
                className={`text-sm ${
                  minRating === rating ? "font-medium" : "text-gray-600"
                }`}
              >
                {rating} star{rating !== 1 ? "s" : ""} & above
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <Button variant="outline" fullWidth onClick={onClearFilters}>
        Clear All Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
