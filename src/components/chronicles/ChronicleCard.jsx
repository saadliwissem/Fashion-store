// components/ChronicleCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Users,
  DollarSign,
  Calendar,
  Lock,
  Eye,
  Sparkles,
  ChevronRight,
} from "lucide-react";

const ChronicleCard = ({ chronicle }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return { bg: "bg-green-100", text: "text-green-700", icon: Lock };
      case "forging":
        return { bg: "bg-orange-100", text: "text-orange-700", icon: Sparkles };
      case "cipher":
        return { bg: "bg-primary-100", text: "text-primary-700", icon: Eye };
      case "solved":
        return { bg: "bg-gray-100", text: "text-gray-700", icon: Eye };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", icon: Lock };
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case "legendary":
        return "bg-yellow-100 text-yellow-700";
      case "rare":
        return "bg-primary-100 text-primary-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusInfo = getStatusColor(chronicle.status);
  const StatusIcon = statusInfo.icon;
  const fragmentProgress =
    chronicle.stats?.fragmentCount > 0
      ? ((chronicle.stats?.fragmentsClaimed || 0) /
          chronicle.stats?.fragmentCount) *
        100
      : 0;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {chronicle.coverImage?.url ? (
          <img
            src={chronicle.coverImage.url}
            alt={chronicle.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
            <BookOpen className="w-12 h-12 text-primary-400" />
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusInfo.bg} ${statusInfo.text}`}
        >
          <StatusIcon className="w-3 h-3" />
          <span>{chronicle.status?.toUpperCase()}</span>
        </div>

        {/* Featured Badge */}
        {chronicle.featured && (
          <div className="absolute top-3 right-3 px-3 py-1 bg-yellow-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            FEATURED
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title & Author */}
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
          {chronicle.name}
        </h3>
        {chronicle.author?.name && (
          <p className="text-sm text-gray-500 mb-3">
            by {chronicle.author.name}
          </p>
        )}
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">
          {chronicle.description}
        </p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Fragments Claimed</span>
            <span>
              {chronicle.stats?.fragmentsClaimed || 0} /{" "}
              {chronicle.stats?.fragmentCount || 0}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-600 rounded-full h-2 transition-all duration-500"
              style={{ width: `${fragmentProgress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4" />
            <span>${chronicle.basePrice || 0}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>{chronicle.stats?.uniqueKeepers || 0} Keepers</span>
          </div>
          {chronicle.estimatedCompletion && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(chronicle.estimatedCompletion).toLocaleDateString()}
              </span>
            </div>
          )}
          {chronicle.difficulty && (
            <div
              className={`flex items-center gap-2 text-sm px-2 py-0.5 rounded-full ${getRarityColor(
                chronicle.difficulty
              )}`}
            >
              <span>{chronicle.difficulty?.toUpperCase()}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {chronicle.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {chronicle.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                {tag}
              </span>
            ))}
            {chronicle.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{chronicle.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* View Button */}
        <Link
          to={`/chronicle/${chronicle._id}`}
          className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          View Chronicle
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};

export default ChronicleCard;
