import React, { useState } from "react";
import {
  Lock,
  CheckCircle,
  Eye,
  Users,
  Sparkles,
  Crown,
  Shield,
  Key,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const FragmentCard = ({ fragment, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const {
    id,
    number,
    name,
    description,
    status,
    claimedBy,
    price,
    rarity,
    features = [],
    estimatedDelivery,
    imageUrl,
    cluesRevealed = 0,
    totalClues = 5,
    isFeatured = false,
  } = fragment;

  const isAvailable = status === "available";
  const cluesPercentage =
    totalClues > 0 ? (cluesRevealed / totalClues) * 100 : 0;

  const getRarityColor = () => {
    switch (rarity) {
      case "common":
        return "text-gray-400";
      case "rare":
        return "text-blue-400";
      case "epic":
        return "text-purple-400";
      case "legendary":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  const getRarityBg = () => {
    switch (rarity) {
      case "common":
        return "bg-gray-500/10";
      case "rare":
        return "bg-blue-500/10";
      case "epic":
        return "bg-purple-500/10";
      case "legendary":
        return "bg-yellow-500/10";
      default:
        return "bg-gray-500/10";
    }
  };

  const getStatusConfig = () => {
    if (isAvailable) {
      return {
        label: "Available",
        color: "bg-green-500/20 text-green-300",
        icon: Lock,
        actionLabel: "Claim Fragment",
        actionColor: "btn-primary",
      };
    } else {
      return {
        label: "Claimed",
        color: "bg-purple-500/20 text-purple-300",
        icon: CheckCircle,
        actionLabel: "View Details",
        actionColor: "bg-gray-800 hover:bg-gray-700 text-gray-300",
      };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 ${
        isAvailable
          ? "border-gray-700 bg-gradient-to-br from-gray-800 to-gray-900 hover:border-primary-500 hover:shadow-puzzle cursor-pointer"
          : "border-gray-800 bg-gradient-to-br from-gray-900 to-black"
      } ${isFeatured ? "border-yellow-500/30" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={isAvailable ? onClick : undefined}
    >
      {/* Featured Badge */}
      {isFeatured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-black flex items-center gap-1">
            <Crown className="w-3.5 h-3.5" />
            Featured
          </span>
        </div>
      )}

      {/* Rarity Badge */}
      <div className="absolute top-4 right-4 z-10">
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold ${getRarityBg()} ${getRarityColor()}`}
        >
          {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
        </span>
      </div>

      {/* Background Image */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={imageUrl}
          alt={name}
          className={`w-full h-full object-cover transition-transform duration-700 ${
            isHovered && isAvailable ? "scale-110" : ""
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />

        {/* Fragment Number */}
        <div className="absolute bottom-4 left-4">
          <div className="text-4xl font-bold text-white/90">#{number}</div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold group-hover:text-primary-300 transition-colors">
              {name}
            </h3>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color} flex items-center gap-1`}
            >
              <StatusIcon className="w-3 h-3" />
              {statusConfig.label}
            </span>
          </div>
          <p className="text-gray-400 text-sm line-clamp-2">{description}</p>
        </div>

        {/* Keeper Info (if claimed) */}
        {claimedBy && (
          <div className="mb-4 p-3 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-xl border border-purple-500/20">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-purple-500/20 rounded-lg">
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div>
                <div className="text-sm text-gray-400">Guarded by</div>
                <div className="font-medium">{claimedBy}</div>
              </div>
            </div>
          </div>
        )}

        {/* Clues Progress (if claimed) */}
        {!isAvailable && totalClues > 0 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-300">Clues Revealed</span>
              <span className="font-bold">
                {cluesRevealed}/{totalClues}
              </span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-1000"
                style={{ width: `${cluesPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="mb-6">
            <div className="text-sm text-gray-400 mb-2">Arcane Features:</div>
            <div className="flex flex-wrap gap-2">
              {features.slice(0, 3).map((feature, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-800/50 rounded-lg text-xs text-gray-300"
                >
                  {feature}
                </span>
              ))}
              {features.length > 3 && (
                <span className="px-2 py-1 bg-gray-800/50 rounded-lg text-xs text-gray-300">
                  +{features.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-800/30 rounded-xl">
            <div className="text-2xl font-bold">${price}</div>
            <div className="text-xs text-gray-400">Price</div>
          </div>
          <div className="text-center p-3 bg-gray-800/30 rounded-xl">
            <div className="text-lg font-bold">{estimatedDelivery}</div>
            <div className="text-xs text-gray-400">Delivery</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
            isAvailable ? "btn-primary" : "bg-gray-800 hover:bg-gray-700"
          }`}
          disabled={!isAvailable}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isAvailable ? "bg-primary-500/20" : "bg-gray-700"
              }`}
            >
              {isAvailable ? (
                <Key className="w-5 h-5 text-primary-400" />
              ) : (
                <Eye className="w-5 h-5 text-gray-400" />
              )}
            </div>
            <div className="text-left">
              <div className="font-bold">{statusConfig.actionLabel}</div>
              <div className="text-sm text-gray-400">
                {isAvailable ? "Secure this fragment" : "View keeper details"}
              </div>
            </div>
          </div>
          <ChevronRight
            className={`w-5 h-5 ${
              isAvailable ? "text-white" : "text-gray-500"
            }`}
          />
        </button>

        {/* Security Badge */}
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Shield className="w-3 h-3" />
          <span>NFT Authentication Included</span>
        </div>
      </div>

      {/* Hover Effects */}
      {isAvailable && (
        <>
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-500/30 rounded-2xl pointer-events-none transition-all duration-300" />
          {isHovered && (
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500/10 via-transparent to-secondary-500/10 rounded-2xl blur-sm opacity-50 pointer-events-none" />
          )}
        </>
      )}

      {/* Fragment Number Glow */}
      <div className="absolute -bottom-2 -right-2 w-16 h-16 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-full blur-xl pointer-events-none" />
    </div>
  );
};

export default FragmentCard;
