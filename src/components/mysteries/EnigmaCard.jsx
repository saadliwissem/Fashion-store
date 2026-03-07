import React from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  Users,
  Puzzle,
  Sparkles,
  Clock,
  Trophy,
  ChevronRight,
} from "lucide-react";

const EnigmaCard = ({ enigma }) => {
  const {
    _id,
    name,
    description,
    status,
    coverImage,
    chronicles = [],
    metadata = {},
    difficulty,
    featured,
  } = enigma;

  // Use metadata for fragment stats (from your data structure)
  const totalFragments = metadata?.totalFragments ?? 0;
  const fragmentsClaimed = metadata?.fragmentsClaimed ?? 0;
  const totalChronicles = metadata?.totalChronicles ?? chronicles?.length ?? 0;

  const percentageClaimed =
    totalFragments > 0 ? (fragmentsClaimed / totalFragments) * 100 : 0;
  const fragmentsRemaining = totalFragments - fragmentsClaimed;

  const getStatusConfig = (status) => {
    const configs = {
      active: {
        label: "Active Investigation",
        color: "bg-green-100 text-green-700",
        icon: Sparkles,
        iconColor: "text-green-600",
      },
      upcoming: {
        label: "Coming Soon",
        color: "bg-blue-100 text-blue-700",
        icon: Clock,
        iconColor: "text-blue-600",
      },
      archived: {
        label: "Solved & Archived",
        color: "bg-gray-100 text-gray-700",
        icon: Trophy,
        iconColor: "text-gray-600",
      },
      solved: {
        label: "Revealed",
        color: "bg-purple-100 text-purple-700",
        icon: Trophy,
        iconColor: "text-purple-600",
      },
    };
    return configs[status] || configs["active"];
  };

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      beginner: { label: "Novice", color: "bg-green-100 text-green-700" },
      intermediate: { label: "Adept", color: "bg-yellow-100 text-yellow-700" },
      advanced: { label: "Expert", color: "bg-orange-100 text-orange-700" },
      expert: { label: "Master", color: "bg-red-100 text-red-700" },
    };
    return configs[difficulty] || configs["intermediate"];
  };

  const statusConfig = getStatusConfig(status);
  const difficultyConfig = getDifficultyConfig(difficulty);
  const StatusIcon = statusConfig.icon;

  // Handle cover image (could be string or object)
  const getCoverImage = () => {
    if (!coverImage)
      return "https://images.unsplash.com/photo-1635805737707-575885ab0820";
    if (typeof coverImage === "string") return coverImage;
    return (
      coverImage.url ||
      "https://images.unsplash.com/photo-1635805737707-575885ab0820"
    );
  };

  const getCoverImageAlt = () => {
    if (!coverImage) return name;
    if (typeof coverImage === "string") return name;
    return coverImage.alt || name;
  };

  return (
    <div
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${
        featured
          ? "border-primary-300 bg-white shadow-md"
          : "border-gray-200 bg-white shadow-soft"
      }`}
    >
      {/* Featured Badge */}
      {featured && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-sm">
            Featured Enigma
          </span>
        </div>
      )}

      {/* Background Image with Overlay */}
      <div className="h-48 overflow-hidden relative">
        <img
          src={getCoverImage()}
          alt={getCoverImageAlt()}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />

        {/* Status Overlay */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color} flex items-center gap-1 shadow-sm`}
          >
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2 text-gray-900 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Puzzle className="w-4 h-4 text-primary-600" />
              <span className="text-sm text-gray-600">Chronicles</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {totalChronicles}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-secondary-600" />
              <span className="text-sm text-gray-600">Fragments</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {totalFragments}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4 text-accent-600" />
              <span className="text-sm text-gray-600">Claimed</span>
            </div>
            <div className="text-lg font-bold text-gray-900">
              {fragmentsClaimed}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-yellow-600" />
              <span className="text-sm text-gray-600">Difficulty</span>
            </div>
            <span
              className={`text-xs px-2 py-1 rounded-full ${difficultyConfig.color} shadow-sm`}
            >
              {difficultyConfig.label}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700">Fragments Claimed</span>
            <span className="font-bold text-gray-900">
              {Math.round(percentageClaimed)}%
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-700"
              style={{ width: `${percentageClaimed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{fragmentsClaimed} claimed</span>
            <span>{fragmentsRemaining} remaining</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/enigmas/${_id}`}
          className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-300 hover:border-primary-400 hover:shadow-md group-hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${statusConfig.color
                .replace("text-", "bg-")
                .replace("700", "100")}`}
            >
              <StatusIcon className={`w-5 h-5 ${statusConfig.iconColor}`} />
            </div>
            <div className="text-left">
              <div className="font-bold text-gray-900">Investigate Enigma</div>
              <div className="text-sm text-gray-600">
                {status === "active"
                  ? "Join the investigation"
                  : status === "upcoming"
                  ? "Get notified when live"
                  : "View archived chronicles"}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-primary-600 transition-colors" />
        </Link>
      </div>

      {/* Hover Effects */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-2xl pointer-events-none transition-all duration-300" />
      {featured && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-200/30 via-transparent to-secondary-200/30 rounded-2xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}
    </div>
  );
};

export default EnigmaCard;
