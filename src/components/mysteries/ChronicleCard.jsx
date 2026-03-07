import React from "react";
import { Link } from "react-router-dom";
import {
  Puzzle,
  Users,
  Lock,
  Clock,
  Sparkles,
  CheckCircle,
  Flame,
  ChevronRight,
} from "lucide-react";

const ChronicleCard = ({ chronicle }) => {
  const {
    _id,
    enigma,
    name,
    description,
    status,
    coverImage,
    stats = {},
    difficulty,
    timeline,
    basePrice,
    featured,
  } = chronicle;

  const fragmentCount = stats?.fragmentCount || 0;
  const fragmentsClaimed = stats?.fragmentsClaimed || 0;
  const requiredFragments = stats?.requiredFragments || 0;

  const percentageClaimed =
    fragmentCount > 0 ? (fragmentsClaimed / fragmentCount) * 100 : 0;
  const fragmentsRemaining = fragmentCount - fragmentsClaimed;
  const thresholdReached = fragmentsClaimed >= requiredFragments;

  const getStatusConfig = (status) => {
    const configs = {
      available: {
        label: "Seeking Keepers",
        color: "bg-green-100 text-green-700",
        icon: Lock,
        iconColor: "text-green-600",
        bgColor: "bg-green-50",
      },
      forging: {
        label: "In The Forge",
        color: "bg-orange-100 text-orange-700",
        icon: Flame,
        iconColor: "text-orange-600",
        bgColor: "bg-orange-50",
      },
      cipher: {
        label: "Cipher Active",
        color: "bg-purple-100 text-purple-700",
        icon: Puzzle,
        iconColor: "text-purple-600",
        bgColor: "bg-purple-50",
      },
      solved: {
        label: "Mystery Solved",
        color: "bg-gray-100 text-gray-700",
        icon: CheckCircle,
        iconColor: "text-gray-600",
        bgColor: "bg-gray-50",
      },
    };
    return configs[status] || configs["available"];
  };

  const getDifficultyConfig = (difficulty) => {
    const configs = {
      beginner: { label: "Novice", color: "bg-green-100 text-green-700" },
      easy: { label: "Novice", color: "bg-green-100 text-green-700" },
      intermediate: { label: "Adept", color: "bg-yellow-100 text-yellow-700" },
      medium: { label: "Adept", color: "bg-yellow-100 text-yellow-700" },
      advanced: { label: "Expert", color: "bg-orange-100 text-orange-700" },
      hard: { label: "Expert", color: "bg-orange-100 text-orange-700" },
      expert: { label: "Master", color: "bg-red-100 text-red-700" },
    };
    return configs[difficulty] || configs["intermediate"];
  };

  const statusConfig = getStatusConfig(status);
  const difficultyConfig = getDifficultyConfig(difficulty);
  const StatusIcon = statusConfig.icon;

  const getActionText = () => {
    switch (status) {
      case "available":
        return thresholdReached
          ? "View Fragments"
          : `Need ${requiredFragments - fragmentsClaimed} more`;
      case "forging":
        return "Track Production";
      case "cipher":
        return "Join Cipher";
      case "solved":
        return "View Solution";
      default:
        return "Investigate";
    }
  };

  // Get enigma ID for the link
  const enigmaId = typeof enigma === "object" ? enigma._id : enigma;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-primary-400 transition-all duration-300 hover:shadow-lg shadow-soft">
      {/* Background Image */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={
            coverImage?.url ||
            coverImage ||
            "https://images.unsplash.com/photo-1635805737707-575885ab0820"
          }
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent" />

        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.color} flex items-center gap-2 shadow-sm`}
          >
            <StatusIcon className="w-3.5 h-3.5" />
            {statusConfig.label}
          </span>
        </div>

        {/* Threshold Badge */}
        {thresholdReached && status === "available" && (
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary-500 to-secondary-500 text-white flex items-center gap-2 shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              Threshold Reached!
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-xl font-bold mb-3 text-gray-900 group-hover:text-primary-600 transition-colors">
            {name}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Puzzle className="w-4 h-4 text-primary-600" />
                <span className="text-sm text-gray-600">Fragments</span>
              </div>
              <span className="font-bold text-gray-900">{fragmentCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-secondary-600" />
                <span className="text-sm text-gray-600">Claimed</span>
              </div>
              <span className="font-bold text-gray-900">
                {fragmentsClaimed}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-accent-600" />
                <span className="text-sm text-gray-600">Required</span>
              </div>
              <span className="font-bold text-gray-900">
                {requiredFragments}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Timeline</span>
              </div>
              <span className="font-bold text-gray-900">
                {timeline || "TBD"}
              </span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700">Fragment Progress</span>
            <span className="font-bold text-gray-900">
              {Math.round(percentageClaimed)}%
            </span>
          </div>
          <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                thresholdReached
                  ? "bg-gradient-to-r from-primary-500 to-secondary-500"
                  : "bg-gradient-to-r from-accent-500 to-yellow-500"
              }`}
              style={{ width: `${percentageClaimed}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{fragmentsClaimed} claimed</span>
            <span>{fragmentsRemaining} available</span>
          </div>
          {!thresholdReached && status === "available" && (
            <div className="mt-2 text-center">
              <span className="text-sm text-accent-600 font-medium">
                {requiredFragments - fragmentsClaimed} more needed to forge
              </span>
            </div>
          )}
        </div>

        {/* Bottom Section */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div>
            <div className="text-2xl font-bold text-gray-900">
              ${basePrice?.toFixed(2) || "0.00"}
            </div>
            <div className="text-sm text-gray-600">per fragment</div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-1 rounded-full ${difficultyConfig.color} shadow-sm`}
            >
              {difficultyConfig.label}
            </span>

            <Link
              to={`/enigmas/${enigmaId}/chronicles/${_id}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-300 hover:border-primary-400 hover:shadow-md transition-all duration-300 group-hover:scale-105 hover:text-primary-600"
            >
              <span className="font-medium text-gray-900">
                {getActionText()}
              </span>
              <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-primary-600 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary-300 rounded-2xl pointer-events-none transition-all duration-300" />
    </div>
  );
};

export default ChronicleCard;
