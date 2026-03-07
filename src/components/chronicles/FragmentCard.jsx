import React from "react";
import { Lock, Users, Crown, Sparkles, Eye } from "lucide-react";

const FragmentCard = ({ fragment = {}, onClick, viewMode = "grid" }) => {
  // Safe destructuring with default values
  const {
    number = 0,
    name = "Unknown Fragment",
    description = "No description available",
    status = "unknown",
    claimedBy = null,
    price = 0,
    rarity = "common",
    imageUrl = "https://images.unsplash.com/photo-1635805737707?auto=format&fit=crop&w=400&h=300&q=80",
    cluesRevealed = 0,
    totalClues = 0,
    isFeatured = false,
    estimatedDelivery = "TBD",
  } = fragment;

  // Helper function to get claimed by display name
  const getClaimedByName = () => {
    if (!claimedBy) return "Unknown";

    // If claimedBy is an object with user data (populated)
    if (typeof claimedBy === "object") {
      // Check if it has keeperProfile or direct user fields
      if (claimedBy.keeperProfile?.displayName) {
        return claimedBy.keeperProfile.displayName;
      }
      if (claimedBy.fullName) {
        return claimedBy.fullName;
      }
      if (claimedBy.firstName && claimedBy.lastName) {
        return `${claimedBy.firstName} ${claimedBy.lastName}`;
      }
      if (claimedBy.email) {
        return claimedBy.email.split("@")[0]; // Use part before @ as name
      }
    }

    // If it's a string (just the ID), return shortened version
    if (typeof claimedBy === "string") {
      return `Keeper ${claimedBy.slice(-4)}`; // Show last 4 chars of ID
    }

    return "Unknown";
  };

  // Ensure we have valid data before rendering
  if (!fragment || Object.keys(fragment).length === 0) {
    return null; // Don't render if no fragment data
  }

  const getStatusColor = () => {
    if (isFeatured) return "yellow";
    if (status === "claimed") return "purple";
    if (status === "available") return "green";
    return "gray";
  };

  const getRarityColor = () => {
    switch (rarity?.toLowerCase()) {
      case "legendary":
        return "from-yellow-400 to-orange-500";
      case "rare":
        return "from-purple-400 to-purple-600";
      case "common":
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  // Handle image URL - could be string or object
  const getImageUrl = () => {
    if (!imageUrl)
      return "https://images.unsplash.com/photo-1635805737707?auto=format&fit=crop&w=400&h=300&q=80";
    if (typeof imageUrl === "string") return imageUrl;
    if (imageUrl.url) return imageUrl.url;
    return "https://images.unsplash.com/photo-1635805737707?auto=format&fit=crop&w=400&h=300&q=80";
  };

  if (viewMode === "list") {
    return (
      <div
        onClick={status === "available" ? onClick : undefined}
        className={`group flex items-center gap-4 p-3 rounded-xl border transition-all ${
          status === "available"
            ? "cursor-pointer hover:shadow-md hover:border-primary-300 bg-white"
            : "cursor-default bg-gray-50 border-gray-200 opacity-75"
        }`}
        role={status === "available" ? "button" : "article"}
        tabIndex={status === "available" ? 0 : -1}
        onKeyPress={(e) => {
          if (
            status === "available" &&
            (e.key === "Enter" || e.key === " ") &&
            onClick
          ) {
            onClick();
          }
        }}
      >
        {/* Image */}
        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          <img
            src={getImageUrl()}
            alt={name}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1635805737707?auto=format&fit=crop&w=400&h=300&q=80";
            }}
          />
          {isFeatured && (
            <div className="absolute top-1 right-1">
              <Crown className="w-3 h-3 text-yellow-500" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-medium text-gray-900 truncate">
              #{number} {name}
            </h4>
            {isFeatured && (
              <span className="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded-full whitespace-nowrap">
                Featured
              </span>
            )}
          </div>

          <p className="text-xs text-gray-600 line-clamp-1 mb-2">
            {description}
          </p>

          <div className="flex items-center gap-3 text-xs flex-wrap">
            {status === "claimed" ? (
              <div className="flex items-center gap-1 text-purple-600">
                <Users className="w-3 h-3" />
                <span className="truncate max-w-[100px]">
                  {getClaimedByName()}
                </span>
              </div>
            ) : status === "available" ? (
              <div className="flex items-center gap-1 text-green-600">
                <Lock className="w-3 h-3" />
                <span>Available</span>
              </div>
            ) : null}

            <div className="flex items-center gap-1 text-gray-500">
              <Sparkles className="w-3 h-3" />
              <span className="capitalize">{rarity}</span>
            </div>

            {cluesRevealed > 0 && totalClues > 0 && (
              <div className="flex items-center gap-1 text-primary-600">
                <Eye className="w-3 h-3" />
                <span>
                  {cluesRevealed}/{totalClues}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Price */}
        {status === "available" && (
          <div className="text-right flex-shrink-0">
            <div className="font-bold text-primary-600">
              ${typeof price === "number" ? price.toFixed(2) : "0.00"}
            </div>
            <div className="text-xs text-gray-500 whitespace-nowrap">
              {estimatedDelivery}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Grid View (compact for sidebar)
  return (
    <div
      onClick={status === "available" ? onClick : undefined}
      className={`group relative rounded-xl overflow-hidden border transition-all ${
        status === "available"
          ? "cursor-pointer hover:shadow-lg hover:scale-[1.02] hover:border-primary-300 bg-white"
          : "cursor-default bg-gray-50 border-gray-200 opacity-75"
      }`}
      role={status === "available" ? "button" : "article"}
      tabIndex={status === "available" ? 0 : -1}
      onKeyPress={(e) => {
        if (
          status === "available" &&
          (e.key === "Enter" || e.key === " ") &&
          onClick
        ) {
          onClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={getImageUrl()}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            e.target.src =
              "https://images.unsplash.com/photo-1635805737707?auto=format&fit=crop&w=400&h=300&q=80";
          }}
        />

        {/* Status Badge */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full shadow-sm ${
              isFeatured
                ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
                : status === "claimed"
                ? "bg-purple-100 text-purple-700 border border-purple-300"
                : status === "available"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-gray-100 text-gray-700 border border-gray-300"
            }`}
          >
            {isFeatured ? "Featured" : status}
          </span>
        </div>

        {/* Rarity Badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${getRarityColor()} text-white shadow-sm`}
        >
          {rarity}
        </div>

        {/* Overlay for claimed fragments */}
        {status === "claimed" && (
          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-white/90 rounded-full px-3 py-1.5 shadow-lg">
              <span className="text-xs font-medium text-purple-600 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {getClaimedByName()}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between mb-2">
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-gray-900 text-sm truncate">
              #{number} {name}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-2 mt-1">
              {description}
            </p>
          </div>
        </div>

        {/* Progress */}
        {cluesRevealed > 0 && totalClues > 0 && (
          <div className="mb-2">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-gray-600">Clues Revealed</span>
              <span className="font-medium text-primary-600">
                {cluesRevealed}/{totalClues}
              </span>
            </div>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full transition-all"
                style={{ width: `${(cluesRevealed / totalClues) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
          {status === "available" ? (
            <>
              <div>
                <span className="text-xs text-gray-500 block">Price</span>
                <span className="font-bold text-primary-600 text-sm">
                  ${typeof price === "number" ? price.toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-500 block">Delivery</span>
                <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                  {estimatedDelivery}
                </span>
              </div>
            </>
          ) : status === "claimed" ? (
            <div className="w-full flex items-center justify-between">
              <span className="text-xs text-gray-500">Claimed by</span>
              <span className="text-xs font-medium text-purple-600 truncate ml-2 max-w-[120px]">
                {getClaimedByName()}
              </span>
            </div>
          ) : null}
        </div>

        {/* Hover effect for available fragments */}
        {status === "available" && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        )}
      </div>
    </div>
  );
};

export default FragmentCard;
