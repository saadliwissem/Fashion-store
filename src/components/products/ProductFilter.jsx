import React from "react";
import { X, DollarSign, Star } from "lucide-react";
import Button from "../common/Button";

const ProductFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  onClose,
}) => {
  const priceMarks = [
    { value: 0, label: "$0" },
    { value: 50, label: "$50" },
    { value: 100, label: "$100" },
    { value: 150, label: "$150" },
    { value: 200, label: "$200+" },
  ];

  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const colors = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#FFFFFF" },
    { name: "Gray", value: "#6B7280" },
    { name: "Blue", value: "#3B82F6" },
    { name: "Red", value: "#EF4444" },
    { name: "Green", value: "#10B981" },
    { name: "Purple", value: "#8B5CF6" },
  ];

  const ratings = [5, 4, 3, 2, 1];

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
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center justify-between w-full p-3 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? "bg-purple-50 text-purple-700"
                  : "hover:bg-gray-50"
              }`}
            >
              <span className="font-medium">{category.name}</span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {category.count}
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
              className="absolute h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{
                left: `${(priceRange[0] / 200) * 100}%`,
                right: `${100 - (priceRange[1] / 200) * 100}%`,
              }}
            />
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[0]}
              onChange={(e) =>
                onPriceChange([parseInt(e.target.value), priceRange[1]])
              }
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="200"
              value={priceRange[1]}
              onChange={(e) =>
                onPriceChange([priceRange[0], parseInt(e.target.value)])
              }
              className="absolute w-full h-2 opacity-0 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              className="w-12 h-12 flex items-center justify-center border border-gray-300 rounded-lg hover:border-purple-500 hover:text-purple-600 transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-4">Color</h3>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color.name}
              className="flex flex-col items-center gap-2"
              title={color.name}
            >
              <div
                className="w-8 h-8 rounded-full border border-gray-300"
                style={{ backgroundColor: color.value }}
              />
              <span className="text-xs text-gray-600">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

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
              className="flex items-center gap-2 p-2 w-full hover:bg-gray-50 rounded-lg"
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
              <span className="text-sm text-gray-600">& above</span>
            </button>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      <Button
        variant="outline"
        fullWidth
        onClick={() => {
          onCategoryChange("all");
          onPriceChange([0, 200]);
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );
};

export default ProductFilter;
